import type { ReactNode } from "react";
import { Link } from "../router";
import { REPO_URL } from "./landing/content";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="m-0 font-display text-[22px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const p = "m-0 text-base leading-[1.65] text-body";

export function Privacy() {
  return (
    <div className="min-h-full bg-white font-sans text-ink">
      <header className="mx-auto flex min-h-[76px] max-w-[720px] items-center px-5">
        <Link href="/" className="flex min-h-11 items-center font-display text-2xl font-bold tracking-[-0.02em] text-ink no-underline">
          Mise
        </Link>
      </header>
      <main className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 pb-24 pt-6">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 font-display text-[40px] font-semibold leading-none tracking-[-0.03em]">Privacy</h1>
          <p className={p}>
            Mise lets one person gather requirements from another with a single link. This page says what is stored, who can see it,
            and how to delete it. Last updated 17 November 2026.
          </p>
        </div>

        <Section title="If you answer a link">
          <p className={p}>
            You don’t create an account. Your answers, the questions you were asked, and the document made from them are stored so the
            person who sent you the link can read them, and so you can keep your own copy.
          </p>
          <p className={p}>
            You can delete everything at any time with “Delete my answers” on the last screen. Anything you don’t delete is removed
            automatically 90 days after the link was created.
          </p>
        </Section>

        <Section title="If you create links">
          <p className={p}>
            You sign in with Google. Mise stores your name, your email address and your Google account ID, plus the links you create
            and the setup details you enter. Mise does not read or change anything else in your Google account.
          </p>
          <p className={p}>
            A cookie keeps you signed in for 30 days. It is the only cookie Mise uses, and it is only for signing in. Respondents
            never get cookies from Mise.
          </p>
        </Section>

        <Section title="AI">
          <p className={p}>
            The interview questions and the final document are written by Claude, an AI model from Anthropic, reached through
            Cloudflare. What you type in a session is sent to it for that purpose. Mise keeps no separate log of those requests, and
            Anthropic’s and Cloudflare’s own terms apply to how they handle them.
          </p>
        </Section>

        <Section title="Abuse limits">
          <p className={p}>
            To limit abuse, Mise stores a scrambled (hashed) version of your IP address next to the links you create. The address
            itself is not stored.
          </p>
        </Section>

        <Section title="Where it is kept">
          <p className={p}>Everything is stored with Cloudflare. It is not sold, and it is not used for advertising.</p>
        </Section>

        <Section title="Questions or deletion requests">
          <p className={p}>
            To delete your account and links, or to ask anything about your data, open an issue at{" "}
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer noopener">
              github.com/localnori1/mise
            </a>
            .
          </p>
        </Section>
      </main>
    </div>
  );
}
