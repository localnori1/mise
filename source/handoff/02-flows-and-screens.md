# 02 — Flows and Screens

Mockup: https://claude.ai/artifact/5rVcSmMH61URxkmbbXtxhw
All screens are mobile-first (390px wide) except the two output documents.

## Flow 1 — Sender sets up a link
### S1. Setup (`/new`)
1. **Template picker:** Requirements session | Pre-audit intake.
2. **Drop zone:** paste text (MVP). Upload of .txt/.pdf/.docx is a stretch goal.
3. On submit, the **setup drafter** prompt fills the fields below. The sender checks and edits:
   - What this is about (title + one-line summary)
   - Who it's going to: name, role, relationship chips (Client / Prospect / Colleague → `audience`)
   - What you need to learn: focus area chips, max 2 (requirements template)
   - Already known, won't be asked (editable list)
   - They'll be asked to confirm (assumptions)
   - Off-limits topics
   - Process sketch, optional (becomes the respondent's draft step cards)
   - Who gets the brief: Just me | Me and them
4. Actions: **Preview what they'll see** (opens the respondent flow read-only), **Copy link**.

Pre-audit template: setup is pre-filled from the template. The sender only
enters the prospect's name and business, then copies the link.

## Flow 2 — Respondent answers (`/s/{share_token}`)
A top **map bar** shows the template's topics, the current topic, and time left.
Progress saves after every turn; reopening the link resumes.

### R1. Welcome
Top: the "Mise" wordmark with the tagline "Everything understood before anything gets built."
Who's asking, what it's about, about 8 minutes, the map, the privacy note,
and a note asking them not to include off-limits information. Button: Start.

### R2. Quick basics
Tap-only questions from the template (e.g. frequency, tools). Pre-filled
values from setup are shown for correction (e.g. role).

### R3. Conversation
One question per turn. Tappable options when the interviewer offers them.
Text answer box. A collapsible "What we have so far" list (the panel).

### R4. Step cards
Shown when the interviewer drafts or updates a process. Vertical step cards
with "+" between steps. Tap a step to edit or remove it. Optional "if it goes
wrong" branch per step. Steps added by the respondent are highlighted.
Button: Looks right.

### R5. Checkpoint
Playback of 3–5 items with tags (Heard / Assumed), one reflection ("What I'm
hearing is ___. Close?" with Yes / Not quite), and Keep going / Wrap up here /
Fix something.

### R6. Priorities
Candidate items in plain words, each with a three-way toggle:
- Requirements template: Must have / Nice to have / Not needed
- Pre-audit template: Biggest / Annoying / Can live with it
Note: "Your priorities are recorded as yours."

### R7. Landing
Core need (one sentence), what we heard, their must-haves, what's still open,
what stays as it is, what's not to be shared with AI. Buttons: Fix something /
Confirm. On Confirm, the output document is generated.

### R8. Done
Thanks, their own copy (core need + confirmed process), Copy my answers,
Delete my answers.

## Flow 3 — Sender gets the output
### O1. Your links (`/o/{owner_key}`)
Private, bookmarkable owner page. Lists every link created with this owner
key: title, template, respondent, status (Not started / In progress /
Ready). New link button.

### O2. Output document (`/o/{owner_key}/{session_id}`)
- Requirements template → **Elicitation Session Summary** (see `05-prompts/synthesis-session-summary.md`)
- Pre-audit template → **Pre-Audit Brief** (see `05-prompts/synthesis-audit-prep.md`)
Actions: Export as Markdown (MVP), Copy. The Pre-Audit Brief's handoff
section has "Start a requirements session on P-01", which opens Setup
pre-filled from the brief.
