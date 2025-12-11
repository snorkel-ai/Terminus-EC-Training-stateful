# Quick Start Guide

Get up and running with TerminalBench in just a few minutes. This guide covers the essential setup and your first task submission.

## Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub account
- ✅ Access to the Snorkel Expert Platform (or GitHub repo)
- ✅ Joined the Slack channel `#ec-terminus-submission`
- ✅ Docker Desktop installed
- ✅ Received your API key via email

## 5-Minute Setup Checklist

### Step 1: Install Dependencies

```bash
# Install uv (package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Optional: clone the repository (if you have access to the repo)
git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git
cd snorkel-tb-tasks
```

### Step 2: Create Your First Task

**Option A: Use the task creation wizard (if you have access to the repo)**

```bash
uv run stb tasks create
```

Follow the prompts to set up your task structure.

**Option B: Download the task skeleton**

<pdf-download src="/Terminus-EC-Training-stateful/template-task.zip" title="Task Skeleton Template" />

Download and extract to get a pre-configured task structure with all required files.

### Step 3: Develop and Test

1. Edit `task.yaml` with your task instructions
2. Set up the Docker environment
3. Write your oracle solution (`solution.sh`)
4. Create pytest tests (`test_outputs.py`)
5. Run the oracle agent to verify:

```bash
uv run harbor run --agent oracle --path harbor_tasks/<task-name>
```

### Step 4: Submit

**GitHub workflow:**
```bash
git checkout -b username/<task-id>
git add harbor_tasks/<task-id>
git commit -m "Add task: <task-id>"
git push origin username/<task-id>
```

Then create a Pull Request with title starting with "Task:".

## What's Next?

Now that you're set up:

- Watch the [Onboarding Videos](/portal/docs/onboarding/platform-onboarding) for detailed walkthroughs
- Read [What Makes a Good Task](/portal/docs/understanding-tasks/what-makes-a-good-task) for quality guidelines
- Check the [Task Components](/portal/docs/understanding-tasks/task-components) reference
- Review the [Submission Checklist](/portal/docs/submitting-tasks/submission-checklist) before submitting
