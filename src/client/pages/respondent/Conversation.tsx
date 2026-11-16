import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { PanelList } from "../../components/Pill";
import { ErrorNote } from "../../components/Status";
import type { ScreenProps } from "../Respondent";

const bubble = "max-w-[86%] px-3.5 py-3 text-[15px] leading-snug whitespace-pre-line lg:max-w-[72%]";
const interviewer = `${bubble} self-start rounded-[16px_16px_16px_4px] border border-border bg-surface`;
const respondent = `${bubble} self-end rounded-[16px_16px_4px_16px] bg-ink text-white`;

export function Conversation({ view, busy, error, run, token }: ScreenProps) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const waiting = busy !== null;
  const options = view.last?.options ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [view.messages.length, pending]);

  const send = async (text: string) => {
    const answer = text.trim();
    if (!answer || waiting) return;
    setPending(answer);
    setDraft("");
    const ok = await run("turn", () => api.turn(token, { answer }));
    setPending(null);
    if (!ok) setDraft(answer);
  };

  return (
    <div className="flex flex-1 flex-col lg:min-h-0 lg:overflow-hidden lg:rounded-card lg:border lg:border-border lg:bg-surface">
      <main className="flex flex-1 flex-col gap-2.5 p-4 lg:min-h-0 lg:overflow-y-auto lg:p-6" aria-live="polite">
        {view.messages.map((m, i) => (
          <div key={i} className={m.role === "interviewer" ? interviewer : respondent}>
            {m.text}
          </div>
        ))}

        {pending && <div className={respondent}>{pending}</div>}

        {pending ? (
          <div role="status" aria-label="Typing" className={`${interviewer} flex gap-1.5 py-4`}>
            {[0, 200, 400].map((delay) => (
              <span
                key={delay}
                className="h-2 w-2 animate-[typing_1.2s_ease-in-out_infinite] rounded-full bg-muted motion-reduce:animate-none"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        ) : (
          options.length > 0 && (
            <div className="flex flex-col gap-1.5 lg:items-start">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => send(option)}
                  disabled={waiting}
                  className="min-h-11 cursor-pointer rounded-btn border border-input bg-surface px-3.5 py-2 text-left text-sm font-medium text-ink disabled:opacity-50 lg:max-w-[72%]"
                >
                  {option}
                </button>
              ))}
            </div>
          )
        )}

        {view.panel.length > 0 && (
          <details className="group mt-1 rounded-xl border border-border bg-surface lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3.5 text-[13px] font-semibold text-accent-text [&::-webkit-details-marker]:hidden">
              What we have so far ({view.panel.length})
              <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3.5 pb-3">
              <PanelList items={view.panel} />
            </div>
          </details>
        )}
        <div ref={endRef} />
      </main>

      <form
        className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-surface px-4 py-3 lg:static lg:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        {error && <ErrorNote>{error}</ErrorNote>}
        <div className="flex items-end gap-2">
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <textarea
            id="answer"
            rows={2}
            placeholder="Type your answer"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 resize-none rounded-btn border border-input bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-muted"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={waiting || !draft.trim()}
            className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center rounded-btn bg-ink text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
