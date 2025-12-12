# Platform Submission Guide

Complete step-by-step guide for creating and submitting tasks through the Snorkel Expert Platform.

## High-Level Workflow

Tasking is performed through the **terminus-project-v2** project on the Snorkel Expert Platform. The complete workflow:

1. Download the task skeleton template
2. Extract and rename the folder
3. Write your task instructions and configure metadata
4. Set up the Docker environment
5. Create and test your solution
6. Write and verify tests
7. Run agents and CI checks locally
8. Create ZIP file and submit
9. Monitor status and respond to feedback

---

## Prerequisites

Before starting, ensure you have:
- [ ] Docker Desktop installed and running
- [ ] Harbor CLI installed (or access to Harbor commands)
- [ ] API key for running agents (received via email)
- [ ] Access to the Snorkel Expert Platform

---

## Step 1: Download the Task Skeleton

Download the ZIP file of the task skeleton from the training site:

<pdf-download src="/Terminus-EC-Training-stateful/template-task.zip" title="Download Task Skeleton (ZIP)"></pdf-download>

## Step 2: Extract and Rename

1. Extract the ZIP file to your desired location
2. **Rename the folder** to match your task name (use kebab-case, e.g., `fix-memory-leak-python`)

## Step 3: Write Task Instructions and Configuration

### Edit instruction.md

Write clear, unambiguous task instructions in markdown format:

```markdown
# Your Task Title

Your task description here. Be explicit about all requirements.

## Requirements

1. Requirement one
2. Requirement two
3. Requirement three
```

See [Writing Instructions & Config](/portal/docs/creating-tasks/writing-task-yaml) for detailed guidance.

### Configure task.toml

Set up metadata and configuration:

```toml
version = "1.0"

[metadata]
author_name = "Your Name"
author_email = "your.email@example.com"
difficulty = "medium"
category = "debugging"
tags = ["python", "memory-leak", "debugging"]

[verifier]
timeout_sec = 120.0

[agent]
timeout_sec = 120.0

[environment]
build_timeout_sec = 600.0
cpus = 1
memory_mb = 2048
storage_mb = 10240
```

## Step 4: Configure Docker Environment

Edit the `environment/Dockerfile` to set up your task environment:

- Add any dependencies required by your task
- Pin all package versions for reproducibility
- Never copy `solution/` or `tests/` folders in the Dockerfile

For multi-container environments or custom configurations, see the [Docker environment documentation](/portal/docs/creating-tasks/creating-docker-environment).

### Docker Troubleshooting

If you encounter Docker issues:

1. Ensure Docker Desktop is running
2. On macOS, enable in Advanced Settings: **"Allow the default Docker socket to be used (requires password)"**
3. Try these commands if needed:

```bash
sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker
```

## Step 5: Test Your Solution Locally

Enter your task container interactively to test your solution:

```bash
harbor run --agent oracle --path harbor_tasks/<task-name> --interactive
```

While in the container, test your solution approach to ensure it works as expected.

## Step 6: Create Solution File

Create `solution/solve.sh` with the verified commands:

- This file is used by the Oracle agent to verify the task is solvable
- Must be deterministic (same result every run)
- Should demonstrate the command sequence, not just output the answer

See [Writing Oracle Solution](/portal/docs/creating-tasks/writing-oracle-solution) for guidance.

## Step 7: Write Tests

Create `tests/test.sh` and test files to verify task completion:

- The test script must produce `/logs/verifier/reward.txt` or `/logs/verifier/reward.json`
- Create pytest unit tests in `tests/test_outputs.py` (or similar)
- Place any test dependencies in the `tests/` directory

**Example test.sh:**

```bash
#!/bin/bash

cd /tests
uv venv
source .venv/bin/activate
uv pip install pytest

pytest test_outputs.py -v

# Produce reward file (REQUIRED)
if [ $? -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi
```

See [Writing Tests](/portal/docs/creating-tasks/writing-tests) for detailed guidance.

## Step 8: Run Oracle Agent

Verify your solution passes all tests:

```bash
harbor run --agent oracle --path harbor_tasks/<task-name>
```

This should **PASS**. If it doesn't, fix issues before proceeding.

## Step 9: Test with Real Agents

1. Set up your API key (received via email):

```bash
export OPENAI_API_KEY=<your-portkey-api-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

2. Run with GPT-5:

```bash
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task-name>
```

3. Run with Claude Sonnet 4.5:

```bash
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/<task-name>
```

Run each agent 2-3 times to gauge pass rate. Your task should have < 80% pass rate to be accepted.

## Step 10: Run CI/LLMaJ Checks Locally

Run CI/LLMaJ checks before submitting:

**GPT-5:**
```bash
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task-name>
```

**Claude Sonnet 4.5:**
```bash
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/<task-name>
```

All checks should pass before submission.

## Step 11: Final Verification

Before submitting, verify:

- [ ] Oracle agent passes
- [ ] All CI/LLMaJ checks pass
- [ ] Tested against real agents (pass rate < 80%)
- [ ] All files are present and correct

Run final checks:

```bash
# Oracle agent
harbor run --agent oracle --path harbor_tasks/<task-name>

# CI/LLMaJ checks
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task-name>
```

## Step 12: Create ZIP File

**Important:** Select the individual files inside your task folder, not the folder itself.

```
my-task/
├── instruction.md   ← Select these
├── task.toml       ←
├── environment/     ←
│   ├── Dockerfile   ← (or docker-compose.yaml)
│   └── [build files]
├── solution/        ←
│   └── solve.sh
└── tests/           ←
    ├── test.sh
    └── [test files]
```

**On macOS:**
1. Open the task folder
2. Select all files (`Cmd+A`)
3. Right-click → Compress

**On Windows:**
1. Open the task folder
2. Select all files (`Ctrl+A`)
3. Right-click → Send to → Compressed folder

## Step 13: Submit to Platform

1. Go to the Snorkel Expert Platform
2. Navigate to **terminus-project-v2**
3. Click **New Submission**
4. Upload your ZIP file
5. Fill in any required metadata
6. Submit

## Step 14: Monitor Status

After submission:

1. Check for automated feedback
2. Review any CI failures
3. Wait for peer review (1-3 business days)

---

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

---

## Common Issues

### ZIP Structure Wrong

**Problem:** Files nested in extra folder.

**Fix:** ZIP the files directly, not the containing folder.

### Missing Files

**Problem:** Forgot to include a file.

**Fix:** Verify all files are in ZIP before uploading. Check that `instruction.md`, `task.toml`, `environment/`, `solution/`, and `tests/` are all included.

### CI Failures After Upload

**Problem:** Local checks passed but platform CI fails.

**Fix:** Check for environment differences, re-run locally with exact CI commands.

### Docker Build Fails

**Problem:** Docker build fails on platform but works locally.

**Fix:** Ensure all dependencies are pinned to specific versions. Check for platform-specific differences.

---

## Video Walkthroughs

Watch these step-by-step videos to learn how to create and test your task:

### 1. Running Your Task

<video-loom id="22449b76123d41e6abff0efb39d0b960" title="Running your task"></video-loom>

### 2. Creating a solution.sh

<video-loom id="140f2cf8f16d404abf5cbd7dcc66b7cb" title="Creating a solution.sh"></video-loom>

### 3. Creating Tests for Your Task

<video-loom id="a00541ff2787464c84bf4601415ee624" title="Creating tests for your task"></video-loom>

---

## Next Steps

- [Understand task components](/portal/docs/understanding-tasks/task-components)
- [Review the submission checklist](/portal/docs/submitting-tasks/submission-checklist)
- [Learn about CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
- [Understand the review process](/portal/docs/submitting-tasks/after-submission)
