# UI foundation

Use this when a user-facing project lacks an explicit UI baseline or visible
drift shows that the existing baseline is insufficient.

## Inspect before defining

Inventory the actual product: surfaces, layout shells, navigation, forms,
overlays, data display, feedback patterns, tokens, typography, icons, motion,
breakpoints, themes, and accessibility conventions. Identify which implementation
is canonical and which variants are accidental. Existing production behavior is
evidence, not automatically the desired standard.

## Establish the minimum system

- Name the authoritative token and component sources.
- Define semantic color, typography, spacing, radius, elevation, layering,
  animation, and responsive rules only to the extent the product uses them.
- Identify canonical primitives and composed patterns with ownership and intended
  variation points.
- Define page/container structure, content density, feedback, forms, overlays,
  navigation, and destructive-action conventions where repeated.
- Define supported viewport/input modes and accessibility baseline.
- Define how visual changes are demonstrated and approved.

Use `templates/ui-foundation.md` for a durable index when justified. Prefer links
to code, Storybook, design files, or tests over prose copies. Introduce a token,
component, or abstraction only when it resolves actual repetition or drift.

For a suitable greenfield React product, TypeScript, Tailwind, shadcn/ui, and
Lucide are sensible defaults, not mandatory choices. Record the decision and
trade-offs when choosing a stack with meaningful long-term consequences.
