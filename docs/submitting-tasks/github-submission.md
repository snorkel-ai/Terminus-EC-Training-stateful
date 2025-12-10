# GitHub Submission Walkthrough

Submit your completed task via GitHub Pull Request.

## Prerequisites

Before submitting:
- [ ] Oracle agent passes
- [ ] All CI/LLMaJ checks pass
- [ ] Tested against real agents
- [ ] Difficulty verified (< 80% pass rate)

## Video Walkthroughs

### 1. Creating a Task

<video-loom id="92c2e195ac1c4b1e9b1177668dfcb81a" title="Creating a Task" />

### 2. Running Your Task

<video-loom id="22449b76123d41e6abff0efb39d0b960" title="Running your task" />

### 3. Creating a solution.sh

<video-loom id="140f2cf8f16d404abf5cbd7dcc66b7cb" title="Creating a solution.sh" />

### 4. Creating Tests

<video-loom id="a00541ff2787464c84bf4601415ee624" title="Creating tests for your task" />

## Submission Steps

### Step 1: Create a Branch

```bash
cd snorkel-tb-tasks
git checkout main
git pull origin main
git checkout -b username/<task-id>
```

**Branch naming:** `username/task-name`
- Example: `jsmith/fix-memory-leak`

### Step 2: Stage Your Changes

```bash
git add harbor_tasks/<task-name>/
```

### Step 3: Commit

```bash
git commit -m "Add task: <task-name>

- Brief description of what the task tests
- Difficulty: medium
- Category: debugging"
```

### Step 4: Push

```bash
git push origin username/<task-id>
```

### Step 5: Create Pull Request

1. Go to [github.com/snorkel-ai/snorkel-tb-tasks](https://github.com/snorkel-ai/snorkel-tb-tasks)
2. Click **"New Pull Request"**
3. Select your branch
4. **Title must start with "Task:"**
   - Example: `Task: Fix memory leak in data pipeline`

### Step 6: Fill PR Template

```markdown
## Task Submission

**Task Name:** fix-memory-leak
**Difficulty:** Medium  
**Category:** debugging
**Tags:** python, memory-leak, debugging

## Summary
This task requires finding and fixing a memory leak in a 
data processing pipeline that causes OOM errors after 
processing ~10,000 records.

## Checklist
- [x] Oracle agent passes
- [x] All CI/LLMaJ checks pass locally
- [x] Tested against GPT-5 and Claude
- [x] Pass rate < 80%
- [x] All requirements have tests
- [x] Tests have informative docstrings
```

### Step 7: Monitor CI

After opening the PR:
1. Wait for CI checks to run
2. Review any failures
3. Fix and push updates if needed

```bash
# If fixes needed:
git add .
git commit -m "Fix CI: add missing docstrings"
git push origin username/<task-id>
```

## After Submission

### CI Status

| Status | Meaning |
|--------|---------|
| ✓ All checks passed | Ready for review |
| ✗ Checks failed | Fix issues and push |
| ⏳ Pending | CI still running |

### Peer Review

1. **Assigned automatically** (or request in comments)
2. **Review within 1-3 business days**
3. **Comments for requested changes**
4. **Approval when ready**

### Addressing Feedback

```bash
# Make requested changes
# ...

git add .
git commit -m "Address review: clarify test docstrings"
git push origin username/<task-id>
```

Then reply to comments explaining your changes.

### After Merge

```bash
git checkout main
git pull origin main
git branch -d username/<task-id>  # Delete local branch
```

## Common Issues

### PR Title Wrong

**Problem:** CI fails because title doesn't start with "Task:"

**Fix:** Edit PR title to start with "Task:"

### CI Passes Locally But Fails in PR

**Problem:** Environment differences

**Fix:** 
1. Check CI logs for specific error
2. Use exact same model flag as CI
3. Ensure all dependencies pinned

### Merge Conflicts

**Problem:** Main branch changed

**Fix:**
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts
git push --force-with-lease origin username/<task-id>
```

---

## Next Steps

- [Review submission checklist](/portal/docs/submitting-tasks/submission-checklist)
- [Understand the review process](/portal/docs/submitting-tasks/after-submission)
