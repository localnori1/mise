// The contract between the React app and the Worker API. Types only: both
// sides import it, so it must not depend on Worker or DOM types.
//
// Errors: every non-2xx response has the body `ApiError`.
// Endpoints (all JSON):
//   POST /api/setup/draft               DraftRequest      -> SetupDraft
//   POST /api/sessions                  CreateSession     -> CreatedSession  (sets owner cookie)
//   GET  /api/s/:token                                    -> RespondentView
//   POST /api/s/:token/start                              -> RespondentView  (R1 Start: status in_progress)
//   POST /api/s/:token/basics           Basics            -> RespondentView  (saves R2, runs the first turn)
//   POST /api/s/:token/turn             TurnRequest       -> RespondentView
//   POST /api/s/:token/steps            StepsRequest      -> RespondentView  (R4 edits; no AI call)
//   POST /api/s/:token/priorities       PrioritiesRequest -> RespondentView  (R6; then the landing turn)
//   POST /api/s/:token/confirm                            -> RespondentView  (R7 Confirm; writes the document)
//   POST /api/s/:token/delete                             -> RespondentView  (R8 Delete my answers)
//   GET  /api/o/:ownerKey                                 -> OwnerList
//   GET  /api/o/:ownerKey/:id                             -> OwnerSession
//   GET  /api/o/:ownerKey/:id/export.md                   -> text/markdown download

export type TemplateId = "requirements" | "pre_audit";
export type Audience = "colleague" | "client" | "prospect";
export type Status = "not_started" | "in_progress" | "ready" | "deleted";
export type Kind = "question" | "reflect" | "offer" | "checkpoint" | "priorities" | "landing" | "done";

export type ApiError = {
  error: {
    code: "not_found" | "invalid_input" | "rate_limited" | "ai_failed" | "conflict" | "turn_cap" | "closed";
    message: string; // safe to show to the user
  };
};

// ---- Setup (S1) ----

export type FocusArea = "process" | "pain" | "goals_scope" | "constraints" | "feel";

export type DraftRequest = { template: TemplateId; pasted: string };

// What the setup drafter returns; every field is editable before creating.
export type SetupDraft = {
  topic: string;
  summary: string;
  respondent: { name: string | null; role: string | null; relationship: Audience | null };
  focus_suggestions: FocusArea[];
  known: string[];
  assumed: string[];
  sketch: string[];
  off_limits_suggestions: string[];
  gaps: string[];
};

export type SetupInput = {
  topic: string; // requirements: title; pre_audit: the prospect's business name
  summary: string;
  sender: string; // the sender's name, shown to the respondent ("From Ana")
  respondent_name: string;
  role: string;
  audience: Audience;
  focus: FocusArea[]; // max 2; empty for pre_audit
  known: string[];
  assumed: string[];
  off_limits: string[];
  sketch: string[];
  deliver_to: "me" | "both";
};

export type CreateSession = { template: TemplateId; setup: SetupInput };
export type CreatedSession = { session_id: string; share_url: string; owner_key: string; owner_url: string };

// ---- Respondent (R1-R8) ----

export type QuickTap = {
  id: string;
  question: string;
  type: "single" | "multi" | "text";
  options?: string[];
  prefill?: string; // e.g. role from setup
};

export type PanelItem = {
  id: string;
  section: string;
  text: string;
  tag: "heard" | "assumed" | "open" | "agreed";
};

export type Step = {
  id: string;
  text: string;
  actor?: string | null;
  if_wrong?: string | null;
  added_by_respondent?: boolean;
};

export type Requirement = { id: string; text: string; priority: string | null };

export type Message = { role: "interviewer" | "respondent"; text: string };

export type RespondentView = {
  status: Status;
  template: TemplateId;
  intro: {
    topic: string;
    summary: string;
    sender: string;
    respondent_name: string;
    map: string[];
    minutes: number;
    off_limits: string[];
  };
  quick_taps: QuickTap[];
  basics: Record<string, string | string[]> | null;
  priority_labels: string[]; // e.g. ["Must have", "Nice to have", "Not needed"]
  messages: Message[];
  // The interviewer's latest turn; the UI picks the screen from `kind`:
  // question/reflect/offer -> R3, checkpoint -> R5, priorities -> R6,
  // landing -> R7; status "ready" -> R8. null before the first question.
  last: { kind: Kind; say: string; options: string[]; topic: string | null; steps_changed: boolean } | null;
  panel: PanelItem[];
  steps: Step[];
  requirements: Requirement[];
  core_need: string | null;
  question_count: number;
  budget: number;
};

export type Basics = { basics: Record<string, string | string[]> };
// `checkpoint`: which R5 button was pressed, if any ("wrap_up" ends the questions).
export type TurnRequest = { answer: string; checkpoint?: "keep_going" | "wrap_up" | "fix" };
export type StepsRequest = { steps: Step[] };
export type PrioritiesRequest = { priorities: Record<string, string> }; // requirement id -> label

// ---- Owner (O1, O2) ----

export type OwnerSessionSummary = {
  id: string;
  template: TemplateId;
  topic: string;
  respondent_name: string;
  role: string;
  status: Status;
  question_count: number;
  share_url: string;
  created_at: string;
  updated_at: string;
};

export type OwnerList = { sessions: OwnerSessionSummary[] };
export type OwnerSession = OwnerSessionSummary & { output_md: string | null };
