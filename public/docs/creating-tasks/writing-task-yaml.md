# Writing Task Instructions and Configuration

In Harbor 2.0, task instructions and configuration are separated into two files:
- **`instruction.md`** — Task instructions shown to the agent (markdown format)
- **`task.toml`** — Task configuration and metadata (TOML format)

Writing clear, unambiguous instructions is critical to task quality.

## instruction.md Structure

The `instruction.md` file contains the task instructions in markdown format:

```markdown
# Fix Empty Input Bug

Your task is to fix the bug in /app/main.py that causes
the application to crash when processing empty input.

## Requirements

The fix should:
1. Handle empty string input gracefully
2. Return an empty list instead of crashing
3. Not modify any other behavior

## Files

- Input: `/app/main.py`
- Output: Modified `/app/main.py`
```

## task.toml Structure

The `task.toml` file contains configuration and metadata:

```toml
version = "1.0"

[metadata]
author_name = "Your Name"
author_email = "your.email@example.com"
difficulty = "medium"
category = "debugging"
tags = ["python", "memory-leak", "debugging"]

[verifier]
timeout_sec = 120.0

[agent]
timeout_sec = 120.0

[environment]
build_timeout_sec = 600.0
docker_image = "some-org/some-name:some-tag"
cpus = 1
memory_mb = 2048
storage_mb = 10240
```

## Writing Good Instructions (instruction.md)

### Be Explicit

State every requirement clearly. Don't assume the agent knows anything.

**Good:**
```markdown
# Fix Server Error Handling

Fix the bug in /app/server.py that causes a 500 error
when the request body is empty.

## Requirements

1. Return HTTP 400 with message "Request body required"
2. Do not modify the response format for valid requests
3. Add a test case in /app/tests/test_server.py
```

**Bad:**
```markdown
# Fix Server Bug

Fix the server bug.
```

### Use Absolute Paths

Always use full paths starting with `/`.

**Good:** `/app/config/settings.json`
**Bad:** `config/settings.json` or `./settings.json`

### Specify Output Files

If tests check for specific files, mention them explicitly.

```markdown
# Process Data and Output Results

Write your solution to /output/result.json

## Output Format

The JSON should have this structure:
```json
{
  "status": "success",
  "count": <number>,
  "items": [...]
}
```
```

### Define Data Formats

Be precise about expected formats:

```markdown
# Parse CSV to JSON

Parse the CSV at /data/input.csv and output to /data/output.json

## CSV Format

- First row is headers
- Columns: id, name, value
- Values may contain commas (enclosed in quotes)

## JSON Format

- Array of objects
- Each object has keys: id (int), name (string), value (float)
```

### List All Constraints

Make implicit requirements explicit:

```markdown
# Optimize Database Query

Optimize the query in /app/db/queries.py

## Constraints

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

```markdown
# Implement Binary Search

Implement binary search in /app/search.py

## Requirements

- Function: `binary_search(arr, target) -> int`
- Return index if found, -1 if not found
- Handle empty arrays (return -1)
- Handle arrays with duplicate values (return any matching index)
```

### Tool Specification Without Verification

Don't require specific tools unless you can verify they were used:

**Bad:**
```markdown
# Edit Configuration

Use vim to edit the file
```

**Good:**
```markdown
# Edit Configuration

Edit /app/config.txt to change the port from 8080 to 3000
```

## task.toml Configuration Fields

### Metadata Section

| Field | Required | Description |
|-------|----------|-------------|
| `metadata.difficulty` | Yes | `easy`, `medium`, or `hard` |
| `metadata.category` | Yes | From task taxonomy |
| `metadata.tags` | Yes | 3-6 descriptive tags (array) |
| `metadata.author_name` | No | Your name |
| `metadata.author_email` | No | Your email |

### Verifier Section

| Field | Required | Description |
|-------|----------|-------------|
| `verifier.timeout_sec` | No | Max seconds for verification (default: 120) |

### Agent Section

| Field | Required | Description |
|-------|----------|-------------|
| `agent.timeout_sec` | No | Max seconds for agent execution (default: 120) |

### Environment Section

| Field | Required | Description |
|-------|----------|-------------|
| `environment.build_timeout_sec` | No | Max seconds for build (default: 600) |
| `environment.docker_image` | No | Pre-built Docker image (optional) |
| `environment.cpus` | No | CPU allocation |
| `environment.memory_mb` | No | Memory allocation in MB |
| `environment.storage_mb` | No | Storage allocation in MB |

## Validation

Your task files will be validated by CI checks:

- `validate_task_fields` — All required fields present in `task.toml`
- `check_task_absolute_path` — Uses absolute paths in `instruction.md`
- `file_reference_mentioned` — Output files mentioned in `instruction.md`
- `typos` — No spelling errors

---

## Key Differences from Terminal-Bench

In Harbor 2.0:
- ✅ Instructions are in **markdown** (`instruction.md`) — better formatting and readability
- ✅ Configuration is in **TOML** (`task.toml`) — cleaner nested structure
- ✅ Separation of concerns — instructions vs. metadata
- ✅ No more multiline YAML strings — markdown handles formatting naturally

## Next Steps

- [Understand task components](/portal/docs/understanding-tasks/task-components)
- [Create Docker environment](/portal/docs/creating-tasks/creating-docker-environment)
- [Write oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)
