# Release and environment review

Release review validates readiness; it never grants deployment permission.

Establish:

- Exact artifact/commit and target environment/account/region
- Relevant test, build, security, dependency, and visual evidence
- Environment configuration and secret source without revealing values
- Database/schema migration order, compatibility window, backup, rollback, and
  expected duration/locking
- Feature flags, staged rollout/canary, smoke tests, monitoring, alert owner, and
  abort criteria proportional to risk
- External integration, job, cache, queue, webhook, DNS, and mobile/client
  compatibility impacts
- Security baseline evidence: permission and tenant-isolation tests, client
  bundle and network responses free of secrets and sensitive fields,
  dependency audit ([baseline](security-baseline.md))
- Compliance items required before launch ([compliance](compliance.md))
- Explicit human approval and who can execute/recover

Give the owner a plain release summary before asking for approval: what users
will notice, risk (safe / needs attention / risky), how it will be checked once
live, how to undo it and how long that takes, and anything not verified.

Block release for an unidentified target, missing critical evidence, unsafe or
irreversible migration, production-as-test practice, unclear rollback, exposed
secrets, or unresolved critical/high security or integrity findings.
