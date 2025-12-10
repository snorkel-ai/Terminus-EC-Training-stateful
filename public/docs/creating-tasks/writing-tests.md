# Writing Tests

The `tests/test_outputs.py` file contains pytest tests that verify task completion. Good tests are the foundation of a quality task.

## Basic Structure

```python
"""Tests for the data processing task."""
import pytest
import json
from pathlib import Path


def test_output_file_exists():
    """Verify the output file was created."""
    assert Path("/output/result.json").exists()


def test_output_format():
    """Verify the output has correct JSON structure."""
    with open("/output/result.json") as f:
        data = json.load(f)
    
    assert "status" in data
    assert "items" in data
    assert isinstance(data["items"], list)


def test_correct_count():
    """Verify the item count is correct."""
    with open("/output/result.json") as f:
        data = json.load(f)
    
    assert len(data["items"]) == 42
```

## Key Principles

### 1. Test Behavior, Not Implementation

Run the code and check results. Don't parse source code looking for patterns.

**Good:**
```python
def test_function_handles_empty_input():
    """Empty input should return empty list."""
    from app.main import process
    result = process("")
    assert result == []
```

**Bad:**
```python
def test_has_empty_check():
    """Check if code has empty input handling."""
    source = open("/app/main.py").read()
    assert "if not" in source  # Brittle!
```

### 2. Informative Docstrings

Every test must have a docstring explaining what behavior it checks. This is validated by CI.

```python
def test_api_returns_json():
    """API endpoint should return valid JSON with Content-Type header."""
    response = requests.get("http://localhost:8080/api/data")
    assert response.headers["Content-Type"] == "application/json"
    assert response.json()  # Parseable JSON
```

### 3. Match Task Requirements

Every requirement in task.yaml should have a corresponding test:

| task.yaml says... | Test verifies... |
|-------------------|------------------|
| "Return empty list for empty input" | `test_empty_input_returns_empty_list` |
| "Output to /data/result.csv" | `test_output_file_exists` |
| "Include header row" | `test_csv_has_header` |

### 4. Cover Edge Cases

Test the boundaries, not just the happy path:

```python
def test_empty_input():
    """Empty input is handled gracefully."""
    assert process("") == []

def test_single_item():
    """Single item input works correctly."""
    assert process("a") == ["a"]

def test_large_input():
    """Large input is handled efficiently."""
    result = process("x" * 10000)
    assert len(result) == 10000

def test_special_characters():
    """Special characters are preserved."""
    assert process("héllo 世界") == ["héllo", "世界"]
```

## run-tests.sh

The test runner script sets up the environment and runs pytest:

```bash
#!/bin/bash
cd /tests

# Set up virtual environment
uv venv
source .venv/bin/activate

# Install test dependencies
uv pip install pytest requests

# Run tests
pytest test_outputs.py -v
```

> **Note:** Test dependencies should be installed in `run-tests.sh`, NOT in the Dockerfile.

## Common Patterns

### Testing File Output

```python
def test_csv_output():
    """Verify CSV output format and content."""
    import csv
    
    with open("/output/data.csv") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    assert len(rows) > 0
    assert "id" in rows[0]
    assert "name" in rows[0]
```

### Testing API Endpoints

```python
import requests

def test_health_endpoint():
    """Health check endpoint returns 200."""
    response = requests.get("http://localhost:8080/health")
    assert response.status_code == 200

def test_api_error_handling():
    """Invalid requests return 400."""
    response = requests.post(
        "http://localhost:8080/api/data",
        json={"invalid": "data"}
    )
    assert response.status_code == 400
```

### Testing Database State

```python
import sqlite3

def test_database_populated():
    """Database contains expected records."""
    conn = sqlite3.connect("/app/data.db")
    cursor = conn.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    conn.close()
    
    assert count == 100
```

### Testing Command Output

```python
import subprocess

def test_cli_help():
    """CLI shows help message."""
    result = subprocess.run(
        ["python", "/app/cli.py", "--help"],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0
    assert "Usage:" in result.stdout
```

## Anti-Patterns to Avoid

### Brittle String Matching

```python
# BAD: Exact string match
def test_output():
    output = open("/output/log.txt").read()
    assert output == "Processing complete\n"

# GOOD: Check for key content
def test_output():
    output = open("/output/log.txt").read()
    assert "complete" in output.lower()
```

### Hardcoded Random Values

```python
# BAD: Assumes specific random output
def test_random():
    result = generate_random()
    assert result == 42

# GOOD: Check properties
def test_random():
    result = generate_random()
    assert 1 <= result <= 100
```

### Order-Dependent Tests

```python
# BAD: Tests depend on execution order
def test_1_setup():
    global data
    data = load_data()

def test_2_process():
    process(data)  # Fails if test_1 didn't run first

# GOOD: Each test is independent
def test_process():
    data = load_data()
    result = process(data)
    assert result is not None
```

## CI Validation

Your tests will be validated by:

| Check | Description |
|-------|-------------|
| `behavior_in_tests` | All task requirements have tests |
| `behavior_in_task_description` | All tested behavior is in task.yaml |
| `informative_test_docstrings` | Each test has a docstring |
| `ruff` | Code passes linting |

---

## Next Steps

- [Run oracle agent](/portal/docs/testing-and-validation/oracle-agent)
- [Review CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
