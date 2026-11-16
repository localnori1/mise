import { describe, expect, it } from "vitest";
import { safeNext } from "./auth";
import { flowRule, leaksInstructions } from "./interviewer";
import { reserveCall, respondentCopy, setPriorities } from "./sessions";
import { applyOps } from "./state";
import { emptyState, type Session } from "./store";

describe("flowRule (ADR-002)", () => {
  const base = { budget: 10, prioritiesDone: false, lastKind: null } as const;

  it("allows questions but not a landing or ending while questions remain", () => {
    const { allowed } = flowRule({ ...base, count: 9 });
    expect(allowed).toContain("question");
    expect(allowed).not.toContain("landing");
    expect(allowed).not.toContain("done");
  });

  it("stops questions at the budget, allowing one final checkpoint", () => {
    expect(flowRule({ ...base, count: 10, lastKind: "question" }).allowed).toEqual(["checkpoint", "priorities"]);
    expect(flowRule({ ...base, count: 10, lastKind: "checkpoint" }).allowed).toEqual(["priorities"]);
  });

  it("goes straight to priorities when they wrap up early", () => {
    expect(flowRule({ ...base, count: 3, wrapUp: true }).allowed).toEqual(["priorities"]);
  });

  it("only lands (or re-lands) after priorities; the respondent's Confirm ends it", () => {
    expect(flowRule({ ...base, count: 10, prioritiesDone: true, lastKind: "priorities" }).allowed).toEqual(["landing"]);
    expect(flowRule({ ...base, count: 10, prioritiesDone: true, lastKind: "landing" }).allowed).toEqual(["landing"]);
  });
});

describe("applyOps (FR-10)", () => {
  it("replaces an updated item instead of duplicating it, keeping fields it leaves out", () => {
    const items = [{ id: "p3", text: "old", tag: "heard" }];
    const { items: next } = applyOps(items, [{ id: "p3", op: "update", text: "new" }]);
    expect(next).toEqual([{ id: "p3", text: "new", tag: "heard" }]);
  });

  it("adds, removes, and upserts items without an op", () => {
    const { items } = applyOps([{ id: "a" }, { id: "b" }], [{ id: "a", op: "remove" }, { id: "c", op: "add" }, { id: "b", text: "x" }]);
    expect(items).toEqual([{ id: "b", text: "x" }, { id: "c" }]);
  });
});

const session = (): Session => ({
  id: "s1",
  owner_key: "o",
  share_token: "t",
  template: "requirements",
  setup: {
    topic: "T", summary: "", sender: "Ana", respondent_name: "Jo", role: "Dispatcher", audience: "colleague",
    focus: [], known: [], assumed: [], off_limits: [], sketch: [],
  },
  basics: {},
  turns: [],
  state: {
    ...emptyState(),
    last_kind: "priorities",
    requirements: [{ id: "r1", text: "One" }, { id: "r2", text: "Two" }],
  },
  status: "in_progress",
  output_md: null,
  version: 0,
  created_at: "",
  updated_at: "",
});

describe("reserveCall (NFR-03)", () => {
  it("counts a call before it is made and refuses past the cap", () => {
    const s = session();
    expect(reserveCall(s, "turn").state.ai_turns).toBe(1);
    const atCap = { ...s, state: { ...s.state, ai_turns: 18 } }; // budget 10 + 8
    expect(() => reserveCall(atCap, "turn")).toThrow(/limit/);
    expect(reserveCall(atCap, "confirm").state.ai_turns).toBe(19);
  });
});

describe("setPriorities (FR-13)", () => {
  it("rejects when any item is missing a label", () => {
    expect(() => setPriorities(session(), { r1: "Must have" })).toThrow(/every item/);
  });

  it("rejects labels that aren't the template's", () => {
    expect(() => setPriorities(session(), { r1: "Must have", r2: "Urgent" })).toThrow(/every item/);
  });

  it("records the respondent's labels", () => {
    const { session: next, answer } = setPriorities(session(), { r1: "Must have", r2: "Not needed" });
    expect(next.state.requirements.map((r) => r.priority)).toEqual(["Must have", "Not needed"]);
    expect(answer).toContain('"Two": Not needed');
  });
});

describe("respondentCopy (ADR-003)", () => {
  const doc = "# Pre-Audit Brief: X\n\n## 5. Success\nQuote\n\n## 6. Where to Dig on the Call\n| D-01 | Ask |\n\n### Notes\nprep\n\n## 7. Owner's Questions\nNone\n\n## 8. Handoff\nInterview Jo next";
  const copy = (template: "requirements" | "pre_audit", output_md: string) => respondentCopy({ template, status: "ready", output_md });

  it("is withheld until the document is ready", () => {
    expect(respondentCopy({ template: "requirements", status: "in_progress", output_md: "x" })).toBeNull();
  });

  it("gives the full requirements document", () => {
    expect(copy("requirements", doc)).toBe(doc);
  });

  it("leaves the consultant's call prep and handoff out of a Pre-Audit Brief", () => {
    const text = copy("pre_audit", doc)!;
    expect(text).not.toMatch(/Where to Dig|D-01|prep|Handoff|Interview Jo/);
    expect(text).toContain("## 5. Success");
    expect(text).toContain("## 7. Owner's Questions");
  });

  it("matches drifted headings", () => {
    expect(copy("pre_audit", "# B\n### 6) **Where to dig on the call**\nD-01\n## 7. Q\nok")).toBe("# B\n## 7. Q\nok");
  });

  it("keeps a title that mentions handoff and drops an indented Hand-off section", () => {
    expect(copy("pre_audit", "# Brief: Shift Handoff Co\n## 6. Where to Dig\nD-01\n  ## 8. Hand-off\nnext\n## 9. End\nok")).toBe(
      "# Brief: Shift Handoff Co\n## 9. End\nok",
    );
  });

  it("withholds a brief whose call-prep heading can't be found", () => {
    expect(copy("pre_audit", "# B\n## 6. Questions for the call\nD-01")).toBeNull();
  });
});

describe("safeNext (sign-in redirect)", () => {
  const origin = "https://mise.example";
  it.each(["/\t/evil.example", "//evil.example", "/\\evil.example", "https://evil.example", "/.//evil.example", "/x/..//evil.example", "/%2e//evil.example", "evil", undefined])(
    "refuses %j",
    (next) => expect(safeNext(next, origin)).toBe("/links"),
  );
  it("keeps same-site paths", () => {
    expect(safeNext("/new?template=pre_audit", origin)).toBe("/new?template=pre_audit");
  });
});

describe("leaksInstructions (the visible reply never talks about the app)", () => {
  const asked = [{ role: "respondent" as const, text: "We just send invoices" }];
  it("catches an echo of the retry instruction", () => {
    expect(leaksInstructions({ say: "Got it, JSON only from here. How often does it happen?" }, asked)).toBe(true);
    expect(leaksInstructions({ say: "Fine.", options: ["Return valid JSON"] }, asked)).toBe(true);
  });
  it("lets a normal question through", () => {
    expect(leaksInstructions({ say: "How often does a slip go missing?" }, asked)).toBe(false);
  });
  it("does not block a business whose subject is JSON", () => {
    expect(leaksInstructions({ say: "Who consumes the JSON export?" }, asked)).toBe(false);
    expect(leaksInstructions({ say: "Do you export it as JSON?", options: ["Yes, as JSON", "No"] }, asked)).toBe(false);
    expect(leaksInstructions({ say: "What does the system message say when it fails?" }, asked)).toBe(false);
  });
  it("checks the notes and the core need the respondent can read", () => {
    expect(leaksInstructions({ say: "Fine.", panel: [{ id: "p1", text: "Reply with JSON only" }] }, asked)).toBe(true);
    expect(leaksInstructions({ say: "Fine.", core_need: "Return valid JSON" }, asked)).toBe(true);
  });
  it("allows the word when the respondent used it first", () => {
    const history = [{ role: "respondent" as const, text: "We export the data as JSON" }];
    expect(leaksInstructions({ say: "Who reads the JSON file?" }, history)).toBe(false);
  });
});
