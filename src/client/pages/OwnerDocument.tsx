import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import templates from "../../shared/templates.json";
import type { OwnerSession } from "../../shared/api";
import { api, errorMessage } from "../api";
import { handleSignedOut, SignInCard, useOwner } from "../auth";
import { Card } from "../components/Card";
import { CopyButton } from "../components/CopyButton";
import { DocumentActions, DocumentView, fileSlug } from "../components/DocumentActions";
import { StatusChip } from "../components/Pill";
import { ErrorNote, Loading } from "../components/Status";
import { Link } from "../router";

const statusNote: Record<OwnerSession["status"], string> = {
  not_started: "They haven't opened the link yet.",
  in_progress: "They're partway through. The document appears here once they confirm their answers.",
  ready: "",
  deleted: "They deleted their answers, so there's nothing to show.",
};

export function OwnerDocument({ id }: { id: string }) {
  const [owner, setOwner] = useOwner();
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner) return;
    let live = true;
    api
      .link(id)
      .then((res) => live && setSession(res))
      .catch((err) => live && !handleSignedOut(err, setOwner) && setError(errorMessage(err)));
    return () => {
      live = false;
    };
  }, [owner, id]);

  if (owner === undefined) return <Loading />;
  if (owner === null) {
    return (
      <main className="mx-auto flex max-w-[480px] flex-col px-4 py-12">
        <SignInCard next={`/links/${encodeURIComponent(id)}`} title="Sign in to see this document" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-4 px-4 pb-16 pt-5 sm:pt-8">
      <Link
        href="/links"
        className="flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold no-underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Your links
      </Link>

      {error && <ErrorNote>{error}</ErrorNote>}
      {!error && !session && <Loading />}

      {session && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[13px] text-muted">
                {templates[session.template].name} · {session.respondent_name}
                {session.role && ` · ${session.role}`}
              </p>
              {!session.output_md && <h1 className="font-display text-[26px] font-semibold leading-tight">{session.topic}</h1>}
            </div>
            <StatusChip status={session.status} />
          </div>

          {session.output_md ? (
            <>
              <DocumentActions markdown={session.output_md} name={fileSlug(session.topic)} />
              <DocumentView
                markdown={session.output_md}
                className="rounded-card border border-border bg-surface px-5 py-6 sm:px-10 sm:py-10"
              />
            </>
          ) : (
            <Card>
              <p className="text-[15px]">{statusNote[session.status] || "The document isn't ready yet."}</p>
              {session.status !== "deleted" && (
                <>
                  <label htmlFor="share-url" className="text-xs font-semibold text-muted">
                    Share link
                  </label>
                  <input
                    id="share-url"
                    readOnly
                    value={session.share_url}
                    onFocus={(e) => e.currentTarget.select()}
                    className="min-h-11 w-full rounded-btn border border-input bg-bg px-3 text-[15px]"
                  />
                  <CopyButton text={session.share_url} size="sm" className="self-start" />
                </>
              )}
            </Card>
          )}
        </>
      )}
    </main>
  );
}
