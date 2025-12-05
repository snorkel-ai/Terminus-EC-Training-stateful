# Environment Setup

This guide walks you through setting up your local development environment for creating TerminalBench tasks.

## Required Software

### 1. Docker Desktop

Docker is required to run task environments.

**Install:**
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Verify installation:**
```bash
docker --version
# Docker version 24.0.0 or higher
```

**macOS Configuration:**
1. Open Docker Desktop → Settings → Advanced
2. Enable: "Allow the default Docker socket to be used (requires password)"
3. If needed, run:
```bash
sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker
```

### 2. uv (Package Manager)

uv is used to manage Python dependencies and run commands.

**Install:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Verify:**
```bash
uv --version
```

### 3. Git

Git is required for the GitHub workflow and recommended for version control.

**Verify:**
```bash
git --version
```

**Configure (if needed):**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Repository Setup

### Clone the Repository

```bash
git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git
cd snorkel-tb-tasks
```

> **Note:** If you don't have access, DM Puyun or Connor on Slack.

### Verify Setup

```bash
# Check uv works with the project
uv run stb --help
```

You should see the CLI help output.

## API Key Setup

You'll receive an API key via email for running agents against your tasks.

**Set environment variables:**
```bash
export OPENAI_API_KEY=<your-portkey-api-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

> **Tip:** Add these to your `~/.bashrc` or `~/.zshrc` for persistence.

## Editor Setup (Optional)

### Recommended VS Code Extensions

- **Docker** — Manage containers
- **Python** — Syntax highlighting, linting
- **YAML** — For task.yaml editing
- **GitLens** — Enhanced Git integration

## Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**
```bash
# Ensure Docker Desktop is running
# On macOS, check menu bar for Docker icon
```

**Permission denied**
```bash
sudo chmod 666 /var/run/docker.sock
```

### uv Issues

**"Command not found: uv"**
```bash
# Re-run the installer
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or add to PATH manually
export PATH="$HOME/.cargo/bin:$PATH"
```

### Repository Access

**"Permission denied (publickey)"**
1. [Generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
2. Add it to your GitHub account
3. Test: `ssh -T git@github.com`

---

## Next Steps

Once your environment is set up:

- [Watch the onboarding video](/portal/docs/onboarding/platform-onboarding) for a full walkthrough
- [Create your first task](/portal/docs/creating-tasks/task-creation-wizard)
