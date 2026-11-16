# Design trade-offs and framework selection

Frame decisions as trade-offs with a recommendation, never as a verdict that one
tool is best.

## Core tensions

- Latency vs throughput; consistency vs availability under partition;
  read cost vs write cost; time vs space; simplicity vs flexibility;
  speed to deliver vs long-term operating cost; build vs buy; coupling vs
  duplication; reversibility vs optimization.

## Comparing options

For two or three viable options, tabulate: fit to access pattern, scale ceiling,
failure modes, operational burden, team familiarity, security surface, lock-in
and exit cost, total cost, and delivery time. Mark each cell evidence-based or
assumed. Prefer the option that is cheapest to reverse when evidence is weak.

## Choosing components

- Datastore: relational by default for structured, transactional data; document,
  key-value, wide-column, search, graph, or time-series only when the access
  pattern demands it. State the query that justifies it.
- Cache/queue/stream: justify by a measured or foreseeable bottleneck; define
  ownership, retention, ordering, and failure semantics.
- Frameworks and libraries: follow the existing stack first. For new choices
  weigh maturity, maintenance activity, ecosystem, security record, performance
  at the target load, learning curve, and replacement cost. Verify current
  versions and claims from primary sources rather than memory.
- API style (REST, RPC, GraphQL, events): choose by consumer needs, versioning,
  caching, and tooling; define pagination, idempotency, errors, and limits.
- Architecture style: start with a modular monolith with clear boundaries; extract
  services when a concrete scaling, team, or isolation need appears.

## Recording

Create an ADR (`templates/decision.md`) for a consequential trade-off: context,
options, choice, consequences, and a concrete "revisit when" trigger such as a
traffic, data-size, or cost threshold.
