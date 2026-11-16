---
title: Engineering OS Portability
tags: [engineering-os, agents, portability]
status: stable
---

# Portability

## Canonical files

- `AGENTS.md` is the universal instruction contract.
- `skills/` is the canonical skill source.
- `docs/` and `source/` are ordinary Markdown and files.
- `scripts/eos.py` uses only the Python standard library.

Generated adapter paths are links to canonical skills, never independent
knowledge bases. `python3 scripts/eos.py adapters` creates or verifies them and
refuses to overwrite a conflicting path.

## Codex

Codex reads `AGENTS.md` natively. The bootstrap exposes canonical skills at
`.agents/skills` where the host supports repository skills. `agents/openai.yaml`
inside each skill is optional UI metadata; it contains no governing rules.
Sandbox, network, and approval policy are configured in Codex, not in this repo.

## Claude Code

Claude reads `CLAUDE.md`, whose only governing content is `@AGENTS.md`. The
bootstrap exposes the same skills at `.claude/skills`. Claude settings,
permissions, hooks, and local auto-memory are complementary host features, not
portable sources of truth.

## Work roles by runtime

`AGENTS.md` defines planner, implementer, and reviewer roles without naming
models. Each runtime maps them:

| Runtime | Planner | Implementer | Reviewer |
| --- | --- | --- | --- |
| Claude Code | Main session on Opus (`/model opus`, or `/model opusplan` for Opus while planning and Sonnet while executing) | `implementer` subagent (`model: sonnet`) | `reviewer` subagent (`model: opus`, fresh context, read-only tools) |
| Codex and others | Session using the strongest available model | Separate session or profile using a faster model, given the written plan | Fresh session using the strongest available model, given acceptance criteria and the diff |

The Claude subagents live in `runtimes/claude/agents/` and are exposed at
`.claude/agents` by `eos.py adapters`. They hold role mechanics only; governing
rules stay in `AGENTS.md`. If a repository already has `.claude/agents`, the
adapter leaves it untouched and reports that the files need manual merging.
The review-fix loop in `AGENTS.md` runs the same way everywhere; in runtimes
without subagents, each review round is a fresh session.
Claude Code also gets an optional review gate: `runtimes/claude/settings.json`
(exposed at `.claude/settings.json`, skipped if the project already has one)
runs `runtimes/claude/hooks/review_gate.py` when a turn ends. If 40 or more
lines of uncommitted non-documentation code changed and no reviewer verdict
followed the latest code edit (documentation edits do not reset it), it sends
the agent back to run the reviewer once. It only sees edits made through edit
tools or the `implementer`, not shell commands. It
fails open, never blocks twice in a row, and is disabled with
`EOS_REVIEW_GATE=off` (`EOS_REVIEW_MIN_LINES` adjusts the threshold).
When a runtime cannot pick models per role, keep the role separation anyway:
plan, implement, and review in distinct steps with a fresh review context.

## Other agents

Agents that support `AGENTS.md` and Agent Skills can use the files directly.
Others should be configured to load `AGENTS.md`; task workflows remain readable
as ordinary Markdown. If a runtime cannot discover skills, the universal
contract tells it where they live and the user can name the appropriate skill.

## Capability registry

Do not maintain a static list that will immediately drift. At project
initialization and before capability-dependent work, record only material facts
in `PROJECT.md`:

| Capability | Available evidence | Permission/approval | Limits |
| --- | --- | --- | --- |
| Example: browser | Runtime tool list | Read-only | No production login |

Runtime tool discovery is authoritative for the current session. Project
knowledge records durable environment facts; it must not claim a tool exists on
every platform.

## Adapter limitations

Directory symlinks are the cleanest no-duplication bridge on macOS/Linux and in
Git-aware Windows environments. When symlinks are unavailable, `adapters`
creates directory junctions on Windows where possible; if the host forbids both,
it reports the exact manual configuration needed rather than copying skills and
allowing drift.

Runtime behavior is verified through the shared, host-neutral protocol in
[Runtime acceptance](ACCEPTANCE.md). Version comparison and copied-instance
upgrade policy are defined in [Maintenance and upgrades](MAINTENANCE.md).
