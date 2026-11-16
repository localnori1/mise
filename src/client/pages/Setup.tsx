import { ArrowLeft, Check, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import templates from "../../shared/templates.json";
import type { Audience, CreatedSession, FocusArea, SetupDraft, SetupInput, TemplateId } from "../../shared/api";
import { api, errorMessage } from "../api";
import { Button, buttonClass } from "../components/Button";
import { Card, CardLabel } from "../components/Card";
import { Chip } from "../components/Chip";
import { CopyButton } from "../components/CopyButton";
import { ErrorNote, Loading } from "../components/Status";
import { TextField } from "../components/TextField";
import { handleSignedOut, SignInCard, useOwner } from "../auth";
import { Link } from "../router";

const templateIds: TemplateId[] = ["requirements", "pre_audit"];

const audiences: [Audience, string][] = [
  ["client", "Client"],
  ["prospect", "Prospect"],
  ["colleague", "Colleague"],
];

const focusAreas: [FocusArea, string][] = [
  ["process", "The process"],
  ["pain", "Pain points"],
  ["goals_scope", "Goals and scope"],
  ["constraints", "Constraints"],
  ["feel", "How it should feel"],
];

type Form = Omit<SetupInput, "sketch"> & { sketch: string };

const emptyForm = (template: TemplateId): Form => ({
  topic: "",
  summary: "",
  sender: "",
  respondent_name: "",
  role: template === "pre_audit" ? "Owner" : "",
  audience: templates[template].audience_default as Audience,
  focus: [],
  known: [],
  assumed: [],
  off_limits: [],
  sketch: "",
});

export function Setup({ search }: { search: string }) {
  const initial: TemplateId = new URLSearchParams(search).get("template") === "pre_audit" ? "pre_audit" : "requirements";
  const [template, setTemplate] = useState<TemplateId>(initial);
  const [form, setForm] = useState<Form>(() => emptyForm(initial));
  const [pasted, setPasted] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [drafted, setDrafted] = useState(false);
  const [gaps, setGaps] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedSession | null>(null);
  const [owner, setOwner] = useOwner();

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const pickTemplate = (id: TemplateId) => {
    if (id === template) return;
    setTemplate(id);
    setForm((f) => ({ ...emptyForm(id), sender: f.sender }));
    setDrafted(false);
    setGaps([]);
    setDraftError(null);
    setCreateError(null);
  };

  const applyDraft = (d: SetupDraft) => {
    setForm((f) => ({
      ...f,
      topic: d.topic,
      summary: d.summary,
      respondent_name: d.respondent.name ?? f.respondent_name,
      role: d.respondent.role ?? f.role,
      audience: d.respondent.relationship ?? f.audience,
      focus: d.focus_suggestions.slice(0, 2),
      known: d.known,
      assumed: d.assumed,
      off_limits: d.off_limits_suggestions,
      sketch: d.sketch.join("\n"),
    }));
    setGaps(d.gaps);
    setDrafted(true);
  };

  const draft = async () => {
    setDrafting(true);
    setDraftError(null);
    try {
      applyDraft(await api.draft({ template, pasted }));
    } catch (err) {
      if (!handleSignedOut(err, setOwner)) setDraftError(errorMessage(err));
    } finally {
      setDrafting(false);
    }
  };

  const toggleFocus = (area: FocusArea) =>
    set("focus", form.focus.includes(area) ? form.focus.filter((a) => a !== area) : [...form.focus, area].slice(-2));

  const missing = [
    !form.topic.trim() && (template === "pre_audit" ? "their business" : "a title"),
    !form.respondent_name.trim() && "their name",
    !form.sender.trim() && "your name",
  ].filter(Boolean);

  const create = async () => {
    if (missing.length) {
      setCreateError(`Add ${missing.join(", ")} before creating the link.`);
      return;
    }
    setCreating(true);
    setCreateError(null);
    const clean = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);
    try {
      const result = await api.createSession({
        template,
        setup: {
          ...form,
          topic: form.topic.trim(),
          summary: form.summary.trim(),
          sender: form.sender.trim(),
          respondent_name: form.respondent_name.trim(),
          role: form.role.trim(),
          known: clean(form.known),
          assumed: clean(form.assumed),
          off_limits: clean(form.off_limits),
          sketch: clean(form.sketch.split("\n")),
        },
      });
      setCreated(result);
      window.scrollTo(0, 0);
    } catch (err) {
      if (!handleSignedOut(err, setOwner)) setCreateError(errorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  if (owner === undefined) return <Loading />;
  if (owner === null) {
    return (
      <Page backHref="/" backLabel="Back">
        <SignInCard next={`/new${search}`} />
      </Page>
    );
  }

  if (created) {
    return (
      <Page backHref="/links" backLabel="Your links">
        <div className="flex flex-col gap-1.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-text">
            <Check size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-2 font-display text-[26px] font-semibold leading-tight">Your link is ready</h1>
          <p className="text-[15px] text-muted">
            Send it to {form.respondent_name.trim()}. They can answer whenever it suits them, no account needed.
          </p>
        </div>
        <Card>
          <label htmlFor="share-url" className="text-xs font-semibold text-muted">
            Share link
          </label>
          <input
            id="share-url"
            readOnly
            value={created.share_url}
            onFocus={(e) => e.currentTarget.select()}
            className="min-h-11 w-full rounded-btn border border-input bg-bg px-3 text-[15px]"
          />
          <CopyButton text={created.share_url} variant="primary" />
        </Card>
        <Link href="/links" className={buttonClass("secondary")}>
          Open your links
        </Link>
        <p className="text-[13px] leading-normal text-muted">
          When they confirm their answers, the document appears in your links, on any device you sign in on.
        </p>
      </Page>
    );
  }

  return (
    <Page backHref="/links" backLabel="Back to your links">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[26px] font-semibold leading-tight">New link</h1>
        <p className="text-sm leading-normal text-muted">
          {template === "pre_audit"
            ? "Tell us who it's for. The questions come from the template."
            : "Paste what you have. We'll draft the rest for you to check."}
        </p>
      </div>

      <Section title="Template">
        {templateIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={template === id}
            onClick={() => pickTemplate(id)}
            className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl bg-surface px-4 py-3.5 text-left ${
              template === id ? "border-2 border-ink" : "border border-border"
            }`}
          >
            <span className="text-[15px] font-semibold">{templates[id].name}</span>
            <span className="text-[13px] leading-normal text-muted-2">{templates[id].description}</span>
          </button>
        ))}
      </Section>

      {template === "pre_audit" ? (
        <Card>
          <CardLabel>Who it's going to</CardLabel>
          <TextField label="Their name" value={form.respondent_name} onChange={(v) => set("respondent_name", v)} required />
          <TextField label="Their business" value={form.topic} onChange={(v) => set("topic", v)} required />
        </Card>
      ) : (
        <>
          <Card>
            <TextField
              label="Paste what you have"
              labelClassName="text-sm font-semibold"
              hint="Notes, an email thread, a brief. Optional: you can also fill the fields below yourself."
              rows={6}
              value={pasted}
              onChange={setPasted}
              disabled={drafting}
            />
            <Button variant="secondary" onClick={draft} loading={drafting} disabled={!pasted.trim()}>
              {drafting ? "Drafting, this can take up to 15 seconds…" : "Draft setup"}
            </Button>
            {draftError && <ErrorNote>{draftError}</ErrorNote>}
          </Card>

          <Section
            title={drafted ? "Drafted from what you gave us" : "Set it up"}
            note={drafted ? "Check each part. Most of it should just look right." : undefined}
          >
            <Card>
              <CardLabel>What this is about</CardLabel>
              <TextField label="Title" value={form.topic} onChange={(v) => set("topic", v)} required />
              <TextField label="One-line summary" value={form.summary} onChange={(v) => set("summary", v)} />
            </Card>

            <Card>
              <CardLabel>Who it's going to</CardLabel>
              <TextField label="Name" value={form.respondent_name} onChange={(v) => set("respondent_name", v)} required />
              <TextField label="Role" value={form.role} onChange={(v) => set("role", v)} />
              <div role="group" aria-label="Relationship" className="flex flex-wrap gap-2">
                {audiences.map(([id, label]) => (
                  <Chip key={id} pressed={form.audience === id} onClick={() => set("audience", id)}>
                    {label}
                  </Chip>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-baseline justify-between gap-2">
                <CardLabel>What you need to learn</CardLabel>
                <span className="text-xs text-muted">{form.focus.length} of 2</span>
              </div>
              <div role="group" aria-label="What you need to learn" className="flex flex-wrap gap-2">
                {focusAreas.map(([id, label]) => (
                  <Chip key={id} pressed={form.focus.includes(id)} onClick={() => toggleFocus(id)}>
                    {label}
                  </Chip>
                ))}
              </div>
              <p className="text-xs text-muted">Two at most keeps it to about 10 questions.</p>
              {gaps.length > 0 && (
                <div className="flex flex-col gap-1 rounded-btn bg-bg p-3">
                  <p className="text-xs font-semibold text-muted">Missing from your notes</p>
                  <ul className="list-disc pl-4 text-sm text-muted-2">
                    {gaps.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <ListEditor label="Already known, won't be asked" items={form.known} onChange={(v) => set("known", v)} />
            <ListEditor label="They'll be asked to confirm" items={form.assumed} onChange={(v) => set("assumed", v)} />
            <ListEditor label="Off-limits" items={form.off_limits} onChange={(v) => set("off_limits", v)} />

            <Card>
              <TextField
                label="Process sketch (optional)"
                labelClassName="text-xs font-semibold text-muted"
                hint="One step per line. They'll see these as step cards to correct."
                rows={4}
                value={form.sketch}
                onChange={(v) => set("sketch", v)}
              />
            </Card>

          </Section>
        </>
      )}

      <Card>
        <TextField
          label="Your name"
          labelClassName="text-xs font-semibold text-muted"
          hint={`They'll see "From ${form.sender.trim() || "you"}".`}
          value={form.sender}
          onChange={(v) => set("sender", v)}
          required
        />
      </Card>

      <div className="flex flex-col gap-2.5">
        <p className="text-[13px] leading-normal text-muted">
          When they confirm their answers, you both get the document made from them.
        </p>
        <Button onClick={create} loading={creating}>
          {creating ? "Creating your link…" : "Create link"}
        </Button>
        {createError && <ErrorNote>{createError}</ErrorNote>}
      </div>
    </Page>
  );
}

function Page({ backHref, backLabel, children }: { backHref: string; backLabel: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-4 px-4 pb-12 pt-5 sm:pt-8">
      <Link href={backHref} className="flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold no-underline">
        <ArrowLeft size={16} aria-hidden="true" />
        {backLabel}
      </Link>
      {children}
    </main>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-2 flex flex-col gap-2.5">
      <div className="px-1">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{title}</h2>
        {note && <p className="mt-1 text-[13px] text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...items, text]);
    setDraft("");
  };
  return (
    <Card>
      <CardLabel>{label}</CardLabel>
      {items.length === 0 && <p className="text-sm text-muted">Nothing yet.</p>}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            aria-label={`${label}, item ${i + 1}`}
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            className="min-h-11 flex-1 rounded-btn border border-transparent bg-bg px-3 text-sm hover:border-input focus:border-input"
          />
          <button
            type="button"
            aria-label={`Remove "${item}"`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-btn text-muted"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          aria-label={`Add to ${label}`}
          placeholder="Add one"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="min-h-12 flex-1 rounded-btn border border-input bg-surface px-3 text-sm placeholder:text-muted"
        />
        <Button variant="secondary" onClick={add} disabled={!draft.trim()}>
          Add
        </Button>
      </div>
    </Card>
  );
}
