# Example Tasks

Learn from these example tasks that demonstrate quality standards and various task types.

## Example 1: VimGolf Challenge

| Property | Value |
|----------|-------|
| **Category** | games |
| **Difficulty** | Medium |
| **Tags** | games, vim, text-editing |

### Task Instruction

```yaml
instruction: |
  You are given a fresh install with python installed.
  First, use pip to install vimgolf.
  Then, read the file "/challenge.txt" to get the challenge id.
  Then, use vimgolf show <CHALLENGE_ID> to get the best scores,
  as well as the start file and end file.
  Then, write the Start File to /start.txt and End File to /end.txt
  Attempt the vimgolf challenge using vimgolf local /start.txt /end.txt,
  and output the string of vim inputs in "/score.txt".
  
  Your primary objective is to solve the problem within the
  minimum score * 1.5 in the leaderboard.
```

### Why It's Good

- ✅ Multi-step: install → read → query → write → solve
- ✅ Clear success criteria (score threshold)
- ✅ Requires reasoning about vim commands
- ✅ Verifiable output

---

## Example 2: OpenCV Debugging

| Property | Value |
|----------|-------|
| **Category** | debugging |
| **Difficulty** | Medium |
| **Tags** | computer-vision, jupyter-notebooks, bugfix |

### Task Instruction

```yaml
instruction: |
  A Jupyter notebook at /app/opencv_analysis.ipynb contains
  several OpenCV image processing operations, but it has multiple
  errors preventing it from running successfully.
  Fix all errors in the notebook so that it executes completely
  without errors and produces the expected output image.
```

### Why It's Good

- ✅ Requires understanding computer vision code
- ✅ Multiple bugs to find and fix
- ✅ Clear success criteria (notebook runs completely)
- ✅ Output is verifiable

---

## Example 3: Python Bytecode Decompilation

| Property | Value |
|----------|-------|
| **Category** | software-engineering |
| **Difficulty** | Hard |
| **Tags** | python, bytecode, serialization |

### Task Instruction

```yaml
instruction: |
  Your task is to decompile a Python function in bytecode format,
  compiled in CPython 3.8, and save the function in decompiled.py
  in the same folder as task.yaml.
  The function name should be "func".
  Note that the function is pickled using dill and serialized
  using base64 in the file called func.serialized.
```

### Why It's Good

- ✅ Requires niche knowledge (bytecode, dill, base64)
- ✅ Multi-step process
- ✅ Hard for LLMs without domain expertise
- ✅ Deterministic verification

---

## Example 4: Python Environment Setup

| Property | Value |
|----------|-------|
| **Category** | system-administration |
| **Difficulty** | Medium |
| **Tags** | environment-setup, python, virtualenv |

### Task Instruction

```yaml
instruction: |
  Install Python using pyenv, create a virtual environment using
  pyenv/virtualenv called "venv", activate it and install
  numpy 1.26.4 in it.
  You shouldn't get any warning during Python installation.
  Make sure that tkinter is also available in the virtual environment.
```

### Why It's Good

- ✅ Real-world setup task
- ✅ Multiple requirements (pyenv, virtualenv, specific package)
- ✅ Hidden complexity (tkinter requires system deps)
- ✅ Verifiable final state

---

## Anti-Examples: Tasks to Avoid

### ❌ Too Easy

```yaml
instruction: "Write a function that reverses a string"
```

**Problem:** One-liner in most languages, GPT-4 solves instantly.

### ❌ Too Vague

```yaml
instruction: "Build a web scraper"
```

**Problem:** No specific requirements, impossible to verify.

### ❌ Requires External Resources

```yaml
instruction: "Query the Twitter API to get trending topics"
```

**Problem:** Requires API credentials, network access.

### ❌ Ambiguous Success Criteria

```yaml
instruction: "Make this code better"
```

**Problem:** "Better" is subjective without specific metrics.

---

## Task Inspiration

Looking for ideas? Consider tasks involving:

- **Concurrency bugs** — Race conditions, deadlocks
- **Algorithm implementation** — With specific constraints
- **Code refactoring** — With measurable improvement goals
- **Security vulnerabilities** — Find and fix issues
- **Performance optimization** — With benchmarks

---

## Next Steps

- [Learn difficulty guidelines](/portal/docs/understanding-tasks/difficulty-guidelines)
- [Start creating your task](/portal/docs/creating-tasks/task-creation-wizard)
