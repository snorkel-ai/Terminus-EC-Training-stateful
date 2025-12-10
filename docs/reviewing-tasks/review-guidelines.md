# Review Guidelines

Guidelines for peer reviewers evaluating submitted tasks.

## Review Philosophy

As a reviewer, you're ensuring quality for the benchmark. Your goal is to:
- Catch issues before they enter the dataset
- Help contributors improve their tasks
- Maintain consistency across submissions

## Review Checklist

### 1. Read the Task Description

- [ ] Instructions look human-written (not LLM-generated)
- [ ] Requirements are clear and unambiguous
- [ ] All constraints are explicitly stated
- [ ] Absolute paths used throughout

**Think like a malicious agent:** Does the description give extra information that makes cheating easier?

### 2. Review Tests

- [ ] Every requirement has a corresponding test
- [ ] Tests have informative docstrings
- [ ] Tests verify behavior, not implementation
- [ ] No brittle string matching
- [ ] No hardcoded thresholds (or thresholds are reasonable)

### 3. Check Solution

- [ ] Solution demonstrates the process (not just outputs answer)
- [ ] Commands are deterministic
- [ ] Works in the provided environment

### 4. Verify Metadata

- [ ] Difficulty matches expected pass rate
- [ ] Category is appropriate
- [ ] Time estimates are realistic
- [ ] Timeout is sufficient but not excessive

### 5. Watch Agent Runs

On the task viewer:
- Watch the terminal recording
- If agent fails, is it failing for a **good reason**?
- Check the analysis for identified issues
- Read the debug pane

## Common Issues to Flag

### Task Description Problems

| Issue | What to Look For |
|-------|------------------|
| Ambiguous requirements | "Make it better", "fix the issues" |
| Missing output specs | Tests check files not mentioned |
| Relative paths | `./data/file.txt` instead of `/app/data/file.txt` |
| Implicit assumptions | Assumes knowledge not in instructions |

### Test Problems

| Issue | What to Look For |
|-------|------------------|
| Brittle tests | Exact string matching |
| Missing coverage | Requirements without tests |
| Order dependency | Tests that must run in sequence |
| Implementation testing | Parsing source code |

### Solution Problems

| Issue | What to Look For |
|-------|------------------|
| Hardcoded answers | `echo "42" > result.txt` |
| Non-deterministic | Uses random without seed |
| Incomplete | Missing steps |
| Over-complex | Unnecessarily convoluted |

## Specific Things to Watch

### Testing Behavior

> It is almost always better to test a behavior by actually running the code than trying to statically analyze it.

**Flag:** Tests that grep through source code looking for patterns.

### Tool Specifications

> Task instructions shouldn't mention specific tools unless there's a way to verify they were used.

**Flag:** "Use vim to edit the file" (can't verify vim was used).

### Randomness

> Tasks involving randomness MUST NOT assume the solution matches that same random order.

**Flag:** Tests that depend on specific `np.random.seed` values.

### Test Complexity

> Long test files are almost always wrong since more tests means more opportunities for error.

**Flag:** test_outputs.py with 20+ tests for a simple task.

### Data Formats

> Be especially paranoid about specifying data formats.

**Flag:** "Output a CSV" without specifying whether it needs headers.

### Anti-Cheating

Think about how agents could cheat:
- Decompile programs to find hidden answers
- Replace programs with dummy versions
- Delete or modify tests
- Access newer git commits

## Review Actions

### Approve

Task is ready. No issues found.

### Request Changes

Issues need fixing before acceptance. Be specific:
- What's wrong
- Where it is
- How to fix it

**Good feedback:**
> The test `test_output_format` on line 45 uses exact string matching. Please change to check for required fields instead, allowing for formatting variations.

**Bad feedback:**
> Tests need work.

### Decline

Fundamental issues that can't be easily fixed:
- Too easy (> 80% pass rate consistently)
- Essentially duplicate of existing task
- Core concept is flawed

Explain clearly why, and whether revision could salvage it.

---

## Next Steps

- [Common errors to watch for](/portal/docs/reviewing-tasks/common-errors)
