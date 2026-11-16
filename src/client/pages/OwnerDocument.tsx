import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import templates from "../../shared/templates.json";
import type { OwnerSession } from "../../shared/api";
import { api, errorMessage } from "../api";
import { buttonClass } from "../components/Button";
import { Card } from "../components/Card";
import { CopyButton } from "../components/CopyButton";
import { StatusChip } from "../components/Pill";
import { ErrorNote, Loading } from "../components/Status";
import { Link } from "../router";

const statusNote: Record<OwnerSession["status"], string> = {
  not_started: "They haven't opened the link yet.",
  in_progress: "They're partway through. The document appears here once they confirm their answers.",
  ready: "",
  deleted: "They deleted their answers, so there's nothing to show.",
};

export function OwnerDocument({ ownerKey, id }: { ownerKey: string; id: string }) {
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api
      .ownerSession(ownerKey, id)
      .then((res) => live && setSession(res))
      .catch((err) => live && setError(errorMessage(err)));
    return () => {
      live = false;
    };
  }, [ownerKey, id]);

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-4 px-4 pb-16 pt-5 sm:pt-8">
      <Link
        href={`/o/${encodeURIComponent(ownerKey)}`}
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
              <div className="flex flex-wrap gap-2">
                <a href={api.exportUrl(ownerKey, id)} download className={buttonClass("primary", "", "sm")}>
                  <Download size={18} aria-hidden="true" />
                  Export as Markdown
                </a>
                <CopyButton text={session.output_md} label="Copy" size="sm" />
              </div>
              <article className="doc rounded-card border border-border bg-surface px-5 py-6 sm:px-10 sm:py-10">
                <Markdown remarkPlugins={[remarkGfm]}>{session.output_md}</Markdown>
              </article>
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
