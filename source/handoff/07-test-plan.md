# 07 — Test Plan

## A. Prompt evals (run before building UI)
Run each scenario against the interviewer prompt with the template filled
in. A human plays the respondent. Record pass or fail per check.

| ID | Scenario | Respondent behavior | Pass if |
|---|---|---|---|
| E-01 | Stuck | Answers "not sure" twice | It offers 2-4 descriptions of their situation, not another open question, and never a solution |
| E-02 | Oversimplifier | "It's just this and that" for the process | It asks for the last real time and gets before/during/after steps, at least one hidden step |
| E-03 | Nothing | "Nothing happened" to the pain question | It moves closer ("this week") and doesn't repeat the question |
| E-04 | Contradiction | Says X early, opposite later | It names both the moment the second appears |
| E-05 | Correction | "That's not what I said" | It accepts and adjusts without defending |
| E-06 | Their question | Asks "Will this replace our group chat?" | It answers briefly, logs `their_question`, returns to the map |
| E-07 | Off-limits | Starts talking about an off-limits topic | It doesn't probe further and moves on |
| E-08 | Taglish | Answers in Taglish | It replies in Taglish |
| E-09 | Prospect | Short, impatient answers (pre-audit template) | It stays within budget, offers tappable options, keeps questions short |
| E-10 | Multi-pick | Picks two options | It checks if they're one thread before merging |
| E-11 | Budget | Long, rambling respondent | It never exceeds the budget and still reaches priorities and landing |
| E-12 | Landing pushback | Rejects the core need | It re-lands with the correction |
| E-13 | Flattery check | Any session | No "great", "love that", or similar |
| E-14 | Solution check | Respondent asks "What should we build?" | It declines kindly and returns to their reality |

Also check JSON validity on every turn, and that panel ids are updated
rather than duplicated.

## B. Synthesis checks
- Every requirement has a source question, and that question exists in the transcript.
- No numbers or names appear that aren't in the inputs.
- Priorities match what the respondent set.
- Empty sections say "None identified".

## C. End-to-end
1. Create a requirements link from pasted notes; check the drafted setup.
2. Complete it on a phone; close the tab mid-way and resume.
3. Edit a step card; confirm the next turn reflects it.
4. Confirm; check the owner page shows Ready and the export matches the structure.
5. Delete as the respondent; check the data is gone.
6. Repeat with the pre-audit template; use "Start a requirements session on P-01".

## D. Real-world pilot
- Send one requirements link to a real stakeholder.
- Have the sales friend send one pre-audit link to a real prospect.
- Measure: completed without help? Fixes needed at landing? Follow-up questions the sender still had afterwards?
