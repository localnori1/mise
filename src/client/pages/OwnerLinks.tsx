import { useEffect, useState } from "react";
import templates from "../../shared/templates.json";
import type { OwnerSessionSummary } from "../../shared/api";
import { api, errorMessage } from "../api";
import { handleSignedOut, SignInCard, useOwner } from "../auth";
import { AccountMenu } from "../components/AccountMenu";
import { buttonClass } from "../components/Button";
import { CopyButton } from "../components/CopyButton";
import { StatusChip } from "../components/Pill";
import { ErrorNote, Loading } from "../components/Status";
import { Link } from "../router";

export function OwnerLinks() {
  const [owner, setOwner] = useOwner();
  const [sessions, setSessions] = useState<OwnerSessionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner) return;
    let live = true;
    api
      .links()
      .then((res) => live && setSessions(res.sessions))
      .catch((err) => live && !handleSignedOut(err, setOwner) && setError(errorMessage(err)));
    return () => {
      live = false;
    };
  }, [owner]);

  if (owner === undefined) return <Loading />;
  if (owner === null) {
    return (
      <main className="mx-auto flex max-w-[480px] flex-col px-4 py-12">
        <SignInCard next="/links" title="Sign in to see your links" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-3 px-4 pb-12 pt-7">
      <div className="flex items-center justify-between gap-3 px-1">
        <h1 className="font-display text-[26px] font-semibold">Your links</h1>
        <div className="flex items-center gap-2">
          <AccountMenu />
          <Link href="/new" className={buttonClass("primary", "", "sm")}>
            New link
          </Link>
        </div>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {!error && !sessions && <Loading />}
      {sessions?.length === 0 && (
        <div className="rounded-card border border-dashed border-faint bg-surface p-6 text-center text-sm text-muted">
          No links yet. Create one and it will show up here.
        </div>
      )}

      {sessions?.map((s) => {
        const meta = [templates[s.template].name, s.respondent_name, s.role].filter(Boolean).join(" · ");
        return (
          <div key={s.id} className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4">
            <Link href={`/links/${encodeURIComponent(s.id)}`} className="flex items-center gap-2.5 text-ink no-underline">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-semibold">{s.topic}</span>
                <span className="text-[13px] text-muted">
                  {meta}
                  {s.status === "in_progress" && ` · question ${s.question_count}`}
                </span>
              </span>
              <StatusChip status={s.status} />
            </Link>
            {s.status !== "deleted" && (
              <CopyButton text={s.share_url} label="Copy share link" size="sm" className="self-start" />
            )}
          </div>
        );
      })}
    </main>
  );
}
