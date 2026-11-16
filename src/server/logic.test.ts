import { describe, expect, it } from "vitest";
import { flowRule } from "./interviewer";
import { reserveCall, setPriorities } from "./sessions";
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
    focus: [], known: [], assumed: [], off_limits: [], sketch: [], deliver_to: "me",
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
