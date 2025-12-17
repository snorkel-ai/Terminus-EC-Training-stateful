# Submission Checklist

Use this checklist before every submission to ensure your task is complete and will pass review.

> **For detailed requirements:** See [Task Requirements](/portal/docs/understanding-tasks/task-requirements) for complete specifications on each component.

---

## Pre-Submission Verification

### Task Design

- [ ] Problem statement is clear and unambiguous
- [ ] All requirements are explicitly stated
- [ ] Uses absolute paths (e.g., `/app/file.txt`)
- [ ] Output files are named in instructions
- [ ] Data schemas are fully specified
- [ ] Difficulty target: < 80% pass rate

### Required Files

- [ ] `instruction.md` — Clear, human-written instructions ([requirements](/portal/docs/understanding-tasks/task-requirements#instructionmd-requirements))
- [ ] `task.toml` — Complete configuration with all required sections ([requirements](/portal/docs/understanding-tasks/task-requirements#tasktoml-requirements))
- [ ] `environment/Dockerfile` — Builds successfully, dependencies pinned ([requirements](/portal/docs/understanding-tasks/task-requirements#environment-requirements))
- [ ] `solution/solve.sh` — Deterministic, human-written solution ([requirements](/portal/docs/understanding-tasks/task-requirements#solution-requirements))
- [ ] `tests/test.sh` — Uses uv, produces reward file ([requirements](/portal/docs/understanding-tasks/task-requirements#test-requirements))
- [ ] `tests/test_outputs.py` — Tests with docstrings, verify behavior

### Quality Standards

- [ ] All requirements have corresponding tests
- [ ] All tests verify described requirements
- [ ] Anti-cheating measures in place (canary strings)
- [ ] Tests check behavior, not implementation

---

## Automated Checks

### Oracle Agent

```bash
harbor run --agent oracle --path harbor_tasks/<task-name>
```

- [ ] Oracle agent PASSES

### CI Checks

```bash
harbor tasks check harbor_tasks/<task-name> --model openai/@openai-tbench/gpt-5
```

- [ ] pinned_dependencies ✓
- [ ] typos ✓
- [ ] tests_or_solution_in_image ✓
- [ ] test_deps_in_image ✓
- [ ] check_canary ✓
- [ ] check_dockerfile_references ✓
- [ ] check_test_sh ✓
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
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task-name>
```

- [ ] Run 1: PASS / FAIL
- [ ] Run 2: PASS / FAIL
- [ ] Run 3: PASS / FAIL

### Run Against Claude

```bash
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/<task-name>
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

- [ ] Created ZIP of files (not folder)
- [ ] All required files included in ZIP
- [ ] Uploaded to terminus-project-v2 on Snorkel Expert Platform
- [ ] Metadata filled in

See [Platform Submission Guide](/portal/docs/submitting-tasks/platform-submission) for detailed submission steps.

---

## Ready?

If you've completed all items above, upload your ZIP file to the Snorkel Expert Platform.

**Good luck!** 🎉

---

## Need Help?

- Slack: `#ec-terminus-submission`
- [Troubleshooting guide](/portal/docs/reference/troubleshooting)
- [FAQ](/portal/docs/reference/faq)
