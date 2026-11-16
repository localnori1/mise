# Security review

Build a small threat model around assets, actors, trust boundaries, entry points,
and plausible abuse. Inspect relevant authentication, authorization, server-side
enforcement, validation, storage, database access, secrets, logs, uploads,
redirects, webhooks, payments, user content, dependencies, and integrations.

Start from the [security baseline](security-baseline.md); any violation is at
least High. Then verify where relevant:

- Deny-by-default authorization at the authoritative boundary; object/tenant
  scope is enforced, not implied by UI.
- Untrusted input is validated and output is encoded for its destination.
- Tokens, credentials, personal/sensitive data, and payment material are not
  exposed in code, client bundles, logs, errors, analytics, or artifacts.
- Webhooks and redirects authenticate origin/destination and resist replay or
  open redirect abuse.
- Uploads constrain type, size, storage path, execution, and access.
- Retries and concurrent requests preserve idempotency and integrity.
- Dependencies and external calls have justified privilege, timeouts, failure
  handling, and update posture.
- Security controls are tested at bypass boundaries, not only happy paths.

Stop dependent implementation for high-impact ambiguity. Never access production
data or run intrusive scans without explicit scope and authority.
