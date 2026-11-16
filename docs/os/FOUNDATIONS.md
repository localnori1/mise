---
title: Engineering OS Foundations
tags: [engineering-os, research, decisions]
status: stable
---

# Foundations and reused work

Research performed for v1 found that the ecosystem already solves instruction
discovery, portable skills, and staged specification workflows. Engineering OS
adopts those standards rather than defining new formats.

## Adopted

- [AGENTS.md](https://agents.md/) for the cross-agent repository contract and
  nearest-file scoping convention.
- [Agent Skills](https://agentskills.io/specification) for `SKILL.md` metadata,
  task routing, optional references/scripts, and progressive disclosure.
- [Codex AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
  for root-to-working-directory instruction layering.
- [Codex skills guidance](https://learn.chatgpt.com/docs/build-skills) for
  on-demand skill loading and concise discriminating descriptions.
- [Claude Code memory guidance](https://code.claude.com/docs/en/memory) for the
  thin `CLAUDE.md` import, small always-loaded context, and topic details loaded
  on demand.
- [Claude Code skills guidance](https://code.claude.com/docs/en/slash-commands)
  for project skill discovery and the open Agent Skills format.
- ADR-style decisions, requirement provenance, readiness classification,
  verification ladders, and human approval gates from established engineering
  practice.

## Evaluated but not embedded

- [itseffi/agentic-os](https://github.com/itseffi/agentic-os) demonstrates a
  useful `AGENTS.md` + adapter + skills + state pattern. Its personal goals,
  backlog, task, MCP, and evaluation structure targets a broader personal OS and
  would add unrelated surface area here.
- [GitHub Spec Kit](https://github.github.com/spec-kit/) provides a strong
  specification/plan/tasks/implementation pipeline and broad agent adapters.
  Requiring that pipeline for every change conflicts with scale-appropriate
  artifact discipline, so its intent-first and cross-artifact checks are reused
  as optional workflow behavior.
- [BMAD Method](https://docs.bmad-method.org/) provides deep role-based planning
  and many workflows. Its dependency and artifact volume are valuable for some
  large projects but too prescriptive for a minimum portable core.
- Hosted/vector memory and MCP memory services can improve retrieval at scale,
  but introduce infrastructure, trust, privacy, and portability costs before a
  repository demonstrates that search plus layered indexes are insufficient.

## Differentiation

Engineering OS is not another agent runtime or planning framework. It combines
product ownership boundaries, senior engineering judgment, executable safety
checks, risk-based verification, context hygiene, and release authority in a
small repository template that degrades gracefully on less capable agents.
