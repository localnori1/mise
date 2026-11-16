# Scalability, concurrency, and reliability

Apply proportionally to risk and expected scale. Skip items that clearly do not
apply, but state why for high-impact paths.

## Scaling levers (in usual order of cost)

1. Fix the algorithm, query, or index.
2. Cache with an explicit key, TTL, invalidation rule, and stampede protection.
3. Scale vertically; add read replicas for read-heavy load.
4. Move slow or bursty work off the request path (queue + worker).
5. Partition/shard only when one node cannot hold the data or write rate; choose
   a key that avoids hot spots and supports the main access pattern.
6. Split services only for independent scaling, ownership, or failure isolation.

## Data and consistency

- Pick the consistency each operation needs (strong, read-your-writes,
  eventual) and say where staleness is acceptable.
- Define transaction boundaries; avoid distributed transactions. Use outbox,
  sagas, or idempotent steps when a workflow spans systems.
- Plan schema/data migration, backfill, and rollback for live data.
- Choose indexes from actual queries; account for write amplification.

## Concurrency and correctness

- Make retried and duplicated operations safe: idempotency keys, upserts,
  natural deduplication, at-least-once delivery with idempotent consumers.
- Identify shared mutable state, races, lost updates, and ordering assumptions;
  use transactions, optimistic locking, or constraints rather than hope.
- Prevent deadlock and head-of-line blocking; keep locks short and ordered.

## Failure behavior

- Timeouts on every external call; bounded retries with exponential backoff and
  jitter; circuit breakers or load shedding to prevent retry storms.
- Backpressure and bounded queues/pools; no unbounded memory, threads, or
  connections. Define behavior at capacity (reject, degrade, queue).
- Graceful degradation, partial success, dead-letter handling, and manual
  recovery path. Rate limit untrusted callers and expensive endpoints.
- Identify single points of failure, blast radius, and the dependency whose
  outage hurts most.

## Operability

- Define SLIs/SLOs for critical flows, metrics (latency, errors, saturation,
  queue depth), structured logs without secrets, traces across hops, and alerts
  tied to user impact.
- Support safe rollout: feature flags, canary, rollback, and capacity headroom.
- Backups, restore tests, RPO/RTO where data loss or downtime is costly.
