# Quick Start Guide

Get up and running with TerminalBench in just a few minutes. This guide covers everything you need to start creating tasks.

## Prerequisites

Before you begin, make sure you have:

- Access to the Snorkel Expert Platform
- Joined the Slack channel `#ec-terminus-submission`
- Joined the Notification channel `#ec-terminus-announcements`
- Received your API key via email

## Environment Setup
Once you have the prerequisites taken care of, follow the following steps: 

<details>
<summary><strong>Step 1: Install Docker Desktop</strong></summary>

Docker is required to run task environments. Note that you need to have at least version 24.0.0 or higher. 

**Install:**
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Verify installation:**
```bash
docker --version
# Docker version 24.0.0 or higher
```

**Special macOS Configuration:**

1. Open Docker Desktop → Settings → Advanced
2. Enable: "Allow the default Docker socket to be used (requires password)"
3. If needed, run:
```bash
sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker
```

</details>

<details>
<summary><strong>Step 2: Install Harbor</strong></summary>

Harbor is the main task validation and testing framework. 

```bash
pip install harbor==0.1.25
```

</details>

<details>
<summary><strong>Step 3: Configure Your API Keys</strong></summary>

You'll receive an API key via email for running agents against your tasks.

**Set environment variables:**
```bash
export OPENAI_API_KEY=<your-portkey-api-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

> **Tip:** You can add these to your `~/.bashrc` or `~/.zshrc` for persistence.

</details>

<details>
<summary><strong>Step 4: Work On Your First Task</strong></summary>

Follow the complete [Platform Submission Guide](/portal/docs/submitting-tasks/platform-submission) for detailed step-by-step instructions on:

- Downloading the task skeleton template
- Writing task instructions and configuration
- Setting up the Docker environment
- Creating your solution and tests
- Running local validation
- Submitting via ZIP upload to the Snorkel Expert Platform

</details>

---

We have found the following VS Code extensions will improve your experience with TerminalBench: 

- **Docker** — For managing containers in VS Code; 
- **Python** — For highlighting syntax, linting, etc.; 
- **Markdown** — For editing markdown files (instruction.md); 
- **TOML** — For editing task.toml files; 
- **GitLens** — For an improved Git integration; 


<details>
<summary><strong>Troubleshooting</strong></summary>

### Docker Issues

**"Cannot connect to Docker daemon"**
- Ensure Docker Desktop is running
- On macOS, check menu bar for Docker icon

**Permission denied**
```bash
sudo chmod 666 /var/run/docker.sock
```

For more help, see the [Troubleshooting Guide](/portal/docs/reference/troubleshooting).

</details>

---

## What's Next?

Now that you're set up:

- 📺 Watch the [Onboarding Videos](/portal/docs/onboarding/platform-onboarding) for detailed walkthroughs
- 📖 Read [What Makes a Good Task](/portal/docs/understanding-tasks/what-makes-a-good-task) for quality guidelines
- 📋 Check the [Task Components](/portal/docs/understanding-tasks/task-components) reference
- ✅ Review the [Submission Checklist](/portal/docs/submitting-tasks/submission-checklist) before submitting
