# 01 — Product Brief: Mise

The product is called **Mise** (from *mise en place*: everything prepared before service). No parent brand appears in the product. The tagline "Everything understood before anything gets built." appears on the respondent welcome screen only.

## Problem
Requirements gathering depends on meetings with people who are too busy to
attend them. The people who know a process best are the ones doing it, and
they have the least free time. Managers who do attend tend to oversimplify
("it's just this and that") and skip steps. Forms (Typeform, Google Forms)
collect vague answers at face value, never follow up, and give the person
answering nothing back.

## Product
A link-based, asynchronous elicitation tool. It makes requirements gathering
easier. It does not automate the analyst away.

- The sender pastes or uploads what they already know, checks a drafted
  setup, and sends a link.
- The person answering goes through a short guided conversation (about 8
  minutes): quick taps, then probing questions, step cards for any process,
  checkpoints, a priority step, and a final confirmation.
- The sender receives a standard document: an **Elicitation Session Summary**
  (requirements template) or a **Pre-Audit Brief** (sales intake template).

## Users
- **Sender (primary):** a business analyst gathering requirements. Also a
  consultant or salesperson running a pre-audit intake on prospects.
- **Respondent:** a colleague, client, or prospect. Never needs an account.

## Templates (built in for MVP)
- **Requirements session** — goes deep on one area. Output: Elicitation
  Session Summary.
- **Pre-audit intake** — sweeps the business, goes deep where it hurts.
  Output: Pre-Audit Brief. Its handoff section can start a requirements
  session on the biggest pain.

## Principles
1. **Easier, not automated.** The analyst still decides, reconciles and writes the BRD.
2. **Show the map, not the questions.** Respondents always see where they are.
3. **Correct a draft instead of narrating from scratch.** Processes become step cards to fix.
4. **Evidence over opinion.** Ask about the last real time, never hypotheticals.
5. **Confirmed, not inferred.** Findings and priorities are confirmed by the respondent before the document is produced.
6. **Never suggest solutions to the respondent.** Their reality only.
7. **The respondent gets something back.** Their own copy, and the right to delete.

## MVP scope (2 days)
In: setup with paste (upload is a stretch goal), two templates, respondent
flow with quick taps, conversation, step cards, checkpoints, priorities,
landing, done; owner home; both output documents with Markdown export;
delete-my-answers.

Out (see `08-decisions.md`): accounts, Telegram, voice, reminders by email,
follow-up rounds, template editor, probe bank, admin panel, .docx export.

## Success criteria for the MVP
- A real stakeholder or prospect completes a session without help.
- The sender needs fewer follow-up questions than with a form or meeting notes alone.
- The respondent confirms the landing without major fixes.
