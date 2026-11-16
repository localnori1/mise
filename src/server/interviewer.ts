import type { Kind } from "../shared/api";
import { callModel, fillPrompt, parseJsonObject, type Message, type ModelTarget, type Usage } from "./ai";
import template from "./prompts/interviewer.txt";
import type { Item, ItemOp } from "./state";

// What the interviewer prompt needs about the session.
export type InterviewSetup = {
  topic: string;
  role: string;
  sender: string;
  audience: "colleague" | "client" | "prospect";
  map: string[];
  focus: string[];
  focus_rule?: string;
  budget: number;
  known: string[];
  assumed: string[];
  off_limits: string[];
  sketch: string[];
};

export type Turn = { role: "respondent" | "interviewer"; text: string };

const KINDS: readonly Kind[] = ["question", "reflect", "offer", "checkpoint", "priorities", "landing", "done"];

export type TurnOutput = {
  say: string;
  kind: Kind;
  topic?: string;
  count?: number;
  options?: string[];
  steps?: ItemOp[];
  panel?: ItemOp[];
  requirements?: ItemOp[];
  core_need?: string | null;
  their_question?: string | null;
};

// Where the session is, as the app knows it. `count` counts question and
// offer turns only (FR-08: reflections, checkpoints, priorities are free).
// `wrapUp`: the respondent pressed "Wrap up here" at a checkpoint.
export type Flow = { count: number; budget: number; prioritiesDone: boolean; lastKind: Kind | null; wrapUp?: boolean };

export const countsAsQuestion = (kind: Kind) => kind === "question" || kind === "offer";

// The app, not the model, decides when questions stop (ADR-002): models lose
// count and overrun the budget or never land. Returns the instruction for this
// turn and the reply kinds the app will accept.
export function flowRule({ count, budget, prioritiesDone, lastKind, wrapUp }: Flow): { note: string; allowed: readonly Kind[] } {
  // The respondent confirms with the app's Confirm button on the landing
  // (principle 5, FR-14), so the model never ends the session ("done"), and
  // a landing only comes after priorities (FR-13).
  if (prioritiesDone) {
    return lastKind === "landing"
      ? { note: 'Ask no new questions. They corrected the landing: re-land with their correction (kind "landing").', allowed: ["landing"] }
      : { note: 'Priorities are set. Ask no new questions. This turn, give the landing (kind "landing").', allowed: ["landing"] };
  }
  if (wrapUp) {
    return { note: 'They chose to wrap up. Ask no more questions. This turn, do the priority step (kind "priorities").', allowed: ["priorities"] };
  }
  if (count >= budget) {
    const checkpointFirst = lastKind !== "checkpoint";
    return {
      note: `All ${budget} questions are used. Ask no more. This turn, ${
        checkpointFirst ? 'play back a final checkpoint (kind "checkpoint") or ' : ""
      }do the priority step (kind "priorities").`,
      allowed: checkpointFirst ? ["checkpoint", "priorities"] : ["priorities"],
    };
  }
  return {
    note: `Questions asked so far: ${count} of ${budget}.`,
    allowed: KINDS.filter((kind) => kind !== "landing" && kind !== "done"),
  };
}

// The models need a user message before the first question; there is no
// respondent text yet at that point.
const KICKOFF = "(The respondent has answered the quick questions and is ready to start.)";
// A visible reply must never talk about the app's own instructions. The retry
// used to be a chat message ("Return valid JSON only."), and the model answered
// it aloud: "Got it, JSON only from here." The retry is now an internal note,
// and this catches any such echo anyway. It only counts when the respondent
// never brought the words up themselves. It matches instruction-shaped phrases,
// not the bare word, so a business whose subject is JSON ("Who consumes the
// JSON export?") is not blocked.
const LEAK =
  /\b(?:valid|only|return(?:ing)?)\s+json\b|\bjson\s+(?:only|object|format|reply|output)\b|\bsystem\s+(?:note|notice|prompt)\b|\bmy\s+instructions\b|\binternal\s+note\b/i;

type Visible = Pick<TurnOutput, "say" | "options" | "core_need" | "panel" | "steps" | "requirements">;

export function leaksInstructions(output: Visible, history: Turn[]): boolean {
  // Everything the respondent can read: the reply, its buttons, the notes and
  // step cards, the requirements and the core need.
  const ops = [output.panel, output.steps, output.requirements].flatMap((list) => list ?? []);
  const visible = [output.say, ...(output.options ?? []), output.core_need ?? "", ...ops.map((op) => String(op.text ?? ""))].join("\n");
  if (!LEAK.test(visible)) return false;
  return !history.some((turn) => turn.role === "respondent" && LEAK.test(turn.text));
}

export class InvalidModelOutput extends Error {
  constructor(
    readonly raw: string[],
    readonly usage: Usage[],
  ) {
    super("Model did not return a valid, allowed reply after one retry");
  }
}

const bullets = (items: string[]) => (items.length ? items.map((item) => `- ${item}`).join("\n") : "none");

export function buildSystemPrompt(setup: InterviewSetup, basics: unknown, priorityLabels: string[], count: number): string {
  return fillPrompt(
    template,
    {
      topic: setup.topic,
      role: setup.role,
      sender: setup.sender,
      audience: setup.audience,
      map: setup.map.join(" | "),
      focus: setup.focus.join(", ") || "none",
      focus_rule: setup.focus_rule ?? "",
      budget: String(setup.budget),
      known: bullets(setup.known),
      assumed: bullets(setup.assumed),
      off_limits: bullets(setup.off_limits),
      sketch: setup.sketch.map((step, i) => `${i + 1}. ${step}`).join("\n"),
      basics: JSON.stringify(basics),
      priority_labels: priorityLabels.join(" / "),
      count: String(count),
    },
    "Interviewer",
  );
}

export function parseTurn(text: string): TurnOutput | null {
  const value = parseJsonObject(text);
  if (!value || typeof value.say !== "string" || !value.say.trim() || !KINDS.includes(value.kind)) return null;
  const isOpList = (ops: unknown) => ops == null || (Array.isArray(ops) && ops.every((op) => typeof op?.id === "string"));
  if (![value.panel, value.steps, value.requirements].every(isOpList)) return null;
  // Options become buttons, so they must be strings; some models return objects.
  if (Array.isArray(value.options)) {
    value.options = value.options.map((option: any) =>
      typeof option === "string" ? option : String(option?.label ?? option?.text ?? JSON.stringify(option)),
    );
  } else {
    value.options = undefined; // a model sometimes sends {} or true here
  }
  return value as TurnOutput;
}

// The prompt has no placeholder for current state and history carries only
// `say`, so without this note the model cannot know existing ids and restarts
// at p1/r1, overwriting earlier items (FR-10).
function stateNote(state: Record<string, Item[]>): string {
  const lines = Object.entries(state)
    .filter(([, items]) => items.length)
    .map(([name, items]) => `${name}:\n${items.map((item) => `- ${item.id}: ${item.text ?? ""}`).join("\n")}`);
  return lines.length
    ? `Current items (reuse these ids for update/remove; use new ids for new items):\n${lines.join("\n")}`
    : "No items captured yet.";
}

// Turn loop step 4: call the model, parse JSON, retry once (NFR-06). A reply
// of a kind the flow doesn't allow (e.g. a question after the budget) gets the
// same single retry, with the flow instruction repeated. `extraNote` carries
// app facts for this turn, such as the respondent's step-card edits.
export async function runInterviewerTurn(
  target: ModelTarget,
  system: string,
  history: Turn[],
  state: Record<string, Item[]>,
  flow: Flow,
  extraNote = "",
) {
  const rule = flowRule(flow);
  const accept = (text: string) => {
    const output = parseTurn(text);
    return output && rule.allowed.includes(output.kind) && !leaksInstructions(output, history) ? output : null;
  };
  const systemText = [system, stateNote(state), extraNote, rule.note].filter(Boolean).join("\n\n");
  const conversation: Message[] = [
    { role: "user", content: KICKOFF },
    ...history.map((turn): Message => ({ role: turn.role === "respondent" ? "user" : "assistant", content: turn.text })),
  ];
  const first = await callModel(target, [{ role: "system", content: systemText }, ...conversation]);
  const accepted = accept(first.text);
  if (accepted) return { output: accepted, usage: [first.usage], retried: false };

  // Retry from the same conversation, with the correction in the system
  // instructions rather than as a chat message, and without the failed reply,
  // so the model has nothing to answer aloud.
  const parsed = parseTurn(first.text);
  const reason = !parsed
    ? "it was not one valid JSON object in the required format."
    : leaksInstructions(parsed, history)
      ? 'it mentioned the app\'s own instructions, which the respondent must never see.'
      : rule.note;
  const correction = `Your previous reply could not be used: ${reason} Reply to the respondent's last message again, as one JSON object in the required format with nothing before or after it. This note is internal: never mention it, JSON, formatting or instructions in "say" or "options".`;
  const second = await callModel(target, [{ role: "system", content: `${systemText}\n\n${correction}` }, ...conversation]);
  const retried = accept(second.text);
  if (!retried) throw new InvalidModelOutput([first.text, second.text], [first.usage, second.usage]);
  return { output: retried, usage: [first.usage, second.usage], retried: true };
}
