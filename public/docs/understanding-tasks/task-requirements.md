# Task Requirements

This page lists all requirements your task must meet to pass review. Use this as a reference during development.

---

## Structural Requirements

Every task submission must include:

| File | Required | Description |
|------|----------|-------------|
| `task.yaml` | ✅ | Task instructions and metadata |
| `Dockerfile` | ✅ | Environment setup |
| `docker-compose.yaml` | ✅ | Service orchestration |
| `solution/solve.sh` | ✅ | Oracle solution script |
| `tests/test_outputs.py` | ✅ | Pytest validation tests |
| `tests/run-tests.sh` | ✅ | Test runner script |

<pdf-download src="/Terminus-EC-Training-stateful/template-task.zip" title="Download Task Skeleton Template"></pdf-download>

---

## task.yaml Requirements

Your `task.yaml` must include:

```yaml
task_id: unique-task-name
authors: [your-name]
description: |
  Clear, unambiguous instructions for the agent.
  
  ## Requirements
  - All requirements explicitly listed
  - Use absolute paths (/app/file.txt)
  - Specify output file names
  - Define data schemas completely
tags: [category, type, difficulty]
```

### Writing Quality Standards

- **Human-written** — No LLM-generated task descriptions
- **Clear and unambiguous** — A first-time reader should understand completely
- **Explicit requirements** — Don't assume anything; state everything
- **Absolute paths** — Always use `/app/file.txt`, never relative paths
- **Named outputs** — Tell the agent exactly what files to create and where

---

## Solution Requirements

### solve.sh Standards

```bash
#!/bin/bash
set -euo pipefail

# Your solution commands here
```

- **Human-written** — No LLM-generated solutions
- **Deterministic** — Same output every run (use seeds for randomness)
- **Self-contained** — All logic in the script, no external dependencies
- **Idempotent** — Can run multiple times safely

### What Makes a Good Solution

✅ Good:
```bash
# Clear, step-by-step commands
cd /app
python process_data.py --seed 42 > output.txt
```

❌ Bad:
```bash
# Relies on random behavior
python script.py  # Non-deterministic output
```

---

## Test Requirements

### test_outputs.py Standards

```python
"""Test docstring explaining what this test file validates."""

def test_output_file_exists():
    """Verify that the required output file was created."""
    assert Path("/app/output.txt").exists()

def test_output_format():
    """Verify output follows the specified JSON schema."""
    # Test implementation
```

### Test Quality Checklist

- [ ] **Docstrings on every test** — Explain what behavior is being tested
- [ ] **Test behavior, not implementation** — Verify outcomes, not methods
- [ ] **One test per requirement** — Each requirement has a corresponding test
- [ ] **No leaked answers** — Tests shouldn't reveal the solution
- [ ] **Anti-cheating measures** — Include canary strings, avoid predictable patterns

### Canary Strings

Include unique canary strings to detect cheating:

```python
CANARY_STRING = "TERMINUS_TASK_abc123xyz"

def test_canary_present():
    """Verify canary string is in output (anti-cheating measure)."""
    output = Path("/app/output.txt").read_text()
    assert CANARY_STRING in output
```

---

## Dockerfile Requirements

### Base Image

Use one of the approved base images:

```dockerfile
FROM python:3.11-slim
# or
FROM node:20-slim
# or
FROM ubuntu:22.04
```

### Dependency Pinning

All dependencies **must** have pinned versions:

```dockerfile
# ✅ Good
RUN pip install pandas==2.0.0 numpy==1.24.0

# ❌ Bad
RUN pip install pandas numpy
```

### Security Requirements

- [ ] No privileged containers
- [ ] Solution files not baked into image
- [ ] Test dependencies not pre-installed
- [ ] Minimal attack surface

---

## Difficulty Requirements

Your task **must** have a pass rate below 80% against SOTA agents.

| Pass Rate | Difficulty | Status |
|-----------|------------|--------|
| < 40% | Hard | ✅ Accepted |
| 40-60% | Medium | ✅ Accepted |
| 60-80% | Easy | ✅ Accepted |
| > 80% | Too Easy | ❌ Rejected |

### How to Verify

Run your task against real agents (minimum 2-3 times each):

```bash
# GPT-5
tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id <task-id>

# Claude Sonnet 4.5
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id <task-id>
```

---

## Anti-Cheating Requirements

Tasks must be resistant to shortcut solutions:

### Required Measures

1. **Canary strings** — Unique identifiers that must appear in output
2. **Dynamic elements** — Use computed values, not hardcoded answers
3. **Validation depth** — Test multiple aspects of the solution
4. **Non-trivial verification** — Answers shouldn't be derivable from tests

### Red Flags

Your task will be rejected if:

- Solution can be copied from test assertions
- Output format reveals the answer structure
- Hardcoded values can pass tests
- Agent can "guess" the correct answer

---

## Automated Check Requirements

Your task must pass all CI and LLMaJ checks:

### CI Checks (Must Pass)

| Check | What It Validates |
|-------|-------------------|
| `pinned_dependencies` | All packages have version pins |
| `typos` | No spelling errors in code |
| `tests_or_solution_in_image` | Solution not in Docker image |
| `check_canary` | Canary strings present |
| `check_dockerfile_references` | All referenced files exist |
| `check_run-tests_sh` | Test runner uses uv |
| `check_task_absolute_path` | Uses absolute paths |
| `ruff` | Python code passes linting |
| `validate_task_fields` | task.yaml is complete |

### LLMaJ Checks (Must Pass)

| Check | What It Validates |
|-------|-------------------|
| `behavior_in_task_description` | Requirements clearly stated |
| `behavior_in_tests` | Tests verify behavior |
| `informative_test_docstrings` | Tests have good docstrings |
| `anti_cheating_measures` | Task can't be gamed |
| `hardcoded_solution` | Solution isn't trivially derivable |
| `file_reference_mentioned` | Output files specified |
| `structured_data_schema` | Data formats defined |

---

## Summary Checklist

Before submitting, verify:

- [ ] All required files present
- [ ] task.yaml is human-written and clear
- [ ] solution.sh is deterministic
- [ ] All tests have docstrings
- [ ] Dependencies are pinned
- [ ] Canary strings included
- [ ] Pass rate < 80%
- [ ] CI checks pass locally
- [ ] LLMaJ checks pass locally

---

## Next Steps

- [Submission Checklist](/portal/docs/submitting-tasks/submission-checklist) — Final pre-submission verification
- [CI Checks Reference](/portal/docs/testing-and-validation/ci-checks-reference) — Detailed check explanations
- [Common Errors](/portal/docs/reviewing-tasks/common-errors) — Avoid these mistakes
