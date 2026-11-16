# Testing and correctness review

Start from acceptance criteria and failure modes, then map evidence:

- Unit tests for deterministic domain logic and edge conditions
- Component/integration tests for meaningful boundaries and state behavior
- Contract/schema tests for external interfaces where drift is costly
- E2E tests for critical user workflows such as auth, authorization, payments,
  financial/data-integrity paths, and release smoke tests
- Visual/accessibility checks for UI behavior that code assertions cannot prove

Look for assertions that could pass while behavior is broken, mocks that remove
the risk under test, flaky timing, shared-state pollution, missing negative or
permission cases, environment-only differences, and bug fixes without regression
coverage. Coverage percentage is a diagnostic, not a definition of quality.

Report the exact verification commands run, results, and missing evidence. A
build proves buildability, not correctness.
