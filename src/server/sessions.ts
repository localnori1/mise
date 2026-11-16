import type { OwnerSessionSummary, PanelItem, QuickTap, RespondentView, Step } from "../shared/api";
import templates from "../shared/templates.json";
import type { ModelTarget } from "./ai";
import { buildSystemPrompt, countsAsQuestion, runInterviewerTurn, type InterviewSetup, type Turn } from "./interviewer";
import { applyOps, type Item } from "./state";
import { emptyState, type Session } from "./store";
import { writeDocument } from "./synthesis";

export type Template = (typeof templates)[keyof typeof templates];
export const templateOf = (session: Pick<Session, "template">): Template => templates[session.template];

// A user-facing failure; the route turns it into an ApiError response.
export class AppError extends Error {
  constructor(
    readonly status: 400 | 404 | 409 | 429 | 502,
    readonly code: "not_found" | "invalid_input" | "rate_limited" | "ai_failed" | "conflict" | "turn_cap" | "closed",
    message: string,
  ) {
    super(message);
  }
}

const now = () => new Date().toISOString();

function interviewSetup(session: Session): InterviewSetup {
  const template = templateOf(session);
  const { setup } = session;
  return {
    topic: setup.topic,
    role: setup.role,
    sender: setup.sender,
    audience: setup.audience,
    map: template.map,
    focus: setup.focus,
    focus_rule: "focus_rule" in template ? template.focus_rule : undefined,
    budget: template.budget,
    known: setup.known,
    assumed: setup.assumed,
    off_limits: setup.off_limits,
    sketch: setup.sketch,
  };
}

function quickTaps(session: Session): QuickTap[] {
  return templateOf(session).quick_taps.map((tap) => ({
    id: tap.id,
    question: tap.question.replace("{{topic_noun}}", session.setup.topic.toLowerCase()),
    type: tap.type as QuickTap["type"],
    options: "options" in tap ? tap.options : undefined,
    prefill: "prefill_from" in tap && tap.prefill_from === "setup.role" ? session.setup.role : undefined,
  }));
}

// What the respondent's browser may see: never the owner key, the sender's
// private notes (known/assumed), or the output document (04-architecture.md).
export function respondentView(session: Session): RespondentView {
  const template = templateOf(session);
  const { state, setup } = session;
  return {
    status: session.status,
    template: session.template,
    intro: {
      topic: setup.topic,
      summary: setup.summary,
      sender: setup.sender,
      respondent_name: setup.respondent_name,
      map: template.map,
      minutes: template.estimated_minutes,
      off_limits: setup.off_limits,
    },
    quick_taps: quickTaps(session),
    basics: session.basics,
    priority_labels: template.priority_labels,
    messages: session.turns.map((turn) => ({ role: turn.role, text: turn.text })),
    last: state.last,
    panel: state.panel.map((item) => ({
      id: item.id,
      section: String(item.section ?? ""),
      text: String(item.text ?? ""),
      tag: (["heard", "assumed", "open", "agreed"].includes(item.tag as string) ? item.tag : "heard") as PanelItem["tag"],
    })),
    steps: state.steps.map((item) => ({
      id: item.id,
      text: String(item.text ?? ""),
      actor: (item.actor as string) ?? null,
      if_wrong: (item.if_wrong as string) ?? null,
      added_by_respondent: Boolean(item.added_by_respondent),
    })),
    requirements: state.requirements.map((item) => ({
      id: item.id,
      text: String(item.text ?? ""),
      priority: (item.priority as string) ?? null,
    })),
    core_need: state.core_need,
    question_count: state.count,
    budget: template.budget,
  };
}

export function ownerSummary(session: Session, origin: string): OwnerSessionSummary {
  return {
    id: session.id,
    template: session.template,
    topic: session.setup.topic,
    respondent_name: session.setup.respondent_name,
    role: session.setup.role,
    status: session.status,
    question_count: session.state.count,
    share_url: `${origin}/s/${session.share_token}`,
    created_at: session.created_at,
    updated_at: session.updated_at,
  };
}

function requireInProgress(session: Session) {
  if (session.status === "deleted") throw new AppError(409, "closed", "These answers were deleted.");
  if (session.status === "ready") throw new AppError(409, "closed", "This session is already complete.");
  if (session.status !== "in_progress") throw new AppError(409, "closed", "Start the session first.");
}

// Turn loop (04-architecture.md, with ADR-002): one interviewer turn after an
// optional respondent answer. Returns the updated session without saving it,
// so a failed model call loses nothing (NFR-06: the client keeps the answer).
export async function takeTurn(
  session: Session,
  target: ModelTarget,
  answer: string | null,
  options: { wrapUp?: boolean } = {},
): Promise<Session> {
  requireInProgress(session);
  const template = templateOf(session);
  // Near the NFR-03 cap, move to priorities and the landing so the session
  // can still be confirmed (those take two calls, plus a re-land).
  const nearCap = session.state.ai_turns >= template.budget + 5;
  const state = { ...session.state, wrap_up: session.state.wrap_up || Boolean(options.wrapUp) || nearCap };

  const turns = [...session.turns];
  if (answer !== null) turns.push({ role: "respondent", text: answer, at: now() });
  const history: Turn[] = turns.map((turn) => ({ role: turn.role, text: turn.text }));
  const system = buildSystemPrompt(interviewSetup(session), session.basics, template.priority_labels, state.count);
  const items = { panel: state.panel, steps: state.steps, requirements: state.requirements };
  const stepsNote = state.steps_edited
    ? "The respondent has corrected the step cards since your last turn. The steps listed above are their version; treat them as right."
    : "";

  let result;
  try {
    result = await runInterviewerTurn(
      target,
      system,
      history,
      items,
      { count: state.count, budget: template.budget, prioritiesDone: state.priorities_done, lastKind: state.last_kind, wrapUp: state.wrap_up },
      stepsNote,
    );
  } catch (error) {
    console.error("Interviewer turn failed", error instanceof Error ? error.message : error);
    throw new AppError(502, "ai_failed", "Something went wrong, try again.");
  }
  const { output } = result;

  // Respondent-owned fields survive the model's updates: their own priorities
  // (D-06) and the steps they added.
  const keep = (before: Item[], after: Item[], fields: string[]) =>
    after.map((item) => {
      const old = before.find((b) => b.id === item.id);
      const kept = Object.fromEntries(fields.filter((f) => old?.[f] != null).map((f) => [f, old![f]]));
      return { ...item, ...kept };
    });
  const steps = keep(state.steps, applyOps(state.steps, output.steps).items, ["added_by_respondent"]);
  const requirements = state.priorities_done
    ? keep(state.requirements, applyOps(state.requirements, output.requirements).items, ["priority"])
    : applyOps(state.requirements, output.requirements).items;

  // The map bar only moves forward, and always shows the template's exact
  // wording: models paraphrase topic names ("What should do").
  const words = (s: string) => s.toLowerCase().replace(/\byour\b/g, "").replace(/[^a-z ]/g, "").trim();
  const said = output.topic ? template.map.findIndex((t) => words(t).startsWith(words(output.topic!)) || words(output.topic!).startsWith(words(t))) : -1;
  const topicIndex = Math.max(state.topic_index ?? 0, said);

  turns.push({ role: "interviewer", text: output.say, json: output, at: now() });
  return {
    ...session,
    turns,
    state: {
      ...state,
      panel: applyOps(state.panel, output.panel).items,
      steps,
      requirements,
      core_need: output.core_need ?? state.core_need,
      their_questions: output.their_question ? [...state.their_questions, output.their_question] : state.their_questions,
      count: state.count + (countsAsQuestion(output.kind) ? 1 : 0),
      priorities_done: state.priorities_done || output.kind === "priorities",
      last_kind: output.kind,
      steps_edited: false,
      topic_index: topicIndex,
      last: {
        kind: output.kind,
        say: output.say,
        options: output.options ?? [],
        topic: template.map[topicIndex],
        steps_changed: Boolean(output.steps?.length),
      },
    },
  };
}

// NFR-03: every interviewer turn (each with at most one retry) or document
// write is counted before it is made, and the caller saves this reservation first. Parallel requests on one link then fail on the
// version check before spending anything, and failed calls still count.
// Interview turns stop at budget + 8; writing the document gets a few tries more.
export function reserveCall(session: Session, purpose: "turn" | "confirm"): Session {
  requireInProgress(session);
  const limit = templateOf(session).budget + (purpose === "turn" ? 8 : 11);
  if (session.state.ai_turns >= limit) {
    throw new AppError(429, "turn_cap", "This session has reached its limit. Ask the sender to send a new link.");
  }
  return { ...session, state: { ...session.state, ai_turns: session.state.ai_turns + 1 } };
}

// "Items are heard until confirmed at a checkpoint or the landing; the app
// marks them agreed on confirmation" (interviewer prompt).
export function markAgreed(session: Session): Session {
  const panel = session.state.panel.map((item) => (item.tag === "heard" ? { ...item, tag: "agreed" } : item));
  return { ...session, state: { ...session.state, panel } };
}

export function startSession(session: Session): Session {
  if (session.status === "not_started") return { ...session, status: "in_progress" };
  return session;
}

export function setBasics(session: Session, raw: unknown): Session {
  requireInProgress(session);
  if (!raw || typeof raw !== "object") throw new AppError(400, "invalid_input", "Please answer the quick questions.");
  const basics: Record<string, string | string[]> = {};
  for (const tap of quickTaps(session)) {
    const value = (raw as Record<string, unknown>)[tap.id];
    if (tap.type === "multi") {
      const list = Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && (tap.options ?? []).includes(v)) : [];
      basics[tap.id] = list;
    } else if (typeof value === "string") {
      if (tap.type === "single" && !(tap.options ?? []).includes(value)) continue;
      basics[tap.id] = value.trim().slice(0, 200);
    }
  }
  return { ...session, basics };
}

export function setSteps(session: Session, raw: unknown): Session {
  requireInProgress(session);
  if (!Array.isArray(raw) || raw.length > 30) throw new AppError(400, "invalid_input", "Those steps couldn't be saved.");
  const clean = (value: unknown, max: number) => (typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null);
  const steps: Item[] = [];
  for (const step of raw as Partial<Step>[]) {
    const text = clean(step?.text, 300);
    const id = clean(step?.id, 60);
    if (!text || !id) continue;
    steps.push({ id, text, actor: clean(step.actor, 100), if_wrong: clean(step.if_wrong, 300), added_by_respondent: Boolean(step.added_by_respondent) });
  }
  const last = session.state.last ? { ...session.state.last, steps_changed: false } : null;
  return { ...session, state: { ...session.state, steps, steps_edited: true, last } };
}

// FR-13: every candidate item needs one of the template's labels.
export function setPriorities(session: Session, raw: unknown): { session: Session; answer: string } {
  requireInProgress(session);
  if (session.state.last_kind !== "priorities") throw new AppError(409, "conflict", "Priorities aren't open yet.");
  const labels = templateOf(session).priority_labels;
  const picks = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const requirements = session.state.requirements.map((item): Item => {
    const label = picks[item.id];
    if (typeof label !== "string" || !labels.includes(label)) {
      throw new AppError(400, "invalid_input", "Please set a priority for every item.");
    }
    return { ...item, priority: label };
  });
  const answer = `My priorities: ${requirements.map((r) => `"${r.text}": ${r.priority}`).join("; ")}.`;
  return { session: { ...session, state: { ...session.state, requirements } }, answer };
}

// FR-14: confirming the landing writes the document and marks the session Ready.
export async function confirmSession(session: Session, target: ModelTarget): Promise<Session> {
  requireInProgress(session);
  if (session.state.last_kind !== "landing") throw new AppError(409, "conflict", "There's nothing to confirm yet.");
  const agreed = markAgreed(session);
  let output: string;
  try {
    output = await writeDocument(agreed, target);
  } catch (error) {
    console.error("Synthesis failed", error instanceof Error ? error.message : error);
    throw new AppError(502, "ai_failed", "We couldn't write up your answers just now. Please try Confirm again.");
  }
  return { ...agreed, status: "ready", output_md: output };
}

// FR-15: remove the transcript, state and output; keep the sender's own setup
// so their page can say "Deleted by respondent".
export function deleteAnswers(session: Session): Session {
  return { ...session, basics: null, turns: [], state: emptyState(), output_md: null, status: "deleted" };
}
