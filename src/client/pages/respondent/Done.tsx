import { Check } from "lucide-react";
import { useState } from "react";
import type { RespondentView } from "../../../shared/api";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card, CardLabel } from "../../components/Card";
import { CopyButton } from "../../components/CopyButton";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";

function summary(view: RespondentView) {
  const parts = [view.intro.topic];
  if (view.core_need) parts.push(`The core need\n${view.core_need}`);
  if (view.steps.length) parts.push(`The process you confirmed\n${view.steps.map((s, i) => `${i + 1}. ${s.text}`).join("\n")}`);
  if (view.panel.length) parts.push(`What we heard\n${view.panel.map((p) => `- ${p.text}`).join("\n")}`);
  const ranked = view.requirements.filter((r) => r.priority);
  if (ranked.length) parts.push(`Your priorities\n${ranked.map((r) => `- ${r.text}: ${r.priority}`).join("\n")}`);
  return parts.join("\n\n");
}

export function Done({ view, busy, error, run, token }: ScreenProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <main className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-12">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent-soft text-accent-text">
        <Check size={26} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h1 className="font-display text-[28px] font-semibold leading-tight">Thanks, that's everything</h1>
      <p className="text-[15px] leading-relaxed">
        {view.intro.sender} now has what you shared. Here's your copy, in case it helps.
      </p>
      {(view.core_need || view.steps.length > 0) && (
        <Card className="gap-2">
          {view.core_need && (
            <>
              <CardLabel>The core need</CardLabel>
              <p className="text-[15px] leading-normal">{view.core_need}</p>
            </>
          )}
          {view.steps.length > 0 && (
            <>
              <CardLabel className="mt-1.5">The process you confirmed</CardLabel>
              <p className="text-sm leading-normal text-muted-2">{view.steps.map((s) => s.text).join(" → ")}</p>
            </>
          )}
        </Card>
      )}
      <CopyButton text={summary(view)} label="Copy my answers" />

      <div className="mt-auto flex flex-col gap-2 pt-4">
        {error && <ErrorNote>{error}</ErrorNote>}
        {confirming ? (
          <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4">
            <p className="text-[15px] font-semibold">Delete everything you shared?</p>
            <p className="text-sm leading-normal text-muted">
              Your answers and the summary made from them will be removed. This can't be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" disabled={busy === "delete"} onClick={() => setConfirming(false)}>
                Keep them
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={busy === "delete"}
                onClick={() => run("delete", () => api.deleteAnswers(token))}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] leading-normal text-muted">
            Kept for this project only.{" "}
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="min-h-11 cursor-pointer font-semibold text-accent-text underline"
            >
              Delete my answers
            </button>
          </p>
        )}
      </div>
    </main>
  );
}

export function Deleted() {
  return (
    <main className="flex flex-1 flex-col gap-3 px-5 py-16">
      <h1 className="font-display text-[26px] font-semibold leading-tight">Your answers were deleted</h1>
      <p className="text-[15px] leading-relaxed text-muted-2">Nothing you shared is kept. You can close this page.</p>
    </main>
  );
}
