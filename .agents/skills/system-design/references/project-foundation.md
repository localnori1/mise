# Project foundation (new or adopted project)

Run once during project initialization, after the product outcome and core
workflows are understood and before the stack or architecture is chosen. This is
where time, space, cost, and failure decisions are cheapest to get right.

## 1. Ask product questions, not technical ones

The product owner may not be technical. Never ask them for latency percentiles,
QPS, consistency models, or framework preferences. Ask about the business, then
derive the engineering targets yourself. Use only the questions that matter for
this product; offer a sensible default with each so "I don't know" is fine.

| Ask (plain language) | Derives |
| --- | --- |
| How many people will use it in the first months? In a year if it goes well? | Load, storage growth, 10x target |
| When is the busiest moment (launch, lunch rush, end of month)? | Peak multiplier |
| What do people mostly do: look things up, or create/change things? | Read:write ratio, caching |
| How much do they upload or store (photos, video, documents)? | Storage, bandwidth, cost |
| If it stopped working for an hour, what happens? A day? | Availability target, redundancy |
| If the last day of changes were lost, how bad is that? | Backups, RPO/RTO, durability |
| Does it handle money, health, children's, or other personal data? | Security, compliance, audit |
| Must things update live for others (chat, live dashboards, bidding)? | Real-time infrastructure |
| Where are users (one country, worldwide)? | Regions, latency, data residency |
| Rough monthly budget for hosting and services? | Option filtering; spending is human-owned |

Also ask, in plain words:

- What kind of product is this (software for businesses, consumer app,
  marketplace, mobile app, online store, internal tool, content site, AI
  feature)? Load the matching sections of [product types](product-types.md).
- Who uses it, on what devices, and where (desk, phone on the move, shared
  tablet, poor connection, connected hardware such as printers or scanners)?
  Any accessibility needs?

## 2. Derive and record a scale profile

Translate the answers into targets using
[resources and complexity](resources-and-complexity.md), label each as provided,
derived, or inferred, and record it in the `Scale and quality profile` section of
`docs/project/PROJECT.md`. Keep it to a few lines; state the assumption behind
each number so it can be revisited.

## 3. Propose the foundation

Recommend one simplest viable foundation (stack, hosting, database, auth,
storage, background work) that meets the profile with headroom for ~10x, plus at
most one alternative. Use [design trade-offs](design-tradeoffs.md). Prefer
managed services that remove operational work the owner cannot do themselves,
unless cost or lock-in outweighs it.

## 4. Cover what the owner would not know to ask

Check and briefly address each, marking not applicable where true:

- Sign-in, roles, and who can see or change what, enforced on the server per
  the [security baseline](../../engineering-review/references/security-baseline.md)
  (choose a proven auth provider; design tenant isolation now)
- Backups and restore; what data loss is tolerable
- Personal data, privacy, and any compliance obligations
- Cost at launch and at 10x, plus spending alerts
- Error monitoring and uptime alerts that reach a human
- Separate test and production environments; safe deploy and rollback
- Abuse: rate limits, spam, file-upload limits
- The first likely bottleneck and the signal that it is approaching
- Delivery pipeline: code hosted in the owner's account; automated checks
  (tests, lint, build, security audit) on every change; a private preview
  deployment for each change so the owner can try it; production deploys only
  after owner approval
- Data traps that apply: time zones and "business day" boundaries that cross
  midnight, dates and recurring schedules, money stored in whole minor units
  (cents) with explicit rounding, taxes by location, currencies, languages and
  formats, names and addresses that do not fit one country's shape
- Usage conditions: device types and sizes, offline or poor-connection
  behavior, connected hardware, accessibility
- The essentials from each matching [product type](product-types.md), marked
  MVP, later, or not applicable

Then record every account and paid service in `docs/project/SERVICES.md` with
the owner as account owner, run the [compliance](../../engineering-review/references/compliance.md)
check for launch obligations, and plan the runbook via the `operations` skill
before launch.

## 5. Present for decision

Explain the recommendation in terms of product consequence: what it costs per
month, how fast it gets built, what breaks first as it grows, and what is hard
to change later. Ask the owner to approve consequential choices (paid services,
irreversible data or vendor choices). Record approved choices as ADRs with a
concrete "revisit when" trigger (for example, "over 5,000 daily users" or
"hosting cost above $X/month").
