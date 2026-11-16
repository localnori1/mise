import { useEffect, useRef, useState } from "react";
import { EXAMPLE_REQUIREMENTS, PROBLEM_STATEMENT } from "./content";

// Page 2 of a finished summary, drawn at 600x860 and scaled to fit its column.
// Pressing a requirement's source (Q3, Q4...) shows the answer behind it.
const DESIGN_WIDTH = 600;
const DESIGN_HEIGHT = 860;
const MAX_SCALE = 0.7833;

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

const thLast = "border-track bg-bg px-2 py-[7px] text-[11px] font-semibold";
const th = `${thLast} border-r`;
const td = "border-r border-track px-2 py-[7px]";
const heading = "border-b border-track pb-[5px] text-sm font-semibold";
const cols = "grid grid-cols-[56px_1fr_86px_58px_78px]";

const META: [string, string][] = [
  ["Document ID", "ESS-014"],
  ["Source", "Asynchronous session with Jun, Dispatcher"],
  ["Confirmation", "Findings, requirements and priorities confirmed by the respondent"],
  ["Status", "Confirmed. 1 open issue"],
];

export function DocPage() {
  const [sel, setSel] = useState(EXAMPLE_REQUIREMENTS[0].id);
  const [ref, available] = useWidth<HTMLDivElement>();
  const scale = available ? Math.min(MAX_SCALE, available / DESIGN_WIDTH) : MAX_SCALE;
  const current = EXAMPLE_REQUIREMENTS.find((r) => r.id === sel) ?? EXAMPLE_REQUIREMENTS[0];

  return (
    <div ref={ref} className="flex justify-center">
      <div
        className="flex-none overflow-hidden rounded border border-track bg-white"
        style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}
      >
        <div
          className="flex flex-col gap-[18px] bg-white px-11 py-10 text-ink"
          style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: "0 0" }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted">Elicitation Session Summary</span>
            <span className="font-display text-[26px] font-semibold tracking-[-0.01em]">Courier Booking Dispatch</span>
          </div>

          <div className="grid grid-cols-[130px_1fr] border border-track text-xs leading-[1.45]">
            {META.map(([label, value], i) => {
              const last = i === META.length - 1;
              return (
                <div key={label} className="contents">
                  <span className={`border-r border-track bg-bg px-2 py-[7px] text-[11px] font-semibold ${last ? "" : "border-b"}`}>
                    {label}
                  </span>
                  <span className={`border-track px-2 py-[7px] ${last ? "" : "border-b"}`}>{value}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={heading}>2. Problem Statement</span>
            <span className="text-[12.5px] leading-[1.6]">{PROBLEM_STATEMENT}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className={heading}>7. Candidate Requirements</span>
            <span className="text-[11.5px] text-muted">
              Priorities set by the respondent. Select a source to see the answer it came from.
            </span>
            <div className="border border-b-0 border-track text-xs leading-[1.45]">
              <div className={`${cols} border-b border-track`}>
                <span className={th}>ID</span>
                <span className={th}>Requirement</span>
                <span className={th}>Priority</span>
                <span className={th}>Source</span>
                <span className={thLast}>Status</span>
              </div>
              {EXAMPLE_REQUIREMENTS.map((r) => {
                const on = r.id === sel;
                return (
                  <div key={r.id} className={`${cols} border-b border-track transition-colors ${on ? "bg-accent-soft" : "bg-white"}`}>
                    <span className={`${td} font-semibold`}>{r.id}</span>
                    <span className={td}>{r.shortText}</span>
                    <span className={td}>{r.priority}</span>
                    <span className="flex items-start border-r border-track px-1 py-[3px]">
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`Show the answer behind ${r.id}`}
                        onClick={() => setSel(r.id)}
                        className={`min-h-[26px] cursor-pointer rounded-full border px-2 text-[11px] font-semibold leading-none ${
                          on ? "border-accent bg-accent text-white" : "border-stroke bg-white text-accent-text"
                        }`}
                      >
                        {r.source}
                      </button>
                    </span>
                    <span className="px-2 py-[7px]">Confirmed</span>
                  </div>
                );
              })}
            </div>
            <div aria-live="polite" className="flex flex-col gap-[3px] rounded-lg bg-accent-soft px-3 py-2.5">
              <span className="text-[11px] font-semibold text-accent-text">
                From {current.source}, Jun’s answer ({current.id})
              </span>
              <span className="font-display text-[15px] font-medium leading-[1.4]">“{current.quote}”</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={heading}>12. Open Issues</span>
            <div className="grid grid-cols-[56px_1fr_110px_80px] border border-track text-xs leading-[1.45]">
              <span className={`${th} border-b`}>ID</span>
              <span className={`${th} border-b`}>Issue</span>
              <span className={`${th} border-b`}>Owner</span>
              <span className={`${thLast} border-b`}>Status</span>
              <span className={`${td} font-semibold`}>OI-01</span>
              <span className={td}>How long before a booking counts as unclaimed?</span>
              <span className={td}>Ana</span>
              <span className="px-2 py-[7px]">Open</span>
            </div>
          </div>

          <span className="mt-auto self-end text-[11px] text-muted">Page 2 of 4</span>
        </div>
      </div>
    </div>
  );
}
