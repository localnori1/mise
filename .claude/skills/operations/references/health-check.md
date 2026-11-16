# Health check

Read-only unless the owner authorizes fixes. Use evidence available in this
runtime; mark any area that could not be checked as "not checked" rather than
healthy.

| Area | Check |
| --- | --- |
| Cost | Spend against budget and `SERVICES.md`; unexpected charges; upcoming renewals (domains, certificates, cards on file) |
| Reliability | Error and uptime trends; alerts firing, silenced, or reaching nobody |
| Scale | Current users and data against the `PROJECT.md` scale profile and ADR "revisit when" triggers |
| Backups | Recent backup exists; restore tested within the agreed interval |
| Security | Known-vulnerable dependencies, unsupported runtimes, who has access (remove departed people and unused keys) |
| Ownership | Every service in `SERVICES.md`, owned by the owner, with working access |
| Debt | Debt records whose trigger has fired |
| Product | Success measures from requirements, trending as hoped or not |

Report green, yellow, or red per area in one line each, then the top three
recommended actions with rough effort and any cost. Recommend a check cadence
(for example monthly) proportional to the product's risk.
