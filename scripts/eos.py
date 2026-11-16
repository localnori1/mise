#!/usr/bin/env python3
"""Engineering OS bootstrap and integrity checks (Python 3.9+, stdlib only)."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import os
import re
import shutil
import subprocess
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Sequence


ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    ".git",
    ".engineering-os",
    ".pytest_cache",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "node_modules",
}
REQUIRED = (
    "ENGINEERING_OS_VERSION",
    "AGENTS.md",
    "CLAUDE.md",
    "README.md",
    "docs/os/ARCHITECTURE.md",
    "docs/os/KNOWLEDGE.md",
    "docs/os/OPERATING-MODEL.md",
    "docs/os/PORTABILITY.md",
    "docs/os/ACCEPTANCE.md",
    "docs/os/MAINTENANCE.md",
    "scripts/eos.py",
    "scripts/eval_os.py",
    "evals/cases.json",
    "templates/project.md",
    "templates/handoff.md",
)
OS_TOP_LEVEL_FILES = {
    ".gitignore",
    "AGENTS.md",
    "CLAUDE.md",
    "ENGINEERING_OS_VERSION",
    "README.md",
}
OS_TOP_LEVEL_DIRS = {".github", ".githooks", "evals", "runtimes", "scripts", "skills", "templates", "tests"}
SEMVER_RE = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$")
REQUIRED_SKILLS = {
    "project-initialization",
    "product-discovery",
    "ui-engineering",
    "engineering-change",
    "engineering-review",
    "system-design",
    "operations",
    "context-management",
}
SECRET_NAMES = re.compile(
    r"(^|/)(\.env($|\.)|id_(rsa|dsa|ecdsa|ed25519)$|.*\.(pem|key|p12|pfx)$)",
    re.IGNORECASE,
)
SECRET_CONTENT = (
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b")),
    ("OpenAI-style key", re.compile(r"\bsk-[A-Za-z0-9_-]{32,}\b")),
    ("Stripe secret key", re.compile(r"\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Slack token", re.compile(r"\bxox[abposr]-[A-Za-z0-9-]{10,}\b")),
    ("database URL with password", re.compile(r"\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?)://[^\s:/@]+:[^\s@/]{3,}@(?!localhost|127\.0\.0\.1)")),
)
LINK_RE = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
HANDOFF_HEADINGS = (
    "## Objective",
    "## Completed",
    "## In progress",
    "## Blockers and decisions needed",
    "## Important decisions and risks",
    "## Relevant files",
    "## Exact next step",
)
KNOWLEDGE_RULES = {
    "requirements": ("REQ-", "## Provenance"),
    "decisions": ("ADR-", "## Provenance and authority"),
    "lessons": ("LESSON-", "## Evidence"),
    "debt": ("DEBT-", "## Provenance"),
}


@dataclass(frozen=True)
class Finding:
    level: str
    message: str


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def os_version(root: Path) -> str:
    path = root / "ENGINEERING_OS_VERSION"
    if not path.is_file() or path.is_symlink():
        raise RuntimeError(f"Engineering OS version marker is missing: {path}")
    version = path.read_text(encoding="utf-8").strip()
    if not SEMVER_RE.fullmatch(version):
        raise RuntimeError(f"Invalid Engineering OS version: {version!r}")
    return version


def render(template: Path, destination: Path, values: dict) -> bool:
    if destination.exists():
        return False
    text = template.read_text(encoding="utf-8")
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(text, encoding="utf-8")
    return True


def run(command: Sequence[str], cwd: Path, check: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(
        list(command), cwd=str(cwd), text=True, capture_output=True, check=check
    )


def iter_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            continue
        if path.is_file() and not path.is_symlink():
            yield path


def same_target(link: Path, target: Path) -> bool:
    try:
        return link.resolve(strict=True) == target.resolve(strict=True)
    except (FileNotFoundError, OSError):
        return False


def create_adapter(
    root: Path, parent_name: str, canonical_rel: str = "skills", required: bool = True
) -> str:
    canonical = root / canonical_rel
    parent = root / parent_name
    adapter = parent / Path(canonical_rel).name
    if adapter.exists() or adapter.is_symlink():
        if same_target(adapter, canonical):
            return f"verified {adapter.relative_to(root)}"
        if not required:
            # Optional runtime extras must never block adoption of a repository
            # that already has its own configuration at that path.
            return f"skipped {adapter.relative_to(root)}: existing path kept; merge {canonical_rel} manually"
        raise RuntimeError(
            f"Refusing to replace conflicting adapter: {adapter}. "
            "Move it explicitly, then rerun adapters."
        )
    parent.mkdir(parents=True, exist_ok=True)
    relative_target = os.path.relpath(str(canonical), str(parent))
    try:
        adapter.symlink_to(relative_target, target_is_directory=canonical.is_dir())
    except OSError as exc:
        if not required:
            return f"skipped {adapter.relative_to(root)}: {exc}; copy {canonical_rel} manually"
        if os.name != "nt":
            raise RuntimeError(
                f"Could not create {adapter}: {exc}. Configure the runtime to use {canonical}."
            ) from exc
        result = run(
            ["cmd", "/c", "mklink", "/J", str(adapter), str(canonical)], root
        )
        if result.returncode != 0:
            raise RuntimeError(
                f"Could not create Windows junction {adapter}: {result.stderr.strip()}"
            ) from exc
    return f"created {adapter.relative_to(root)} -> {relative_target}"


def adapters(root: Path) -> List[str]:
    if not (root / "skills").is_dir():
        raise RuntimeError(f"Canonical skills directory is missing: {root / 'skills'}")
    actions = [create_adapter(root, ".agents"), create_adapter(root, ".claude")]
    if (root / "runtimes/claude/agents").is_dir():
        actions.append(create_adapter(root, ".claude", "runtimes/claude/agents", required=False))
    if (root / "runtimes/claude/settings.json").is_file():
        actions.append(create_adapter(root, ".claude", "runtimes/claude/settings.json", required=False))
    return actions


def initialize(root: Path, name: str, no_git: bool) -> List[str]:
    root.mkdir(parents=True, exist_ok=True)
    values = {
        "PROJECT_NAME": name,
        "DATE": dt.date.today().isoformat(),
        "TIMESTAMP": utc_now(),
        "OS_VERSION": os_version(root),
    }
    actions: List[str] = []
    # Adapter conflicts are the most likely adoption failure. Detect them before
    # creating project-state documents so initialization fails cleanly.
    actions.extend(adapters(root))
    for directory in (
        "docs/project",
        "docs/handoffs",
        "docs/requirements",
        "docs/decisions",
        "docs/lessons",
        "docs/debt",
        "source",
    ):
        (root / directory).mkdir(parents=True, exist_ok=True)
    if render(ROOT / "templates/project.md", root / "docs/project/PROJECT.md", values):
        actions.append("created docs/project/PROJECT.md")
    if render(ROOT / "templates/handoff.md", root / "docs/handoffs/CURRENT.md", values):
        actions.append("created docs/handoffs/CURRENT.md")
    # Account ownership matters from day one, so the registry always exists.
    if render(ROOT / "templates/services.md", root / "docs/project/SERVICES.md", values):
        actions.append("created docs/project/SERVICES.md")
    if not no_git and not (root / ".git").exists():
        result = run(["git", "init", "-b", "main"], root)
        if result.returncode == 0:
            actions.append("initialized Git repository on main (no commit created)")
        else:
            actions.append(f"warning: Git initialization failed: {result.stderr.strip()}")
    return actions


def copy_template(target: Path) -> None:
    resolved_target = target.resolve()
    if resolved_target == ROOT.resolve() or ROOT.resolve() in resolved_target.parents:
        raise RuntimeError("Target must be outside the template root.")
    if target.exists() and any(target.iterdir()):
        raise RuntimeError(f"Target must be absent or empty: {target}")
    target.mkdir(parents=True, exist_ok=True)
    for source in ROOT.iterdir():
        if source.name in SKIP_DIRS or source.name in {".agents", ".claude", "docs"}:
            continue
        destination = target / source.name
        if source.is_dir() and not source.is_symlink():
            shutil.copytree(source, destination, symlinks=True)
        elif source.is_file():
            shutil.copy2(source, destination)
    shutil.copytree(ROOT / "docs/os", target / "docs/os")


def os_owned_files(root: Path) -> List[Path]:
    """Return portable OS files; project state and application code are never included."""
    files: List[Path] = []
    for name in sorted(OS_TOP_LEVEL_FILES):
        path = root / name
        if path.is_file() and not path.is_symlink():
            files.append(path)
    for name in sorted(OS_TOP_LEVEL_DIRS):
        directory = root / name
        if directory.is_dir():
            files.extend(iter_files(directory))
    docs_os = root / "docs/os"
    if docs_os.is_dir():
        files.extend(iter_files(docs_os))
    source_readme = root / "source/README.md"
    if source_readme.is_file():
        files.append(source_readme)
    return sorted(set(files), key=lambda path: path.relative_to(root).as_posix())


def file_digest(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def compare_os(current: Path, candidate: Path) -> List[str]:
    """Compare two OS copies without modifying either one."""
    current_version = os_version(current)
    candidate_version = os_version(candidate)
    current_files = {
        path.relative_to(current).as_posix(): file_digest(path)
        for path in os_owned_files(current)
    }
    candidate_files = {
        path.relative_to(candidate).as_posix(): file_digest(path)
        for path in os_owned_files(candidate)
    }
    lines = [f"Current: {current_version}", f"Candidate: {candidate_version}"]
    for relative in sorted(candidate_files.keys() - current_files.keys()):
        lines.append(f"ADD {relative}")
    for relative in sorted(current_files.keys() - candidate_files.keys()):
        lines.append(f"REMOVE {relative}")
    for relative in sorted(current_files.keys() & candidate_files.keys()):
        if current_files[relative] != candidate_files[relative]:
            lines.append(f"CHANGE {relative}")
    if len(lines) == 2:
        lines.append("No OS-owned file differences.")
    else:
        lines.append("No files were changed. Review and merge differences manually.")
    return lines


def parse_skill(path: Path) -> List[Finding]:
    findings: List[Finding] = []
    text = path.read_text(encoding="utf-8")
    relative = path.relative_to(path.parents[2])
    if "TODO" in text or "[TODO" in text:
        findings.append(Finding("error", f"unfinished scaffold marker in {relative}"))
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        return [Finding("error", f"missing YAML frontmatter in {relative}")]
    fields = {}
    for line in match.group(1).splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip().strip('"').strip("'")
    name = fields.get("name", "")
    description = fields.get("description", "")
    if name != path.parent.name:
        findings.append(
            Finding("error", f"skill name {name!r} does not match directory {path.parent.name!r}")
        )
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        findings.append(Finding("error", f"invalid skill name in {relative}: {name!r}"))
    if not description or len(description) > 1024:
        findings.append(Finding("error", f"invalid skill description in {relative}"))
    if len(text.encode("utf-8")) > 12_000:
        findings.append(Finding("warning", f"large SKILL.md should use references: {relative}"))
    return findings


def parse_frontmatter(text: str) -> dict:
    match = re.match(r"^---\n(.*?)\n---(?:\n|$)", text, re.DOTALL)
    if not match:
        return {}
    fields = {}
    for line in match.group(1).splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip().strip('"').strip("'")
    return fields


def section_body(text: str, heading: str) -> str:
    match = re.search(
        rf"^{re.escape(heading)}\s*$\n(.*?)(?=^##\s|\Z)", text, re.MULTILINE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def parse_timestamp(value: str) -> Optional[dt.datetime]:
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.astimezone(dt.timezone.utc)


def check_handoff(path: Path, strict: bool) -> List[Finding]:
    findings: List[Finding] = []
    text = path.read_text(encoding="utf-8")
    fields = parse_frontmatter(text)
    if not fields:
        findings.append(Finding("error", "CURRENT.md is missing YAML frontmatter"))
    if fields.get("status") not in {"ready", "in-progress", "complete", "blocked"}:
        findings.append(Finding("error", "CURRENT.md has an invalid or missing status"))
    updated = parse_timestamp(fields.get("updated", ""))
    if updated is None:
        findings.append(Finding("error", "CURRENT.md has an invalid or missing updated timestamp"))
    elif fields.get("status") in {"ready", "in-progress"}:
        age = dt.datetime.now(dt.timezone.utc) - updated
        if age < -dt.timedelta(minutes=5):
            findings.append(Finding("error", "CURRENT.md updated timestamp is in the future"))
        elif age > dt.timedelta(days=14):
            findings.append(Finding("warning", f"CURRENT.md may be stale ({age.days} days old)"))
    for heading in HANDOFF_HEADINGS:
        if not section_body(text, heading):
            findings.append(Finding("error", f"handoff missing or empty heading: {heading}"))
    if re.search(r"\{\{[A-Z0-9_]+\}\}", text):
        findings.append(Finding("error", "CURRENT.md contains an unrendered placeholder"))
    if len(text.encode("utf-8")) > 8_000:
        findings.append(Finding("error" if strict else "warning", "CURRENT.md exceeds 8 KB context budget"))
    return findings


def project_link_targets(project_path: Path) -> set:
    if not project_path.is_file():
        return set()
    targets = set()
    text = project_path.read_text(encoding="utf-8")
    for raw_target in LINK_RE.findall(text):
        target = raw_target.strip().split(" ", 1)[0].strip("<>").split("#", 1)[0]
        if target and not target.startswith(("http://", "https://", "mailto:")):
            targets.add((project_path.parent / target).resolve())
    return targets


def check_knowledge(root: Path, strict: bool) -> List[Finding]:
    findings: List[Finding] = []
    seen_ids = {}
    linked = project_link_targets(root / "docs/project/PROJECT.md")
    now = dt.date.today()
    for folder, (prefix, provenance_heading) in KNOWLEDGE_RULES.items():
        directory = root / "docs" / folder
        if not directory.is_dir():
            continue
        for path in sorted(directory.glob("*.md")):
            relative = path.relative_to(root)
            text = path.read_text(encoding="utf-8")
            fields = parse_frontmatter(text)
            record_id = fields.get("id", "")
            if not fields:
                findings.append(Finding("error", f"knowledge record lacks frontmatter: {relative}"))
                continue
            if not record_id.startswith(prefix):
                findings.append(Finding("error", f"invalid or missing id in {relative}; expected {prefix}*"))
            elif record_id in seen_ids:
                findings.append(
                    Finding("error", f"duplicate knowledge id {record_id}: {seen_ids[record_id]} and {relative}")
                )
            else:
                seen_ids[record_id] = relative
            if not fields.get("status"):
                findings.append(Finding("error", f"knowledge record lacks status: {relative}"))
            if not section_body(text, provenance_heading):
                findings.append(Finding("error" if strict else "warning", f"knowledge record lacks provenance section: {relative}"))
            if folder == "requirements" and fields.get("classification") not in {
                "provided", "derived", "inferred", "unknown", "pending", "confirmed"
            }:
                findings.append(Finding("error", f"invalid requirement classification in {relative}"))
            date_value = fields.get("date") or fields.get("last_reviewed")
            if fields.get("status") in {"pending", "proposed"} and date_value:
                try:
                    age_days = (now - dt.date.fromisoformat(date_value)).days
                    if age_days > 90:
                        findings.append(Finding("warning", f"pending record may be stale ({age_days} days): {relative}"))
                except ValueError:
                    findings.append(Finding("error", f"invalid record date in {relative}: {date_value!r}"))
            if (root / "docs/project/PROJECT.md").is_file() and path.resolve() not in linked:
                findings.append(Finding("warning", f"durable record is not linked from PROJECT.md: {relative}"))
    return findings


def check_links(root: Path) -> List[Finding]:
    findings: List[Finding] = []
    for path in iter_files(root):
        if path.suffix.lower() != ".md":
            continue
        if "templates" in path.relative_to(root).parts:
            # Template links are resolved after rendering into their destination.
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for raw_target in LINK_RE.findall(text):
            target = raw_target.strip().split(" ", 1)[0].strip("<>")
            if not target or target.startswith(("#", "http://", "https://", "mailto:")):
                continue
            clean = target.split("#", 1)[0]
            if clean and not (path.parent / clean).resolve().exists():
                findings.append(
                    Finding(
                        "error",
                        f"broken relative link in {path.relative_to(root)}: {target}",
                    )
                )
    return findings


def check_secrets(root: Path) -> List[Finding]:
    findings: List[Finding] = []
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            continue
        if not path.is_file() and not path.is_symlink():
            continue
        relative = path.relative_to(root).as_posix()
        if SECRET_NAMES.search(relative) and path.name not in {".env.example", ".env.sample"}:
            findings.append(Finding("error", f"secret-like filename is tracked/present: {relative}"))
        if path.is_symlink():
            continue
        try:
            if path.stat().st_size > 2_000_000:
                continue
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for label, pattern in SECRET_CONTENT:
            if pattern.search(text):
                findings.append(Finding("error", f"possible {label} in {relative}"))
    return findings


def check_repository(root: Path, strict: bool) -> List[Finding]:
    findings: List[Finding] = []
    for relative in REQUIRED:
        if not (root / relative).exists():
            findings.append(Finding("error", f"missing required path: {relative}"))
    version_path = root / "ENGINEERING_OS_VERSION"
    if version_path.exists():
        try:
            os_version(root)
        except RuntimeError as exc:
            findings.append(Finding("error", str(exc)))
    claude = root / "CLAUDE.md"
    if claude.exists():
        text = claude.read_text(encoding="utf-8")
        if "@AGENTS.md" not in text:
            findings.append(Finding("error", "CLAUDE.md must import canonical AGENTS.md"))
        if len(text.encode("utf-8")) > 2_000:
            findings.append(Finding("warning", "CLAUDE.md adapter exceeds 2 KB"))
    skills_dir = root / "skills"
    names = {p.name for p in skills_dir.iterdir() if p.is_dir()} if skills_dir.is_dir() else set()
    missing = REQUIRED_SKILLS - names
    if missing:
        findings.append(Finding("error", f"missing canonical skills: {', '.join(sorted(missing))}"))
    if skills_dir.is_dir():
        for skill_file in sorted(skills_dir.glob("*/SKILL.md")):
            findings.extend(parse_skill(skill_file))
    for adapter in (root / ".agents/skills", root / ".claude/skills"):
        if adapter.exists() or adapter.is_symlink():
            if not same_target(adapter, skills_dir):
                findings.append(Finding("error", f"adapter does not target canonical skills: {adapter.relative_to(root)}"))
        else:
            level = "error" if strict and (root / "docs/project/PROJECT.md").exists() else "warning"
            findings.append(Finding(level, f"runtime adapter absent: {adapter.relative_to(root)}; run adapters"))
    handoff = root / "docs/handoffs/CURRENT.md"
    if handoff.exists():
        findings.extend(check_handoff(handoff, strict))
    findings.extend(check_knowledge(root, strict))
    findings.extend(check_links(root))
    findings.extend(check_secrets(root))
    return findings


def git_summary(root: Path) -> List[str]:
    if not (root / ".git").exists():
        return ["Git: not initialized"]
    branch = run(["git", "branch", "--show-current"], root)
    status = run(["git", "status", "--short"], root)
    lines = [f"Git branch: {branch.stdout.strip() or '(unborn/detached)'}"]
    changes = [line for line in status.stdout.splitlines() if line]
    lines.append(f"Working tree entries: {len(changes)}")
    return lines


def status(root: Path) -> List[str]:
    lines = [f"Engineering OS root: {root}", f"Engineering OS version: {os_version(root)}"]
    lines.extend(git_summary(root))
    for folder in ("requirements", "decisions", "lessons", "debt"):
        directory = root / "docs" / folder
        count = len(list(directory.glob("*.md"))) if directory.exists() else 0
        lines.append(f"{folder.capitalize()}: {count}")
    handoff = root / "docs/handoffs/CURRENT.md"
    if handoff.exists():
        modified = dt.datetime.fromtimestamp(handoff.stat().st_mtime, dt.timezone.utc)
        lines.append(f"Handoff updated: {modified.replace(microsecond=0).isoformat()}")
    else:
        lines.append("Handoff: not initialized")
    return lines


# Directories that contain only OS files, so a file missing from a newer OS is stale.
PURE_OS_DIRS = ("skills", "templates", "runtimes", "docs/os")
# Files projects legitimately own; an update reports differences but never copies them.
PROJECT_SHARED_FILES = {"README.md", ".gitignore", "source/README.md"}
# OS files a project may have extended; replaced, but flagged for review.
CUSTOMIZABLE_FILES = {"AGENTS.md", "CLAUDE.md", ".githooks/pre-commit", "runtimes/claude/settings.json"}


def version_key(version: str) -> tuple:
    core, _, prerelease = version.partition("-")
    parts = core.split(".")
    if not all(part.isdigit() for part in parts):
        return (0,)
    # Semver: a prerelease (1.3.0-rc.1) sorts before its release (1.3.0).
    return (*(int(part) for part in parts), 0 if prerelease else 1, prerelease)


def within_without_symlinks(root: Path, path: Path) -> bool:
    """True when every existing component from root to path is a real directory/file."""
    current = root
    for part in path.relative_to(root).parts:
        current = current / part
        if current.is_symlink():
            return False
    return True


def apply_update(current: Path, candidate: Path, force: bool = False) -> List[str]:
    """Copy a newer OS's files into a project as a reviewable, revertible Git diff."""
    if current.resolve() == candidate.resolve():
        raise RuntimeError("Candidate is the current copy.")
    if not (candidate / "ENGINEERING_OS_VERSION").is_file() or not (candidate / "AGENTS.md").is_file():
        raise RuntimeError(f"Not an Engineering OS copy: {candidate}")
    # Fail closed: without a working Git baseline nothing could be reviewed or undone.
    toplevel = run(["git", "rev-parse", "--show-toplevel"], current)
    if toplevel.returncode != 0 or Path(toplevel.stdout.strip()).resolve() != current.resolve():
        raise RuntimeError("Updates require a working Git repository at the project root so every change can be reviewed and undone.")
    status_result = run(["git", "status", "--porcelain"], current)
    if status_result.returncode != 0:
        raise RuntimeError(f"Could not read Git status: {status_result.stderr.strip()}")
    if status_result.stdout.strip():
        raise RuntimeError("Commit or stash current changes first so the update is a clean, reviewable diff.")
    old, new = os_version(current), os_version(candidate)
    if version_key(new) < version_key(old) and not force:
        raise RuntimeError(f"Candidate {new} is older than {old}; pass --force to downgrade.")
    lines = [f"Updating {old} -> {new}"]
    shipped = set()
    for source in os_owned_files(candidate):
        relative = source.relative_to(candidate).as_posix()
        shipped.add(relative)
        destination = current / relative
        if not within_without_symlinks(current, destination):
            lines.append(f"SKIP {relative} (symlink in path kept)")
            continue
        if destination.exists() and file_digest(destination) == file_digest(source):
            continue
        if relative in CUSTOMIZABLE_FILES and destination.exists():
            lines.append(f"NOTE {relative} replaced; re-apply any project-specific lines from `git diff`")
        if relative in PROJECT_SHARED_FILES and destination.exists():
            lines.append(f"MERGE {relative} (project-owned; compare with the new OS copy manually)")
            continue
        action = "UPDATE" if destination.exists() else "ADD"
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        lines.append(f"{action} {relative}")
    for path in os_owned_files(current):
        relative = path.relative_to(current).as_posix()
        if relative not in shipped and relative.startswith(PURE_OS_DIRS):
            lines.append(f"STALE {relative} (not in the new OS: removed upstream or your own addition; not deleted)")
    linked_parents = [name for name in (".agents", ".claude") if (current / name).is_symlink()]
    if linked_parents:
        lines.append(f"SKIP adapters ({', '.join(linked_parents)} is a symlink; run `adapters` manually)")
    else:
        try:
            lines.extend(adapters(current))
        except RuntimeError as exc:
            lines.append(f"ADAPTERS not refreshed: {exc}")
    lines.append(f"Review from the project root ({current}): `git diff`, `git status`, `python3 scripts/eos.py check --strict`.")
    lines.append("To undo from the project root: `git restore .`, then `git clean -n` to list added files and links.")
    return lines


def os_feedback(project: Path) -> List[str]:
    """List lessons a project flagged as improvements for the Engineering OS itself."""
    lessons = project / "docs/lessons"
    if not lessons.is_dir():
        raise RuntimeError(f"No docs/lessons in {project}; is this an Engineering OS project?")
    lines: List[str] = []
    for path in sorted(lessons.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        fields = parse_frontmatter(text)
        tags = {tag.strip() for tag in fields.get("tags", "").strip("[]").split(",")}
        if "os-feedback" not in tags:
            continue
        lines.append(f"## {fields.get('id', path.stem)}: {fields.get('title', '')} ({path.relative_to(project)})")
        lines.append(section_body(text, "## Proposed OS change") or "(no proposed change written)")
        lines.append("")
    return lines or ["No OS feedback recorded in this project."]


def install_hooks(root: Path) -> str:
    if not (root / ".git").is_dir():
        raise RuntimeError("Git is not initialized; refusing to configure hooks.")
    result = run(["git", "config", "core.hooksPath", ".githooks"], root)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Could not configure Git hooks")
    return "configured local core.hooksPath=.githooks"


def package(root: Path, destination: Path) -> int:
    destination = destination.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    files = [path for path in os_owned_files(root) if path.resolve() != destination]
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(files):
            archive.write(path, path.relative_to(root).as_posix())
    return len(files)


def print_findings(findings: Sequence[Finding]) -> int:
    for finding in findings:
        print(f"{finding.level.upper()}: {finding.message}")
    errors = sum(f.level == "error" for f in findings)
    warnings = sum(f.level == "warning" for f in findings)
    print(f"Check complete: {errors} error(s), {warnings} warning(s)")
    return 1 if errors else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="eos", description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="Engineering OS project root")
    sub = parser.add_subparsers(dest="command", required=True)
    new = sub.add_parser("new", help="copy a clean template and initialize it")
    new.add_argument("target", type=Path)
    new.add_argument("--name", required=True)
    new.add_argument("--no-git", action="store_true")
    init = sub.add_parser("init", help="initialize minimum project state in this checkout")
    init.add_argument("--name", required=True)
    init.add_argument("--no-git", action="store_true")
    check = sub.add_parser("check", help="validate structure, links, adapters, and likely secrets")
    check.add_argument("--strict", action="store_true")
    sub.add_parser("adapters", help="create/verify Codex and Claude skill adapters")
    sub.add_parser("status", help="show compact project and Git state")
    sub.add_parser("version", help="show the local Engineering OS version")
    update = sub.add_parser("update-check", help="compare with another OS copy; never writes files")
    update.add_argument("candidate", type=Path, help="path to a newer unpacked Engineering OS")
    apply = sub.add_parser("update", help="apply a newer OS copy as a reviewable Git diff")
    apply.add_argument("candidate", type=Path, help="path to a newer unpacked Engineering OS")
    apply.add_argument("--force", action="store_true", help="allow applying an older OS version")
    feedback = sub.add_parser("feedback", help="list a project's lessons flagged for OS improvement")
    feedback.add_argument("project", type=Path, help="path to a project that uses the Engineering OS")
    hooks = sub.add_parser("hooks", help="manage optional repository safeguards")
    hooks.add_argument("action", choices=("install",))
    pack = sub.add_parser("package", help="create a clean ZIP without project state/build output")
    pack.add_argument("destination", type=Path)
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    root = args.root.resolve()
    try:
        if args.command == "new":
            target = args.target.resolve()
            copy_template(target)
            for line in initialize(target, args.name, args.no_git):
                print(line)
            print(f"created Engineering OS project: {target}")
        elif args.command == "init":
            for line in initialize(root, args.name, args.no_git):
                print(line)
        elif args.command == "check":
            return print_findings(check_repository(root, args.strict))
        elif args.command == "adapters":
            for line in adapters(root):
                print(line)
        elif args.command == "status":
            for line in status(root):
                print(line)
        elif args.command == "version":
            print(os_version(root))
        elif args.command == "update-check":
            for line in compare_os(root, args.candidate.resolve()):
                print(line)
        elif args.command == "update":
            for line in apply_update(root, args.candidate.resolve(), args.force):
                print(line)
        elif args.command == "feedback":
            for line in os_feedback(args.project.resolve()):
                print(line)
        elif args.command == "hooks":
            print(install_hooks(root))
        elif args.command == "package":
            count = package(root, args.destination)
            print(f"packaged {count} files at {args.destination.resolve()}")
    except (RuntimeError, OSError, shutil.Error) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
