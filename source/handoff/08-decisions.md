# 08 — Decisions and Parked Items

## Decisions
| ID | Decision | Why |
|---|---|---|
| D-01 | Elicitation only. Clarity mode (untangling your own idea) is parked. | Clarity mode competes with general AI chat apps, and tests showed a constrained version felt worse. Elicitation does something a chat app can't: an async link to someone else, structured, with the output delivered to the sender. |
| D-02 | No accounts. Owner key and share tokens. | Lowest friction; fits a 2-day MVP. |
| D-03 | Web app first. Telegram Mini App later. | A Mini App is the same web app inside Telegram; mobile-first and token links keep that step cheap. |
| D-04 | Two built-in templates, no template editor. | Covers both known users (requirements, pre-audit) without building an editor. |
| D-05 | Output is an Elicitation Session Summary, not a BRD. | One session yields confirmed elicitation results; a BRD consolidates several sessions. Same IDs carry over. |
| D-06 | Priorities are set by the respondent. | Real confirmation instead of the analyst's proposal; recorded as theirs. |
| D-07 | The tool never suggests solutions to the respondent. | Keeps requirements uncontaminated; solutioning stays with the analyst or consultant. |
| D-08 | Interviewer and synthesis are separate prompts. | Conversation behavior and document quality are tuned independently. |
| D-09 | The respondent can delete their answers; data expires after 90 days. | Trust, and the Philippine Data Privacy Act. |

## Known limitation
"Not to be shared with AI" is asked and respected in the output, but anything
the respondent types is still processed by the AI. The welcome screen asks
them not to include off-limits information.

## Parked (post-MVP)
- Clarity mode, as an optional "think it through first" step before setup
- Telegram Mini App and bot (links, reminders, voice notes)
- File upload beyond paste
- Follow-up rounds on the same link
- Reminders
- Multi-stakeholder sessions with conflict detection
- Probe bank: logging which questions worked, curated by the analyst
- .docx export
- Template editor
- Usage dashboard and admin
- Sales view alongside the requirements view in one session
