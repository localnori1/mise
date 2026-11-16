import { Check } from "lucide-react";
import { useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card, CardLabel } from "../../components/Card";
import { DocumentActions, fileSlug } from "../../components/DocumentActions";
import { ErrorNote } from "../../components/Status";
import { Link } from "../../router";
import type { ScreenProps } from "../Respondent";

export function Done({ view, busy, error, run, token }: ScreenProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <main className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-12">
      <h1 className="font-display text-[28px] font-semibold leading-tight">
        Thanks, that's everything
        <span className="ml-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft align-middle text-accent-text">
          <Check size={22} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </h1>
      <p className="text-[15px] leading-relaxed">
        {view.intro.sender} now has what you shared.
        {view.document_md && " The document made from your answers is yours to keep too."}
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
      {view.document_md && <DocumentActions markdown={view.document_md} name={fileSlug(view.intro.topic)} hint centered />}

      <div className="mt-auto flex flex-col gap-2 pt-4">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Link href="/" className="inline-flex min-h-11 items-center self-center text-sm font-semibold">
          Go to Mise
        </Link>
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
