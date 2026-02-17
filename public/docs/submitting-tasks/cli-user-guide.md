# Snorkel Terminal-Bench CLI - User Guide

A command-line tool for submitting and managing your Snorkel Terminal-Bench assignments.

## Installation

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running

### Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Install stb

```bash
uv tool install snorkelai-stb -f https://snorkel-python-wheels.s3.us-west-2.amazonaws.com/stb/index.html -p 3.12 -U
```

The `stb` command will be available globally (you may need to restart your terminal).

### Verify Installation

```bash
stb --help
```

---

## Setup

### Authentication

```bash
stb login
```

This opens the Experts platform website. Click the email dropdown in the top-right corner, select 'New API Key', copy it, and paste it in your terminal.

---

## Task Creation Workflow

### Step 1: Download Task Skeleton

```bash
stb init my-task-name
```

This creates a new folder with the required task structure:

```
my-task-name/
├── instruction.md     # Task instructions
├── task.toml          # Task configuration
├── environment/
│   └── Dockerfile     # Docker environment setup
├── solution/
│   └── solve.sh       # Oracle solution
└── tests/
    ├── test.sh        # Test runner
    └── test_outputs.py
```

### Step 2: Write Task Instructions

Edit `instruction.md` with clear, unambiguous task instructions:

```markdown
# Your Task Title

Your task description here. Be explicit about all requirements.

## Requirements

1. Requirement one
2. Requirement two
3. Requirement three
```

### Step 3: Configure task.toml

Set up metadata and configuration:

```toml
version = "1.0"

[metadata]
author_name = "anonymous"
author_email = "anonymous"
difficulty = "medium"
category = "debugging"
tags = ["python", "memory-leak", "debugging"]

[verifier]
timeout_sec = 120.0

[agent]
timeout_sec = 600.0

[environment]
build_timeout_sec = 600.0
cpus = 1
memory_mb = 2048
storage_mb = 10240
```

### Step 4: Configure Docker Environment

Edit `environment/Dockerfile` to set up your task environment:

- Add any dependencies required by your task
- Pin all package versions for reproducibility
- Never copy `solution/` or `tests/` folders in the Dockerfile

### Step 5: Test Your Solution Locally

Enter your task container interactively:

```bash
stb harbor tasks start-env --path ./my-task-name --interactive
```

Test your solution approach inside the container.

### Step 6: Create Solution File

Create `solution/solve.sh` with verified commands:

- Must be deterministic (same result every run)
- Demonstrates the command sequence to solve the task

### Step 7: Write Tests

Create tests in `tests/` to verify task completion:

- `test.sh` must produce `/logs/verifier/reward.txt`
- Create pytest unit tests in `tests/test_outputs.py`

### Step 8: Run Oracle Agent

Verify your solution passes all tests:

```bash
stb harbor run -a oracle -p ./my-task-name
```

This should **PASS**. Fix any issues before proceeding.

### Step 9: Test with Real Agents

Run with GPT-5:

```bash
stb harbor run -m gpt-5 -p ./my-task-name
```

Run with Claude Sonnet 4.5:

```bash
stb harbor run -m @anthropic-tbench/claude-sonnet-4-5 -p ./my-task-name
```

Run each agent 2-3 times to gauge pass rate. Tasks should be challenging enough that agents don't pass every time (< 80% pass rate).

### Step 10: Submit to Platform

```bash
stb submissions create ./my-task-name -p PROJECT_ID
```

This automatically:
- Zips your task folder
- Uploads to the platform
- Runs automated checks

### Step 11: Check Submission Results and Update

```bash
stb submissions list
```

Assignment States:
- `EVALUATION_PENDING` - Waiting for system evaluation
- `NEEDS_REVISION` - Reviewer requested changes (can update)
- `REVIEW_PENDING` - Waiting for reviewers' review
- `ACCEPTED` - Task accepted
- `OFFERED` - Offer made
- `REJECTED` - Task rejected
- `SKIPPED` - Task skipped

Check your submission status. If changes are needed, fix issues and update:

```bash
stb submissions update ./my-task-name
```

Note: Updates automatically send the submission to a reviewer. You can only update submissions in "NEEDS_REVISION" state.

---

## For Reviewers

This section covers CLI commands for reviewing submissions. For resources for onboarding and training as a reviewer, see [Reviewer Training](/portal/docs/reviewing-tasks/reviewer-training).

### Get the Current Review or Request a New Review Assignment if There Are No Ongoing Reviews

```bash
stb reviews get -p PROJECT_ID
```

### List Review Assignments

```bash
stb reviews list
```

### Download a Submission for Review

```bash
stb reviews download REVIEW_ID
```

### Accept a Submission You Reviewed
```bash
stb reviews accept REVIEW_ID
```

### Reject a Submission You Reviewed
```bash
stb reviews reject REVIEW_ID
```

### Request Revision for a Submission You Reviewed
```bash
stb reviews revise REVIEW_ID
```

### Skip a Submission You Don't Want to Review
```bash
stb reviews skip REVIEW_ID --reason REASON --rationale RATIONALE
```
The reason for skipping is required, and must be one of the following:
- outside_expertise
- unclear_or_ambiguous
- too_time_consuming
- invalid_input
- other


### View an Ongoing Review in the Browser
```bash
stb reviews view REVIEW_ID
```

---

## Troubleshooting

### "This folder has already been submitted"

Use `stb submissions update` instead of `create` for existing submissions.

### "Cannot update: submission is in X state (must be NEEDS_REVISION)"

You can only update submissions in "NEEDS_REVISION" state. Check status with `stb submissions list`.

### "Feedback did not pass"

Review the detailed feedback output, fix issues, and resubmit.

### Docker Issues

1. Ensure Docker Desktop is running
2. On macOS, enable: **"Allow the default Docker socket to be used"** in Docker Advanced Settings

### API Key Issues

Run `stb login` to authenticate and store your API key.

### AI Credentials Issues

Run `stb keys refresh` to generate new credentials.

### "You are not assigned to review submission"

Use `stb reviews list` to see your assigned reviews.

### "Submission not found" for reviewers

Use `stb reviews download` instead of `stb submissions download` when downloading submissions assigned for review.

---

## Getting Help

```bash
stb --help
stb submissions --help
stb reviews --help
stb harbor --help
```

For issues, contact your project administrator.


## Upgrading

The CLI automatically checks for updates once per day. When an update is available, you'll see a message like:

```
⚠️  Update available: 1.1.0 → 1.2.0
   Run: uv tool upgrade snorkelai-stb --find-links https://snorkel-python-wheels.s3.us-west-2.amazonaws.com/stb/index.html --python ">=3.12"
```

To upgrade, please run the command manually.

Your configuration and credentials are preserved during upgrades.


## Uninstallation

### Uninstall snorkelai-stb

**If you installed using `uv tool install` (recommended method):**

```bash
uv tool uninstall snorkelai-stb
```

If you installed in a virtual environment:

```bash
# Replace .venv with your virtual environment directory name
rm -rf .venv
```

### Remove Configuration Files (Optional)

The CLI stores configuration and credentials in your system. To completely remove all data:

**Linux/macOS:**
```bash
rm -rf ~/.config/stb/
```

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\stb"
```