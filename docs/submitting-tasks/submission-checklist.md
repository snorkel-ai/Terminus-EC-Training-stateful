# Submission Checklist

Use this checklist before every submission to ensure your task is complete and will pass review.

---

## Pre-Submission Verification

### Task Design

- [ ] Problem statement is clear and unambiguous
- [ ] All requirements are explicitly stated
- [ ] Uses absolute paths (e.g., `/app/file.txt`)
- [ ] Output files are named in instructions
- [ ] Data schemas are fully specified
- [ ] Difficulty target: < 80% pass rate

### Components

- [ ] `task.yaml` has all required fields
- [ ] `Dockerfile` builds successfully
- [ ] Dependencies have pinned versions
- [ ] `docker-compose.yaml` is valid
- [ ] `solution/solve.sh` is deterministic
- [ ] `tests/test_outputs.py` has docstrings
- [ ] `tests/run-tests.sh` uses uv

### Quality

- [ ] task.yaml written by human (not LLM)
- [ ] solution.sh written by human
- [ ] Tests check behavior, not implementation
- [ ] All requirements have corresponding tests
- [ ] All tests verify described requirements
- [ ] Anti-cheating measures in place
- [ ] Canary strings present

---

## Automated Checks

### Oracle Agent

```bash
uv run harbor run --agent oracle --path harbor_tasks/<task-name>
```

- [ ] Oracle agent PASSES

### CI Checks

```bash
uv run harbor tasks check harbor_tasks/<task-name> --model openai/@openai-tbench/gpt-5
```

- [ ] pinned_dependencies ✓
- [ ] typos ✓
- [ ] tests_or_solution_in_image ✓
- [ ] test_deps_in_image ✓
- [ ] check_canary ✓
- [ ] check_dockerfile_references ✓
- [ ] check_run-tests_sh ✓
- [ ] check_task_absolute_path ✓
- [ ] check_privileged_containers ✓
- [ ] ruff ✓
- [ ] check_task_sizes ✓
- [ ] validate_task_fields ✓

### LLMaJ Checks

- [ ] behavior_in_task_description ✓
- [ ] behavior_in_tests ✓
- [ ] informative_test_docstrings ✓
- [ ] anti_cheating_measures ✓
- [ ] structured_data_schema ✓
- [ ] hardcoded_solution ✓
- [ ] file_reference_mentioned ✓

---

## Real Agent Testing

### Run Against GPT-5

```bash
uv run harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task-name>
```

- [ ] Run 1: PASS / FAIL
- [ ] Run 2: PASS / FAIL
- [ ] Run 3: PASS / FAIL

### Run Against Claude

```bash
uv run harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/<task-name>
```

- [ ] Run 1: PASS / FAIL
- [ ] Run 2: PASS / FAIL

### Difficulty Calculation

- Best pass rate: ____%
- [ ] Pass rate < 80% (REQUIRED)
- Difficulty: Easy / Medium / Hard

---

## Final Review

### Self-Check Questions

1. **Would I understand this task as a first-time reader?**
   - If no → Clarify instructions

2. **Are there any ambiguous requirements?**
   - If yes → Make them explicit

3. **Could an agent cheat on this task?**
   - If yes → Add anti-cheating measures

4. **Do tests verify actual behavior?**
   - If no → Rewrite to test behavior

5. **Is the solution deterministic?**
   - If no → Add seeds, remove randomness

---

## Submission Method

### GitHub

- [ ] Created branch: `username/<task-id>`
- [ ] Committed with descriptive message
- [ ] Pushed to remote
- [ ] PR title starts with "Task:"
- [ ] PR template filled out

### Platform

- [ ] Created ZIP of files (not folder)
- [ ] All files included in ZIP
- [ ] Uploaded to terminus-project
- [ ] Metadata filled in

---

## Ready?

If you've completed all items above:

**GitHub:**
```bash
git push origin username/<task-id>
# Then create PR on GitHub
```

**Platform:**
Upload your ZIP file to the Snorkel Expert Platform.

**Good luck!** 🎉

---

## Need Help?

- Slack: `#ec-terminus-submission`
- [Troubleshooting guide](/portal/docs/reference/troubleshooting)
- [FAQ](/portal/docs/reference/faq)
