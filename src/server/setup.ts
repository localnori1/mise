import type { Audience, FocusArea, SetupDraft, TemplateId } from "../shared/api";
import { callModel, fillPrompt, parseJsonObject, type ModelTarget } from "./ai";
import template from "./prompts/setup-drafter.txt";

const FOCUS: FocusArea[] = ["process", "pain", "goals_scope", "constraints", "feel"];
const AUDIENCES: Audience[] = ["client", "prospect", "colleague"];

const text = (value: unknown, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const list = (value: unknown, max = 12) =>
  Array.isArray(value) ? value.map((v) => text(v)).filter(Boolean).slice(0, max) : [];

// Keep only the fields and shapes the setup screen expects; the model's reply
// is untrusted (it was shaped by pasted material).
function cleanDraft(raw: Record<string, any>): SetupDraft | null {
  const topic = text(raw.topic, 80);
  if (!topic) return null;
  const respondent = raw.respondent && typeof raw.respondent === "object" ? raw.respondent : {};
  return {
    topic,
    summary: text(raw.summary),
    respondent: {
      name: text(respondent.name, 80) || null,
      role: text(respondent.role, 80) || null,
      relationship: AUDIENCES.includes(respondent.relationship) ? respondent.relationship : null,
    },
    focus_suggestions: list(raw.focus_suggestions)
      .filter((f): f is FocusArea => FOCUS.includes(f as FocusArea))
      .slice(0, 2),
    known: list(raw.known),
    assumed: list(raw.assumed),
    sketch: list(raw.sketch, 15),
    off_limits_suggestions: list(raw.off_limits_suggestions),
    gaps: list(raw.gaps),
  };
}

// FR-02: draft the setup fields from pasted notes; one retry on bad JSON.
export async function draftSetup(target: ModelTarget, templateId: TemplateId, pasted: string): Promise<SetupDraft | null> {
  const system = fillPrompt(template, { template: templateId, pasted }, "Setup drafter");
  const messages = [
    { role: "system" as const, content: system },
    { role: "user" as const, content: "Draft the setup now." },
  ];
  const first = await callModel(target, messages, 2048);
  const draft = parseJsonObject(first.text);
  if (draft) return cleanDraft(draft);
  const second = await callModel(target, [
    ...messages,
    { role: "assistant", content: first.text || "(empty)" },
    { role: "user", content: "Return valid JSON only." },
  ], 2048);
  const retried = parseJsonObject(second.text);
  return retried ? cleanDraft(retried) : null;
}
