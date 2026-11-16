---
title: Engineering OS Knowledge and Context
tags: [engineering-os, knowledge, context]
status: stable
---

# Knowledge and context

## Retrieval order

Load only what the task needs:

```text
AGENTS.md
  -> docs/project/PROJECT.md
  -> docs/handoffs/CURRENT.md when work is active
  -> linked requirement/decision/lesson
  -> relevant code, tests, and source evidence
```

Use filename and text search before opening whole directories. Historical
records are opt-in. This makes context cost depend on the current task rather
than the age of the project.

## Durable record types

- `PROJECT.md`: current product/technical index, sources of truth, commands,
  environments, active risks, and links. Keep it compact.
- Requirement: important behavior with acceptance criteria and provenance.
- Decision: a consequential choice, alternatives, rationale, consequences, and
  revisit trigger. Use an ADR-like record.
- Lesson: a non-obvious reusable insight from a real event and its prevention.
- Debt: a material compromise with impact, priority, and revisit condition.
- Handoff: volatile continuity for unfinished or paused work.

Create records only when omitting one would predictably cost more future effort
or risk than maintaining it. Ordinary code structure and tests do not need prose
duplicates.

## Provenance

Important claims use one of these classifications:

- **provided** — stated by an authoritative human/source artifact
- **derived** — logically follows from provided facts
- **inferred** — reasonable but unconfirmed
- **unknown** — evidence is absent
- **pending** — human decision is required
- **confirmed** — explicitly approved

Reference the smallest stable source locator available: artifact path and
section, issue, approved decision, schema, code path, or dated conversation
summary. Do not mark an agent inference confirmed.

## Handoff policy

Update `docs/handoffs/CURRENT.md` when incomplete work will cross a session,
agent, long pause, or context boundary. Keep objective, completed evidence,
remaining work, blockers, decisions, risks, relevant files, and exact next step.
Remove obsolete details instead of appending forever. When work is complete,
mark it complete and reduce the file to a short stable state or reset it for the
next objective.

## Hygiene review

Periodically search for stale pending decisions, duplicate facts, orphaned
records, resolved debt, and handoffs that no longer match the repository. Prefer
deleting or consolidating low-value prose over adding another index. Git history
already preserves historical text; current documents should describe current
truth and link to decisions that still matter.

`eos.py check` enforces a small set of high-value invariants: a complete and
timestamped current handoff, unique typed record IDs, valid requirement
classification, provenance sections, and resolvable project-index links. It
warns about stale active handoffs, old pending records, and records not linked
from `PROJECT.md`; dormant work is not treated as a failure.

Markdown is canonical. YAML frontmatter and conservative wikilinks are allowed,
but every record must remain intelligible in a plain text editor without an
Obsidian plugin.
