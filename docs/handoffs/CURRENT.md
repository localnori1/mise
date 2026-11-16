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

## In progress

- Nothing running except the local dev server.

## Important decisions and risks

- `src/server/prompts/interviewer.txt` and `setup-drafter.txt` diverge from
  `source/handoff/05-prompts/` on purpose (eval fixes; short off-limits names).
- Out of scope: FR-18 (start requirements session from a brief), FR-19
  (preview), FR-20 (upload).
- Local D1 uses a placeholder `database_id`; production needs a real one.

## Relevant files

- `docs/project/PROJECT.md` (technical map, commands), `docs/project/SERVICES.md`
- `docs/decisions/ADR-001-…`, `ADR-002-…`; `prompt-evals/results/SUMMARY.md`

## Blockers and decisions needed

1. "Who gets the brief" (Just me / Me and them) is stored but has no effect
   yet: implement, or hide it.
2. Owner page across devices: new links made from a second device start a
   separate owner page (the owner key is in a cookie). Accept, or send the
   remembered key when creating.
3. Deployment (owner approval): create the production D1 database, set the
   `IP_HASH_SALT` secret, add security headers, `wrangler deploy`.
4. First commit of this work (nothing committed yet).

## Exact next step

Owner reviews the app at `npm run dev` (localhost:5173) and the screenshots,
decides items 1–2, approves a commit, then deployment.
