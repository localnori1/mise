import { callModel, fillPrompt, type ModelTarget } from "./ai";
import { countsAsQuestion } from "./interviewer";
import auditPrompt from "./prompts/synthesis-audit-prep.txt";
import summaryPrompt from "./prompts/synthesis-session-summary.txt";
import type { Session } from "./store";

// Questions are numbered Q1, Q2, ... so every requirement can cite its source.
function transcript(session: Session): string {
  let q = 0;
  return session.turns
    .map((turn) => {
      if (turn.role === "respondent") return `Respondent: ${turn.text}`;
      const kind = turn.json?.kind ?? "question";
      const label = countsAsQuestion(kind) ? `Q${++q}` : kind;
      return `${label} Interviewer: ${turn.text}`;
    })
    .join("\n");
}

// FR-14: the template's output document, as Markdown.
export async function writeDocument(session: Session, target: ModelTarget): Promise<string> {
  const { setup, state } = session;
  const values = {
    setup: JSON.stringify(setup),
    basics: JSON.stringify(session.basics ?? {}),
    state: JSON.stringify({
      panel: state.panel,
      steps: state.steps,
      requirements: state.requirements,
      core_need: state.core_need,
      their_questions: state.their_questions,
    }),
    transcript: transcript(session),
    date: new Date().toISOString().slice(0, 10),
    sender: setup.sender,
    respondent: setup.respondent_name,
    role: setup.role,
    topic: setup.topic,
    business: setup.topic,
    seq: session.id.slice(0, 8).toUpperCase(),
  };
  const system =
    session.template === "pre_audit"
      ? fillPrompt(auditPrompt, values, "Pre-audit synthesis")
      : fillPrompt(summaryPrompt, values, "Session summary synthesis");
  const { text } = await callModel(target, [
    { role: "system", content: system },
    { role: "user", content: "Write the document now." },
  ], 16000);
  // Some models wrap Markdown in a code fence; the document is the inside.
  const markdown = text.trim().replace(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/, "$1").trim();
  if (!markdown.startsWith("#")) throw new Error("Synthesis did not return a Markdown document");
  return markdown;
}
