# Troubleshooting

Solutions to common issues you might encounter.

---

## Git & GitHub Issues

### Can't push to repository

**Symptoms:** `Permission denied` or `remote: Permission to X denied`

**Solutions:**

1. **Check SSH key setup:**
   ```bash
   ssh -T git@github.com
   # Should show: "Hi username! You've successfully authenticated"
   ```

2. **Verify repository access:**
   - Go to the repository on GitHub
   - Check if you can see the "Code" tab
   - If not, request access in Slack

3. **Make sure you're on a branch:**
   ```bash
   git branch
   # Should show your branch name, not main
   ```

4. **Use SSH URL (not HTTPS):**
   ```bash
   git remote set-url origin git@github.com:org/repo.git
   ```

### Merge conflicts

**Symptoms:** `CONFLICT (content): Merge conflict in file.py`

**Solution:**

```bash
# Fetch latest from main
git fetch origin

# Rebase your branch
git rebase origin/main

# If conflicts appear, resolve them in your editor
# Then mark as resolved:
git add .
git rebase --continue

# Force push (with lease for safety)
git push --force-with-lease origin your-branch
```

### Accidentally committed to main

**Solution:**

```bash
# Create a branch from current state
git checkout -b task/my-task

# Go back to main and reset
git checkout main
git reset --hard origin/main
```

---

## Platform Issues

### Can't log in

**Try these steps:**

1. Clear browser cache and cookies
2. Try incognito/private mode
3. Verify you're using the correct email
4. Try a different browser
5. Contact support if still failing

### Session expired frequently

**Solution:**
- Enable "Remember me" when logging in
- Check that cookies aren't being blocked
- Disable browser extensions that might interfere

### Page not loading / showing errors

**Try:**

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear site data in browser settings
3. Try different browser
4. Check if others have the issue (Slack)

---

## Task Submission Issues

### CI checks failing

**Check the error message:**

| Error | Solution |
|-------|----------|
| "Syntax error" | Fix Python/JS syntax in your files |
| "Tests failed" | Ensure solution passes all tests |
| "Invalid metadata" | Check metadata.json for typos |
| "Missing file" | Ensure all required files exist |

**View detailed logs:**
1. Click "Details" next to the failed check
2. Expand the failed step
3. Read the error message

### Tests pass locally but fail in CI

**Common causes:**

1. **Different Python version:**
   ```bash
   # Check your version
   python --version
   # CI uses Python 3.9 or 3.11 typically
   ```

2. **Missing dependencies:**
   - Only use standard library or approved packages
   - Check if your imports are available in CI

3. **Timing issues:**
   ```python
   # Bad: Flaky timing test
   time.sleep(1)
   assert time_elapsed() > 1.0
   
   # Good: Account for variance
   time.sleep(1)
   assert time_elapsed() > 0.9
   ```

4. **Path issues:**
   ```python
   # Bad: Absolute path
   open('/Users/me/file.txt')
   
   # Good: Relative path
   open('file.txt')
   ```

### PR not getting reviewed

**If no review after 3 days:**

1. Comment on the PR: "@reviewer This PR is ready for review"
2. Post in #terminalbench-support on Slack
3. Make sure all CI checks are passing

---

## Local Development Issues

### Tests not running

**Check pytest installation:**
```bash
pip install pytest
pytest --version
```

**Run with verbose output:**
```bash
pytest tests/ -v --tb=long
```

### Import errors

**Check your file structure:**
```
task/
├── solution/
│   └── solution.py   # Your solution
└── tests/
    └── test_solution.py  # Must import correctly
```

**In test file:**
```python
# Make sure the import path is correct
import sys
sys.path.insert(0, '../solution')
from solution import YourClass
```

---

## Performance Issues

### Solution is too slow

**Optimization checklist:**

1. **Check time complexity:**
   - O(n²) → O(n log n) or O(n)?
   - Nested loops over same data?

2. **Use efficient data structures:**
   ```python
   # Slow: O(n) lookup
   if item in my_list:
   
   # Fast: O(1) lookup  
   if item in my_set:
   ```

3. **Avoid repeated work:**
   ```python
   # Slow: Recalculates every time
   for i in range(len(data)):
       total = sum(data)  # O(n) each iteration!
   
   # Fast: Calculate once
   total = sum(data)
   for i in range(len(data)):
       # use total
   ```

---

## Getting Help

### Before asking for help:

1. ✅ Read the error message carefully
2. ✅ Search this documentation (⌘K)
3. ✅ Check Slack for similar issues
4. ✅ Try the solution yourself first

### When asking for help:

Include:
- What you're trying to do
- What's happening instead
- Error messages (full text)
- What you've already tried

**Bad:** "It's not working"

**Good:** "When I run pytest, I get ImportError: No module named 'solution'. I've verified the file exists at solution/solution.py. Full error: [paste error]"

---

## Contact Support

**Slack:** #terminalbench-support

**Include:**
- Your GitHub username
- Task name (if applicable)
- PR link (if applicable)
- Screenshots of errors

---

*Last updated: December 2024*
