# 04 — Architecture

## Stack (all free tier)
- **App:** Next.js (App Router) on Vercel
- **Database:** Supabase Postgres
- **AI:** Anthropic API. Model names in env vars so they can change without code changes.
  - `MODEL_INTERVIEWER` — a mid-tier model (Sonnet class) for turns
  - `MODEL_SYNTHESIS` — a stronger model (Opus class) for the final document; it runs once per session
  - `MODEL_SETUP` — same as interviewer
- Prompt tests so far were run with an Opus-class model. Re-run the evals in `07-test-plan.md` if the interviewer model changes.

Rough cost: a 10-question session is roughly 150k input / 10k output tokens on the interviewer, plus one synthesis call. Check current pricing at docs.claude.com.

## Access model (no accounts)
- **owner_key:** created on first visit to `/new`, stored in a cookie, and shown as a bookmarkable owner link `/o/{owner_key}`. Anyone with the owner link sees that owner's sessions.
- **share_token:** one per session, in the respondent link `/s/{share_token}`.
- Both are random 128-bit-plus tokens.
- Losing the owner link means losing access. That's acceptable for the MVP; say so on the owner page.

## Data model

### owners
| column | type | notes |
|---|---|---|
| owner_key | text, PK | random token |
| created_at | timestamptz | |

### sessions
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| owner_key | text, FK | |
| share_token | text, unique | |
| template | text | `requirements` or `pre_audit` |
| setup | jsonb | topic, summary, role, audience, map, focus, budget, known, assumed, off_limits, sketch, deliver_to |
| basics | jsonb | quick-tap answers |
| turns | jsonb | array of `{role, text, json, at}` |
| state | jsonb | `{panel[], steps[], requirements[], core_need, count, parked[], their_questions[]}` |
| status | text | `not_started`, `in_progress`, `ready`, `deleted` |
| output_md | text | generated document |
| created_at, updated_at | timestamptz | |
| expires_at | timestamptz | created_at + 90 days |

## Routes
| Route | Purpose |
|---|---|
| `/` | Landing: "Get input from someone" |
| `/new?template=` | Setup |
| `/s/{share_token}` | Respondent flow (screen chosen from session state) |
| `/o/{owner_key}` | Owner home |
| `/o/{owner_key}/{session_id}` | Output document |

## API
| Method & path | Does |
|---|---|
| `POST /api/setup/draft` | Pasted text + template → setup-drafter prompt → drafted setup JSON |
| `POST /api/sessions` | Creates a session from the confirmed setup; returns the share link |
| `GET /api/s/{token}` | Session state for the respondent (never returns owner fields) |
| `POST /api/s/{token}/basics` | Saves quick-tap answers |
| `POST /api/s/{token}/turn` | The turn loop (below) |
| `POST /api/s/{token}/steps` | Saves respondent step-card edits |
| `POST /api/s/{token}/priorities` | Saves priorities |
| `POST /api/s/{token}/confirm` | Runs synthesis, stores `output_md`, status `ready` |
| `POST /api/s/{token}/delete` | Deletes respondent data, status `deleted` |
| `GET /api/o/{owner_key}/{id}/export.md` | Markdown export |

## The turn loop
1. Load the session. Reject if the turn cap is reached (NFR-03).
2. Build the interviewer system prompt from `05-prompts/interviewer.md`, filling `{{...}}` from `setup`, `basics` and `state.count`.
3. Messages = prior turns (respondent text, plus the assistant's `say` only), then the new answer. Include respondent step edits as a short system note.
4. Call the model. Parse JSON; on failure retry once with "Return valid JSON only."
5. Apply `panel`, `steps` and `requirements` operations by id (add / update / remove).
6. Update `count`, `core_need`, `their_questions`.
7. Save, then return `say`, `kind`, `options` and the state the UI needs.
8. The UI chooses the screen from `kind`: `question`/`reflect`/`offer` → R3, `checkpoint` → R5, `priorities` → R6, `landing` → R7, `done` → R8. A non-empty `steps` change opens R4.

## Synthesis
On confirm: run the template's synthesis prompt with setup, basics, final
state and the transcript. Store the Markdown. Render it on O2.

## Out of scope for the MVP
Telegram Mini App (later: same web app inside Telegram, with a bot for links
and reminders), voice, email reminders, follow-up rounds, template editor,
probe bank, admin. Keep the UI mobile-first, use token links only, and keep
colors as CSS variables so the Telegram wrapper is cheap later.
