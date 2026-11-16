---
name: ui-engineering
description: Establish, implement, or review a product UI and its design system with reusable components, responsive behavior, accessibility, visual consistency, and appropriate shadcn/ui governance. Use for UI foundations, screens, components, styling, frontend interaction changes, design-system work, visual QA, or UI audits; use product-discovery first when the product flow itself is unresolved.
---

# UI Engineering

Treat UI as a product system, not isolated page styling. Preserve human ownership
of consequential product and visual decisions.

## Establish context

Before changing UI, inspect the rendered product when possible, existing design
tokens and components, frontend stack, relevant requirements, current project
UI foundation, and available browser/visual capabilities. Search for the
canonical pattern before creating or changing one.

If actors, workflow, information hierarchy, or consequential interaction choices
are unresolved, stop dependent implementation and use `product-discovery`.

## Select the mode

Read only what the task needs:

- Creating or repairing the design-system baseline: [foundation](references/foundation.md)
- Implementing a screen, component, or interaction: [implementation](references/implementation.md)
- Auditing UI quality, consistency, responsiveness, or accessibility: [review](references/review.md)
- Working in a project that uses or is evaluating shadcn/ui: [shadcn/ui](references/shadcn-ui.md)

## Invariants

- Follow the established product design system before generic defaults.
- One conceptual component or interaction should have one canonical owner.
- Every relevant interaction includes loading, empty, error, partial, disabled,
  success, destructive, interrupted, and recovery behavior.
- Accessibility and responsive behavior are acceptance criteria, not polish.
- Verify behavior with tests and appearance in the rendered product when tools
  are available. Never claim visual verification from code inspection alone.
- Use specialist UI skills or visual tools when available and trustworthy, but
  keep the repository contract sufficient when they are absent.

Record stable UI rules in `docs/project/UI-FOUNDATION.md` only when the project
has enough user-facing surface for that index to prevent drift. Do not document
every component or repeat information already authoritative in code or Storybook.
