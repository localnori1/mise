import { ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import { TOPICS } from "./content";

// Pictures of the respondent's screens, drawn at 390x844 and shown inside a
// PhoneFrame. They are illustrations, not working screens.

function StatusBar() {
  return (
    <div className="relative flex h-[54px] flex-none items-center justify-between bg-white pl-[34px] pr-[30px] pt-1.5">
      <span className="text-base font-semibold tracking-[-0.01em]">9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="#14171c" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#14171c" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="#14171c" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="#14171c" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 11.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0z" fill="#14171c" />
          <path d="M3.6 6.9a6.6 6.6 0 0 1 8.8 0l1.6-1.9a9.1 9.1 0 0 0-12 0z" fill="#14171c" />
          <path d="M0.6 3.4a11.2 11.2 0 0 1 14.8 0L16 2.6a12.4 12.4 0 0 0-16 0z" fill="#14171c" opacity="0.9" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="#14171c" opacity="0.4" />
          <rect x="2.5" y="2.5" width="16" height="8" rx="2" fill="#14171c" />
          <rect x="24" y="4" width="2" height="5" rx="1" fill="#14171c" opacity="0.5" />
        </svg>
      </span>
      <span className="absolute left-1/2 top-[11px] h-[35px] w-[122px] -translate-x-1/2 rounded-[20px] bg-black" />
    </div>
  );
}

function MapHeader({ minutesLeft }: { minutesLeft: string }) {
  return (
    <div className="flex flex-none flex-col gap-2.5 border-b border-border bg-white px-5 pb-3 pt-1.5">
      <div className="flex justify-between text-xs text-muted">
        <span className="font-semibold">Courier booking dispatch</span>
        <span>{minutesLeft}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TOPICS.map((topic, i) => (
          <div key={topic} className="flex flex-col gap-1.5">
            <div className={`h-1 rounded ${i === 0 ? "bg-accent" : "bg-track"}`} />
            <span className={`text-[11px] leading-tight ${i === 0 ? "font-semibold text-accent-text" : "font-medium text-muted"}`}>
              {topic}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen({ minutesLeft, children, footer }: { minutesLeft: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative flex h-[844px] w-[390px] flex-col bg-bg font-sans text-ink">
      <StatusBar />
      <MapHeader minutesLeft={minutesLeft} />
      {children}
      {footer}
      <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-[3px] bg-ink" />
    </div>
  );
}

const bubbleFrom = "max-w-[84%] self-start rounded-[18px_18px_18px_6px] border border-border bg-white px-3.5 py-3";
const choice = "flex min-h-11 items-center rounded-full bg-white px-[18px]";

export function ChatScreen() {
  return (
    <Screen
      minutesLeft="About 6 min left"
      footer={
        <div className="flex flex-none items-center gap-2.5 border-t border-border bg-white px-4 pb-[34px] pt-3">
          <span className="flex min-h-11 flex-1 items-center rounded-full border border-stroke px-4 text-[15px] text-muted">
            Type your answer
          </span>
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-navy">
            <ArrowUp size={18} strokeWidth={2.2} color="#fff" />
          </span>
        </div>
      }
    >
      <div className="flex flex-1 flex-col gap-3 px-4 py-[18px] text-[15px] leading-[1.45]">
        <div className={bubbleFrom}>When a booking goes unclaimed, what happens next?</div>
        <div className="max-w-[78%] self-end rounded-[18px_18px_6px_18px] bg-navy px-3.5 py-3 text-white">
          I call riders one by one. Sometimes forty minutes on the phone.
        </div>
        <div className={bubbleFrom}>Walk me through the last time. Who did you call first?</div>
        <div className="flex flex-col items-start gap-2">
          <span className={`${choice} border border-stroke`}>Whoever is closest</span>
          <span className={`${choice} border-2 border-ink font-semibold`}>Riders I trust most</span>
          <span className={`${choice} border border-stroke`}>Something else</span>
        </div>
      </div>
    </Screen>
  );
}

export function StepRow({ n, text, added = false, small = false }: { n: number; text: string; added?: boolean; small?: boolean }) {
  return (
    <div
      className={`flex items-center bg-white ${small ? "gap-2 rounded-[10px] p-2.5" : "gap-2.5 rounded-[10px] p-3"} ${
        added ? "border-2 border-accent" : "border border-border"
      }`}
    >
      <span
        className={`flex flex-none items-center justify-center rounded-full bg-ink font-semibold text-white ${
          small ? "h-[22px] w-[22px] text-[11px]" : "h-[26px] w-[26px] text-xs"
        }`}
      >
        {n}
      </span>
      <span className={`flex-1 ${small ? "text-[13px] leading-[1.35]" : "text-[15px] leading-[1.4]"}`}>{text}</span>
      {added && (
        <span
          className={`flex-none rounded-full bg-accent-soft font-semibold text-accent-text ${
            small ? "px-[7px] py-[3px] text-[10px]" : "px-2 py-1 text-[11px]"
          }`}
        >
          Added by you
        </span>
      )}
    </div>
  );
}

export function AddStep({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center self-center rounded-full border border-dashed border-stroke bg-white text-body ${
        small ? "h-5 w-9 text-sm" : "h-[26px] w-11 text-[17px]"
      }`}
    >
      +
    </span>
  );
}

const STEPS: { text: string; added: boolean }[] = [
  { text: "Booking is posted to the rider app", added: false },
  { text: "It sits unclaimed", added: true },
  { text: "You check the group chat for who’s free", added: true },
  { text: "You call riders one by one", added: true },
  { text: "A rider takes it", added: false },
];

export function StepsScreen() {
  return (
    <Screen
      minutesLeft="About 4 min left"
      footer={
        <div className="flex-none px-4 pb-[34px] pt-3">
          <span className="flex min-h-[50px] items-center justify-center rounded-full bg-navy text-base font-semibold text-white">
            Looks right
          </span>
        </div>
      }
    >
      <div className="flex flex-1 flex-col gap-1.5 px-4 py-5">
        <span className="mx-1 font-display text-[22px] font-semibold">Is this how it goes?</span>
        <span className="mx-1 mb-2.5 mt-0.5 text-sm leading-normal text-muted">
          Drafted from what you said. Tap + to add a missing step.
        </span>
        {STEPS.map((step, i) => (
          <div key={step.text} className="flex flex-col gap-1.5">
            <StepRow n={i + 1} text={step.text} added={step.added} />
            {i < STEPS.length - 1 && <AddStep />}
          </div>
        ))}
      </div>
    </Screen>
  );
}
