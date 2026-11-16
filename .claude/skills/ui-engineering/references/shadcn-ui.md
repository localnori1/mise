# shadcn/ui governance

Use this only when the project already uses shadcn/ui or the stack decision is
being evaluated. Do not introduce it solely because it is a default preference.

- Treat generated component source as project-owned code: inspect, adapt, test,
  and maintain it rather than assuming package-level behavior.
- Check the project's current configuration and component conventions before
  adding anything. Do not invent installation or update commands; use current
  official tooling and project evidence.
- Prefer existing local components and variants. Add a new primitive only when
  it is semantically distinct or the current one cannot support the requirement
  without harmful coupling.
- Centralize intentional variants with clear names; avoid page-local class
  overrides that create hidden design-system forks.
- Preserve accessibility behavior when composing or styling underlying
  primitives, especially focus, labels, keyboard behavior, portals, and overlays.
- Use Lucide consistently when it is the established icon system. Icons require
  accessible names when they convey information and should not replace clear
  text where meaning would become ambiguous.
- Validate responsive behavior and every relevant state after customization;
  visual similarity to a default example is not proof of product fit.
