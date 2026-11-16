---
id: ADR-002
title: The app controls the interview flow
tags: [decision, architecture, ai]
status: accepted
date: 2026-11-16
---

# ADR-002 — The app controls the interview flow

## Context

`source/handoff/04-architecture.md` ("The turn loop") leaves question
counting and the move to priorities and landing to the model. In evals every
model drifted: gpt-oss-120b and Claude Haiku 5.5 went over the 10-question
budget, and gpt-oss sometimes never landed (`prompt-evals/results/SUMMARY.md`).

## Decision

The app owns the flow (`flowRule` in `src/server/interviewer.ts`):

- The app counts questions: turns of kind `question` or `offer` (FR-08).
- Each turn the system prompt ends with the flow instruction for that turn.
- Below the budget any kind except `landing` and `done`. At the budget, or
  when the respondent presses "Wrap up here" (`wrap_up`), or near the NFR-03
  call cap: one final `checkpoint` (budget only), then `priorities` only.
  After priorities: `landing` only, including re-lands after a correction.
- The model never ends the session: the respondent's Confirm button on the
  landing does (FR-14), which writes the document. (Amended 2026-11-16 after
  review: a model "done" could strand a session with no document.)
- Every model call is reserved in the database before it is made, so
  parallel requests on one link can't overspend (NFR-03).
- A reply of a disallowed kind gets the same single retry as invalid JSON
  (NFR-06), with the instruction repeated; then it fails as invalid output.

Turn-loop changes to `04-architecture.md`: step 4 also rejects disallowed
kinds; step 6 updates the count from the reply kind instead of trusting the
model's `count`. Session `state` adds `priorities_done` and `last_kind`.

## What this means for the owner

Sessions can't run over the question budget or skip the confirmation step,
whichever model is used. No cost change.

## Options considered

| Option | Benefits | Costs/risks |
| --- | --- | --- |
| Model tracks the flow (handoff) | No app logic | Every model tested drifted |
| App controls the flow (chosen) | Deterministic budget and landing | A little app logic; an extra retry when the model disobeys |

## Consequences

- Positive: FR-08 and NFR-03 hold by construction.
- Negative: none known beyond the extra retry.
- Done 2026-11-16: `wrap_up` flag; the final checkpoint shows "Continue"
  instead of "Keep going".

## Provenance and authority

- Evidence: `prompt-evals/results/SUMMARY.md`.
- Decision owner: product owner.
- Approval/date: approved 2026-11-16.

## Revisit when

Evals show a model that holds the budget and always lands on its own.
