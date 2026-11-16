import { Check } from "lucide-react";
import type { PanelItem } from "../../../shared/api";
import { PanelList } from "../../components/Pill";

// Desktop only (the phone layout keeps the bar on top and the collapsible
// "What we have so far" under the chat): where we are, and what we've heard.
export function ChatSidebar({
  title,
  map,
  current,
  right,
  panel,
}: {
  title: string;
  map: string[];
  current: number;
  right: string;
  panel: PanelItem[];
}) {
  return (
    <aside aria-label="Progress" className="hidden lg:flex lg:w-[300px] lg:flex-none lg:flex-col lg:gap-4 lg:overflow-y-auto">
      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-display text-lg font-semibold leading-snug">{title}</h1>
          <p className="m-0 text-[13px] text-muted">{right}</p>
        </div>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {map.map((topic, i) => {
            const state = i < current ? "done" : i === current ? "now" : "next";
            return (
              <li key={topic} aria-current={state === "now" ? "step" : undefined} className="flex items-center gap-2.5">
                <span
                  className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full text-[11px] font-semibold ${
                    state === "done"
                      ? "bg-ink text-white"
                      : state === "now"
                        ? "border-2 border-accent bg-accent-soft text-accent-text"
                        : "border border-track bg-surface text-muted"
                  }`}
                >
                  {state === "done" ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}
                </span>
                <span
                  className={`text-sm leading-tight ${
                    state === "done" ? "font-medium text-ink" : state === "now" ? "font-semibold text-accent-text" : "text-muted"
                  }`}
                >
                  {topic}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      {panel.length > 0 && (
        <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-5">
          <p className="m-0 text-[13px] font-semibold text-accent-text">What we have so far ({panel.length})</p>
          <PanelList items={panel} />
        </div>
      )}
    </aside>
  );
}
