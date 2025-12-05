# GitHub Onboarding

Get started with TerminalBench using the GitHub workflow. Watch the onboarding video and download the slides to learn the Git-based submission process.

## Onboarding Video

<video-embed src="https://snorkel-ai.github.io/Terminus-EC-Training/video1251502681.mp4" title="GitHub Onboarding Video" />

## Onboarding Slides

<pdf-download src="/Terminus EC Onboarding.pdf" title="GitHub Onboarding Slides" />

## Key Takeaways

### What You'll Learn
- How to set up your local Git environment
- The branch → PR → CI workflow
- How to iterate based on automated feedback

### GitHub Workflow Overview

1. **Install uv**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. **Clone the repository**: `git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git`
3. **Create a task** using the CLI wizard: `uv run stb tasks create`
4. **Develop and test** your task locally
5. **Push a branch**: `git push origin username/<task-id>`
6. **Create a Pull Request** (title must start with "Task:")
7. **Iterate** until all CI/Evals pass

### Repository Access

Submissions are made through the private GitHub repository:
- **URL:** [https://github.com/snorkel-ai/snorkel-tb-tasks](https://github.com/snorkel-ai/snorkel-tb-tasks)

> **No access?** DM Puyun or Connor on Slack if you weren't onboarded via the Expert Platform.

## Initial Setup

### 1. Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Clone the Repository

```bash
git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git
cd snorkel-tb-tasks
```

### 3. Create a Task

```bash
uv run stb tasks create
```

Follow the wizard prompts to:
- Provide a unique task name
- Write a task description
- Select a category from the taxonomy
- Add 3-6 tags
- Set difficulty and time estimates

This creates a new folder in `harbor_tasks/` with all required files.

## Next Steps

After completing onboarding:

1. [Understand task components](/portal/docs/understanding-tasks/task-components)
2. [Learn what makes a good task](/portal/docs/understanding-tasks/what-makes-a-good-task)
3. [Watch the submission walkthrough](/portal/docs/submitting-tasks/github-submission)

---

> **Prefer a web interface?** Check out the [Platform Onboarding](/portal/docs/onboarding/platform-onboarding) instead.
