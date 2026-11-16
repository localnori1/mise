# Incident response

1. **Impact first.** Who is affected, what they cannot do, since when, and
   whether data or money is at risk. Tell the owner in two or three plain
   sentences before deep investigation.
2. **Look for what changed.** Recent deploys or configuration, vendor status
   pages, quotas and free-tier limits, and the non-code causes owners often hit:
   an expired card on a hosting account, domain or certificate expiry, a
   rotated or revoked API key, or a third-party outage.
3. **Stabilize before root cause.** Propose the safest reversible action (roll
   back the last deploy, turn off a feature flag, scale up) with its consequence
   and cost. Act only with approval or a pre-approved runbook action.
4. **Verify recovery** from the user's point of view, not just a green dashboard.
5. **Close out** with a short plain-language note: what happened, who was
   affected, what fixed it, and what prevents a repeat. No blame. Add a
   regression test and update `RUNBOOK.md`.
