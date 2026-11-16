import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card, CardLabel } from "../../components/Card";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";

export function Welcome({ view, busy, error, run, token }: ScreenProps) {
  const { intro } = view;
  return (
    <main className="flex flex-1 flex-col gap-[18px] px-5 pb-6 pt-8">
      <div className="flex flex-col gap-1 border-b border-border pb-3.5">
        <span className="font-display text-[22px] font-semibold tracking-tight">Mise</span>
        <span className="text-[13px] leading-normal text-muted">Everything understood before anything gets built.</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">From {intro.sender}</p>
      <h1 className="font-display text-[30px] font-semibold leading-[1.12]">{intro.topic}</h1>
      {intro.summary && <p className="text-[15px] leading-relaxed">{intro.summary}</p>}
      <Card className="text-sm">
        <span>
          <strong className="font-semibold">About {intro.minutes} minutes.</strong> Saves as you go, so you can leave and
          come back.
        </span>
      </Card>
      <Card>
        <CardLabel>We'll cover</CardLabel>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[15px]">
          {intro.map.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ol>
      </Card>
      <p className="rounded-xl bg-chip px-3.5 py-3 text-[13px] leading-normal text-muted-2">
        Your answers are used only to prepare requirements for this project. AI helps organise them. You can ask for them
        to be deleted anytime.
      </p>
      {intro.off_limits.length > 0 && (
        <p className="rounded-xl bg-assumed-bg px-3.5 py-3 text-[13px] leading-normal text-assumed-text">
          Please leave these out of your answers: {intro.off_limits.map((topic) => topic.replace(/[.\s]+$/, "")).join(", ")}.
        </p>
      )}
      <div className="mt-auto flex flex-col gap-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Button loading={busy === "start"} onClick={() => run("start", () => api.start(token))}>
          Start
        </Button>
      </div>
    </main>
  );
}
