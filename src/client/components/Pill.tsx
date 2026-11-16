import type { ReactNode } from "react";
import type { PanelItem, Status } from "../../shared/api";

type Tone = "neutral" | "accent" | "assumed" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-chip text-muted-2",
  accent: "bg-accent-soft text-accent-text",
  assumed: "bg-assumed-bg text-assumed-text",
  outline: "border border-input bg-surface text-muted-2",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

const tags: Record<PanelItem["tag"], [Tone, string]> = {
  heard: ["neutral", "Heard"],
  assumed: ["assumed", "Assumed"],
  open: ["outline", "Open"],
  agreed: ["accent", "Agreed"],
};

export function TagChip({ tag }: { tag: PanelItem["tag"] }) {
  const [tone, label] = tags[tag];
  return <Pill tone={tone}>{label}</Pill>;
}

const statuses: Record<Status, [Tone, string]> = {
  not_started: ["neutral", "Not started"],
  in_progress: ["assumed", "In progress"],
  ready: ["accent", "Ready"],
  deleted: ["outline", "Deleted by respondent"],
};

export function StatusChip({ status }: { status: Status }) {
  const [tone, label] = statuses[status];
  return <Pill tone={tone}>{label}</Pill>;
}

export function PanelList({ items }: { items: PanelItem[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-2.5">
          <span>{item.text}</span>
          <TagChip tag={item.tag} />
        </li>
      ))}
    </ul>
  );
}
