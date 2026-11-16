import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { RespondentView } from "../../shared/api";
import { api, errorMessage } from "../api";
import { Button } from "../components/Button";
import { MapBar } from "../components/MapBar";
import { ErrorNote, Loading } from "../components/Status";
import { Basics } from "./respondent/Basics";
import { Checkpoint } from "./respondent/Checkpoint";
import { ChatSidebar } from "./respondent/ChatSidebar";
import { Conversation } from "./respondent/Conversation";
import { Deleted, Done } from "./respondent/Done";
import { Landing } from "./respondent/Landing";
import { Priorities } from "./respondent/Priorities";
import { StepCards } from "./respondent/StepCards";
import { Welcome } from "./respondent/Welcome";

// Runs one respondent API call; resolves true on success so a screen can keep
// the user's input when it fails.
export type Run = (action: string, call: () => Promise<RespondentView>) => Promise<boolean>;

export type ScreenProps = { view: RespondentView; busy: string | null; error: string | null; run: Run; token: string };

// One narrow column for every screen. The conversation gets a wide layout on
// desktop: a sidebar and a framed chat that scrolls inside its own card.
function Shell({ children, chat = false }: { children: ReactNode; chat?: boolean }) {
  return (
    <div
      className={`mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-bg ${
        chat ? "lg:h-dvh lg:max-w-[1080px] lg:flex-row lg:gap-8 lg:p-8" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function Respondent({ token }: { token: string }) {
  const [view, setView] = useState<RespondentView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Message count at which the respondent last confirmed the step cards, so
  // R4 shows once per steps change.
  const [stepsReviewedAt, setStepsReviewedAt] = useState(-1);

  const load = useCallback(() => {
    setLoadError(null);
    api.view(token).then(setView, (err) => setLoadError(errorMessage(err)));
  }, [token]);

  useEffect(load, [load]);

  const run: Run = async (action, call) => {
    setBusy(action);
    setError(null);
    try {
      setView(await call());
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(null);
    }
  };

  if (loadError) {
    return (
      <Shell>
        <main className="flex flex-col gap-4 px-5 py-16">
          <h1 className="font-display text-2xl font-semibold">We couldn't open this link</h1>
          <ErrorNote>{loadError}</ErrorNote>
          <Button variant="secondary" className="self-start" onClick={load}>
            Try again
          </Button>
        </main>
      </Shell>
    );
  }
  if (!view) {
    return (
      <Shell>
        <Loading />
      </Shell>
    );
  }

  const props: ScreenProps = { view, busy, error, run, token };
  const { last, intro } = view;

  if (view.status === "deleted")
    return (
      <Shell>
        <Deleted />
      </Shell>
    );
  if (view.status === "ready")
    return (
      <Shell>
        <Done {...props} />
      </Shell>
    );
  if (view.status === "not_started")
    return (
      <Shell>
        <Welcome {...props} />
      </Shell>
    );

  const match = last?.topic ? intro.map.findIndex((t) => t.toLowerCase() === last.topic!.toLowerCase()) : -1;
  const left = Math.max(1, Math.round((intro.minutes * (view.budget - view.question_count)) / view.budget));
  const asking = !last || last.kind === "question" || last.kind === "reflect" || last.kind === "offer";
  const right = !view.basics
    ? `About ${intro.minutes} min`
    : last?.kind === "landing"
      ? "Last step"
      : asking
        ? `Question ${Math.max(1, view.question_count)} · about ${left} min left`
        : `About ${left} min left`;

  let screen: ReactNode;
  let chat = false;
  if (!view.basics) screen = <Basics {...props} />;
  else if (busy === "confirm") screen = <Writing />;
  else if (last?.steps_changed && view.steps.length > 0 && stepsReviewedAt !== view.messages.length)
    screen = <StepCards {...props} onReviewed={() => setStepsReviewedAt(view.messages.length)} />;
  else if (last?.kind === "checkpoint") screen = <Checkpoint {...props} />;
  else if (last?.kind === "priorities") screen = <Priorities {...props} />;
  else if (last?.kind === "landing") screen = <Landing {...props} />;
  else {
    screen = <Conversation {...props} />;
    chat = true;
  }

  const current = last?.kind === "landing" ? intro.map.length : Math.max(match, 0);
  return (
    <Shell chat={chat}>
      <MapBar title={intro.topic} map={intro.map} current={current} right={right} className={chat ? "lg:hidden" : ""} />
      {chat && <ChatSidebar title={intro.topic} map={intro.map} current={current} right={right} panel={view.panel} />}
      {screen}
    </Shell>
  );
}

function Writing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Loading label="Writing up your answers…" />
      <p className="text-sm leading-normal text-muted">This can take up to a minute. Please keep this page open.</p>
    </main>
  );
}
