import { useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";

export function Priorities({ view, busy, error, run, token }: ScreenProps) {
  const [picked, setPicked] = useState<Record<string, string>>(() =>
    Object.fromEntries(view.requirements.flatMap((r) => (r.priority ? [[r.id, r.priority]] : []))),
  );
  const waiting = busy === "priorities";
  const done = view.requirements.filter((r) => picked[r.id]).length;
  const complete = done === view.requirements.length;
  const pains = view.template === "pre_audit";

  return (
    <main className="flex flex-1 flex-col gap-2.5 px-4 py-5">
      <h1 className="mx-1 font-display text-[22px] font-semibold">{pains ? "What's costing you most?" : "What matters most?"}</h1>
      <p className="mx-1 mb-1.5 mt-0.5 text-sm leading-normal text-muted">
        {pains
          ? "From what you shared, here's what gets in the way. Tap how much each one costs you."
          : "From what you shared, here's what the solution would need to do. Tap how important each one is to you."}
      </p>

      {view.requirements.map((r) => (
        <div key={r.id} className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-3.5">
          <p id={`req-${r.id}`} className="text-[15px] font-medium leading-snug">
            {r.text}
          </p>
          <div role="group" aria-labelledby={`req-${r.id}`} className="flex gap-1 rounded-btn bg-bg p-1">
            {view.priority_labels.map((label) => {
              const on = picked[r.id] === label;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={on}
                  disabled={waiting}
                  onClick={() => setPicked((p) => ({ ...p, [r.id]: label }))}
                  className={`min-h-11 flex-1 cursor-pointer rounded-lg px-1.5 text-[13px] ${
                    on ? "bg-ink font-semibold text-white" : "font-medium text-muted-2"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="mx-1 mt-1 text-[13px] text-muted">
        {!complete && `${done} of ${view.requirements.length} set. `}Your priorities are recorded as yours. Others may weigh
        things differently.
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Button disabled={!complete} loading={waiting} onClick={() => run("priorities", () => api.priorities(token, picked))}>
          {waiting ? "Putting it together…" : "Continue"}
        </Button>
      </div>
    </main>
  );
}
