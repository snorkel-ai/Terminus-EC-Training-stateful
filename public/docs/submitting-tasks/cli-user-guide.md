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
uv tool install snorkelai-stb --find-links https://snorkel-python-wheels.s3.us-west-2.amazonaws.com/stb/index.html --python >= "3.12"
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
stb harbor run -m claude-sonnet-4-5 -p ./my-task-name
```

Run each agent 2-3 times to gauge pass rate. Tasks should be challenging enough that agents don't pass every time (< 80% pass rate).

### Step 10: Submit to Platform

```bash
stb submissions create ./my-task-name
```

This automatically:
- Zips your task folder
- Uploads to the platform
- Runs automated checks

### Step 11: Check CI Results and Update

```bash
stb submissions list
```

Check your submission status. If changes are needed, fix issues and update:

```bash
stb submissions update ./my-task-name
```

Note: Updates automatically send the submission to a reviewer. You can only update submissions in "NEEDS_REVISION" state.

---

## For Reviewers

### List Review Assignments

```bash
stb reviews list
```

### Download Submission for Review

```bash
stb reviews download -s SUBMISSION_ID
```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `stb login` | Authenticate with the platform |
| `stb keys refresh` | Refresh AI credentials if you run out of credits |
| `stb keys show` | Show current AI credentials |
| `stb init [name]` | Download task skeleton template |
| `stb harbor <cmd>` | Run harbor commands with AI credentials |
| `stb claude` | Run Claude Code with AI credentials |
| `stb submissions create <folder>` | Create and upload a new submission |
| `stb submissions update <folder>` | Update an existing submission |
| `stb submissions list` | List your submissions |
| `stb submissions download -s ID` | Download your submission |
| `stb reviews list` | List review assignments |
| `stb reviews download -s ID` | Download submission for review |

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
stb harbor --help
```

For issues, contact your project administrator.
