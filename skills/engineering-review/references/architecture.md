# Architecture review

Inspect boundaries, ownership, dependency direction, coupling, cohesion, state,
data integrity, external contracts, failure isolation, and operational burden.

Ask:

- Does each rule have one clear owner, or is business logic duplicated?
- Does data remain valid across concurrency, retries, partial failure, and schema
  evolution?
- Are APIs and modules shaped around actual change boundaries?
- Is state held at the narrowest reliable scope?
- Is a dependency, service, cache, queue, or abstraction justified by measured or
  foreseeable need?
- Can another maintainer understand, test, replace, and operate the design?
- Does scale reasoning match expected traffic, data, team, lifetime, and risk?
- Are time/space complexity, capacity, failure, and concurrency behavior stated
  and verified at expected and 10x load? See
  [system-design](../../system-design/SKILL.md).
- Is a workaround masking a wrong underlying boundary?

Prefer diagrams only when three or more relationships are otherwise difficult to
explain. Recommend an ADR for a consequential accepted trade-off.
