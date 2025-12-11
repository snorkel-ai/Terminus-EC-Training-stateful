# Oracle Training

Learn how to effectively use and debug the Oracle Agent with hands-on practice.

## Video Tutorial

<video-loom id="72b70216a5314068823bc6ed0350e672" title="Oracle Training Tutorial"></video-loom>

## Practice Notebook

Download the Jupyter notebook for hands-on practice:

<pdf-download src="/Terminus-EC-Training-stateful/oracle_agent_training.ipynb" title="Download Oracle Training Notebook"></pdf-download>

## What You'll Learn

- What the Oracle Agent is and how it works
- How to run the Oracle Agent on your task
- How to interpret Oracle output
- How to debug failing runs
- How to iterate and fix issues

## Key Concepts

### Oracle Agent Purpose

The Oracle Agent verifies that your task is **solvable**. It:
- Executes your solution.sh script
- Runs in your Docker environment
- Verifies all tests pass

> If the Oracle can't solve your task, it's broken.

### Running the Oracle

```bash
# Basic run
uv run harbor run --agent oracle --path harbor_tasks/<task-name>

# With verbose output
uv run harbor run --agent oracle --path harbor_tasks/<task-name> -v
```

### Interpreting Output

**Success:**
```
✓ Solution completed
✓ All tests passed
RESULT: PASS
```

**Failure:**
```
✗ Solution failed at step 3
Error: FileNotFoundError: /app/config.json
RESULT: FAIL
```

## Debugging Workflow

### Step 1: Identify the Failure

Read the error message carefully:
- Which step failed?
- What was the error?
- What file/command was involved?

### Step 2: Reproduce Interactively

```bash
uv run harbor tasks start-env --path harbor_tasks/<task-name> --interactive
```

Inside the container, run commands one by one to find the issue.

### Step 3: Fix and Re-test

1. Update solution.sh or Dockerfile
2. Run Oracle again
3. Repeat until passing

## Common Debugging Scenarios

### Missing File

```
Error: No such file: /app/data/input.csv
```

**Fix:** Check Dockerfile COPY commands and file paths

### Command Not Found

```
Error: grep: command not found
```

**Fix:** Add package to Dockerfile `apt-get install`

### Test Assertion Failed

```
AssertionError: Expected 42, got 41
```

**Fix:** Debug your solution logic

### Timeout

```
Error: Task exceeded timeout (1800s)
```

**Fix:** Optimize solution or increase timeout in task.yaml

## Practice Exercise

Using the notebook:

1. Load the sample task
2. Run the Oracle (it will fail)
3. Identify the issue
4. Fix the solution
5. Run Oracle again until passing

---

## Next Steps

- [Run against real agents](/portal/docs/testing-and-validation/running-real-agents)
- [Understand CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
