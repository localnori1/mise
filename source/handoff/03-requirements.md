# 03 — Requirements

Priority: Must = MVP blocker. Should = MVP if time allows. Could = post-MVP.

## Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The sender can create a link from either built-in template. | Must |
| FR-02 | The sender can paste text, and the system drafts the setup fields from it. | Must |
| FR-03 | The sender can edit every drafted setup field before creating the link. | Must |
| FR-04 | Creating a link produces a share link (respondent) and adds it to the sender's owner page. | Must |
| FR-05 | The respondent can open the share link with no account and resume where they left off. | Must |
| FR-06 | The respondent sees the welcome screen with the privacy note before any question. | Must |
| FR-07 | The respondent answers template quick-tap questions before the conversation. | Must |
| FR-08 | The conversation asks one question per turn, driven by the interviewer prompt, within the template's budget. | Must |
| FR-09 | Tappable options returned by the interviewer are shown as buttons; free text is always allowed. | Must |
| FR-10 | Panel, step and requirement operations (add/update/remove by id) from each turn are applied to the session state. | Must |
| FR-11 | The respondent can add, edit and remove step cards; their edits are sent to the interviewer on the next turn. | Should |
| FR-12 | Checkpoints show the playback and the reflection, with Keep going / Wrap up / Fix. | Must |
| FR-13 | The respondent sets a priority for every candidate item before the landing. | Must |
| FR-14 | On Confirm at the landing, the system generates the template's output document. | Must |
| FR-15 | The respondent sees their own copy and can delete their answers. | Must |
| FR-16 | The owner page lists links with status. | Must |
| FR-17 | The sender can export the output as Markdown. | Must |
| FR-18 | "Start a requirements session" from a Pre-Audit Brief opens setup pre-filled from that brief. | Should |
| FR-19 | Preview shows the respondent flow without saving answers. | Should |
| FR-20 | Upload .txt/.pdf/.docx as setup input. | Could |

## Acceptance criteria (Must items)

- **FR-02** Given pasted notes mentioning a process and a stakeholder role, when the sender submits, then title, summary, role, known facts, assumptions and a process sketch are pre-filled within 15 seconds.
- **FR-05** Given a respondent answered 3 questions and closed the tab, when they reopen the link, then they return to question 4 with the panel intact.
- **FR-08** Given a budget of 10, then the interviewer never asks an 11th question, and reflections, checkpoints and the priority step do not count toward the budget.
- **FR-10** Given a turn returns `{"id":"p3","op":"update"}`, then item p3 is replaced, not duplicated.
- **FR-13** Given 5 candidate items, when the respondent has not set all 5, then Continue is disabled.
- **FR-14** Given Confirm, then the output document is stored and the owner page shows the link as Ready.
- **FR-15** Given Delete my answers, then the transcript, state and output are removed and the owner page shows "Deleted by respondent".
- **FR-17** Given a Ready session, then Export produces a .md file matching the template structure, with tables and IDs.

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Usability | Respondent flow works on a 360px-wide phone; touch targets at least 44px. |
| NFR-02 | Performance | An interviewer turn returns in under 8 seconds at p90; show a typing state while waiting. |
| NFR-03 | Cost | Each session is capped at budget + 8 AI turns; each owner key is capped at 20 new sessions per day. |
| NFR-04 | Privacy | Share and owner tokens are unguessable (at least 128 bits). No personal data in URLs beyond tokens. |
| NFR-05 | Privacy | Respondent data is deleted on request and automatically after 90 days. |
| NFR-06 | Reliability | Invalid JSON from the model is retried once, then shown as "Something went wrong, try again" without losing the answer. |
| NFR-07 | Language | The interviewer replies in the respondent's language, including Taglish. Output documents are in English. |
| NFR-08 | Accessibility | Text contrast at least 4.5:1; all controls are real buttons, links or inputs. |
