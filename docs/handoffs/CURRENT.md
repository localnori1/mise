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
- Pushed to https://github.com/localnori1/mise (`main`).
- Deployed 2026-11-16 to https://mise.sadyadesign.com (custom domain): production D1
  with migrations 0001-0002, `IP_HASH_SALT` secret, security headers.
- ADR-003: owners sign in with Google (`/links`), "Who gets the brief"
  removed, respondents get the document (PDF via browser print, Markdown,
  copy; pre-audit call prep and handoff left out). Reviewed; fixes applied.
  Verified locally with `DEV_LOGIN=1`; real Google sign-in not yet tested.

## In progress

- Nothing running except the local dev server.

## Important decisions and risks

- `src/server/prompts/interviewer.txt` and `setup-drafter.txt` diverge from
  `source/handoff/05-prompts/` on purpose (eval fixes; short off-limits names).
- Out of scope: FR-18 (start requirements session from a brief), FR-19
  (preview), FR-20 (upload).
- Owners sign in with Google; D-02's secret owner URL is superseded (ADR-003).

## Relevant files

- `docs/project/PROJECT.md` (technical map, commands, deploy), `docs/project/SERVICES.md`
- `docs/decisions/ADR-001-…`, `ADR-002-…`, `ADR-003-…`; `prompt-evals/results/SUMMARY.md`
- `src/server/auth.ts` (sign-in), `public/_headers` (security headers)

## Blockers and decisions needed

1. Google sign-in is configured (client ID in `wrangler.jsonc`, secret
   `GOOGLE_CLIENT_SECRET` in the dashboard) for https://mise.sadyadesign.com;
   the owner still has to complete one real sign-in to confirm it.
2. `PUBLIC_ORIGIN` (wrangler var) is the site's address. The custom domain
   reaches the Worker with the workers.dev host, so links, sign-in redirects
   and the cross-site check use it. Do not disable workers.dev until the
   domain is attached natively (Worker > Domains and Routes > Custom domain).
3. Later: account deletion for signed-in owners (name/email kept until then).

## Exact next step

Owner completes one real Google sign-in on the live site; then optional polish.
