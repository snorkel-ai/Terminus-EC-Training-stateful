# Oracle Agent

The Oracle Agent runs your solution.sh in the task environment and verifies it passes all tests. It's the first line of validation for your task.

## What is the Oracle Agent?

The Oracle Agent is an automated agent that:
1. Starts your Docker environment
2. Executes your solution.sh commands
3. Runs your tests to verify completion
4. Reports pass/fail results

If the Oracle Agent can't complete your task, neither can AI agents.

## Running the Oracle Agent

### GitHub Workflow

```bash
uv run harbor run --agent oracle --path harbor_tasks/<task-name>
```

### Platform Workflow

```bash
tb run --agent oracle --task-id <task-name>
```

## Expected Output

### Successful Run

```
Starting task: my-task
Building Docker environment...
Running oracle solution...
  ✓ Step 1 completed
  ✓ Step 2 completed
  ✓ Step 3 completed
Running tests...
  ✓ test_output_exists PASSED
  ✓ test_format_correct PASSED
  ✓ test_values_valid PASSED

RESULT: PASS
```

### Failed Run

```
Starting task: my-task
Building Docker environment...
Running oracle solution...
  ✓ Step 1 completed
  ✗ Step 2 failed: command not found

RESULT: FAIL
Error: Solution did not complete successfully
```

## Debugging Failures

### Solution Fails

If your solution doesn't run:

1. **Enter interactive mode:**
   ```bash
   uv run harbor tasks start-env --path harbor_tasks/<task-name> --interactive
   ```

2. **Run commands manually** to find the failing step

3. **Check for:**
   - Typos in commands
   - Missing dependencies
   - Wrong file paths
   - Permission issues

### Tests Fail

If the solution runs but tests fail:

1. **Check test output** for specific failures

2. **Verify your solution** actually produces expected output

3. **Check for:**
   - Incorrect output format
   - Missing files
   - Off-by-one errors
   - Edge cases not handled

### Environment Issues

If the container won't build:

1. **Check Dockerfile syntax**

2. **Verify base image** exists and is accessible

3. **Check dependency installation** commands

4. **Try building manually:**
   ```bash
   cd harbor_tasks/<task-name>
   docker build -t test .
   ```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "command not found" | Missing dependency | Add to Dockerfile |
| "file not found" | Wrong path | Use absolute paths |
| "permission denied" | File permissions | Check chmod in Dockerfile |
| Tests timeout | Solution too slow | Optimize or increase timeout |

## Oracle vs Real Agents

| Oracle Agent | Real Agents (GPT-5, etc.) |
|--------------|---------------------------|
| Runs your solution.sh | Generate their own solution |
| Always deterministic | May vary between runs |
| Tests task validity | Tests task difficulty |
| Must always pass | May fail (that's the goal!) |

## Best Practices

1. **Run oracle early and often** — Don't wait until submission

2. **Fix oracle failures first** — If oracle fails, task is broken

3. **Check all test output** — Understand why tests pass/fail

4. **Keep environment minimal** — Easier to debug

---

## Next Steps

- [Watch Oracle training video](/portal/docs/testing-and-validation/oracle-training)
- [Run against real agents](/portal/docs/testing-and-validation/running-real-agents)
- [Review CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
