// `current` is the index of the topic in progress; topics before it are done.
// Pass map.length to show every topic as done.
export function MapBar({
  title,
  map,
  current,
  right,
  className = "",
}: {
  title: string;
  map: string[];
  current: number;
  right: string;
  className?: string;
}) {
  return (
    <header className={`flex flex-none flex-col gap-2.5 border-b border-border bg-surface px-5 pb-3 pt-4 ${className}`}>
      <div className="flex justify-between gap-3 text-xs text-muted">
        <span className="font-semibold">{title}</span>
        <span className="flex-none">{right}</span>
      </div>
      <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${map.length}, minmax(0, 1fr))` }}>
        {map.map((topic, i) => {
          const state = i < current ? "done" : i === current ? "now" : "next";
          return (
            <li key={topic} className="flex flex-col gap-1.5" aria-current={state === "now" ? "step" : undefined}>
              <div
                className={`h-1 rounded ${state === "done" ? "bg-ink" : state === "now" ? "bg-accent" : "bg-track"}`}
              />
              <span
                className={`text-[11px] leading-tight ${
                  state === "done" ? "font-medium text-ink" : state === "now" ? "font-semibold text-accent-text" : "font-medium text-muted"
                }`}
              >
                {topic}
              </span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
