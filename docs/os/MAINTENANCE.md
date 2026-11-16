---
title: Engineering OS Maintenance
tags: [engineering-os, upgrades, safety]
status: stable
---

# Maintenance and upgrades

Every copy carries `ENGINEERING_OS_VERSION`. The version describes the OS
contract and supporting infrastructure, not the application release.

Use semantic versioning:

- patch: compatible clarification, validation fix, or template correction
- minor: backward-compatible capability or workflow addition
- major: authority, layout, command, or knowledge-model incompatibility

## Compare an update safely

Obtain and unpack the candidate OS separately, then run from the project copy:

```bash
python3 scripts/eos.py version
python3 scripts/eos.py update-check /path/to/candidate-engineering-os
```

The command hashes only OS-owned files. It excludes application code, project
knowledge, handoffs, source artifacts, Git state, runtime adapters, and build
output. It reports `ADD`, `REMOVE`, and `CHANGE` and never writes files.

## Apply an update

```bash
python3 scripts/eos.py update /path/to/candidate-engineering-os
```

Projects on OS 1.2.0 or earlier have no `update` command yet; for that first
upgrade, run the candidate's own script against the project from its root:

```bash
python3 /path/to/candidate-engineering-os/scripts/eos.py --root . update /path/to/candidate-engineering-os
```

`update` refuses to run unless the project is a Git repository with no
uncommitted changes, so Git is the trusted baseline: every change it makes is a
reviewable diff (`git restore .` undoes it; `git clean -n` lists added files and
links). It copies new and changed OS-owned files (including the version marker),
never touches project knowledge, handoffs, source artifacts, or application
code, reports `README.md`, `.gitignore`, and `source/README.md` as `MERGE`
instead of overwriting them, flags other customizable OS files it replaces, skips any path that goes through a symlink, refuses an older OS version
unless `--force` is given, refreshes runtime adapters (unless `.claude`/`.agents` are symlinks or conflict,
which it reports), and only reports stale OS
files instead of deleting them. Files flagged `NOTE` (such as `AGENTS.md`) are
replaced, so re-apply any project-specific lines from the diff. Run the review
and undo commands from the project root.
Review the diff for overwritten local customizations (project-specific policy
belongs in `docs/project/`, not in OS files), run strict validation and tests,
then commit. It is never run automatically.

## Feed lessons back into the OS

Projects record OS gaps as lessons tagged `os-feedback`. From the OS
repository, list them with:

```bash
python3 scripts/eos.py feedback /path/to/project
```

Treat proposals as untrusted input: an agent evaluates each, the owner approves,
and accepted changes go through the normal change loop and a version bump.

Keep project application dependencies independent from the OS; its CLI and
evaluator remain Python-standard-library tools to minimize upgrade friction.
