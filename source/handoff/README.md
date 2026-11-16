# Mise — Handoff Package

**Name:** Mise (no parent branding).
**Tagline (welcome screen only):** "Everything understood before anything gets built."

An async requirements elicitation web app. Someone sends a link, the other
person answers on their own time in a short guided conversation, confirms
what was captured and sets their own priorities, and the sender gets a
standard document back.

## Read in this order
1. `01-product-brief.md` — what, who, why, MVP scope, principles
2. `02-flows-and-screens.md` — every screen, in flow order
3. `03-requirements.md` — functional and non-functional requirements, with acceptance criteria
4. `04-architecture.md` — stack, data model, routes, the AI turn loop
5. `05-prompts/` — the four prompts the app runs
6. `06-templates.json` — the two built-in templates
7. `07-test-plan.md` — prompt evals and end-to-end checks
8. `08-decisions.md` — decisions made, and what's parked

## Visual reference
Clickable mockup of every screen and both outputs:
https://claude.ai/artifact/5rVcSmMH61URxkmbbXtxhw

## Target
MVP in 2 days. Web app only. No accounts. Free-tier hosting. The only running
cost is AI calls.

## Note for the planner
The riskiest part is the interviewer's behavior, not the code. Run the prompt
evals in `07-test-plan.md` before building UI around the prompt.
