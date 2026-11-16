---
name: engineering-review
description: Review a design, code change, or release for architecture, security, testing, environment, or deployment risk. Use for explicit engineering audits, pre-release checks, high-risk changes, or independent self-review; use ui-engineering for visual, responsive, design-system, or accessibility review. Review does not authorize fixes or deployment.
---

# Engineering Review

Produce evidence-backed findings, not a generic checklist. Review is read-only
unless the user also authorizes fixes.

## Select scope

Read only the references relevant to the request and risk:

- [Architecture](references/architecture.md)
- [Security](references/security.md) and [baseline](references/security-baseline.md)
- [Testing and correctness](references/testing.md)
- [Release and environment](references/release.md)
- [Legal, privacy, and compliance](references/compliance.md)

## Review method

1. Define the review target, intended behavior, risk level, and evidence available.
2. Read project state, relevant requirements/decisions, the actual diff or design,
   affected callers and tests, and executable configuration. Do not review from
   a summary alone when primary evidence is available.
3. Trace important trust, data, state, dependency, and deployment boundaries.
   Check that the change is proportional to the request (see "Lean,
   proportional changes" in `AGENTS.md`); unjustified new files, rewrites, or
   speculative code are defects, not style preferences.
4. Run safe relevant checks when they materially strengthen evidence. Distinguish
   observed facts from inference and missing evidence.
5. Report findings in descending severity. Each finding includes location,
   consequence, evidence/reproduction, and the smallest credible remediation.
6. Explicitly say when no material finding was identified and list residual risk
   or tests not performed. Do not claim the system is safe or correct in absolute
   terms.

Severity is consequence and likelihood, not stylistic preference:

- **Blocker/Critical**: release or implementation must stop.
- **High**: likely serious user, security, data, or operational harm.
- **Medium**: meaningful defect or maintainability/reliability risk.
- **Low**: bounded improvement with concrete value.

Avoid findings that merely request more abstraction, documentation, or tests
without a plausible failure they prevent.
