import { Pencil, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import type { Step } from "../../../shared/api";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Pill } from "../../components/Pill";
import { ErrorNote } from "../../components/Status";
import { TextField } from "../../components/TextField";
import type { ScreenProps } from "../Respondent";

export function StepCards({ view, busy, error, run, token, onReviewed }: ScreenProps & { onReviewed: () => void }) {
  const [steps, setSteps] = useState<Step[]>(view.steps);
  const [editing, setEditing] = useState<string | null>(null);
  const saving = busy === "steps";

  const update = (id: string, patch: Partial<Step>) => setSteps((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => {
    setSteps((s) => s.filter((x) => x.id !== id));
    setEditing(null);
  };
  const addAt = (index: number) => {
    const step: Step = { id: `s-new-${Date.now()}`, text: "", if_wrong: null, added_by_respondent: true };
    setSteps((s) => [...s.slice(0, index), step, ...s.slice(index)]);
    setEditing(step.id);
  };
  const finishEditing = () => {
    setSteps((s) => s.filter((x) => x.id !== editing || x.text.trim()));
    setEditing(null);
  };

  const save = async () => {
    const clean = steps
      .filter((s) => s.text.trim())
      .map((s) => ({ ...s, text: s.text.trim(), if_wrong: s.if_wrong?.trim() || null }));
    if (await run("steps", () => api.steps(token, clean))) onReviewed();
  };

  const addButton = (index: number) => (
    <button
      type="button"
      aria-label={index === 0 ? "Add a step" : `Add a step after step ${index}`}
      onClick={() => addAt(index)}
      disabled={saving}
      className="flex h-11 w-11 cursor-pointer items-center justify-center self-center rounded-full border border-dashed border-faint bg-surface text-muted-2"
    >
      <Plus size={18} aria-hidden="true" />
    </button>
  );

  return (
    <main className="flex flex-1 flex-col gap-1.5 px-4 py-5">
      <h1 className="mx-1 font-display text-[22px] font-semibold">Is this how it goes?</h1>
      <p className="mx-1 mb-2.5 mt-0.5 text-sm leading-normal text-muted">
        Drafted from what you said. Tap + to add a missing step, or tap a step to fix it.
      </p>

      {steps.map((step, i) => (
        <Fragment key={step.id}>
          {i > 0 && addButton(i)}
          {editing === step.id ? (
            <div className="flex flex-col gap-2.5 rounded-xl border-2 border-accent bg-surface p-3">
              <TextField label={`Step ${i + 1}`} rows={2} value={step.text} onChange={(text) => update(step.id, { text })} />
              <TextField
                label="If it goes wrong (optional)"
                value={step.if_wrong ?? ""}
                onChange={(if_wrong) => update(step.id, { if_wrong })}
              />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => remove(step.id)}>
                  Remove step
                </Button>
                <Button size="sm" className="flex-1" onClick={finishEditing}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditing(step.id)}
                disabled={saving}
                aria-label={`Step ${i + 1}: ${step.text}. Edit`}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl bg-surface p-3 text-left ${
                  step.added_by_respondent ? "border-2 border-accent" : "border border-border"
                }`}
              >
                <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm leading-normal">{step.text}</span>
                {step.added_by_respondent && <Pill tone="accent">Added by you</Pill>}
                <Pencil size={14} aria-hidden="true" className="flex-none text-muted" />
              </button>
              {step.if_wrong && (
                <div className="ml-9 flex flex-col gap-1 rounded-btn border border-dashed border-faint bg-surface px-3 py-2.5">
                  <span className="text-xs font-semibold text-muted">If it goes wrong</span>
                  <span className="text-sm">{step.if_wrong}</span>
                </div>
              )}
            </>
          )}
        </Fragment>
      ))}
      {addButton(steps.length)}

      <div className="mt-3.5 flex flex-col gap-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Button onClick={save} loading={saving} disabled={editing !== null}>
          Looks right
        </Button>
      </div>
    </main>
  );
}
