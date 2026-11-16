import importlib.util
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/eos.py"
SPEC = importlib.util.spec_from_file_location("eos", SCRIPT)
eos = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules["eos"] = eos
SPEC.loader.exec_module(eos)

EVAL_SCRIPT = Path(__file__).resolve().parents[1] / "scripts/eval_os.py"
EVAL_SPEC = importlib.util.spec_from_file_location("eval_os", EVAL_SCRIPT)
eval_os = importlib.util.module_from_spec(EVAL_SPEC)
assert EVAL_SPEC.loader is not None
sys.modules["eval_os"] = eval_os
EVAL_SPEC.loader.exec_module(eval_os)

GATE_SCRIPT = Path(__file__).resolve().parents[1] / "runtimes/claude/hooks/review_gate.py"
GATE_SPEC = importlib.util.spec_from_file_location("review_gate", GATE_SCRIPT)
review_gate = importlib.util.module_from_spec(GATE_SPEC)
assert GATE_SPEC.loader is not None
sys.modules["review_gate"] = review_gate
GATE_SPEC.loader.exec_module(review_gate)


def git_commit_all(root):
    subprocess.run(["git", "init", "-q", "-b", "main"], cwd=root, check=True)
    subprocess.run(["git", "add", "-A"], cwd=root, check=True)
    subprocess.run(
        ["git", "-c", "user.email=t@example.com", "-c", "user.name=t", "commit", "-q", "-m", "init"],
        cwd=root, check=True,
    )


class EngineeringOsTests(unittest.TestCase):
    def test_cli_new_end_to_end(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            result = eos.main(["new", str(target), "--name", "CLI Example", "--no-git"])
            self.assertEqual(0, result)
            self.assertTrue((target / "docs/project/PROJECT.md").exists())

    def test_new_creates_valid_initialized_project(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            actions = eos.initialize(target, "Example", no_git=True)
            self.assertTrue((target / "docs/project/PROJECT.md").exists())
            self.assertTrue((target / ".claude/skills").exists())
            self.assertTrue((target / "docs/project/SERVICES.md").exists())
            self.assertTrue((target / ".claude/agents/reviewer.md").exists())
            self.assertTrue((target / ".claude/settings.json").exists())
            self.assertIn("Example", (target / "docs/project/PROJECT.md").read_text())
            self.assertTrue(any("created docs/project" in action for action in actions))
            errors = [f for f in eos.check_repository(target, strict=True) if f.level == "error"]
            self.assertEqual([], errors)

    def test_initialize_is_idempotent_and_preserves_project_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            eos.initialize(target, "First", no_git=True)
            project = target / "docs/project/PROJECT.md"
            project.write_text("custom project state\n", encoding="utf-8")
            eos.initialize(target, "Second", no_git=True)
            self.assertEqual("custom project state\n", project.read_text(encoding="utf-8"))

    def test_git_initialization_and_hook_installation(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            actions = eos.initialize(target, "Example", no_git=False)
            self.assertTrue((target / ".git").is_dir())
            self.assertTrue(any("initialized Git" in action for action in actions))
            self.assertIn("core.hooksPath", eos.install_hooks(target).replace("configured local ", ""))
            configured = eos.run(["git", "config", "--get", "core.hooksPath"], target)
            self.assertEqual(".githooks", configured.stdout.strip())

    def test_check_rejects_unfinished_skill_scaffold(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            eos.initialize(target, "Example", no_git=True)
            skill = target / "skills/context-management/SKILL.md"
            skill.write_text(skill.read_text(encoding="utf-8") + "\nTODO\n", encoding="utf-8")
            messages = [f.message for f in eos.check_repository(target, strict=True)]
            self.assertTrue(any("unfinished scaffold" in message for message in messages))

    def test_ui_engineering_is_first_class_and_legacy_ui_routes_are_removed(self):
        skill = eos.ROOT / "skills/ui-engineering/SKILL.md"
        self.assertTrue(skill.exists())
        self.assertTrue((eos.ROOT / "templates/ui-foundation.md").exists())
        self.assertFalse((eos.ROOT / "skills/engineering-change/references/ui-change.md").exists())
        self.assertFalse((eos.ROOT / "skills/engineering-review/references/ui.md").exists())

    def test_safe_environment_example_is_allowed(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            eos.initialize(target, "Example", no_git=True)
            (target / ".env.example").write_text("API_URL=https://example.test\n", encoding="utf-8")
            errors = [f.message for f in eos.check_repository(target, strict=True) if f.level == "error"]
            self.assertFalse(any("secret-like filename" in message for message in errors))

    def test_secret_named_symlink_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            eos.initialize(target, "Example", no_git=True)
            (target / ".env").symlink_to("missing-local-secret")
            errors = [f.message for f in eos.check_repository(target, strict=True) if f.level == "error"]
            self.assertTrue(any("secret-like filename" in message for message in errors))

    def test_adapter_conflict_fails_before_project_state_creation(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            (target / ".agents/skills").mkdir(parents=True)
            with self.assertRaisesRegex(RuntimeError, "Refusing to replace"):
                eos.initialize(target, "Example", no_git=True)
            self.assertFalse((target / "docs/project/PROJECT.md").exists())

    def test_existing_claude_agents_are_kept_not_blocking(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            (target / ".claude/agents").mkdir(parents=True)
            (target / ".claude/agents/mine.md").write_text("custom", encoding="utf-8")
            actions = eos.initialize(target, "Example", no_git=True)
            self.assertTrue(any("skipped .claude/agents" in action for action in actions))
            self.assertEqual("custom", (target / ".claude/agents/mine.md").read_text())

    def test_common_live_secrets_are_detected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            # Built at runtime so this test file never contains a key-shaped string.
            samples = {
                "Stripe secret key": "sk_" + "live_" + "a1B2" * 6,
                "database URL with password": "postgres" + "://app:hunter2pass@db.example.com/prod",
            }
            for label, value in samples.items():
                (root / "config.js").write_text(f"const k = '{value}';\n", encoding="utf-8")
                messages = [f.message for f in eos.check_secrets(root)]
                self.assertTrue(any(label in m for m in messages), label)
            (root / "config.js").write_text("postgres" + "://app:pw123@localhost/dev", encoding="utf-8")
            self.assertEqual([], eos.check_secrets(root))

    def test_review_gate_blocks_unreviewed_code_only(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "README.md").write_text("x\n", encoding="utf-8")
            git_commit_all(root)
            (root / "app.py").write_text("\n".join(f"x{i} = {i}" for i in range(50)), encoding="utf-8")
            edit = '{"type":"tool_use","name":"Edit","input":{}}\n'
            transcript = root / "t.jsonl"
            transcript.write_text(edit, encoding="utf-8")
            payload = {"transcript_path": str(transcript)}
            self.assertEqual("block", review_gate.decide(payload, root, 40)["decision"])
            self.assertIsNone(review_gate.decide({**payload, "stop_hook_active": True}, root, 40))
            dispatch = '{"type":"tool_use","name":"Agent","input":{"prompt":"Output first line VERDICT: PASS or VERDICT: FIX REQUIRED"}}\n'
            transcript.write_text(edit + dispatch, encoding="utf-8")
            self.assertEqual("block", review_gate.decide(payload, root, 40)["decision"])
            transcript.write_text(edit + '{"content":"VERDICT: PASS"}\n', encoding="utf-8")
            self.assertIsNone(review_gate.decide(payload, root, 40))
            snapshot = '{"type":"attachment","tools":[{"name":"Edit"}]}\n'
            doc_edit = '{"type":"tool_use","name":"Edit","input":{"file_path":"/p/docs/CURRENT.md"}}\n'
            self_pass = '{"type":"assistant","content":"VERDICT: PASS"}\n'
            transcript.write_text(edit + '{"content":"VERDICT: PASS"}\n' + snapshot + doc_edit, encoding="utf-8")
            self.assertIsNone(review_gate.decide(payload, root, 40))
            transcript.write_text(edit + self_pass, encoding="utf-8")
            self.assertEqual("block", review_gate.decide(payload, root, 40)["decision"])
            transcript.write_text(edit, encoding="utf-8")
            (root / "app.py").unlink()
            (root / "notes.md").write_text("\n".join("doc" for _ in range(80)), encoding="utf-8")
            self.assertIsNone(review_gate.decide(payload, root, 40))

    def test_update_applies_os_files_only_on_clean_git(self):
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary) / "project"
            candidate = Path(temporary) / "candidate"
            eos.copy_template(project)
            eos.initialize(project, "Example", no_git=True)
            git_commit_all(project)
            eos.copy_template(candidate)
            skill = candidate / "skills/operations/SKILL.md"
            skill.write_text(skill.read_text(encoding="utf-8") + "\nNew rule.\n", encoding="utf-8")
            (candidate / "docs/project").mkdir(parents=True)
            (candidate / "docs/project/PROJECT.md").write_text("candidate state", encoding="utf-8")
            before = (project / "docs/project/PROJECT.md").read_text(encoding="utf-8")
            lines = eos.apply_update(project, candidate)
            self.assertIn("UPDATE skills/operations/SKILL.md", lines)
            self.assertIn("New rule.", (project / "skills/operations/SKILL.md").read_text(encoding="utf-8"))
            self.assertEqual(before, (project / "docs/project/PROJECT.md").read_text(encoding="utf-8"))
            with self.assertRaisesRegex(RuntimeError, "Commit or stash"):
                eos.apply_update(project, candidate)

    def test_update_preserves_project_files_and_refuses_downgrade(self):
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary) / "project"
            candidate = Path(temporary) / "candidate"
            outside = Path(temporary) / "outside"
            eos.copy_template(project)
            (project / "README.md").write_text("# My App\n", encoding="utf-8")
            (project / ".gitignore").write_text("config/secrets.yml\n", encoding="utf-8")
            (project / "source/README.md").write_text("our sources\n", encoding="utf-8")
            (project / "templates").rename(outside)
            (project / "templates").symlink_to(outside, target_is_directory=True)
            git_commit_all(project)
            eos.copy_template(candidate)
            (candidate / "templates/project.md").write_text("changed", encoding="utf-8")
            lines = eos.apply_update(project, candidate)
            self.assertEqual("# My App\n", (project / "README.md").read_text(encoding="utf-8"))
            self.assertEqual("config/secrets.yml\n", (project / ".gitignore").read_text(encoding="utf-8"))
            self.assertTrue(any(line.startswith("MERGE README.md") for line in lines))
            self.assertEqual("our sources\n", (project / "source/README.md").read_text(encoding="utf-8"))
            self.assertNotEqual("changed", (outside / "project.md").read_text(encoding="utf-8"))
            subprocess.run(["git", "stash", "-u", "-q"], cwd=project, check=True)
            (candidate / "ENGINEERING_OS_VERSION").write_text("0.1.0\n", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "older"):
                eos.apply_update(project, candidate)

    def test_update_fails_closed_without_working_git(self):
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary) / "project"
            candidate = Path(temporary) / "candidate"
            eos.copy_template(project)
            (project / "AGENTS.md").write_text("custom agents\n", encoding="utf-8")
            (project / ".git").mkdir()
            eos.copy_template(candidate)
            with self.assertRaisesRegex(RuntimeError, "working Git repository"):
                eos.apply_update(project, candidate)
            self.assertEqual("custom agents\n", (project / "AGENTS.md").read_text(encoding="utf-8"))

    def test_version_order_treats_prerelease_as_older(self):
        self.assertLess(eos.version_key("1.3.0-rc.1"), eos.version_key("1.3.0"))
        self.assertLess(eos.version_key("1.3.0"), eos.version_key("1.10.0"))

    def test_feedback_lists_only_os_feedback_lessons(self):
        with tempfile.TemporaryDirectory() as temporary:
            lessons = Path(temporary) / "docs/lessons"
            lessons.mkdir(parents=True)
            (lessons / "LESSON-001.md").write_text(
                "---\nid: LESSON-001\ntitle: Reviewer missed it\ntags: [lesson, os-feedback]\n---\n"
                "## Proposed OS change\n\nAdd a check.\n\n## Evidence\n\n- x\n", encoding="utf-8")
            (lessons / "LESSON-002.md").write_text(
                "---\nid: LESSON-002\ntitle: App bug\ntags: [lesson]\n---\n", encoding="utf-8")
            output = "\n".join(eos.os_feedback(Path(temporary)))
            with self.assertRaisesRegex(RuntimeError, "No docs/lessons"):
                eos.os_feedback(Path(temporary) / "missing")
            self.assertIn("Add a check.", output)
            self.assertNotIn("LESSON-002", output)

    def test_package_excludes_build_and_git_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / "project"
            eos.copy_template(target)
            (target / "dist").mkdir()
            (target / "dist/ignored.txt").write_text("ignore", encoding="utf-8")
            (target / ".git").mkdir()
            (target / ".git/ignored").write_text("ignore", encoding="utf-8")
            (target / "docs/project").mkdir(parents=True)
            (target / "docs/project/private.md").write_text("project", encoding="utf-8")
            (target / "source/private.pdf").write_text("artifact", encoding="utf-8")
            archive = Path(temporary) / "engineering-os.zip"
            eos.package(target, archive)
            with zipfile.ZipFile(archive) as opened:
                names = opened.namelist()
            self.assertIn("AGENTS.md", names)
            self.assertNotIn("dist/ignored.txt", names)
            self.assertNotIn(".git/ignored", names)
            self.assertNotIn("docs/project/private.md", names)
            self.assertNotIn("source/private.pdf", names)

    def test_packaged_archive_can_initialize_and_validate(self):
        with tempfile.TemporaryDirectory() as temporary:
            archive = Path(temporary) / "engineering-os.zip"
            eos.package(eos.ROOT, archive)
            extracted = Path(temporary) / "extracted"
            with zipfile.ZipFile(archive) as opened:
                opened.extractall(extracted)
            initialized = subprocess.run(
                [
                    sys.executable,
                    str(extracted / "scripts/eos.py"),
                    "init",
                    "--name",
                    "Packaged Example",
                    "--no-git",
                ],
                cwd=extracted,
                text=True,
                capture_output=True,
            )
            self.assertEqual(0, initialized.returncode, initialized.stderr)
            checked = subprocess.run(
                [sys.executable, str(extracted / "scripts/eos.py"), "check", "--strict"],
                cwd=extracted,
                text=True,
                capture_output=True,
            )
            self.assertEqual(0, checked.returncode, checked.stdout + checked.stderr)

    def test_new_refuses_target_inside_template(self):
        with self.assertRaisesRegex(RuntimeError, "outside the template root"):
            eos.copy_template(eos.ROOT / "nested-project")

    def test_version_is_rendered_and_update_check_never_compares_project_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            current = Path(temporary) / "current"
            candidate = Path(temporary) / "candidate"
            eos.copy_template(current)
            eos.copy_template(candidate)
            eos.initialize(current, "Versioned", no_git=True)
            project = current / "docs/project/PROJECT.md"
            self.assertIn(eos.os_version(current), project.read_text(encoding="utf-8"))
            project.write_text("local project state\n", encoding="utf-8")
            lines = eos.compare_os(current, candidate)
            self.assertEqual("No OS-owned file differences.", lines[-1])

    def test_update_check_reports_os_change_without_writing(self):
        with tempfile.TemporaryDirectory() as temporary:
            current = Path(temporary) / "current"
            candidate = Path(temporary) / "candidate"
            eos.copy_template(current)
            eos.copy_template(candidate)
            before = (current / "AGENTS.md").read_text(encoding="utf-8")
            (candidate / "AGENTS.md").write_text("candidate contract\n", encoding="utf-8")
            lines = eos.compare_os(current, candidate)
            self.assertIn("CHANGE AGENTS.md", lines)
            self.assertEqual(before, (current / "AGENTS.md").read_text(encoding="utf-8"))

    def test_behavior_eval_reference_passes_and_empty_results_fail(self):
        cases = eval_os.load_json(eos.ROOT / "evals/cases.json")
        self.assertEqual([], eval_os.validate_cases(cases))
        reference = eval_os.load_json(eos.ROOT / "evals/fixtures/reference-results.json")
        self.assertEqual([], eval_os.score(cases, reference))
        self.assertTrue(eval_os.score(cases, []))

    def test_handoff_requires_complete_structure_and_valid_timestamp(self):
        with tempfile.TemporaryDirectory() as temporary:
            handoff = Path(temporary) / "CURRENT.md"
            handoff.write_text("---\nstatus: ready\nupdated: not-a-date\n---\n\n# Current\n", encoding="utf-8")
            messages = [finding.message for finding in eos.check_handoff(handoff, strict=True)]
            self.assertTrue(any("updated timestamp" in message for message in messages))
            self.assertTrue(any("Exact next step" in message for message in messages))

    def test_knowledge_check_detects_duplicate_ids(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            directory = root / "docs/requirements"
            directory.mkdir(parents=True)
            record = "---\nid: REQ-001\nstatus: proposed\nclassification: provided\n---\n\n## Provenance\n\nSource.\n"
            (directory / "one.md").write_text(record, encoding="utf-8")
            (directory / "two.md").write_text(record, encoding="utf-8")
            messages = [finding.message for finding in eos.check_knowledge(root, strict=True)]
            self.assertTrue(any("duplicate knowledge id REQ-001" in message for message in messages))


if __name__ == "__main__":
    unittest.main()
