import { useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { PanelList } from "../../components/Pill";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";
import { FixBox } from "./FixBox";

export function Checkpoint({ view, busy, error, run, token }: ScreenProps) {
  const [fixing, setFixing] = useState(false);
  const say = view.last?.say ?? "";
  const finalCheckpoint = view.question_count >= view.budget;

  return (
    <main className="flex flex-1 flex-col gap-3 px-4 py-5">
      <h1 className="mx-1 font-display text-[22px] font-semibold">Here's what we have so far</h1>
      {view.panel.length > 0 && (
        <Card>
          <PanelList items={view.panel} />
        </Card>
      )}
      {say && (
        <div className="flex flex-col gap-2 rounded-card bg-accent-soft p-4">
          <p className="text-xs font-semibold text-accent-text">What I'm hearing</p>
          <p className="whitespace-pre-line text-[15px] leading-normal">{say}</p>
        </div>
      )}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        {fixing ? (
          <FixBox
            busy={busy === "fix"}
            onCancel={() => setFixing(false)}
            onSend={async (answer) => {
              const ok = await run("fix", () => api.turn(token, { answer, checkpoint: "fix" }));
              if (ok) setFixing(false);
              return ok;
            }}
          />
        ) : finalCheckpoint ? (
          // Questions are used up: the only way on is the priority step.
          <div className="flex gap-2">
            <Button
              className="flex-1"
              loading={busy === "keep_going"}
              disabled={busy !== null}
              onClick={() => run("keep_going", () => api.turn(token, { answer: "That's right, let's continue.", checkpoint: "keep_going" }))}
            >
              Continue
            </Button>
            <Button variant="secondary" className="flex-1" disabled={busy !== null} onClick={() => setFixing(true)}>
              Fix something
            </Button>
          </div>
        ) : (
          <>
            <Button
              loading={busy === "keep_going"}
              disabled={busy !== null}
              onClick={() => run("keep_going", () => api.turn(token, { answer: "Keep going.", checkpoint: "keep_going" }))}
            >
              Keep going
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                loading={busy === "wrap_up"}
                disabled={busy !== null}
                onClick={() => run("wrap_up", () => api.turn(token, { answer: "Let's wrap up here.", checkpoint: "wrap_up" }))}
              >
                Wrap up here
              </Button>
              <Button variant="secondary" className="flex-1" disabled={busy !== null} onClick={() => setFixing(true)}>
                Fix something
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
