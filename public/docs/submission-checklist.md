# Submission Checklist

Use this checklist before every task submission to ensure quality and completeness.

## Pre-Submission Checklist

Print this page or copy it to verify each item before submitting.

---

### 📝 Problem Statement

- [ ] Title is clear and descriptive
- [ ] Problem is explained in 2-3 paragraphs max
- [ ] Requirements are listed explicitly
- [ ] Input/output format is defined
- [ ] At least one example is provided
- [ ] No ambiguous language ("might", "could", "generally")

### 📐 Constraints

- [ ] All input constraints are stated (size, range, type)
- [ ] Time complexity requirement is specified (if applicable)
- [ ] Space complexity requirement is specified (if applicable)
- [ ] Edge cases are mentioned in constraints

### 💻 Starter Code

- [ ] File compiles/parses without errors
- [ ] All required functions/classes are defined
- [ ] Function signatures include type hints
- [ ] Docstrings explain expected behavior
- [ ] TODO comments mark implementation points
- [ ] **No solution logic included**

### ✅ Solution

- [ ] Solution is complete and correct
- [ ] Meets all stated constraints
- [ ] Handles all edge cases
- [ ] Code is clean and readable
- [ ] No hardcoded test-specific values

### 🧪 Test Cases

- [ ] Minimum 5 test cases
- [ ] Tests cover normal/happy path
- [ ] Tests cover edge cases:
  - [ ] Empty input
  - [ ] Single element
  - [ ] Maximum input size
  - [ ] Boundary values
- [ ] Tests are independent (don't rely on each other)
- [ ] Test names describe what they test
- [ ] All tests pass against solution

### 📋 Metadata

- [ ] `id` is unique and kebab-case
- [ ] `title` matches README title
- [ ] `difficulty` is accurate (easy/medium/hard/expert)
- [ ] `domain` is appropriate
- [ ] `tags` are relevant (3-5 tags)
- [ ] `estimated_time_minutes` is realistic
- [ ] `author` is your GitHub username

### 📁 File Structure

```
task-name/
├── README.md           ✓
├── starter/
│   └── solution.py     ✓
├── solution/
│   └── solution.py     ✓
├── tests/
│   └── test_solution.py ✓
└── metadata.json       ✓
```

---

## Quick Validation Commands

Run these before submitting:

```bash
# Check file structure
ls -la task-name/

# Verify starter code parses
python -m py_compile task-name/starter/solution.py

# Run tests against solution
cd task-name && pytest tests/ -v

# Validate metadata JSON
python -c "import json; json.load(open('task-name/metadata.json'))"
```

---

## Final Questions

Ask yourself:

1. **Would I understand this task if I saw it for the first time?**
   - If no → Clarify the problem statement

2. **Can this be solved in under 60 minutes by an expert?**
   - If no → Consider simplifying or splitting

3. **Is there exactly one correct answer (or clear criteria for correctness)?**
   - If no → Add more specific requirements

4. **Would current AI models struggle with this?**
   - If no → Increase complexity or add nuance

5. **Did I run all tests against my solution?**
   - If no → Do it now!

---

## Common Last-Minute Fixes

| Issue | Quick Fix |
|-------|-----------|
| Tests failing | Check solution matches latest requirements |
| Metadata invalid | Validate JSON syntax |
| Starter has hints | Remove any solution-revealing code |
| Missing edge case | Add test for empty/null/boundary |
| Unclear requirements | Add explicit constraints section |

---

## Ready to Submit?

If you've checked everything above:

1. `git add .`
2. `git commit -m "Add task: your-task-name"`
3. `git push origin task/your-task-name`
4. Create Pull Request on GitHub
5. Fill out PR template completely
6. Wait for review (1-3 business days)

**Good luck!** 🎉

---

Questions? Ask in **#terminalbench-support** on Slack.
