# Video: Creating Tests

Learn how to write effective pytest tests that verify task completion.

## Video Tutorial

<video-loom id="a00541ff2787464c84bf4601415ee624" title="Creating Tests for Your Task"></video-loom>

## What You'll Learn

- Structure of test_outputs.py
- Writing effective test cases
- Matching tests to task requirements
- Common testing patterns

## Test Structure

```python
"""Tests for [task name]."""
import pytest

def test_requirement_one():
    """Verify that [specific behavior] works."""
    # Arrange
    expected = ...
    
    # Act
    result = ...
    
    # Assert
    assert result == expected


def test_requirement_two():
    """Verify that [another behavior] works."""
    ...
```

## Best Practices

### 1. One Test Per Requirement

Each requirement in task.yaml should have its own test:

| Requirement | Test |
|-------------|------|
| "Output file created" | `test_output_file_exists()` |
| "Handle empty input" | `test_empty_input()` |
| "Return 400 for errors" | `test_error_returns_400()` |

### 2. Informative Names & Docstrings

```python
# Good
def test_api_returns_json_on_success():
    """Successful API calls return JSON with status field."""
    ...

# Bad
def test_1():
    ...
```

### 3. Test Behavior, Not Code

```python
# Good: Tests actual behavior
def test_sorts_correctly():
    """Output list is sorted alphabetically."""
    result = json.load(open("/output/items.json"))
    assert result == sorted(result)

# Bad: Checks implementation
def test_uses_sorted():
    """Solution uses sorted() function."""
    code = open("/app/main.py").read()
    assert "sorted(" in code  # Brittle!
```

### 4. Cover Edge Cases

```python
def test_empty_input():
    """Empty input handled gracefully."""
    ...

def test_large_input():
    """Large inputs don't timeout."""
    ...

def test_special_characters():
    """Unicode and special chars work."""
    ...
```

## Common Patterns

### File Output Tests

```python
from pathlib import Path

def test_output_exists():
    """Output file is created."""
    assert Path("/output/result.txt").exists()
```

### JSON Validation

```python
import json

def test_valid_json():
    """Output is valid JSON."""
    with open("/output/data.json") as f:
        data = json.load(f)  # Raises if invalid
    assert "items" in data
```

### API Tests

```python
import requests

def test_api_health():
    """Health endpoint returns 200."""
    r = requests.get("http://localhost:8080/health")
    assert r.status_code == 200
```

## Key Takeaways

1. ✅ Every requirement has a test
2. ✅ Every test has a docstring
3. ✅ Test behavior, not implementation
4. ✅ Cover edge cases
5. ✅ Keep tests independent
6. ❌ Don't use brittle string matching
7. ❌ Don't depend on test order

---

## Related Videos

- [Running your task](/portal/docs/creating-tasks/videos/running-your-task)
- [Creating a solution.sh](/portal/docs/creating-tasks/videos/creating-solution)
