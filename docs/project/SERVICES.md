---
title: Services and Accounts
tags: [project, operations]
status: active
---

# Services and accounts

Every account, domain, and paid service the product depends on. The product
owner must own each account (their email or organization), hold admin access,
and be able to cancel or move it. Agents and contractors get delegated access,
never sole ownership. Never record secret values here, only where they live.

| Service | Purpose | Account owner | Plan and monthly cost | Renewal/billing date | Secrets location (name only) | Exit or backup path |
| --- | --- | --- | --- | --- | --- | --- |
| Cloudflare (Workers, Workers AI; later D1, Cron) | Hosting, AI models, database | Product owner | Workers Paid, $5/month; Workers AI beyond 10,000 neurons/day at $0.011 per 1,000 | Renews 2026-12-15 | `wrangler login` on owner's machine; secret `IP_HASH_SALT` to set before deploy (`wrangler secret put IP_HASH_SALT`) | Code is portable Workers/TypeScript; export D1 with `wrangler d1 export` |
| Cloudflare AI Gateway `mise` (Unified Billing) | Claude Haiku 5.5 interviewer/setup, Opus 5.5 documents | Product owner | Prepaid credits ($10 loaded 2026-11-16, 5% fee); spend limit $5/month; logs off | Prepaid, no renewal | None (Cloudflare-managed keys) | Switch models via `MODEL_*` vars in `wrangler.jsonc` |

## Totals

- Estimated monthly cost: $5 plus AI usage beyond the daily free allowance (evals: cents)
- Spending alert configured: Pending (recommend a Cloudflare billing notification)
- Last reviewed: 2026-11-16
