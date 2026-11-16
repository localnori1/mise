---
name: operations
description: Keep a live product healthy and respond when something breaks. Use for incidents or outages ("the site is down", "users can't pay", error or cost spikes), launch readiness for monitoring, alerts, backups, and the runbook, and periodic health checks of cost, errors, scale triggers, backups, access, and debt. Investigation is read-only; production actions need explicit owner approval.
---

# Operations

The product owner may not be technical. Lead every report with user impact and
the decision needed, in plain language; technical detail follows.

## Select the mode

- Something is broken, slow, or unexpectedly expensive: [incident](references/incident.md)
- Routine check or "is everything okay?": [health check](references/health-check.md)
- Preparing to launch: create `docs/project/RUNBOOK.md` from
  `templates/runbook.md` and confirm monitoring exists, alerts reach a human,
  backups exist with a tested restore, rollback is known, and
  `docs/project/SERVICES.md` lists every account in the owner's name.

## Rules

- Read-only investigation needs no approval. Any production change (rollback,
  restart, configuration, data fix, paid scaling) needs the owner's explicit
  approval for that action, unless `RUNBOOK.md` records it as pre-approved.
- Never expose secrets or personal data in reports, logs, or the repository.
- After an incident, add regression coverage and update the runbook; record a
  lesson only for non-obvious, reusable insight.
