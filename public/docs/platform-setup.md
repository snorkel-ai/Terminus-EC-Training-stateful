# Platform Setup

This guide walks you through setting up your environment for creating and submitting TerminalBench tasks.

## Snorkel Expert Platform

The Expert Platform is where you'll manage your tasks, track progress, and receive feedback.

### Getting Access

1. You should have received an invitation email
2. Click the link to set up your account
3. Complete your profile information
4. Enable two-factor authentication (recommended)

### Platform Features

| Feature | Description |
|---------|-------------|
| Task Dashboard | View and manage your submitted tasks |
| Feedback Center | See reviewer feedback on your submissions |
| Progress Tracking | Track accepted tasks and earnings |
| Resources | Access training materials and guides |

## GitHub Setup

All task submissions go through GitHub. Make sure your Git environment is configured correctly.

### Configure Git Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### SSH Key Setup

We recommend using SSH keys for authentication:

```bash
# Generate a new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# Copy your public key (add to GitHub)
cat ~/.ssh/id_ed25519.pub
```

Add the public key to your [GitHub SSH settings](https://github.com/settings/keys).

### Verify Connection

```bash
ssh -T git@github.com
# Should see: Hi username! You've successfully authenticated...
```

## Repository Access

Once your GitHub account is linked:

1. You'll be added to the task repository
2. Clone the repo: `git clone git@github.com:your-org/terminal-bench-tasks.git`
3. Create a branch for each task

> ⚠️ **Never commit directly to main.** Always create a feature branch for your tasks.

## Development Environment

### Recommended Tools

- **VS Code** or your preferred editor
- **Node.js 18+** for running task validators
- **Docker** (optional) for containerized environments
- **Git** version 2.30+

### Useful VS Code Extensions

- GitLens — Enhanced Git integration
- Markdown Preview — For documentation
- ESLint — Code quality

## Troubleshooting

### Can't push to repository?

1. Verify you have repository access
2. Check your SSH key is added to GitHub
3. Ensure you're on a feature branch, not main

### Platform login issues?

1. Clear browser cookies
2. Try incognito/private mode
3. Contact support on Slack

---

Next: Learn [What Makes a Good Task](/portal/docs/what-makes-good-task)
