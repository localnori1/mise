# Resources and complexity (time and space)

Every operation consumes time, memory/storage, network, and money. Account for
each at the sizes the system will actually reach.

## Algorithmic cost (Big-O)

- State time and space complexity for any code that loops over user-, tenant-,
  or time-scaled data. Name the variable (`n` = rows per tenant, not "n").
- Distinguish best, average, worst, and amortized cost; use worst case for
  anything exposed to untrusted input (hash collisions, regex backtracking,
  adversarial sort inputs).
- Watch for hidden quadratic behavior: nested loops, `contains` on a list,
  string concatenation in loops, N+1 queries, per-item network calls, repeated
  full scans, unbounded recursion, re-rendering on every change.
- Space includes auxiliary memory, not just stored data: copies, intermediate
  collections, buffers, caches, and retained references. Prefer streaming,
  pagination, and iterators over loading whole datasets.
- Trade time for space deliberately (index, cache, memoize, precompute) and name
  what is paid: memory, write cost, staleness, invalidation complexity.
- Constant factors and I/O dominate before asymptotics do at small `n`; do not
  replace a simple O(n) with a complex O(log n) below the size where it matters.

## Resource budgets

For each critical path, state a budget and the reasoning behind it:

- Latency: target percentile (p50/p95/p99), not the average; include network
  hops, serialization, and downstream dependencies. Tail latency compounds
  across fan-out.
- Throughput: steady and peak requests/sec, batch size, and job duration.
- Memory/CPU per instance and the failure when exceeded (OOM, throttling).
- Storage: rows x bytes x replicas x indexes x retention, plus growth rate.
- Network: payload size, egress cost, chattiness, connection reuse.
- Cost: estimated monthly cost at current and 10x load; spending is human-owned.

## Back-of-envelope method

1. Users or events per day -> average requests/sec (divide by ~86,400).
2. Apply a peak multiplier (commonly 2-10x) for burst capacity.
3. Bytes per record x records x retention x replication -> storage.
4. Read:write ratio and hot-set size -> cache and index sizing.
5. Compare against single-node limits (roughly: thousands of simple DB
   queries/sec, hundreds of GB of RAM, TB-scale disks). If one node fits with
   headroom, do not distribute.
6. Write down assumptions; flag which are guesses.

## Evidence

Reason first, then measure: benchmark the hot path with realistic data volume,
inspect query plans (`EXPLAIN`), profile CPU/memory, and load test against the
stated target. Report the command, dataset size, and result.
