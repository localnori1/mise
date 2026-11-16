import { useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";
import { FixBox } from "./FixBox";

export function Landing({ view, busy, error, run, token }: ScreenProps) {
  const [fixing, setFixing] = useState(false);

  return (
    <main className="flex flex-1 flex-col gap-3 px-4 py-5">
      <h1 className="mx-1 font-display text-[22px] font-semibold">Before you go, is this right?</h1>
      {view.core_need && (
        <div className="flex flex-col gap-1.5 rounded-card bg-ink p-4 text-white">
          <p className="text-xs font-semibold text-input">The core need</p>
          <p className="text-base font-medium leading-snug">{view.core_need}</p>
        </div>
      )}
      {view.last?.say && (
        <Card>
          <p className="whitespace-pre-line text-sm leading-relaxed">{view.last.say}</p>
        </Card>
      )}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        {fixing ? (
          <FixBox
            busy={busy === "fix"}
            onCancel={() => setFixing(false)}
            onSend={async (answer) => {
              const ok = await run("fix", () => api.turn(token, { answer }));
              if (ok) setFixing(false);
              return ok;
            }}
          />
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" disabled={busy !== null} onClick={() => setFixing(true)}>
              Fix something
            </Button>
            <Button className="flex-1" disabled={busy !== null} onClick={() => run("confirm", () => api.confirm(token))}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
