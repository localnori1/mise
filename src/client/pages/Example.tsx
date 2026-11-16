import { useState } from "react";
import { DocumentActions } from "../components/DocumentActions";
import { Link } from "../router";
import { EXAMPLE_ANSWERS, EXAMPLE_REQUIREMENTS, PROBLEM_STATEMENT } from "./landing/content";

// A finished, fictional session, read-only: what the respondent answered next
// to the brief that came out of it. Needs no sign-in and makes no AI calls.
const FILE_NAME = "example-courier-booking-dispatch";

const markdown = [
  "# Courier booking dispatch",
  "*Example session, a fictional courier business. Requirements template, answered by Jun, a dispatcher.*",
  `## Problem statement\n\n${PROBLEM_STATEMENT}`,
  [
    "## Candidate requirements",
    "",
    "| ID | Requirement | Priority | Source |",
    "|---|---|---|---|",
    ...EXAMPLE_REQUIREMENTS.map((r) => `| ${r.id} | ${r.text} | ${r.priority} | ${r.source} |`),
  ].join("\n"),
].join("\n\n");

const display = "font-display";

export function Example() {
  const [sel, setSel] = useState(EXAMPLE_REQUIREMENTS[0].id);
  const active = EXAMPLE_REQUIREMENTS.find((r) => r.id === sel) ?? EXAMPLE_REQUIREMENTS[0];

  return (
    <div className="min-h-full bg-white font-sans text-ink">
      <header className="mx-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-6 px-5 lg:px-12">
        <Link href="/" className={`${display} flex min-h-11 items-center text-2xl font-bold tracking-[-0.02em] text-ink no-underline`}>
          Mise
        </Link>
        <Link
          href="/new"
          className="inline-flex min-h-11 items-center rounded-full bg-navy px-[18px] text-[15px] font-semibold text-white no-underline"
        >
          Create your own link
        </Link>
      </header>

      <div className="bg-assumed-bg text-[#6b3407]">
        <p className="mx-auto max-w-[1200px] px-5 py-3.5 text-[15px] lg:px-12">
          <strong className="font-semibold">This is an example.</strong> The courier business and its people are fictional, and nothing
          here is sent anywhere.
        </p>
      </div>

      <section className="mx-auto max-w-[1200px] px-5 pt-14 lg:px-12">
        <h1 className={`${display} m-0 text-[40px] font-semibold leading-none tracking-[-0.03em] lg:text-[64px]`}>
          Courier booking dispatch
        </h1>
        <p className="mt-[18px] max-w-[64ch] text-lg leading-[1.6] text-body">
          A requirements session with Jun, a dispatcher. He answered ten questions in about eight minutes, corrected the drafted
          process, set his own priorities, and confirmed the result.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-5 pb-24 lg:px-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] border-t-2 border-ink">
          <div className="flex flex-col gap-2.5 pt-7 lg:pr-10">
            <h2 className="mb-2 mt-0 text-xl font-semibold">What Jun answered</h2>
            {EXAMPLE_ANSWERS.map((a) => {
              const on = a.q === active.source;
              return (
                <div
                  key={a.q}
                  className={`flex flex-col gap-1 rounded-r-xl border-l-4 px-5 py-[18px] transition-colors ${
                    on ? "border-accent bg-tint-blue" : "border-track bg-bg"
                  }`}
                >
                  <span className="text-[13px] font-semibold text-muted">{a.q}</span>
                  <span className="text-base font-medium leading-normal">{a.question}</span>
                  <span className={`${display} mt-1 text-xl font-medium leading-[1.45]`}>{a.answer}</span>
                </div>
              );
            })}
            <p className="mt-1.5 text-sm text-muted">
              This is an excerpt. A real session also has questions 6 to 10, the corrected steps and Jun’s own priorities.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-track pt-7 lg:border-l lg:pl-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="m-0 text-xl font-semibold">The brief you get</h2>
              <DocumentActions markdown={markdown} name={FILE_NAME} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className={`${display} m-0 text-[22px] font-semibold`}>Problem statement</h3>
              <p className="m-0 max-w-[60ch] text-base leading-[1.65]">{PROBLEM_STATEMENT}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className={`${display} m-0 text-[22px] font-semibold`}>Candidate requirements</h3>
              <p className="m-0 mb-1.5 text-[15px] text-muted">
                Priorities are Jun’s own. Select a requirement to see the answer it came from.
              </p>
              {EXAMPLE_REQUIREMENTS.map((r) => {
                const on = r.id === sel;
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSel(r.id)}
                    className={`flex w-full cursor-pointer flex-col gap-1 rounded-r-xl border-0 border-l-4 px-[18px] py-3.5 text-left transition-colors ${
                      on ? "border-accent bg-tint-blue" : "border-transparent bg-transparent"
                    }`}
                  >
                    <span className="flex justify-between gap-4 text-[13px] font-semibold">
                      <span className={on ? "text-accent-text" : "text-ink"}>{r.id}</span>
                      <span className="font-medium text-muted">
                        {r.priority}, from {r.source}
                      </span>
                    </span>
                    <span className="text-base leading-normal">{r.text}</span>
                  </button>
                );
              })}
            </div>
            <p className="m-0 border-t border-track pt-4 text-sm text-muted">
              The full summary continues with stakeholders, the as-is process, assumptions, open issues and action items.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
