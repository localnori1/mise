# UI review

Review the rendered interface at representative small and large viewports and
with keyboard interaction when the runtime permits. Compare against the
authoritative design system and canonical product patterns.

## Review dimensions

- User outcome, information hierarchy, action priority, content clarity, and
  unnecessary steps or screens
- Layout, alignment, spacing, density, typography, color, icons, imagery,
  elevation, layering, motion, and interaction feedback
- Loading, skeleton, empty, error, partial, disabled, success, destructive,
  interrupted, and recovery states
- Navigation, forms, tables, overlays, notifications, and repeated pattern
  consistency across the product
- Small-screen reflow, orientation, zoom, content growth, localization, touch
  targets, pointer/keyboard parity, and supported input modes
- Semantics, names/labels, focus behavior, error association, contrast,
  announcements, reduced motion, and screen-reader comprehension

## Evidence and output

Use browser inspection, screenshots, component tests, automated accessibility
checks, and specialist visual capabilities when available. Automated checks do
not prove usability or visual quality.

Report findings by consequence with location, observed evidence, affected state
or viewport, and smallest credible remediation. Search for existing canonical
components before recommending a new abstraction. Distinguish objective defects
from aesthetics requiring human judgment.
