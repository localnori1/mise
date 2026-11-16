# Feature mode

- Confirm actors, business rules, permissions, acceptance criteria, and failure
  behavior. Use product discovery for consequential unknowns.
- Trace existing end-to-end behavior before choosing a layer or API boundary.
- Reuse domain logic and UI primitives; avoid parallel conceptual implementations.
- Test deterministic business logic and meaningful integration boundaries. Use
  E2E for critical user journeys, not every branch.
- Identify the expected data volume and traffic; check for N+1 queries,
  unbounded loads, and quadratic loops before implementing.
- Before starting non-trivial work, tell the owner its rough size and any new
  recurring cost.
- Include tracking for the feature's success measure when one is defined.
- Check [compliance](../../engineering-review/references/compliance.md) when the feature adds
  personal data, payments, tracking, messaging, or user content.
- Apply the [security baseline](../../engineering-review/references/security-baseline.md)
  for any feature touching sign-in, permissions, user data, payments, uploads,
  or secrets, and test the permission and tenant-isolation paths.
- Treat schema, contract, authorization, migration, and environment changes as
  impact multipliers requiring broader review.
