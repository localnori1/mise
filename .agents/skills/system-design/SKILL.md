---
name: system-design
description: Set a new project's scale and technical foundation, or design or evaluate how a system, feature, or data flow behaves under load and failure. Use for architecture and system-design questions, choosing frameworks/data stores/queues/caches, time and space (Big-O) analysis, capacity and cost estimation, scalability, concurrency, consistency, reliability, and performance work. Invoked by project-initialization for new projects. Use engineering-change to implement the result and engineering-review to audit an existing design.
---

# System Design

Reason about cost and failure before choosing structure. Design is advice until
the human approves; it does not authorize implementation or spending.

## Select the mode

- New project or adopting one: follow
  [project foundation](references/project-foundation.md), then return here only
  for deeper analysis.
- Product-type essentials: [product types](references/product-types.md).
- Specific design question, performance problem, or component choice: use the
  workflow below.

## Workflow

1. Pin down the problem: actors, core workflows, and the non-functional targets
   that matter (latency, throughput, data size/growth, availability, durability,
   consistency, cost, team size, lifetime). Label each as provided, derived,
   inferred, or unknown. Read the scale profile in `PROJECT.md` first. Ask only
   when an unknown changes the design, and ask in product terms.
2. Estimate scale with back-of-envelope numbers (requests/sec, peak factor,
   rows, bytes, growth/year). Use [resources and complexity](references/resources-and-complexity.md).
3. Start from the simplest design that meets the stated targets (usually one
   service, one database, no queue or cache). Identify the first bottleneck and
   only add machinery that removes a demonstrated or foreseeable one.
4. Define the data model, access patterns, and API/contract before components.
   Pick storage and framework by access pattern, not fashion.
5. Walk the design through failure and concurrency using
   [scalability and reliability](references/scalability-and-reliability.md).
6. Compare two or three viable options on the trade-offs in
   [design trade-offs](references/design-tradeoffs.md); recommend one and say
   what would make you change your mind.
7. Hand off: decisions needing sign-off, an ADR for each consequential
   trade-off (`templates/decision.md`), measurable acceptance targets, and the
   verification (load test, benchmark, query plan) that will prove them.

## Rules

- Numbers beat adjectives. "Fast" and "scalable" are not requirements; state the
  target and the load it applies to.
- Optimize for foreseeable scale (about 10x current, not 1000x). Premature
  distribution is a cost, not insurance.
- Measure before optimizing a working system; reason before building a new one.
  Never claim a performance result that was not measured or derived.
- Prefer boring, well-understood technology. A new datastore, queue, or service
  needs a failure mode analysis and an owner.
- Record estimates and their assumptions so they can be rechecked, not just the
  conclusion.
