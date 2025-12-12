# Troubleshooting

Solutions to common issues you might encounter.

---

## Docker Issues

### "Cannot connect to Docker daemon"

**Cause:** Docker Desktop isn't running.

**Fix:**
1. Start Docker Desktop
2. Wait for it to fully initialize (check menu bar icon)
3. Try again

### "Permission denied" on Docker socket

**Fix (macOS):**
```bash
sudo chmod 666 /var/run/docker.sock
```

Or enable in Docker Desktop:
1. Settings → Advanced
2. Enable "Allow the default Docker socket to be used"

**Fix (Linux):**
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### Container won't build

**Check:**
1. Dockerfile syntax is valid
2. Base image exists
3. All COPY source files exist

**Debug:**
```bash
cd harbor_tasks/<task-name>
docker build -t test . 2>&1 | tail -50
```

### Container starts but commands fail

**Enter interactive mode to debug:**
```bash
uv run harbor tasks start-env --path harbor_tasks/<task-name> --interactive
```

Then run commands manually to find the issue.

---

## Git & GitHub Issues

### "Permission denied (publickey)"

**Cause:** SSH key not set up or not added to GitHub.

**Fix:**
1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

2. Add to SSH agent:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. Add to GitHub:
```bash
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub → Settings → SSH Keys
```

4. Test:
```bash
ssh -T git@github.com
```

### Can't push to repository

**Check:**
1. You have repository access (can view on GitHub)
2. You're on a feature branch, not main
3. SSH key is working

**If no access:** DM Puyun or Connor on Slack.

### Merge conflicts

**Fix:**
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts in your editor
git add .
git rebase --continue
git push --force-with-lease origin your-branch
```

### Accidentally committed to main

**Fix:**
```bash
# Create branch from current state
git checkout -b task/my-task

# Reset main to remote
git checkout main
git reset --hard origin/main
```

---

## CI / Check Issues

### Checks pass locally but fail in PR

**Common causes:**

1. **Python version mismatch**
   - Check CI logs for version used
   - Test locally with same version

2. **Missing dependency**
   - Ensure all imports are in requirements

3. **Path differences**
   - Use absolute paths everywhere

4. **Environment variables**
   - Don't rely on local env vars

### "pinned_dependencies" failure

**Fix:** Add exact versions to all pip installs:
```dockerfile
# Before
RUN pip install numpy pandas

# After
RUN pip install numpy==1.26.4 pandas==2.1.0
```

### "check_task_absolute_path" failure

**Fix:** Change relative paths to absolute:
```yaml
# Before
instruction: "Edit config/settings.json"

# After
instruction: "Edit /app/config/settings.json"
```

### "informative_test_docstrings" failure

**Fix:** Add docstrings to all test functions:
```python
def test_output_exists():
    """Verify the output file is created at /output/result.json."""
    assert Path("/output/result.json").exists()
```

---

## Agent Issues

### API key not working

**Check:**
1. Key is set correctly:
```bash
echo $OPENAI_API_KEY
```

2. Base URL is set:
```bash
echo $OPENAI_BASE_URL
# Should be: https://api.portkey.ai/v1
```

3. Key hasn't expired (contact Slack if needed)

### Agent times out

**Possible causes:**
- Task timeout too short (increase in task.yaml)
- Solution is inefficient
- Environment is slow to start

**Fix:**
```yaml
# In task.yaml
timeout: 3600  # Increase from default
```

### Agent passes too often (> 80%)

**Your task is too easy.** Make it harder by:
- Adding more steps
- Using niche knowledge
- Creating debugging scenarios
- Adding edge cases

---

## Platform Issues

### Can't log in

1. Clear browser cache and cookies
2. Try incognito/private mode
3. Verify email address is correct
4. Try different browser
5. Contact Slack if still failing

### Upload fails

1. Check file size (< 100MB)
2. Ensure ZIP structure is correct
3. Try a different browser
4. Check internet connection

### Session expires frequently

1. Enable "Remember me" on login
2. Check browser isn't blocking cookies
3. Disable interfering extensions

---

## Getting Help

### Before asking:

1. ✅ Read the error message carefully
2. ✅ Search this documentation (⌘K)
3. ✅ Check Slack for similar issues
4. ✅ Try the suggested fix

### When asking:

Include:
- What you're trying to do
- What's happening instead
- Full error message
- What you've already tried

**Bad:**
> "It's not working"

**Good:**
> "When I run `uv run harbor run --agent oracle`, I get `FileNotFoundError: /app/data/input.csv`. The file exists in my task folder and is included in the Dockerfile COPY command. Full error: [paste]"

### Where to ask:

- **Slack:** `#ec-terminus-submission`
- **GitHub:** Comment on your PR
- **Payment issues:** Reach out to Snorkel
