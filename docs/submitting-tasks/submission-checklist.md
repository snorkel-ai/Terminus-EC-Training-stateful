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
- [ ] _optional_ `milestones.md` — Only include if milestones in task. Short 1-2 sentence descriptions of each milestone

### Rubric
- Every submission should include a rubric that is aligned to the task. 
- You generate a synthetic rubric via the submission UI in the Snorkel Platform, then edit it for accuracy and completeness.
- See the  [Rubrics page](/portal/docs/understanding-tasks/rubrics) for workflow details and quality criteria.

### Quality Standards

- [ ] All requirements have corresponding tests
- [ ] All tests verify described requirements
- [ ] Anti-cheating measures in place (canary strings)
- [ ] Tests check behavior, not implementation
- [ ] Complies with [Quality Guidelines](/portal/docs/reference/quality-guidelines)

---

## Automated Checks

### Oracle Agent

```bash
harbor run --agent oracle --path <task-folder>
```

- [ ] Oracle agent PASSES

### CI Checks

```bash
harbor tasks check <task-folder> --model openai/@openai-tbench/gpt-5.2
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

### Run Against GPT-5.2

```bash
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5.2 -p <task-folder>
```

- [ ] Run 1: PASS / FAIL
- [ ] Run 2: PASS / FAIL
- [ ] Run 3: PASS / FAIL

### Run Against Claude Opus 4.6

```bash
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-opus-4-6 -p <task-folder>
```

- [ ] Run 1: PASS / FAIL
- [ ] Run 2: PASS / FAIL

### Difficulty Calculation

| Difficulty | Pass Rate | Description |
|------------|-----------|-------------|
| **Hard** | <= 20% | Requires deep expertise, multi-step reasoning |
| **Medium** | 21-80% | Moderate complexity, some domain knowledge |
| **Easy** | > 80% | Straightforward but still challenging |

- Best pass rate: ____%
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
