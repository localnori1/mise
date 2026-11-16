import { ArrowRight } from "lucide-react";
import templates from "../../shared/templates.json";
import type { TemplateId } from "../../shared/api";
import { Link } from "../router";
import { ownerLinksPath } from "../ownerLink";

const order: TemplateId[] = ["requirements", "pre_audit"];

export function Home() {
  const ownerPath = ownerLinksPath();
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 py-10 sm:py-16">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[22px] font-semibold tracking-tight">Mise</span>
          <p className="text-[15px] leading-normal text-muted">
            Send one link. They answer in their own time. You get a clear brief back, no meeting needed.
          </p>
        </div>
        {ownerPath && (
          <Link href={ownerPath} className="flex min-h-11 flex-none items-center text-sm font-semibold">
            Your links
          </Link>
        )}
      </div>
      <h1 className="font-display text-[26px] font-semibold leading-tight">What do you need to learn?</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {order.map((id) => (
          <Link
            key={id}
            href={`/new?template=${id}`}
            className="flex flex-col gap-2 rounded-card border border-border bg-surface p-5 text-ink no-underline hover:border-ink"
          >
            <span className="flex items-center justify-between gap-2 text-base font-semibold">
              {templates[id].name}
              <ArrowRight size={18} aria-hidden="true" />
            </span>
            <span className="text-sm leading-normal text-muted-2">{templates[id].description}</span>
            <span className="text-[13px] text-muted">About {templates[id].estimated_minutes} minutes for them</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
