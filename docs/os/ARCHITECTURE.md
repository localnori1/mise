---
title: Engineering OS Architecture
tags: [engineering-os, architecture]
status: stable
---

# Architecture

## Purpose

Engineering OS is a repository protocol, not an autonomous runtime. It improves
an agent's decisions using durable context and deterministic checks while leaving
execution, permissions, sandboxing, and model capabilities to the host platform.

```text
Human request
    |
AGENTS.md                 always-loaded authority and engineering contract
    |
Matching SKILL.md         task workflow, loaded only when relevant
    |
Relevant project records requirements, decisions, handoff, code
    |
Agent runtime             tools, sandbox, approvals, model
    |
Repository evidence       implementation, tests, validation, review
```

## Layers

1. **Universal contract** — `AGENTS.md` contains only rules that affect almost
   every engineering task: authority, evidence, implementation quality, safety,
   verification, Git, and knowledge hygiene.
2. **Task capabilities** — `skills/` follows the open Agent Skills format.
   Metadata supports cheap discovery; bodies and focused references load on
   demand.
3. **Project knowledge** — `docs/project/PROJECT.md` is a compact index, not a
   second specification. It points to only the records a task needs.
4. **Evidence** — code, executable configuration, tests, source artifacts, and
   approved decisions provide the facts against which claims are verified.
5. **Mechanics** — `scripts/eos.py` creates instances and adapters, validates
   invariants, detects likely secrets, compares OS versions without writing,
   reports state, and packages the template. `scripts/eval_os.py` scores the
   runtime-neutral behavior contract in `evals/`.
6. **Host controls** — Codex/Claude permissions, CI protection, branch rules,
   deployment approvals, secret managers, and production access enforce
   boundaries that prose cannot enforce.

## Why eight skills

The specification listed nine specializations and seven workflows. Most share
the same inspection, impact, verification, and review loop. Eight task-oriented
entry points keep routing clear without loading duplicate rules:

- initialization
- product discovery
- UI engineering and design-system governance
- engineering change
- engineering review, with specialized references
- system design (complexity, capacity, scalability, reliability, trade-offs)
- operations (incidents, launch readiness, health checks)
- context management

Release remains a review mode because it validates an already prepared change;
it does not grant deployment authority. UI is a first-class skill because its
foundation, implementation, visual verification, responsive behavior, and
accessibility form a distinct workflow and routing surface. Architecture,
security, testing, and release remain focused engineering-review references.

## Extension rules

Add a new skill only when it has a distinct trigger and enough non-obvious,
repeated procedure to justify context and maintenance. Add a script when
determinism or repetition materially improves reliability. Add a project record
when it will change future decisions. Prefer extending a focused reference over
duplicating the universal contract.

No vector database, MCP server, document generator, or hosted memory service is
part of the core. Add one only after repository search and plain Markdown cease
to meet demonstrated retrieval or collaboration needs.
