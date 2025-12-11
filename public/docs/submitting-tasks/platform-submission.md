# Platform Submission Walkthrough

Submit your completed task through the Snorkel Expert Platform.

## Prerequisites

Before submitting:
- [ ] Oracle agent passes
- [ ] All CI/LLMaJ checks pass
- [ ] Tested against real agents
- [ ] Difficulty verified (< 80% pass rate)

## Video Walkthroughs

### 1. Running Your Task

<video-loom id="22449b76123d41e6abff0efb39d0b960" title="Running your task"></video-loom>

### 2. Creating a solution.sh

<video-loom id="140f2cf8f16d404abf5cbd7dcc66b7cb" title="Creating a solution.sh"></video-loom>

### 3. Creating Tests

<video-loom id="a00541ff2787464c84bf4601415ee624" title="Creating tests for your task"></video-loom>

## Submission Steps

### Step 1: Final Verification

Run all checks one more time:

```bash
# Oracle agent
tb run --agent oracle --task-id <task-name>

# CI/LLMaJ checks
tb tasks check <task-id> --model openai/@openai-tbench/gpt-5
```

### Step 2: Create ZIP File

**Important:** Select the individual files inside your task folder, not the folder itself.

```
my-task/
├── task.yaml        ← Select these
├── Dockerfile       ← 
├── docker-compose.yaml ←
├── solution/        ←
│   └── solve.sh
└── tests/           ←
    ├── run-tests.sh
    └── test_outputs.py
```

**On macOS:**
1. Open the task folder
2. Select all files (`Cmd+A`)
3. Right-click → Compress

**On Windows:**
1. Open the task folder
2. Select all files (`Ctrl+A`)
3. Right-click → Send to → Compressed folder

### Step 3: Upload to Platform

1. Go to the Snorkel Expert Platform
2. Navigate to **terminus-project**
3. Click **New Submission**
4. Upload your ZIP file
5. Fill in any required metadata
6. Submit

### Step 4: Monitor Status

After submission:
1. Check for automated feedback
2. Review any CI failures
3. Wait for peer review (1-3 days)

## After Submission

### Review Process

1. **Automated checks** run immediately
2. **Peer review** within 1-3 business days
3. **Feedback** provided if changes needed
4. **Acceptance** when all criteria met

### If Changes Requested

1. Review the feedback carefully
2. Make requested changes locally
3. Re-run all checks
4. Create new ZIP and resubmit

### Payment

- Payment processed after **acceptance**
- Based on difficulty: Easy $140 / Medium $245 / Hard $350
- Turnaround: 1-2 weeks after billing week

## Common Issues

### ZIP Structure Wrong

**Problem:** Files nested in extra folder.

**Fix:** ZIP the files directly, not the containing folder.

### Missing Files

**Problem:** Forgot to include a file.

**Fix:** Verify all files are in ZIP before uploading.

### CI Failures After Upload

**Problem:** Local checks passed but platform CI fails.

**Fix:** Check for environment differences, re-run locally with exact CI commands.

---

## Next Steps

- [Review submission checklist](/portal/docs/submitting-tasks/submission-checklist)
- [Understand the review process](/portal/docs/submitting-tasks/after-submission)
