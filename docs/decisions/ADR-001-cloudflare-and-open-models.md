---
id: ADR-001
title: Host on Cloudflare; use open models on Workers AI
tags: [decision, architecture, hosting, ai]
status: proposed
date: 2026-11-16
---

# ADR-001 — Host on Cloudflare; use open models on Workers AI

## Context

The handoff (`source/handoff/04-architecture.md`) specified Next.js on Vercel,
Supabase, and the Anthropic API. On 2026-11-16 the owner asked to host on
Cloudflare instead and to look for free AI options.

## Decision

- Hosting: Cloudflare (owner decision, confirmed).
- Proposed stack: a React + Vite single-page app served as Workers static
  assets, a small Hono API Worker, Cloudflare D1 (SQLite) for storage, and a
  daily Cron Trigger to delete sessions after 90 days. One account, one bill.
- Proposed AI: Workers AI open models behind a single provider interface so the
  model (and provider) stays an environment setting. Pick the model by running
  evals E-01..E-14 from `07-test-plan.md` on these candidates:
  `@cf/openai/gpt-oss-120b`, `@cf/aisingapore/gemma-sea-lion-v4-27b-it`
  (Southeast Asian languages, for Taglish), `@cf/google/gemma-4-26b-a4b-it`.

## What this means for the owner

Can start at $0. The free AI allowance covers roughly 1-5 sessions a day
depending on model; past that, Workers Paid ($5/month) bills extra AI use at
about $0.01-0.07 per session. Open models are weaker than the ones the prompts
were tested with, so the evals decide whether quality is good enough.

## Options considered

| Option | Benefits | Costs/risks |
| --- | --- | --- |
| Next.js on Workers (OpenNext) | Keeps handoff stack | Free plan allows 10 ms CPU per request; server-rendered pages risk exceeding it, so effectively needs $5/month |
| Vite SPA + Hono Worker + D1 (chosen) | Fits free plan; static files cost no CPU; one vendor | Departs from handoff's Next.js plan |
| Keep Supabase | Postgres, handoff schema as-is | Second vendor; free projects pause after inactivity |
| Gemini API free tier | Strong models, free | Free-tier data may be used for product improvement and read by human reviewers; conflicts with D-09 and respondent trust |
| Groq free tier | Fast, open models | Daily token caps on large models are small relative to ~150k tokens per session |
| Self-host (Ollama etc.) | No per-token cost | Needs an always-on GPU machine; not free; fine for local experiments only |

## Consequences

- Positive: $0 to start; Cloudflare's free plan permits commercial use.
- Negative: model quality risk on JSON validity, Taglish, and "never suggest
  solutions"; prompts may need tuning.
- Follow-up: confirm Workers AI data-use terms before the pilot; set the model
  after evals; add a per-IP session limit (owner key cap alone is bypassable).

## Provenance and authority

- Evidence: Cloudflare Workers AI pricing and Workers limits pages (checked
  2026-11-16); Gemini API additional terms (effective 2026-03-23).
- Decision owner: product owner (hosting, spending); agent (stack details).
- Approval/date: Cloudflare confirmed 2026-11-16; stack and model pending.

## Update 2026-11-16: interviewer model

Evals (`prompt-evals/results/SUMMARY.md`): gpt-oss-120b failed 10 of 14 and
broke the core rules; Claude Haiku 5.5 and Sonnet 5.5 held them. Owner chose
Claude through Cloudflare AI Gateway with Unified Billing (prepaid credits, no
Anthropic account): gateway `mise`, logs off, $5/month spend limit.
Interviewer: `anthropic/claude-haiku-5.5` (Sonnet 5.5 as fallback setting).
Project is a portfolio piece, so demo-scale cost is cents.

## Revisit when

Evals fail on all candidates, sessions exceed ~5/day for a week, or AI spend
passes $20/month.
