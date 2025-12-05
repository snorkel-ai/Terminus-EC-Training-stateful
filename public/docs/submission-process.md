# Submission Process

This guide covers the complete process for submitting your tasks for review.

## Overview

```
Create Task → Self-Review → Submit PR → Review → Revisions → Acceptance
```

The process typically takes 3-7 days from submission to acceptance, depending on revision needs.

## Before You Submit

### Self-Review Checklist

Before submitting, verify your task against this checklist:

- [ ] **Problem statement is clear** — Would another engineer understand exactly what to do?
- [ ] **Constraints are explicit** — Input limits, time/space requirements stated
- [ ] **Starter code compiles** — No syntax errors in the template
- [ ] **Solution works** — All tests pass against your solution
- [ ] **Tests are comprehensive** — Edge cases covered
- [ ] **Metadata is complete** — All fields filled in correctly

### Run Local Validation

```bash
# Navigate to your task directory
cd tasks/your-task-name/

# Run the validation script
./validate.sh

# Expected output:
# ✓ README.md exists and is valid
# ✓ Starter code parses correctly
# ✓ Solution passes all tests
# ✓ Metadata is complete
# Ready to submit!
```

## Submitting Your Task

### Step 1: Create a Pull Request

```bash
# Make sure all changes are committed
git add .
git commit -m "Add task: implement-rate-limiter"

# Push your branch
git push origin task/implement-rate-limiter
```

Then on GitHub:
1. Navigate to the repository
2. Click "Pull requests" → "New pull request"
3. Select your branch
4. Fill out the PR template

### Step 2: Complete the PR Template

```markdown
## Task Submission

**Task Name:** Implement Rate Limiter
**Difficulty:** Medium
**Domain:** Systems
**Estimated Time:** 30 minutes

## Summary
Implement a sliding window rate limiter with O(1) operations.

## Checklist
- [x] Problem statement is clear and unambiguous
- [x] All constraints are explicitly stated
- [x] Starter code provided with proper structure
- [x] Reference solution included and tested
- [x] Minimum 5 test cases including edge cases
- [x] Metadata.json is complete
- [x] Ran local validation successfully

## Testing Notes
Tested with Python 3.9 and 3.11. All tests pass.

## Additional Context
This task tests understanding of time-based data structures 
and thread safety considerations.
```

### Step 3: Request Review

After creating the PR:
1. Ensure CI checks pass (automated validation)
2. A reviewer will be assigned automatically
3. You'll receive notification when review starts

## The Review Process

### What Reviewers Look For

| Criteria | What They Check |
|----------|-----------------|
| Clarity | Is the problem statement unambiguous? |
| Difficulty | Is it appropriately challenging? |
| Quality | Are tests comprehensive? |
| Completeness | Is everything included? |
| Originality | Is it distinct from existing tasks? |

### Review Timeline

- **Initial review:** 1-3 business days
- **Follow-up reviews:** 1-2 business days
- **Total time:** Typically 3-7 days

### Review Outcomes

1. **Approved** — Task is accepted! 🎉
2. **Changes Requested** — Revisions needed
3. **Declined** — Task doesn't meet criteria (with explanation)

## Addressing Feedback

When changes are requested:

### 1. Read Feedback Carefully

Review each comment and understand what's being asked.

### 2. Make Requested Changes

```bash
# Make your changes, then:
git add .
git commit -m "Address review: clarify constraints, add edge case test"
git push origin task/implement-rate-limiter
```

### 3. Respond to Comments

Reply to each review comment explaining:
- What you changed
- Any questions you have
- Why you may have done something differently (if applicable)

### 4. Re-request Review

Click "Re-request review" to notify the reviewer.

## After Acceptance

Once your task is merged:

1. **Task goes live** — Added to the benchmark suite
2. **Payout processed** — According to task difficulty and quality
3. **Credit recorded** — Appears in your contributor profile

### Payout Schedule

| Difficulty | Base Payout |
|------------|-------------|
| Easy | $X |
| Medium | $Y |
| Hard | $Z |
| Expert | $W |

*Note: Actual amounts are communicated separately.*

## Common Issues

### PR Checks Failing

If automated checks fail:
1. Click "Details" to see the error
2. Fix the issue locally
3. Push the fix
4. Checks will re-run automatically

### No Reviewer Assigned

If no reviewer is assigned within 3 days:
1. Comment on the PR asking for review
2. Reach out on Slack in #terminalbench-support

### Disagreement with Feedback

If you disagree with review feedback:
1. Respond politely explaining your perspective
2. Provide reasoning for your approach
3. Be open to compromise
4. Escalate to Slack if needed

---

Next: [Submission Checklist](/portal/docs/submission-checklist) for a final pre-submit review.
