# Common Errors

Anti-patterns and mistakes to watch for when creating or reviewing tasks.

## Instruction Problems

### Ambiguous Language

| Avoid | Use Instead |
|-------|-------------|
| "Make it better" | "Reduce runtime by 50%" |
| "Fix the issues" | "Fix the 3 failing tests" |
| "Handle errors properly" | "Return HTTP 400 for invalid input" |
| "Optimize the code" | "Achieve O(n log n) complexity" |

### Relative Paths

```yaml
# Bad
instruction: "Edit config/settings.json"

# Good  
instruction: "Edit /app/config/settings.json"
```

### Missing Output Specs

```yaml
# Bad
instruction: "Process the data and save results"

# Good
instruction: "Process /data/input.csv and save results to /output/results.json"
```

### Unverifiable Tool Requirements

```yaml
# Bad - Can't verify vim was used
instruction: "Use vim to edit the file"

# Good - Verifies the result
instruction: "Change the port from 8080 to 3000 in /app/config.txt"
```

## Test Problems

### Brittle String Matching

```python
# Bad - Breaks with formatting changes
def test_output():
    output = open("/output/log.txt").read()
    assert output == "Processing complete.\n"

# Good - Checks for key content
def test_output():
    output = open("/output/log.txt").read()
    assert "complete" in output.lower()
```

### Implementation Testing

```python
# Bad - Tests implementation, not behavior
def test_uses_sorted():
    code = open("/app/main.py").read()
    assert "sorted(" in code

# Good - Tests actual behavior
def test_output_is_sorted():
    result = process_data()
    assert result == sorted(result)
```

### Missing Docstrings

```python
# Bad
def test_1():
    assert process("") == []

# Good
def test_empty_input_returns_empty_list():
    """Verify that empty string input returns an empty list."""
    assert process("") == []
```

### Order-Dependent Tests

```python
# Bad - test_2 depends on test_1
def test_1_setup():
    global data
    data = load_data()

def test_2_process():
    result = process(data)
    assert result

# Good - Each test is independent
def test_process():
    data = load_data()
    result = process(data)
    assert result
```

### Hardcoded Random Values

```python
# Bad - Assumes specific random output
def test_random_sample():
    result = random_sample(data)
    assert result == [3, 7, 2]

# Good - Tests properties
def test_random_sample_size():
    result = random_sample(data, n=3)
    assert len(result) == 3
    assert all(item in data for item in result)
```

## Solution Problems

### Hardcoded Answers

```bash
# Bad - Just outputs the answer
echo "The answer is 42" > /output/result.txt

# Good - Derives the answer
python /app/calculate.py > /output/result.txt
```

### Non-Deterministic Commands

```bash
# Bad - Output order varies
ls /data/ > /output/files.txt

# Good - Consistent ordering
ls /data/ | sort > /output/files.txt
```

### Missing Error Handling

```bash
# Bad - Continues after errors
cd /nonexistent
do_something

# Good - Fails fast
set -e
cd /app
do_something
```

## Cheating Opportunities

### Exposing Test Logic

```dockerfile
# Bad - Agent can read test files
COPY tests/ /tests/
```

Tests should be mounted at runtime, not baked into the image.

### Answer in Git History

```dockerfile
# Bad - Agent could see newer commits with answers
RUN git clone https://github.com/example/repo.git

# Good - Pin to specific commit
RUN git clone https://github.com/example/repo.git \
    && cd repo && git checkout abc123
```

### Editable Data Files

If tests check data files, ensure agents can't just edit them to pass:

```python
# Bad - Agent could just write the expected values
def test_processed_data():
    data = json.load(open("/data/output.json"))
    assert data["total"] == 42

# Good - Verify computation, not just final value
def test_computation():
    input_data = json.load(open("/data/input.json"))
    output_data = json.load(open("/data/output.json"))
    expected = sum(item["value"] for item in input_data)
    assert output_data["total"] == expected
```

## Difficulty Issues

### Too Easy

Signs a task might be too easy:
- Single-step solution
- Common tutorial topic
- Simple API usage
- Pattern matching suffices

### Too Hard / Unfair

Signs a task might be problematic:
- Requires unavailable information
- Environment is unreliable
- Success depends on luck
- Requirements are contradictory

---

## Quick Reference

| Category | Red Flag | Fix |
|----------|----------|-----|
| Instructions | Relative paths | Use absolute paths |
| Instructions | "Better", "properly" | Specific metrics |
| Tests | String matching | Content checks |
| Tests | No docstrings | Add docstrings |
| Tests | Implementation checks | Behavior checks |
| Solution | Echo answers | Derive answers |
| Solution | Random without seed | Add seeds |
| Cheating | Tests in image | Mount at runtime |
| Cheating | Mutable data | Verify computation |

---

## See Also

- [Quality Guidelines](/portal/docs/reference/quality-guidelines) — Additional quality standards for TBench 2.0 tasks
