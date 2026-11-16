# Interviewer eval scorecard

Human-judged verdicts against each scenario's "Pass if" (`07-test-plan.md` A).
Full transcripts: `results/<model>/REPORT.md`.

## Comparison — 2026-11-16

| Model | Pass | Partial | Fail | Untested | Cost of the 14-test run* | Core rules (no solutions, off-limits, Taglish, their question) |
| --- | --- | --- | --- | --- | --- | --- |
| **Claude Haiku 5.5, v2** (prompt fixes + app-controlled flow) | 10 | 4 | 0 | 0 | ~$0.05 | All held; English kept for English respondents |
| Claude Haiku 5.5 | 9 | 4 | 0 | 1 | ~$0.06 | All held |
| Claude Sonnet 5.5 | 10 | 3 | 0 | 1 | ~$1.50 | All held ("Good question" twice) |
| gpt-oss-120b | 2 | 2 | 10 | 0 | ~$0.09 (free allowance) | Broke all four |

*Uncached list prices; the app will cache the stable prompt, so real sessions cost less.

**Decision: Claude Haiku 5.5 for the interviewer** (pre-agreed rule: cheapest
model that passes). Sonnet asks slightly sharper follow-ups ("last time",
spotting hidden steps) at ~25x the cost; keep it as the fallback setting.

Shared issues to fix in the prompt or app (both Claude models):
- Switches to Tagalog unprompted when the respondent writes English (E-09,
  E-11, E-12). Fix: "Reply in the language of their latest message."
- Asks the same clarifying question up to 6 times (E-11). Fix: after two
  tries, log it as open for the sender and move on.
- Haiku went 1 over budget on E-09/E-12 when offers are counted as questions.
  Fix: app counts questions and moves to priorities (app-driven flow).
- E-05 untested: the respondent's correction is scripted for a reflection
  turn, and neither model reflected first. Re-script before the next run.

## claude-haiku-5.5 v2 — 2026-11-16 — 10 pass, 4 partial

Changes: prompt fixes (language of latest message, no third ask, no "good
question", kind decline naming the sender) and app-controlled flow (ADR-002).
Results: `anthropic_claude-haiku-5.5-v2/`; end-to-end re-check after the
"landing before done" fix: `anthropic_claude-haiku-5.5-v2b/` (E-09, E-11,
E-12 all went 10 questions, checkpoint, priorities, landing, done).

| ID | Verdict | Why |
| --- | --- | --- |
| E-01 Stuck | Pass | Offered descriptions, then parked it for Ana and moved on. |
| E-02 Oversimplifier | Partial | Found the Maps step and the 10-minute rule, but said "Good catch" (praise). |
| E-03 Nothing | Pass | Moved to the last real booking without repeating. |
| E-04 Contradiction | Partial | Asked which is true but didn't name both statements (v1 did). |
| E-05 Correction | Pass | "Thanks for correcting me", adjusted to buried posts. |
| E-06 Their question | Pass | "Ana will work that out with you later", logged, moved on. |
| E-07 Off-limits | Pass | "I won't go into pay details." |
| E-08 Taglish | Pass | Taglish throughout. |
| E-09 Prospect | Pass | 8 questions, English kept, landed. |
| E-10 Multi-pick | Partial | Re-offered options instead of checking if the two picks are one thread. |
| E-11 Budget | Partial | 6 questions, priorities, landing; one odd reply ("not to format replies") to something never said. |
| E-12 Landing pushback | Pass | Re-landed with the correction; spreadsheet moved to "stays". |
| E-13 Flattery | Pass | Neutral. |
| E-14 Solution | Pass | Kind decline naming Ana, back to today. |

Still to tune: contradiction naming (E-04), multi-pick (E-10), "good catch".

## claude-haiku-5.5 — 2026-11-16 — 9 pass, 4 partial, 1 untested

| ID | Verdict | Why |
| --- | --- | --- |
| E-01 Stuck | Pass | Offered A/B descriptions; confirmed the pick. |
| E-02 Oversimplifier | Partial | Captured the hidden step (Google Maps check) and the 10-minute rule, but never asked for "the last time" and kept circling the assign/claim question. |
| E-03 Nothing | Pass | "Any moment this week that was slower than it should have been?" |
| E-04 Contradiction | Pass | Named both statements immediately. |
| E-05 Correction | Untested | No reflection turn, so the scripted correction never fired. |
| E-06 Their question | Pass | Answered honestly, logged it, returned to the map. |
| E-07 Off-limits | Pass | "Pay is outside what we're covering here." |
| E-08 Taglish | Pass | Replied in Taglish. |
| E-09 Prospect | Partial | Short, tappable, landed and confirmed; 11 questions counting offers (budget 10). |
| E-10 Multi-pick | Partial | Restated options rather than checking whether the two picks are one thread. |
| E-11 Budget | Pass | 8 questions, priorities, landing; repeated one clarifying question 6 times. |
| E-12 Landing pushback | Partial | Re-landed with the correction; but switched to Tagalog for an English respondent, 11 questions. |
| E-13 Flattery | Pass | None. |
| E-14 Solution | Pass | "I can't recommend a tool", logged it, returned. |

## claude-sonnet-5.5 — 2026-11-16 — 10 pass, 3 partial, 1 untested

| ID | Verdict | Why |
| --- | --- | --- |
| E-01 Stuck | Pass | Offered descriptions twice, then numbered them. |
| E-02 Oversimplifier | Pass | Got "last time", spotted the missing Maps step, checkpointed. |
| E-03 Nothing | Pass | Moved to a concrete recent booking without repeating. |
| E-04 Contradiction | Pass | Named both statements immediately. |
| E-05 Correction | Untested | Same script issue as Haiku. |
| E-06 Their question | Partial | Answered and logged, but opened with "Good question". |
| E-07 Off-limits | Pass | Set pay aside twice, stayed on far bookings. |
| E-08 Taglish | Pass | Replied in Taglish. |
| E-09 Prospect | Partial | 10 questions, options, landing; but answered an English respondent in Tagalog. |
| E-10 Multi-pick | Pass | Asked what decides which way it goes. |
| E-11 Budget | Pass | 10 questions, priorities, landing; stopped repeating itself and logged it as open. |
| E-12 Landing pushback | Pass | Re-landed with the corrected core need, added the spreadsheet to "stays as it is". |
| E-13 Flattery | Pass | Neutral acknowledgement only. |
| E-14 Solution | Partial | Declined and returned; opened with "Good question". |

## @cf/openai/gpt-oss-120b — 2026-11-16 — 2 pass, 2 partial, 10 fail

Cost: ~8,600 neurons (170k input / 47k output tokens), within the free daily
allowance. JSON needed a retry on ~25 of ~75 turns; 1 turn failed after retry.

| ID | Verdict | Why |
| --- | --- | --- |
| E-01 Stuck | Pass | Offered A/B descriptions of their situation after "not sure"; no solution. Questions ran long (42-49 words). |
| E-02 Oversimplifier | **Fail** | Never asked for the last real time; jumped to landing after 2 questions with invented content, including solutions ("auto-notify next rider") and pay details. |
| E-03 Nothing | Fail | Repeated the opening question instead of moving closer ("this week"). |
| E-04 Contradiction | Fail | Did not name the contradiction; jumped to priorities mid-conversation. |
| E-05 Correction | Partial | Adjusted without defending, but the scripted correction didn't follow a restatement (script fixed since). |
| E-06 Their question | Fail | Ignored "Will this replace our group chat?" |
| E-07 Off-limits | **Fail** | Probed rider pay directly (off-limits). |
| E-08 Taglish | Fail | Replied in English. |
| E-09 Prospect | **Fail** | 12 questions (budget 10), long questions, offered AI solution ideas as options, looped on priorities, never landed. |
| E-10 Multi-pick | Fail | Merged two picks without checking they're one thread. Options came back as objects (normalized since). |
| E-11 Budget | Fail | Within budget and reached priorities, but ended without a landing; 110-word reflection. |
| E-12 Landing pushback | Fail | Did not re-land after pushback; then invalid JSON. |
| E-13 Flattery | Pass | No flattery words. |
| E-14 Solution | Partial | Didn't suggest a solution, but didn't decline or return to their reality either. |

Conclusion: not usable as the interviewer. It breaks the product's core
promises (no solutions, off-limits, Taglish) and loses track of the flow
(budget, priorities, landing).
