import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import type {
  ApiError,
  Audience,
  CreatedSession,
  FocusArea,
  OwnerList,
  OwnerSession,
  SetupInput,
  TemplateId,
} from "../shared/api";
import type { ModelTarget } from "./ai";
import { auth, requireOwner, siteOrigin, type Env } from "./auth";
import { buildSystemPrompt, InvalidModelOutput, runInterviewerTurn } from "./interviewer";
import {
  AppError,
  confirmSession,
  deleteAnswers,
  markAgreed,
  ownerSummary,
  reserveCall,
  respondentView,
  setBasics,
  setPriorities,
  setSteps,
  startSession,
  takeTurn,
} from "./sessions";
import { draftSetup } from "./setup";
import { applyOps, type Item } from "./state";
import {
  ConflictError,
  countDraft,
  hashIp,
  insertSession,
  purgeExpired,
  recentCreations,
  saveSession,
  sessionByToken,
  sessionForOwner,
  sessionsForOwner,
  type Session,
} from "./store";

type Ctx = Context<{ Bindings: Env }>;

// NFR-03 abuse limits (per day). Creating and drafting need a signed-in
// owner (ADR-003). Limits are per owner, per IP (against many accounts), and
// site-wide, so no one visitor can use up the month's AI spend limit and take
// the demo offline for everyone (ADR-003).
const LIMITS = {
  sessionsPerOwner: 3,
  sessionsPerIp: 5,
  sessionsSite: 15,
  draftsPerOwner: 10,
  draftsPerIp: 15,
  draftsSite: 60,
};
const BUSY_TODAY = "Mise has had a busy day and isn't taking new links until tomorrow.";
const TEMPLATES: TemplateId[] = ["requirements", "pre_audit"];

const target = (env: Env, model: string): ModelTarget => ({ ai: env.AI, gateway: env.AI_GATEWAY, model });

function fail(c: Ctx, status: number, code: ApiError["error"]["code"], message: string) {
  return c.json<ApiError>({ error: { code, message } }, status as 400);
}

async function ipHash(c: Ctx) {
  return hashIp(c.req.header("CF-Connecting-IP") ?? "local", c.env.IP_HASH_SALT ?? "mise-dev");
}

async function readJson(c: Ctx): Promise<any> {
  try {
    return await c.req.json();
  } catch {
    throw new AppError(400, "invalid_input", "That request couldn't be read.");
  }
}

// ---- input validation for a new link (FR-03: the sender edits everything) ----

const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const strList = (value: unknown, maxItems = 20, maxLen = 300) =>
  Array.isArray(value) ? value.map((v) => str(v, maxLen)).filter(Boolean).slice(0, maxItems) : [];

function validSetup(template: TemplateId, raw: any): SetupInput {
  const focusAreas: FocusArea[] = ["process", "pain", "goals_scope", "constraints", "feel"];
  const audiences: Audience[] = ["colleague", "client", "prospect"];
  const setup: SetupInput = {
    topic: str(raw?.topic, 80),
    summary: str(raw?.summary, 300),
    sender: str(raw?.sender, 80),
    respondent_name: str(raw?.respondent_name, 80),
    role: str(raw?.role, 80),
    audience: audiences.includes(raw?.audience) ? raw.audience : template === "pre_audit" ? "prospect" : "colleague",
    focus: template === "pre_audit" ? [] : strList(raw?.focus, 2, 20).filter((f): f is FocusArea => focusAreas.includes(f as FocusArea)),
    known: strList(raw?.known),
    assumed: strList(raw?.assumed),
    off_limits: strList(raw?.off_limits),
    sketch: strList(raw?.sketch, 15),
  };
  if (!setup.topic) throw new AppError(400, "invalid_input", template === "pre_audit" ? "Add the business name." : "Add what this is about.");
  if (!setup.sender) throw new AppError(400, "invalid_input", "Add your name, so they know who's asking.");
  if (!setup.respondent_name) throw new AppError(400, "invalid_input", "Add who it's going to.");
  if (template === "pre_audit" && !setup.role) setup.role = "Owner";
  return setup;
}

// ---- app ----

const app = new Hono<{ Bindings: Env }>();

// Security headers for Worker responses; pages and files get theirs from
// public/_headers.
app.use("*", async (c, next) => {
  await next();
  c.header("Referrer-Policy", "no-referrer");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
});

// Rejects cross-site writes (CSRF), on top of the SameSite=Lax login cookie.
app.use("/api/*", async (c, next) => {
  const origin = c.req.header("Origin");
  const allowed = [new URL(c.req.url).origin, siteOrigin(c as Ctx)];
  if (c.req.method !== "GET" && origin && !allowed.includes(origin)) {
    return fail(c as Ctx, 403, "unauthorized", "That request came from another site.");
  }
  await next();
});
app.use("/api/*", bodyLimit({ maxSize: 64 * 1024, onError: (c) => fail(c as Ctx, 400, "invalid_input", "That's too long.") }));
app.use("/api/*", async (c, next) => {
  await next();
  // Responses carry private answers; never cache them.
  c.header("Cache-Control", "no-store");
});

app.onError((error, c) => {
  if (error instanceof AppError) return fail(c as Ctx, error.status, error.code, error.message);
  if (error instanceof ConflictError) return fail(c as Ctx, 409, "conflict", "This changed in another tab. Reload to continue.");
  console.error("Unhandled error", error instanceof Error ? error.message : error);
  return fail(c as Ctx, 500, "ai_failed", "Something went wrong, try again.");
});

app.route("/", auth);

// FR-02: draft the setup from pasted text.
app.post("/api/setup/draft", async (c) => {
  const { owner_key: ownerKey } = await requireOwner(c);
  const body = await readJson(c);
  const template = body?.template as TemplateId;
  const pasted = str(body?.pasted, 20_000);
  if (!TEMPLATES.includes(template)) return fail(c, 400, "invalid_input", "Pick a template.");
  if (pasted.length < 20) return fail(c, 400, "invalid_input", "Paste a little more, at least a couple of sentences.");
  const [byOwner, byIp, site] = await countDraft(c.env.DB, [`owner:${ownerKey}`, await ipHash(c), "site"], new Date().toISOString().slice(0, 10));
  if (site > LIMITS.draftsSite) return fail(c, 429, "rate_limited", "Drafting is paused until tomorrow. Fill the fields by hand instead.");
  if (byOwner > LIMITS.draftsPerOwner || byIp > LIMITS.draftsPerIp) {
    return fail(c, 429, "rate_limited", "That's the drafting limit for today. Fill the fields by hand, or try tomorrow.");
  }
  const draft = await draftSetup(target(c.env, c.env.MODEL_SETUP), template, pasted).catch((error) => {
    console.error("Setup draft failed", error instanceof Error ? error.message : error);
    return null;
  });
  if (!draft) return fail(c, 502, "ai_failed", "We couldn't draft that. Try again, or fill the fields by hand.");
  return c.json(draft);
});

// FR-01, FR-04: create a link for the signed-in owner.
app.post("/api/sessions", async (c) => {
  const { owner_key: ownerKey } = await requireOwner(c);
  const body = await readJson(c);
  const template = body?.template as TemplateId;
  if (!TEMPLATES.includes(template)) return fail(c, 400, "invalid_input", "Pick a template.");
  const setup = validSetup(template, body?.setup);

  const ip = await ipHash(c);
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const recent = await recentCreations(c.env.DB, ownerKey, ip, since);
  if (recent.site >= LIMITS.sessionsSite) return fail(c, 429, "rate_limited", BUSY_TODAY);
  if (recent.byOwner >= LIMITS.sessionsPerOwner || recent.byIp >= LIMITS.sessionsPerIp) {
    return fail(c, 429, "rate_limited", `You can create ${LIMITS.sessionsPerOwner} links a day. Try again tomorrow.`);
  }

  const session = await insertSession(c.env.DB, { ownerKey, template, setup, ipHash: ip });
  return c.json<CreatedSession>({
    session_id: session.id,
    share_url: `${siteOrigin(c)}/s/${session.share_token}`,
  });
});

// ---- respondent (R1-R8) ----

async function loadByToken(c: Ctx): Promise<Session> {
  const session = await sessionByToken(c.env.DB, c.req.param("token") ?? "");
  if (!session) throw new AppError(404, "not_found", "This link doesn't exist, or it has expired.");
  return session;
}

const interviewer = (c: Ctx) => target(c.env, c.env.MODEL_INTERVIEWER);
const respond = async (c: Ctx, session: Session) => c.json(respondentView(await saveSession(c.env.DB, session)));
// Saves the call reservation before any model call (see reserveCall).
const reserve = (c: Ctx, session: Session, purpose: "turn" | "confirm") => saveSession(c.env.DB, reserveCall(session, purpose));

app.get("/api/s/:token", async (c) => c.json(respondentView(await loadByToken(c))));

app.post("/api/s/:token/start", async (c) => {
  const session = await loadByToken(c);
  return session.status === "not_started" ? respond(c, startSession(session)) : c.json(respondentView(session));
});

// Saves the quick taps and asks the first question.
app.post("/api/s/:token/basics", async (c) => {
  const body = await readJson(c);
  const loaded = await loadByToken(c);
  if (loaded.basics) return fail(c, 409, "conflict", "The quick questions are already answered.");
  setBasics(loaded, body?.basics); // validate before reserving a call
  const session = setBasics(await reserve(c, loaded, "turn"), body?.basics);
  return respond(c, await takeTurn(session, interviewer(c), null));
});

app.post("/api/s/:token/turn", async (c) => {
  const body = await readJson(c);
  const answer = str(body?.answer, 4000);
  if (!answer) return fail(c, 400, "invalid_input", "Type an answer first.");
  const loaded = await loadByToken(c);
  if (loaded.status === "in_progress" && !loaded.basics) return fail(c, 409, "conflict", "Answer the quick questions first.");
  // FR-13: priorities are answered through their own step, not free text.
  if (loaded.state.last_kind === "priorities") return fail(c, 409, "conflict", "Set your priorities to continue.");
  let session = await reserve(c, loaded, "turn");
  if (body?.checkpoint === "keep_going") session = markAgreed(session);
  return respond(c, await takeTurn(session, interviewer(c), answer, { wrapUp: body?.checkpoint === "wrap_up" }));
});

app.post("/api/s/:token/steps", async (c) => {
  const body = await readJson(c);
  return respond(c, setSteps(await loadByToken(c), body?.steps));
});

app.post("/api/s/:token/priorities", async (c) => {
  const body = await readJson(c);
  const loaded = await loadByToken(c);
  setPriorities(loaded, body?.priorities); // validate before reserving a call
  const { session, answer } = setPriorities(await reserve(c, loaded, "turn"), body?.priorities);
  return respond(c, await takeTurn(session, interviewer(c), answer));
});

app.post("/api/s/:token/confirm", async (c) => {
  const loaded = await loadByToken(c);
  // confirmSession checks the landing too; checking before reserving keeps
  // an early Confirm from using up a call.
  if (loaded.state.last_kind !== "landing") return fail(c, 409, "conflict", "There's nothing to confirm yet.");
  const session = await reserve(c, loaded, "confirm");
  return respond(c, await confirmSession(session, target(c.env, c.env.MODEL_SYNTHESIS)));
});

app.post("/api/s/:token/delete", async (c) => respond(c, deleteAnswers(await loadByToken(c))));

// ---- owner (O1, O2): signed-in owners see only their own links ----

app.get("/api/links", async (c) => {
  const owner = await requireOwner(c);
  const origin = siteOrigin(c);
  const sessions = await sessionsForOwner(c.env.DB, owner.owner_key);
  return c.json<OwnerList>({ sessions: sessions.map((s) => ownerSummary(s, origin)) });
});

app.get("/api/links/:id", async (c) => {
  const owner = await requireOwner(c);
  const session = await sessionForOwner(c.env.DB, owner.owner_key, c.req.param("id"));
  if (!session) throw new AppError(404, "not_found", "That link isn't in your account.");
  return c.json<OwnerSession>({ ...ownerSummary(session, siteOrigin(c)), output_md: session.output_md });
});

app.all("/api/*", (c) => fail(c, 404, "not_found", "Not found."));

// ---- local-only prompt evals (07-test-plan.md, part A) ----
// It lets the caller pick any model, so it is off unless EVAL_MODE is "1"
// (npm run dev:eval). Never enabled in production.
app.post("/eval/turn", async (c) => {
  if (c.env.EVAL_MODE !== "1") return c.text("Not found", 404);
  const body: any = await c.req.json();
  const system = buildSystemPrompt(body.setup, body.basics, body.priority_labels, body.count);
  const state: { panel: Item[]; steps: Item[]; requirements: Item[] } = body.state;
  const flow = { count: body.count, budget: body.setup.budget, prioritiesDone: body.priorities_done, lastKind: body.last_kind };
  try {
    const { output, usage, retried } = await runInterviewerTurn(target(c.env, body.model), system, body.history, state, flow);
    const panel = applyOps(state.panel, output.panel);
    const steps = applyOps(state.steps, output.steps);
    const requirements = applyOps(state.requirements, output.requirements);
    return c.json({
      output,
      usage,
      retried,
      state: { panel: panel.items, steps: steps.items, requirements: requirements.items },
      anomalies: [...panel.anomalies, ...steps.anomalies, ...requirements.anomalies],
    });
  } catch (error) {
    if (error instanceof InvalidModelOutput) return c.json({ error: "invalid_output", raw: error.raw, usage: error.usage }, 502);
    return c.json({ error: "model_error", message: String(error) }, 500);
  }
});

export default {
  fetch: app.fetch,
  // NFR-05: daily deletion of expired sessions.
  async scheduled(_controller, env) {
    await purgeExpired(env.DB);
  },
} satisfies ExportedHandler<Env>;
