---
title: "Mise Project Index"
tags: [project]
status: initializing
last_reviewed: "2026-11-16"
---

# Mise

- Engineering OS version: `1.3.0`

## Product intent

- Outcome: Async requirements elicitation. A sender shares a link; the
  respondent answers a short guided AI conversation (~8 min), confirms what was
  captured and sets their own priorities; the sender gets a standard document
  (Elicitation Session Summary or Pre-Audit Brief). (provided:
  `source/handoff/01-product-brief.md`)
- Users/actors: Sender (business analyst, consultant, salesperson); Respondent
  (colleague, client, prospect; never has an account). (provided)
- Purpose: portfolio project (owner, 2026-11-16). Demo-scale usage; optimize
  for low cost and showing the work (incl. the model eval scorecard), not scale.
- Current phase: Initialization -> MVP (target 2 days, provided)
- Evolution: MVP web app -> pilot with one real stakeholder and one prospect ->
  parked items in `source/handoff/08-decisions.md` (Telegram Mini App, upload,
  follow-up rounds, .docx)

## Product owner

- Technical background: Unknown (assume non-technical; explain by product
  consequence)

## Scale and quality profile

- Expected users (launch / one year): pilot = a handful of senders, tens of
  sessions (inferred from success criteria); one year unknown — pending owner
- Peak pattern: none meaningful; async, low concurrency (derived)
- Data stored and growth: text only, ~50-200 KB per session (transcript + state
  + output); expires after 90 days (derived from `04-architecture.md`)
- Tolerable downtime / data loss: pending owner; inferred tolerant for pilot
  (losing an in-progress session is annoying, not costly)
- Sensitive data or compliance: business process details and names; Philippine
  Data Privacy Act cited (provided, D-09). Respondent text is sent to Anthropic.
- Hosting budget: free tier (provided); Cloudflare Workers Paid $5/month if needed
- AI usage budget: free first (owner, 2026-11-16). Derived: ~150k input / 10k
  output tokens per session = roughly 2,000-6,500 Workers AI neurons; free
  allowance is 10,000/day (~1-5 sessions/day).
- Design headroom: ~10x expected load
- First likely bottleneck: AI spend and abuse (limited by Google sign-in for
  owners and daily per-owner/per-IP limits, ADR-003), then the 10,000 neurons/day free AI allowance — not database load
- Product type(s): AI feature inside a small web app; mobile-first respondent
- Devices and usage conditions: respondent on phone (360-390px, possibly poor
  connection, Taglish); sender on desktop
- Delivery pipeline (checks, previews, deploy approval): Not set up

## Sources of truth

| Topic | Authority | Status |
| --- | --- | --- |
| Product intent, scope, decisions | `source/handoff/01`, `08` | provided, treat as approved |
| Screens and flows | `source/handoff/02` + mockup https://claude.ai/artifact/5rVcSmMH61URxkmbbXtxhw | provided |
| Requirements and acceptance | `source/handoff/03-requirements.md` (FR-01..20, NFR-01..08) | provided |
| Stack, data model, API, turn loop | `source/handoff/04-architecture.md` | provided |
| AI behavior | `source/handoff/05-prompts/`, `06-templates.json` | provided |
| Verification | `source/handoff/07-test-plan.md` (E-01..14, E2E) | provided |
| Current behavior | Code and executable configuration | no code yet |

## Current state

- Readiness: Assessed 2026-11-16 — product ready; blocked on owner accounts
  and AI budget (see `docs/handoffs/CURRENT.md`)
- Active objective: Owner sign-off, then prompt evals, then build
- Known blockers: Cloudflare account (owner-owned); model choice after evals

## Technical map

- Stack: Cloudflare (confirmed). Proposed: React + Vite + TypeScript + Tailwind
  SPA on Workers static assets, Hono API Worker, D1, Cron Trigger; Claude
  (Haiku 5.5 interviewer) through AI Gateway `mise` with prepaid credits, model
  in env vars `MODEL_INTERVIEWER`, `MODEL_SETUP`, `MODEL_SYNTHESIS`. See
  [ADR-001](../decisions/ADR-001-cloudflare-and-open-models.md). The app, not
  the model, controls the interview flow:
  [ADR-002](../decisions/ADR-002-app-controlled-interview-flow.md).
  Owners sign in with Google; respondents get the document as PDF/Markdown:
  [ADR-003](../decisions/ADR-003-google-sign-in-and-respondent-copy.md).
  Supersedes the handoff's Vercel/Supabase/Anthropic plan.
- Code locations: `src/server/` (Worker API, Hono, D1, AI calls, prompts),
  `src/client/` (React app), `src/shared/` (API contract `api.ts`,
  `templates.json`), `migrations/` (D1 schema), `prompt-evals/` (interviewer evals)
- Build/test commands: `npm run dev` (Vite + Worker on localhost:5173),
  `npm run db:migrate` (local D1 schema), `npm run typecheck`, `npm test`,
  `npm run build`; local sign-in without Google: `DEV_LOGIN=1` in `.dev.vars`;
  evals: `npm run dev:eval` + `npm run eval -- --model <id>`
  (needs a build first so `dist/client` exists)
- Environments: local only (local D1, AI through the owner's gateway). No
  production database or deployment yet.
- Deployment/rollback: pending owner approval (create D1, set `database_id`
  and the `IP_HASH_SALT` secret, `wrangler deploy`; rollback via Workers versions)

## Durable records

- Requirements: use `source/handoff/03-requirements.md` IDs directly; do not
  duplicate into `docs/requirements/`
- Decisions: D-01..D-09 in `source/handoff/08-decisions.md`; new ones in
  `docs/decisions/`
- Services and accounts: [SERVICES](SERVICES.md)
- Current handoff: [CURRENT](../handoffs/CURRENT.md)

## Capabilities relevant to this project

| Capability | Evidence | Approval/limits |
| --- | --- | --- |
| Repository files | Workspace access | Follow host sandbox |
| Node 22 / npm 10, Python 3.14, Git | Verified locally | `python` not `python3` on this machine |
| Cloudflare (Workers, D1, Workers AI) | Not available | Owner creates the account; agent uses `wrangler` with owner login |

## Open decisions

See "Blockers and decisions needed" in `docs/handoffs/CURRENT.md`.
