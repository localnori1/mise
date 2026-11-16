#!/usr/bin/env python3
"""Claude Code Stop hook: require an independent review after non-trivial code changes.

Blocks the turn from ending when uncommitted code changes exceed a threshold and
no reviewer verdict appears in the transcript after the latest edit. Fails open:
any error, a non-Git folder, or a second stop attempt lets the turn end.
Environment: EOS_REVIEW_GATE=off disables it; EOS_REVIEW_MIN_LINES sets the
threshold (default 40 changed lines outside documentation).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

DOC_SUFFIXES = {".md", ".mdx", ".txt", ".rst"}
EDIT_EVENT = re.compile(
    r'"name"\s*:\s*"(?:Edit|Write|MultiEdit|NotebookEdit)"|"subagent_type"\s*:\s*"implementer"'
)
# A reviewer's returned text starts with the verdict (start of a JSON string or of
# an escaped line). Dispatch prompts and file reads that merely mention the format
# do not count.
VERDICT = re.compile(r'(?:"(?:text|content)"\s*:\s*"|\\n)\s*VERDICT:\s*(?:PASS|FIX REQUIRED)')
TOOL_USE = re.compile(r'"type"\s*:\s*"tool_use"')
ASSISTANT = re.compile(r'"type"\s*:\s*"assistant"')
FILE_PATH = re.compile(r'"(?:file_path|notebook_path)"\s*:\s*"([^"]+)"')
IMPLEMENTER = re.compile(r'"subagent_type"\s*:\s*"implementer"')


def git(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-c", "core.quotePath=false", *args], cwd=root, capture_output=True, text=True, timeout=20
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
    return result.stdout


def is_code(path: str) -> bool:
    return Path(path).suffix.lower() not in DOC_SUFFIXES


def changed_code_lines(root: Path) -> int:
    total = 0
    has_head = subprocess.run(
        ["git", "rev-parse", "--verify", "HEAD"], cwd=root, capture_output=True
    ).returncode == 0
    if has_head:
        for line in git(root, "diff", "HEAD", "--numstat", "--no-renames").splitlines():
            added, removed, path = line.split("\t", 2)
            if is_code(path) and added != "-":
                total += int(added) + int(removed)
    for path in git(root, "ls-files", "--others", "--exclude-standard").splitlines():
        file = root / path
        if is_code(path) and file.is_file() and file.stat().st_size < 1_000_000:
            try:
                total += len(file.read_text(encoding="utf-8").splitlines())
            except UnicodeDecodeError:
                continue
    return total


def is_code_edit(line: str) -> bool:
    """A real tool call that changes code (tool listings and doc edits do not count)."""
    if not TOOL_USE.search(line) or not EDIT_EVENT.search(line):
        return False
    if IMPLEMENTER.search(line):
        return True
    paths = FILE_PATH.findall(line)
    return not paths or any(is_code(path) for path in paths)


def reviewed_after_last_edit(transcript: Path) -> bool:
    last_edit = last_verdict = -1
    with transcript.open(encoding="utf-8", errors="replace") as handle:
        for index, line in enumerate(handle):
            if is_code_edit(line):
                last_edit = index
            # Verdicts come back as tool results or agent messages, never as the
            # main agent's own text or tool calls.
            if VERDICT.search(line) and not TOOL_USE.search(line) and not ASSISTANT.search(line):
                last_verdict = index
    return last_edit == -1 or last_verdict > last_edit


def decide(payload: dict, root: Path, min_lines: int) -> dict | None:
    if payload.get("stop_hook_active"):
        return None
    transcript = Path(payload.get("transcript_path") or "")
    if not transcript.is_file() or not (root / ".git").exists():
        return None
    if reviewed_after_last_edit(transcript):
        return None
    lines = changed_code_lines(root)
    if lines < min_lines:
        return None
    return {
        "decision": "block",
        "reason": (
            f"Engineering OS review gate: {lines} lines of uncommitted code changed since the "
            "last independent review. Run the `reviewer` subagent and follow the review-fix "
            "loop in AGENTS.md before presenting the work, or tell the owner plainly why "
            "this change does not need review."
        ),
    }


def main() -> int:
    if os.environ.get("EOS_REVIEW_GATE", "").lower() == "off":
        return 0
    try:
        payload = json.load(sys.stdin)
        root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or payload.get("cwd") or ".")
        min_lines = int(os.environ.get("EOS_REVIEW_MIN_LINES", "40"))
        result = decide(payload, root.resolve(), min_lines)
    except Exception:  # noqa: BLE001 - a broken gate must never trap the session
        return 0
    if result:
        print(json.dumps(result))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
