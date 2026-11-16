import { useEffect, useState } from "react";
import templates from "../../shared/templates.json";
import type { OwnerSessionSummary } from "../../shared/api";
import { api, errorMessage } from "../api";
import { buttonClass } from "../components/Button";
import { CopyButton } from "../components/CopyButton";
import { StatusChip } from "../components/Pill";
import { ErrorNote, Loading } from "../components/Status";
import { rememberOwnerUrl } from "../ownerLink";
import { Link } from "../router";

export function OwnerLinks({ ownerKey }: { ownerKey: string }) {
  const [sessions, setSessions] = useState<OwnerSessionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api
      .ownerList(ownerKey)
      .then((res) => {
        if (!live) return;
        setSessions(res.sessions);
        rememberOwnerUrl(`/o/${encodeURIComponent(ownerKey)}`);
      })
      .catch((err) => live && setError(errorMessage(err)));
    return () => {
      live = false;
    };
  }, [ownerKey]);

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-3 px-4 pb-12 pt-7">
      <div className="flex items-center justify-between gap-3 px-1">
        <h1 className="font-display text-[26px] font-semibold">Your links</h1>
        <Link href="/" className={buttonClass("primary", "", "sm")}>
          New link
        </Link>
      </div>
      <p className="mb-1.5 px-1 text-[13px] leading-normal text-muted">
        This page is your private owner link. Bookmark it. If you lose it, these links can't be recovered.
      </p>

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
            <Link
              href={`/o/${encodeURIComponent(ownerKey)}/${encodeURIComponent(s.id)}`}
              className="flex items-center gap-2.5 text-ink no-underline"
            >
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
