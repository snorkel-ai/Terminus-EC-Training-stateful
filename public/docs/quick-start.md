# Quick Start Guide

Get up and running with TerminalBench in just a few minutes. This guide covers the essential setup and your first task submission.

## Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub account
- ✅ Access to the Snorkel Expert Platform
- ✅ Joined the Slack channel

## Step 1: Complete Platform Onboarding

Watch the onboarding video and review the materials to understand how the Expert Platform works.

1. Go to **Onboarding Materials** in the portal
2. Watch the platform walkthrough video (~15 minutes)
3. Review the onboarding slides

> 📌 **Important:** Complete platform onboarding before attempting to submit tasks. It covers essential workflow information.

## Step 2: Explore Example Tasks

Before creating your own, study what makes a good task:

1. Browse the [Example Tasks](/portal/docs/task-examples) documentation
2. Review tasks that have been accepted
3. Note patterns in complexity, clarity, and testability

## Step 3: Set Up Your Environment

Clone the task repository and set up your local development environment:

```bash
# Clone the repository
git clone https://github.com/your-org/terminal-bench-tasks.git

# Navigate to the directory
cd terminal-bench-tasks

# Install dependencies
npm install
```

## Step 4: Create Your First Task

1. Pick a domain you're expert in (systems, web, data, etc.)
2. Think of a challenge that requires multi-step reasoning
3. Write a clear problem statement
4. Create a verifiable solution
5. Write tests that validate correctness

## Step 5: Submit via GitHub

Once your task is ready:

1. Create a new branch: `git checkout -b task/your-task-name`
2. Commit your changes: `git commit -m "Add task: description"`
3. Push to remote: `git push origin task/your-task-name`
4. Open a Pull Request following the template

---

## What's Next?

Now that you're set up:

- Read [What Makes a Good Task](/portal/docs/what-makes-good-task) for quality guidelines
- Check the [Task Creation Guide](/portal/docs/task-creation-guide) for detailed instructions
- Review the [Submission Checklist](/portal/docs/submission-checklist) before submitting
