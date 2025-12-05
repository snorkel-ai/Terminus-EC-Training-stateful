# GitHub Workflow

This guide explains the Git workflow for submitting tasks to TerminalBench.

## Overview

We use a **feature branch workflow**:

1. Create a branch for your task
2. Make your changes
3. Open a Pull Request
4. Address review feedback
5. Get merged

```
main ─────●─────────────●─────────────●──────►
           \           /             /
            ●────●────●             /
             task/my-task          /
                        \         /
                         ●───●───●
                          task/another-task
```

## Creating a Task Branch

Always start from an up-to-date main branch:

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Create your task branch
git checkout -b task/descriptive-name
```

### Branch Naming Convention

Use the format: `task/brief-description`

**Good examples:**
- `task/implement-binary-search-tree`
- `task/debug-memory-leak`
- `task/optimize-database-query`

**Avoid:**
- `my-task` (too vague)
- `task1` (not descriptive)
- `fix` (no context)

## Making Commits

Write clear, descriptive commit messages:

```bash
# Good commit message
git commit -m "Add task: implement LRU cache with O(1) operations

- Define problem statement and constraints
- Include starter code template
- Add test cases for edge cases
- Write solution and verification script"

# Bad commit message
git commit -m "added stuff"
```

### Commit Best Practices

- **Atomic commits** — Each commit should be a logical unit
- **Present tense** — "Add feature" not "Added feature"
- **Reference issues** — Include issue numbers if applicable

## Pushing Changes

Push your branch to the remote repository:

```bash
git push origin task/descriptive-name
```

If this is your first push for this branch:

```bash
git push -u origin task/descriptive-name
```

## Creating a Pull Request

1. Go to the repository on GitHub
2. Click "Pull requests" → "New pull request"
3. Select your branch as the compare branch
4. Fill out the PR template completely

### PR Template

Your PR should include:

```markdown
## Task Summary
Brief description of what the task tests

## Difficulty Level
[ ] Easy  [ ] Medium  [ ] Hard  [ ] Expert

## Domain
[ ] Systems  [ ] Web  [ ] Data  [ ] DevOps  [ ] Other

## Checklist
- [ ] Task has clear problem statement
- [ ] Solution is verifiable
- [ ] Test cases included
- [ ] Edge cases covered
- [ ] Documentation complete
```

## Addressing Feedback

Reviewers may request changes:

1. Read feedback carefully
2. Make requested changes locally
3. Commit and push updates
4. Reply to comments explaining changes

```bash
# Make changes, then:
git add .
git commit -m "Address review feedback: clarify constraints"
git push origin task/descriptive-name
```

> 💡 **Tip:** Don't force-push after review has started. It makes tracking changes difficult.

## After Merge

Once your PR is merged:

```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete your local branch (optional)
git branch -d task/descriptive-name
```

## Common Issues

### Merge Conflicts

If main has changed since you branched:

```bash
# Fetch latest changes
git fetch origin

# Rebase your branch on main
git rebase origin/main

# Resolve any conflicts, then:
git push --force-with-lease origin task/descriptive-name
```

### Accidentally Committed to Main

```bash
# Create a branch from your current state
git checkout -b task/my-task

# Reset main to origin
git checkout main
git reset --hard origin/main
```

---

Next: [Submission Process](/portal/docs/submission-process)
