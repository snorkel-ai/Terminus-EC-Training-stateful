# Writing task.yaml

The `task.yaml` file contains the instructions shown to the agent. Writing clear, unambiguous instructions is critical to task quality.

## Structure

```yaml
# Required: The instruction shown to the agent
instruction: |
  Your multi-line task
  instruction goes here.

# Metadata (not shown to agent)
category: debugging
difficulty: medium
tags: [python, memory-leak, debugging]
timeout: 1800
expert_time: 30
junior_time: 90
```

## Writing Good Instructions

### Be Explicit

State every requirement clearly. Don't assume the agent knows anything.

**Good:**
```yaml
instruction: |
  Fix the bug in /app/server.py that causes a 500 error
  when the request body is empty.
  
  Requirements:
  1. Return HTTP 400 with message "Request body required"
  2. Do not modify the response format for valid requests
  3. Add a test case in /app/tests/test_server.py
```

**Bad:**
```yaml
instruction: |
  Fix the server bug.
```

### Use Absolute Paths

Always use full paths starting with `/`.

**Good:** `/app/config/settings.json`
**Bad:** `config/settings.json` or `./settings.json`

### Specify Output Files

If tests check for specific files, mention them explicitly.

```yaml
instruction: |
  Write your solution to /output/result.json
  
  The JSON should have this structure:
  {
    "status": "success",
    "count": <number>,
    "items": [...]
  }
```

### Define Data Formats

Be precise about expected formats:

```yaml
instruction: |
  Parse the CSV at /data/input.csv and output to /data/output.json
  
  CSV format:
  - First row is headers
  - Columns: id, name, value
  - Values may contain commas (enclosed in quotes)
  
  JSON format:
  - Array of objects
  - Each object has keys: id (int), name (string), value (float)
```

### List All Constraints

Make implicit requirements explicit:

```yaml
instruction: |
  Optimize the query in /app/db/queries.py
  
  Constraints:
  - Must complete in under 100ms for 1M rows
  - Do not change the function signature
  - Do not use raw SQL (ORM only)
  - Result must maintain same ordering
```

## Common Mistakes

### Ambiguous Language

| Avoid | Use Instead |
|-------|-------------|
| "Make it better" | "Reduce runtime by 50%" |
| "Fix the issues" | "Fix the 3 failing tests in test_api.py" |
| "Handle errors properly" | "Return HTTP 400 for invalid input" |

### Missing Edge Cases

If tests check edge cases, mention them:

```yaml
instruction: |
  Implement binary search in /app/search.py
  
  Requirements:
  - Function: binary_search(arr, target) -> int
  - Return index if found, -1 if not found
  - Handle empty arrays (return -1)
  - Handle arrays with duplicate values (return any matching index)
```

### Tool Specification Without Verification

Don't require specific tools unless you can verify they were used:

**Bad:**
```yaml
instruction: |
  Use vim to edit the file
```

**Good:**
```yaml
instruction: |
  Edit /app/config.txt to change the port from 8080 to 3000
```

## Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `instruction` | Yes | Task description shown to agent |
| `category` | Yes | From task taxonomy |
| `difficulty` | Yes | easy, medium, or hard |
| `tags` | Yes | 3-6 descriptive tags |
| `timeout` | Yes | Max seconds (typically 1800) |
| `expert_time` | No | Minutes for expert human |
| `junior_time` | No | Minutes for junior human |

## Validation

Your task.yaml will be validated by CI checks:

- `validate_task_fields` — All required fields present
- `check_task_absolute_path` — Uses absolute paths
- `file_reference_mentioned` — Output files mentioned
- `typos` — No spelling errors

---

## Next Steps

- [Create Docker environment](/portal/docs/creating-tasks/creating-docker-environment)
- [Write oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)
