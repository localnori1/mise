import { useState } from "react";
import { PRIORITY_OPTIONS } from "./content";
import { AddStep, StepRow } from "./Screens";

// "How it works" for phones: four cards that snap sideways, with dots below.
// The third card's priority toggle works.
const CARD_STEP = 308; // 296px card + 12px gap
const card = "flex h-[400px] shrink-0 grow-0 basis-[296px] snap-start flex-col gap-1.5 rounded-[22px] px-[18px] pb-[18px] pt-5";

function CardHead({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <>
      <span className="text-[13px] font-semibold text-muted">{n} of 4</span>
      <h3 className="m-0 font-display text-2xl font-bold leading-[1.1] tracking-[-0.02em]">{title}</h3>
      <p className="m-0 mb-2 text-sm leading-[1.45] text-body">{text}</p>
    </>
  );
}

function PriorityToggle() {
  const [current, setCurrent] = useState(PRIORITY_OPTIONS[0]);
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-3.5">
      <span className="text-sm font-medium leading-[1.4]">See which riders are free right now</span>
      <div role="group" aria-label="Priority" className="flex gap-[3px] rounded-full bg-bg p-[3px]">
        {PRIORITY_OPTIONS.map((label) => {
          const on = label === current;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => setCurrent(label)}
              className={`min-h-9 flex-1 cursor-pointer rounded-full border-0 text-xs transition-colors ${
                on ? "bg-navy font-semibold text-white" : "bg-transparent font-medium text-body"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-muted">Recorded as theirs, not yours.</span>
    </div>
  );
}

export function Carousel() {
  const [index, setIndex] = useState(0);
  return (
    <section className="flex flex-col gap-4 pb-12 lg:hidden">
      <h2 className="m-0 px-4 font-display text-[30px] font-bold leading-[1.08] tracking-[-0.025em]">How it works</h2>
      <div
        role="region"
        aria-label="How it works, four steps"
        tabIndex={0}
        onScroll={(e) => setIndex(Math.max(0, Math.min(3, Math.round(e.currentTarget.scrollLeft / CARD_STEP))))}
        className="no-sb flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4"
      >
        <article className={`${card} bg-tint-blue`}>
          <CardHead n={1} title="They answer on their phone" text="Ten questions, on their own time. They don’t need to sign in." />
          <div className="mt-auto flex flex-col gap-2 rounded-2xl border border-border bg-white p-3.5 text-sm leading-[1.4]">
            <div className="max-w-[90%] self-start rounded-[16px_16px_16px_5px] bg-bg px-3 py-2.5">
              Walk me through the last time. Who did you call first?
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="flex min-h-[38px] items-center rounded-full border border-stroke px-3.5">Whoever is closest</span>
              <span className="flex min-h-[38px] items-center rounded-full border-2 border-ink px-3.5 font-semibold">
                Riders I trust most
              </span>
            </div>
          </div>
        </article>

        <article className={`${card} border border-border bg-white`}>
          <CardHead n={2} title="They fix the steps" text="A drafted process to correct, not explain." />
          <div className="mt-auto flex flex-col gap-[5px]">
            <StepRow n={1} text="Booking is posted" small />
            <AddStep small />
            <StepRow n={2} text="It sits unclaimed" added small />
            <StepRow n={3} text="You call riders one by one" added small />
          </div>
        </article>

        <article className={`${card} bg-bg`}>
          <CardHead n={3} title="They set priorities" text="Each requirement, marked by them." />
          <div className="mt-auto">
            <PriorityToggle />
          </div>
        </article>

        <article className={`${card} bg-tint-cream`}>
          <CardHead n={4} title="You get the brief" text="Every line cites the answer it came from." />
          <div className="mt-auto flex flex-col gap-2 rounded-2xl border border-border bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">BR-01</span>
              <span className="rounded-full bg-accent-soft px-2 py-[3px] text-[11px] font-semibold text-accent-text">Confirmed</span>
            </div>
            <span className="text-[13px] leading-[1.45]">Unclaimed bookings shall be offered to available riders automatically.</span>
            <div className="flex items-center gap-2 border-t border-border pt-2">
              <span className="flex min-h-[26px] flex-none items-center rounded-full bg-accent px-2.5 text-[11px] font-semibold text-white">Q3</span>
              <span className="font-display text-sm font-medium leading-[1.35]">“I call riders one by one.”</span>
            </div>
          </div>
        </article>
      </div>
      <div aria-hidden="true" className="flex justify-center gap-1.5 pt-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-[18px] bg-navy" : "w-1.5 bg-track"}`}
          />
        ))}
      </div>
    </section>
  );
}
