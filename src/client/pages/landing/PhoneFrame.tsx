import type { ReactNode } from "react";

// A phone around a 390x844 screen, scaled to `width`. The screen is a picture
// of the respondent's side, so it is hidden from assistive technology and the
// frame carries a label instead.
const LEFT_BUTTONS: [top: number, height: number][] = [
  [100, 21],
  [147, 39],
  [194, 39],
];

export function PhoneFrame({ width, label, children }: { width: number; label: string; children: ReactNode }) {
  const factor = width / 290;
  const screenWidth = width - 18;
  const screenHeight = Math.round((screenWidth * 844) / 390);
  return (
    <div role="img" aria-label={label} className="relative flex-none" style={{ width }}>
      {LEFT_BUTTONS.map(([top, height]) => (
        <span
          key={top}
          className="absolute rounded-l-sm bg-[#3b3e45]"
          style={{ left: -3, top: Math.round(top * factor), width: 3, height: Math.round(height * factor) }}
        />
      ))}
      <span
        className="absolute rounded-r-sm bg-[#3b3e45]"
        style={{ right: -3, top: Math.round(159 * factor), width: 3, height: Math.round(60 * factor) }}
      />
      <div
        className="bg-[#16181c] p-[9px]"
        style={{ borderRadius: Math.round(48 * factor), boxShadow: "inset 0 0 0 1.5px #5a5e66, inset 0 0 0 4px #24272d" }}
      >
        <div
          className="relative overflow-hidden bg-black"
          style={{ width: screenWidth, height: screenHeight, borderRadius: Math.round(39 * factor) }}
        >
          <div
            aria-hidden="true"
            style={{ width: 390, height: 844, transform: `scale(${screenWidth / 390})`, transformOrigin: "0 0" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardShadow = "shadow-[0_1px_2px_rgba(20,23,28,0.06),0_16px_40px_rgba(20,23,28,0.08)]";

// The grey card the phone sits on: a smaller phone below the desktop breakpoint.
export function PhoneCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`flex justify-center rounded-[22px] border border-border bg-subtle p-[22px] lg:p-8 ${cardShadow}`}>
      <div className="lg:hidden">
        <PhoneFrame width={256} label={label}>
          {children}
        </PhoneFrame>
      </div>
      <div className="hidden lg:block">
        <PhoneFrame width={290} label={label}>
          {children}
        </PhoneFrame>
      </div>
    </div>
  );
}

export function PanelCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[22px] border border-border bg-subtle p-[22px] ${cardShadow} ${className}`}>{children}</div>
  );
}
