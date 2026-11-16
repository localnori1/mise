# Refactor mode

- Require a concrete reason: duplication, coupling, testability, readability,
  ownership, performance evidence, or an upcoming confirmed change.
- Define observable behavior and tests to preserve before restructuring.
- Inspect all callers and external contracts. Keep mechanical changes separate
  from behavior changes where practical.
- Prefer a smaller diff and existing abstractions. Do not build a framework from
  one example.
- Compare complexity before and after; stop if indirection or configuration grew
  without a measurable maintenance benefit.
