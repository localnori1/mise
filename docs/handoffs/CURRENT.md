---
title: Current Handoff
tags: [handoff, current]
status: ready
updated: "2026-11-16"
---

# Current handoff

## Objective

Mise MVP (portfolio project) running locally end to end; next is owner
review, a first commit, then deployment to Cloudflare.

## Completed

- Engineering OS 1.3.0 instance; handoff package in `source/handoff/`.
- Cloudflare + Claude via AI Gateway `mise` (ADR-001); app-controlled flow
  (ADR-002). Evals: `prompt-evals/results/SUMMARY.md` (Haiku v2: 10 pass, 4 partial).
- MVP built: all Must FRs. Server `src/server/` (Hono, D1, turn loop, setup
  drafter, synthesis, 90-day cron purge), client `src/client/` (S1, R1–R8,
  O1, O2), contract `src/shared/api.ts`, schema `migrations/0001_init.sql`.
- Verified 2026-11-16: typecheck, 10 unit tests, production build; full
  browser run (draft → link → respondent flow → Confirm → Opus document →
  owner page Ready → export → delete); pre-audit first turn; concurrent turns
  rejected before any AI call. Screenshots: `docs/screenshots/`.
- Independent review (Fable): High/Medium findings fixed (model can't end a
  session; calls reserved before spending; near-cap wrap-up).
- AI spend so far ~$2 of the $10 gateway credit (estimate).
- First commit 5d9bbb4 (local `main`, no remote).
- ADR-003: owners sign in with Google (`/links`), "Who gets the brief"
  removed, respondents get the document (PDF via browser print, Markdown,
  copy; pre-audit call prep and handoff left out). Reviewed; fixes applied.
  Verified locally with `DEV_LOGIN=1`; real Google sign-in not yet tested.

## In progress

- Nothing running except the local dev server.

## Important decisions and risks

- `src/server/prompts/interviewer.txt` and `setup-drafter.txt` diverge from
  `source/handoff/05-prompts/` on purpose (eval fixes; short off-limits names).
- Out of## Blockers and decisions needed

1. Owner creates a Google OAuth client (free) and sets `GOOGLE_CLIENT_ID`
   and the `GOOGLE_CLIENT_SECRET` Worker secret; redirect URIs
   `http://localhost:5173/auth/google/callback` and the production
   `https://<host>/auth/google/callback`.
2. Deployment (owner approval): production D1 (`database_id`), migrations
   0001-0002 remote, `IP_HASH_SALT` secret, security headers, `wrangler deploy`.
3. Later: account deletion for signed-in owners (name/email kept until then).

## Exact next step

Owner approves committing the sign-in work, then the Google OAuth setup and
deployment.
