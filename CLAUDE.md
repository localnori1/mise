@AGENTS.md

# Claude Code adapter

The canonical skills are in `skills/`. Run `python3 scripts/eos.py adapters` once
if `.claude/skills` is absent. Claude-specific permissions remain external to
this portable contract.

Work roles (see "Work roles" in `AGENTS.md`): plan in the main session on Opus,
delegate implementation of the approved plan to the `implementer` subagent, then
send the acceptance criteria and changed files to the `reviewer` subagent. On
`VERDICT: FIX REQUIRED`, send the in-scope findings back to `implementer` and
start a new `reviewer` run, following the review-fix loop in `AGENTS.md`.
A Stop hook (`.claude/settings.json`) sends you back to run the reviewer if
non-trivial code changed without a verdict; heed it rather than working around it. The
subagents are exposed at `.claude/agents` by the same `adapters` command.
