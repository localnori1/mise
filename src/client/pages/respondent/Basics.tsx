import { useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Chip } from "../../components/Chip";
import { ErrorNote } from "../../components/Status";
import { TextField } from "../../components/TextField";
import type { ScreenProps } from "../Respondent";

type Answers = Record<string, string | string[]>;

export function Basics({ view, busy, error, run, token }: ScreenProps) {
  const [answers, setAnswers] = useState<Answers>(() =>
    Object.fromEntries(view.quick_taps.map((q) => [q.id, q.type === "multi" ? [] : (q.prefill ?? "")])),
  );
  const waiting = busy === "basics";
  const set = (id: string, value: string | string[]) => setAnswers((a) => ({ ...a, [id]: value }));

  return (
    <main className="flex flex-1 flex-col gap-3.5 p-5">
      <div>
        <h1 className="font-display text-[22px] font-semibold">Quick basics</h1>
        <p className="mt-1 text-sm text-muted">About 30 seconds. Just tap.</p>
      </div>

      {view.quick_taps.map((q) => {
        const value = answers[q.id];
        if (q.type === "text") {
          return (
            <Card key={q.id}>
              <TextField
                label={q.question}
                labelClassName="text-[15px] font-semibold"
                value={value as string}
                onChange={(v) => set(q.id, v)}
                disabled={waiting}
                hint={q.prefill ? `${view.intro.sender} told us this. Fix it if it's off.` : undefined}
              />
            </Card>
          );
        }
        const selected = q.type === "multi" ? (value as string[]) : [value as string];
        const toggle = (option: string) =>
          q.type === "multi"
            ? set(q.id, selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option])
            : set(q.id, value === option ? "" : option);
        return (
          <Card key={q.id}>
            <p id={`q-${q.id}`} className="text-[15px] font-semibold">
              {q.question}
            </p>
            {q.type === "multi" && <p className="text-[13px] text-muted">Pick all that apply.</p>}
            <div role="group" aria-labelledby={`q-${q.id}`} className="flex flex-wrap gap-2">
              {q.options?.map((option) => (
                <Chip key={option} pressed={selected.includes(option)} onClick={() => toggle(option)} disabled={waiting}>
                  {option}
                </Chip>
              ))}
            </div>
          </Card>
        );
      })}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        {waiting && (
          <p role="status" className="text-center text-[13px] text-muted">
            Getting your first question ready. This can take a few seconds.
          </p>
        )}
        <Button loading={waiting} onClick={() => run("basics", () => api.basics(token, answers))}>
          Continue
        </Button>
      </div>
    </main>
  );
}
