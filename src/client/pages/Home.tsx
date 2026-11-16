import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { signInHref, useOwner } from "../auth";
import { Link } from "../router";
import { Carousel } from "./landing/Carousel";
import { REPO_URL } from "./landing/content";
import { DocPage } from "./landing/DocPage";
import { PanelCard, PhoneCard } from "./landing/PhoneFrame";
import { ChatScreen, StepsScreen } from "./landing/Screens";

// The front door for visitors: what Mise does, what the respondent sees, what
// you get back, and a way into the example or into creating a link.
const pill = "inline-flex items-center justify-center rounded-full font-semibold no-underline";
const heading = "m-0 font-display font-bold tracking-[-0.025em]";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] leading-normal">
          <span className="mt-px flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-accent-soft text-accent-text">
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function FeatureSection({ tint, children }: { tint: string; children: ReactNode }) {
  return (
    <section className={`hidden py-24 lg:block ${tint}`}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-[72px] px-12">{children}</div>
    </section>
  );
}

function AccountLink({ owner }: { owner: ReturnType<typeof useOwner>[0] }) {
  const base = `${pill} min-h-11 border border-border bg-pill px-4 text-sm lg:px-5 lg:text-[15px]`;
  if (owner === undefined) return <span className="min-h-11 w-[84px]" />;
  if (owner) return <Link href="/links" className={`${base} text-ink`}>Your links</Link>;
  return <a href={signInHref("/links")} className={`${base} text-ink`}>Sign in</a>;
}

export function Home() {
  const [owner] = useOwner();
  const signInFailed = new URLSearchParams(window.location.search).get("signin") === "failed";
  const navLink = "hidden min-h-11 items-center px-3.5 text-ink no-underline lg:flex";

  return (
    <div className="bg-white font-sans text-ink">
      <header className="mx-auto flex min-h-[60px] max-w-[1200px] items-center justify-between px-4 lg:min-h-[76px] lg:px-12">
        <span className="font-display text-[22px] font-bold tracking-[-0.02em] lg:text-2xl">Mise</span>
        <nav aria-label="Main" className="flex items-center gap-1.5 text-[15px] font-medium">
          <Link href="/example" className={navLink}>
            Example
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer noopener" className={navLink}>
            GitHub
          </a>
          <AccountLink owner={owner} />
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-4 pb-12 pt-7 lg:grid-cols-2 lg:items-center lg:gap-[72px] lg:px-12 lg:pb-24 lg:pt-14">
        <div className="flex flex-col gap-[18px] lg:gap-6">
          {signInFailed && (
            <p role="alert" className="m-0 text-sm font-medium text-danger">
              Sign-in didn't finish. Try again.
            </p>
          )}
          <h1 className="m-0 font-display text-[42px] font-bold leading-[1.02] tracking-[-0.035em] lg:text-[76px] lg:leading-[0.98] lg:tracking-[-0.04em]">
            Discovery calls, without the call.
          </h1>
          <p className="m-0 max-w-[44ch] text-[17px] leading-[1.55] text-body lg:text-[19px]">
            Send one link. They answer on their phone. You get a brief they’ve confirmed.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/example" className={`${pill} min-h-12 flex-1 bg-navy px-6 text-[15px] text-white lg:flex-none`}>
              See an example
            </Link>
            <Link href="/new" className={`${pill} min-h-12 flex-1 border border-border bg-pill px-6 text-[15px] text-ink lg:flex-none`}>
              Create a link
            </Link>
          </div>
        </div>
        <PhoneCard label="A phone showing Mise asking a dispatcher what happens when a booking goes unclaimed, with tappable answers">
          <ChatScreen />
        </PhoneCard>
      </section>

      <Carousel />

      <FeatureSection tint="bg-tint-blue">
        <PhoneCard label="A phone showing a drafted five-step process the respondent can correct, with three steps they added">
          <StepsScreen />
        </PhoneCard>
        <div className="flex flex-col gap-[18px]">
          <h2 className={`${heading} text-[44px] leading-[1.08]`}>They answer on their phone</h2>
          <p className="m-0 max-w-[44ch] text-lg leading-[1.55] text-body">
            About ten questions, on their own time. They don’t need to sign in or join a meeting.
          </p>
          <Bullets items={["It asks about the last real time", "It drafts the process for them to fix", "They set their own priorities"]} />
        </div>
      </FeatureSection>

      <FeatureSection tint="bg-tint-cream">
        <div className="flex flex-col gap-[18px]">
          <h2 className={`${heading} text-[44px] leading-[1.08]`}>You get a brief you can use</h2>
          <p className="m-0 max-w-[44ch] text-lg leading-[1.55] text-body">
            A standard session summary they’ve confirmed. Every requirement cites the answer it came from.
          </p>
          <Bullets items={["IDs, priorities, sources and status", "Assumptions and open issues to follow up", "Save as PDF or Markdown"]} />
          <span className="text-sm text-muted">An excerpt of a finished summary. Select a source to see the answer behind it.</span>
        </div>
        <PanelCard>
          <DocPage />
        </PanelCard>
      </FeatureSection>

      <section className="px-4 pb-10 lg:hidden">
        <h2 className={`${heading} mb-3.5 text-[30px] leading-[1.08]`}>Two ways to use it</h2>
        <div className="flex gap-2.5">
          <div className="flex flex-1 flex-col gap-1.5 rounded-[18px] border border-border bg-white p-4">
            <span className="text-base font-semibold leading-tight">Requirements session</span>
            <span className="text-[13px] leading-[1.45] text-body">Go deep on one process.</span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 rounded-[18px] bg-bg p-4">
            <span className="text-base font-semibold leading-tight">Pre-audit intake</span>
            <span className="text-[13px] leading-[1.45] text-body">Sweep a small business.</span>
          </div>
        </div>
      </section>
      <section className="mx-auto hidden max-w-[1200px] px-12 pt-24 lg:block">
        <h2 className={`${heading} text-[44px] leading-[1.08]`}>Two ways to use it</h2>
        <div className="mt-8 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-1.5 border-t border-track pt-[18px]">
            <span className="text-xl font-semibold">Requirements session</span>
            <span className="text-[17px] leading-[1.55] text-body">Go deep on one process with the person who runs it.</span>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-track pt-[18px]">
            <span className="text-xl font-semibold">Pre-audit intake</span>
            <span className="text-[17px] leading-[1.55] text-body">Sweep a small business, then go deep where it hurts.</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-10 lg:px-12 lg:pb-24 lg:pt-24">
        <div className="flex flex-col gap-[18px] rounded-[22px] bg-navy px-[22px] py-7 text-white lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-6 lg:rounded-[28px] lg:p-14">
          <span className="font-display text-[26px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-[40px] lg:leading-[1.08] lg:tracking-[-0.025em]">
            Read a finished session.
          </span>
          <Link href="/example" className={`${pill} min-h-12 bg-white px-7 text-[15px] text-navy lg:min-h-[52px] lg:text-base`}>
            See an example
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-8 pt-8 text-[13px] text-muted lg:px-12 lg:pb-10 lg:text-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <span className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink">Mise</span>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-1 font-semibold">
              <Link href="/example" className="inline-flex min-h-11 items-center">
                Example
              </Link>
              <Link href="/new" className="inline-flex min-h-11 items-center">
                Create a link
              </Link>
              <a href={REPO_URL} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center">
                GitHub
              </a>
              <Link href="/privacy" className="inline-flex min-h-11 items-center">
                Privacy
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-border pt-5 lg:flex-row lg:justify-between">
            <span>Answers are kept for 90 days. Respondents can delete theirs at any time.</span>
            <span>© {new Date().getFullYear()} Mise. Built on Cloudflare with Claude.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
