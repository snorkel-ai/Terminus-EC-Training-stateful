# CI Feedback Training

Learn to iterate on CI and LLMaJ feedback to get your task passing all checks.

## Video Tutorial

<video-loom id="db35a5b03c1c43ab80f46f481fa02be1" title="CI Feedback Training"></video-loom>

## Practice Notebook

Download the Jupyter notebook for hands-on practice:

<pdf-download src="/Terminus-EC-Training-stateful/ci_feedback_training.ipynb" title="Download CI Feedback Training Notebook"></pdf-download>

## What You'll Learn

- Understanding CI check output
- Interpreting LLMaJ feedback
- Iterating on failures efficiently
- Common patterns and fixes

## CI Iteration Workflow

```
Run checks → Identify failures → Fix issues → Re-run → Repeat
```

### Step 1: Run All Checks

```bash
uv run harbor tasks check harbor_tasks/<task-name> --model openai/@openai/gpt-5
```

### Step 2: Review Output

```
CI Checks:
  ✓ pinned_dependencies
  ✗ check_task_absolute_path
  ✓ validate_task_fields

LLMaJ Checks:
  ✓ behavior_in_tests
  ✗ informative_test_docstrings
  ✓ anti_cheating_measures

2 checks failed
```

### Step 3: Fix One Issue at a Time

Focus on one failure:

```
✗ check_task_absolute_path
  Line 3: "Edit config/settings.json"
  Use absolute path: /app/config/settings.json
```

Fix:
```yaml
instruction: |
  Edit /app/config/settings.json  # Changed from relative
```

### Step 4: Re-run and Verify

```bash
uv run harbor tasks check harbor_tasks/<task-name> --model openai/@openai/gpt-5
```

### Step 5: Repeat

Continue until all checks pass.

## Common Failure Patterns

### Missing Test Docstrings

**Error:**
```
✗ informative_test_docstrings
  test_output() - Missing docstring
  test_format() - Docstring not informative
```

**Fix:**
```python
def test_output():
    """Verify output.json exists and contains required fields."""
    ...

def test_format():
    """Verify JSON output has correct schema with status and items."""
    ...
```

### Behavior Mismatch

**Error:**
```
✗ behavior_in_task_description
  test_handles_empty_input tests behavior not in instructions
```

**Fix:** Add to task.yaml:
```yaml
instruction: |
  ...
  Handle empty input by returning an empty list.
```

### Relative Paths

**Error:**
```
✗ check_task_absolute_path
  Found: "./data/input.csv"
```

**Fix:**
```yaml
instruction: |
  Read from /app/data/input.csv  # Absolute path
```

### Missing Pinned Versions

**Error:**
```
✗ pinned_dependencies
  Dockerfile:5 - numpy not pinned
```

**Fix:**
```dockerfile
RUN pip install numpy==1.26.4
```

## Tips for Efficient Iteration

1. **Fix easy issues first** — Start with CI checks before LLMaJ

2. **Run locally before pushing** — Saves CI time

3. **Read error messages carefully** — They tell you exactly what's wrong

4. **One fix at a time** — Easier to track what worked

5. **Keep a checklist** — Track what you've fixed

## Checklist Before Final Submission

- [ ] All CI checks pass
- [ ] All LLMaJ checks pass
- [ ] Oracle agent passes
- [ ] Real agents tested (difficulty verified)
- [ ] Code reviewed for quality

---

## Next Steps

- [Submit via Platform](/portal/docs/submitting-tasks/platform-submission)
- [Submit via GitHub](/portal/docs/submitting-tasks/github-submission)
