# Bug-fix mode

- Reproduce the failure or establish the strongest available evidence before
  changing code. Separate symptom, trigger, and root cause.
- Trace the data/control path and recent relevant changes. Avoid speculative
  edits and timing workarounds.
- Choose the simplest fix at the owning boundary, not a downstream mask. A bug
  fix normally edits existing files; adding new files needs a stated reason.
- Add regression coverage that fails for the original defect when practical.
- Verify both the reproduction and adjacent behavior. Document a lesson only if
  the cause is non-obvious and reusable.
