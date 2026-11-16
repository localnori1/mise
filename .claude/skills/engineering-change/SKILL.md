---
name: engineering-change
description: Implement a software feature, bug fix, backend/configuration change, or refactor with inspection, reuse, impact analysis, risk-based verification, and self-review. Use when the user authorizes non-UI code or configuration changes; use ui-engineering for screens, components, styling, frontend interactions, or visual work.
---

# Engineering Change

Complete the authorized change, not adjacent cleanup. Preserve unrelated work.

## Select the mode

Read only the matching reference:

- Feature or behavior change: [feature](references/feature.md)
- Bug diagnosis plus authorized fix: [bug fix](references/bug-fix.md)
- Refactor with behavior preservation: [refactor](references/refactor.md)

## Shared loop

1. Establish outcome, acceptance criteria, authority, and stop conditions.
2. Read current project state/handoff and inspect relevant code, tests, history,
   instructions, dependencies, and existing patterns.
3. For code or designs whose cost grows with data, users, or traffic, state
   time/space complexity and resource impact; read
   [system-design](../system-design/SKILL.md) when non-trivial.
   Search for reuse. Analyze downstream effects and choose the smallest durable
   solution. Explain a material flaw in the requested approach before proceeding.
4. Plan in proportion to risk. Create a branch only when appropriate and safe.
5. Implement with relevant error, permission, state, recovery, and observability
   behavior.
6. Run the smallest verification ladder that can establish correctness. Record
   exact commands and results; never imply an unrun check passed.
7. Review requirements, regressions, architecture, security, tests,
   maintainability, and product/UI quality as relevant. Fix safe in-scope issues
   and verify again.
8. Update project knowledge only for durable decisions, material debt, lessons,
   or incomplete handoff state.
9. Present what changed, why, files affected (calling out any new file and why
   it was needed), verification, limitations, risks,
   and pending human actions. Do not commit, push, or deploy without authority.
