---
id: ADR-003
title: Owners sign in with Google; respondents get a copy of the document
tags: [decision, security, product]
status: accepted
date: 2026-11-16
---

# ADR-003 — Owners sign in with Google; respondents get a copy

## Context

D-02 (`source/handoff/08-decisions.md`) made the owner's private page a
secret URL tied to a browser cookie. Links created on a second device started
a separate page, and anyone could create links and spend AI credit. The owner
wants links tied to the person (2026-11-16) and asked to drop the unused
"Who gets the brief" option in favour of always giving the respondent a copy,
including as a PDF, with no new paid service.

## Decision

- Owners sign in with Google (OpenID Connect, authorization code + PKCE,
  `src/server/auth.ts`). Chosen over GitHub because portfolio visitors are
  more likely to have a Google account. Respondents never sign in.
- Creating and drafting need a signed-in owner; owner pages are `/links` and
  `/links/:id` and show only that owner's sessions. Old `/o/<key>` URLs
  redirect to `/links` and no longer grant access.
- Login: random token in an httpOnly, SameSite=Lax cookie, 30 days; only its
  hash is stored (`logins`). Owners keep `owner_key` as their id; `google_sub`,
  name and email are added (`migrations/0002_google_sign_in.sql`).
- `deliver_to` is removed. When a session is `ready`, the respondent view
  carries `document_md`. A Pre-Audit Brief's "Where to Dig on the Call" is
  left out of the prospect's copy (it is the consultant's call prep).
- PDF uses the browser's "Save as PDF" with print styles that print only the
  document: no PDF library, no server work, no cost.
- Local testing: with `DEV_LOGIN=1` in `.dev.vars` and no Google credentials,
  `/auth/google` signs in a local tester, on localhost only.

## Consequences

- The owner creates a Google OAuth client (free) and sets
  `GOOGLE_CLIENT_ID` (var) and `GOOGLE_CLIENT_SECRET` (Worker secret).
- Supersedes D-02's secret owner URL. Email delivery stays out of scope;
  revisit with a sending domain if wanted.
- The ID token is read from Google's token endpoint over TLS without
  signature verification (OIDC Core 3.1.3.7); issuer, audience and expiry are
  checked.
