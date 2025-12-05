# Task Components

Every TerminalBench task consists of several required components. This guide explains each one and how they work together.

## File Structure

```
my-task/
├── task.yaml           # Task instructions and metadata
├── Dockerfile          # Environment setup
├── docker-compose.yaml # Container orchestration
├── solution/
│   └── solve.sh        # Oracle solution
├── tests/
│   ├── run-tests.sh    # Test execution script
│   └── test_outputs.py # Pytest verification
└── [optional files]    # Data, configs, etc.
```

## Required Components

### 1. task.yaml

The task instruction file contains everything the agent sees.

```yaml
# Required fields
instruction: |
  Your task is to fix the bug in /app/main.py that causes
  the application to crash when processing empty input.
  
  The fix should:
  1. Handle empty string input gracefully
  2. Return an empty list instead of crashing
  3. Not modify any other behavior

# Metadata (not shown to agent)
category: debugging
difficulty: medium
tags: [python, error-handling, bugfix]
timeout: 1800  # 30 minutes
```

**Key principles:**
- Be **explicit** — state all requirements
- Use **absolute paths** (e.g., `/app/main.py`)
- Mention all **output files** by name if tests check for them
- Written by a **human** (not LLM-generated)

### 2. Dockerfile

Sets up the task environment. Must be:
- **Reproducible** — Same result every build
- **Lightweight** — Only necessary dependencies
- **Unprivileged** — No root requirements

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies (pinned versions!)
RUN pip install numpy==1.26.4 pandas==2.1.0

# Copy task files
COPY app/ /app/

# Do NOT copy solution or tests
```

**Important:**
- Pin all dependency versions
- Never copy `solution/` or `tests/` in Dockerfile
- No privileged mode

### 3. docker-compose.yaml

Orchestrates the task environment:

```yaml
version: "3.8"
services:
  task:
    build: .
    volumes:
      - ./workspace:/workspace
    environment:
      - PYTHONPATH=/app
```

### 4. Oracle Solution (solution/solve.sh)

Expert-authored step-by-step solution that reliably completes the task.

```bash
#!/bin/bash

# Navigate to the application
cd /app

# Fix the bug by editing the file
sed -i 's/def process(data):/def process(data):\n    if not data:\n        return []/' main.py

# Verify the fix
python -c "from main import process; assert process('') == []"
```

**Key principles:**
- Demonstrates the **command sequence**, not just the answer
- Must be **deterministic** — same result every run
- No hardcoded outputs (don't just `echo` the answer)

### 5. Tests (tests/test_outputs.py)

Pytest tests that verify task completion:

```python
"""Tests for the bug fix task."""
import pytest
from app.main import process

def test_empty_input_returns_empty_list():
    """Verify empty input is handled gracefully."""
    result = process("")
    assert result == []

def test_normal_input_unchanged():
    """Verify normal behavior is preserved."""
    result = process("hello")
    assert result == ["h", "e", "l", "l", "o"]

def test_none_input_handled():
    """Verify None input doesn't crash."""
    result = process(None)
    assert result == []
```

**Key principles:**
- **Informative docstrings** — Each test explains what it checks
- **All behavior tested** — Every requirement has a test
- **Not brittle** — Avoid exact string matching
- **Behavioral testing** — Run code, don't parse it statically

### 6. run-tests.sh

Script that executes the tests:

```bash
#!/bin/bash
cd /tests
uv venv
source .venv/bin/activate
uv pip install pytest
pytest test_outputs.py -v
```

## Optional Components

| Component | Use Case |
|-----------|----------|
| Data files | Input data, config files, sample databases |
| solution.yaml | For interactive commands (vim, etc.) |
| Custom tools | Additional scripts or binaries |
| Multiple containers | Complex multi-service environments |

## Validation Checklist

Before submission, verify:

- [ ] task.yaml has all required fields
- [ ] Dockerfile builds successfully
- [ ] Dependencies have pinned versions
- [ ] Solution demonstrates command sequence
- [ ] Tests have informative docstrings
- [ ] All behavior in task.yaml has corresponding tests
- [ ] All behavior in tests is described in task.yaml
- [ ] No solution/test files copied in Dockerfile
- [ ] Canary string present in required files

---

## Next Steps

- [Learn the task taxonomy](/portal/docs/understanding-tasks/task-taxonomy)
- [See example tasks](/portal/docs/understanding-tasks/example-tasks)
- [Create your first task](/portal/docs/creating-tasks/task-creation-wizard)
