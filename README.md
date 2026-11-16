# Engineering OS

A repository-native operating contract for using capable coding agents as
senior engineering partners. It is Markdown-first, Obsidian-compatible without
requiring Obsidian, and portable across Codex, Claude Code, and agents that can
read repository instructions.

The system is deliberately small: one universal contract, eight progressively
loaded skills, a layered knowledge model, reusable templates, and a dependency-
free validation/bootstrap CLI.

## Start a project

Requires Python 3.9 or newer.

```bash
python3 scripts/eos.py new ../my-project --name "My Project"
cd ../my-project
python3 scripts/eos.py init --name "My Project"
python3 scripts/eos.py check
```

`new` copies a clean Engineering OS instance without build output, Git history,
or project state. `init` creates the minimum durable project state, attempts to
initialize Git when requested and possible, and creates runtime skill adapters.
Place original requirements and research in `source/`, then tell the agent:

> Initialize this project from the artifacts in `source/`.

The agent will use the `project-initialization` skill, create only justified
knowledge artifacts, assess readiness, and present product decisions for sign-
off before implementation.

For an existing repository, copy this template into the repository root (or use
`new` and then place the code in the resulting directory), run `init`, and ask
the agent to initialize the project. Review conflicts with existing instructions
instead of overwriting them.

## Daily use

- Ask normally: “brainstorm…”, “build…”, “fix…”, “establish the UI system…”,
  “review the UI…”, “review security…”, or “prepare a handoff.” Skill
  descriptions route the task-specific guidance.
- Non-trivial work runs as planner -> implementer -> independent reviewer.
  Roles are model-neutral; `docs/os/PORTABILITY.md` maps them per runtime
  (Claude Code ships `implementer` and `reviewer` subagents).
- `AGENTS.md` stays short enough to load on every task. Detailed review and
  workflow guidance loads only when needed.
- `docs/project/PROJECT.md` is the compact project index.
- `docs/handoffs/CURRENT.md` is working continuity, not a conversation log.
- Requirements, decisions, lessons, and debt are individual records created only
  when their future value exceeds their maintenance cost.

Useful commands:

```bash
python3 scripts/eos.py status
python3 scripts/eos.py version
python3 scripts/eos.py check --strict
python3 scripts/eos.py adapters
python3 scripts/eos.py hooks install
python3 scripts/eos.py update-check /path/to/newer-engineering-os
python3 scripts/eos.py update /path/to/newer-engineering-os
python3 scripts/eos.py feedback /path/to/project
python3 scripts/eval_os.py --results evals/fixtures/reference-results.json
python3 scripts/eos.py package dist/engineering-os.zip
```

The optional hook refuses obvious secret files and malformed OS state before a
commit. It does not replace repository tests, platform permissions, CI, or human
review.

## Layout

```text
AGENTS.md                 universal contract
CLAUDE.md                 thin Claude adapter
skills/                   canonical Agent Skills
docs/os/                  stable OS design and operating model
docs/project/             project-specific index (created by init)
docs/handoffs/            current continuity (created by init)
docs/{requirements,...}/  on-demand durable records
source/                    human-provided source artifacts
templates/                 on-demand knowledge templates
scripts/eos.py             bootstrap, adapters, validation, status, packaging
scripts/eval_os.py        portable behavioral contract scorer
evals/                    cross-runtime behavior cases and fixtures
tests/                     CLI behavior tests
```

Read [Architecture](docs/os/ARCHITECTURE.md), [Operating model](docs/os/OPERATING-MODEL.md),
[Knowledge and context](docs/os/KNOWLEDGE.md), and [Portability](docs/os/PORTABILITY.md)
for the maintained design.

Use [Runtime acceptance](docs/os/ACCEPTANCE.md) to test actual Codex/Claude
behavior and [Maintenance](docs/os/MAINTENANCE.md) to compare copied OS versions
without overwriting project state.

## Standards reused

This template adopts the [AGENTS.md open format](https://agents.md/), the
[Agent Skills specification](https://agentskills.io/specification), lightweight
Architecture Decision Records, risk-based verification, and repository-native
Markdown. The rationale and evaluated alternatives are recorded in
[Foundations](docs/os/FOUNDATIONS.md).
