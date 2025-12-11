# Video: Creating a Solution

Learn how to write an effective oracle solution (solution.sh) for your task.

## Video Tutorial

<video-loom id="140f2cf8f16d404abf5cbd7dcc66b7cb" title="Creating a solution.sh"></video-loom>

## What You'll Learn

- Structure of a good solution.sh file
- How to transfer commands from interactive testing
- Best practices for deterministic solutions
- Common pitfalls to avoid

## Solution Structure

```bash
#!/bin/bash
# CANARY_STRING_PLACEHOLDER
set -e

# Step 1: Set up
cd /app

# Step 2: Main solution logic
# (Commands you tested interactively)

# Step 3: Verification
# (Optional sanity checks)
```

## Best Practices

### 1. Use `set -e`

Exit immediately if any command fails:

```bash
#!/bin/bash
set -e  # Fail fast
```

### 2. Be Explicit

Don't rely on defaults or assumptions:

```bash
# Good: Explicit paths
cd /app
python /app/main.py

# Bad: Relies on current directory
python main.py
```

### 3. Show Your Work

Demonstrate the process, not just the answer:

```bash
# Good: Shows the process
grep -r "ERROR" /logs/ > /tmp/errors.txt
python analyze.py /tmp/errors.txt > /output/report.json

# Bad: Just outputs answer
echo '{"errors": 42}' > /output/report.json
```

### 4. Keep It Deterministic

Same input should always produce same output:

```bash
# Good: Reproducible
sort /data/items.txt | uniq > /output/unique.txt

# Bad: Order not guaranteed
ls /data/ > /output/files.txt  # Order varies
```

## Key Takeaways

1. ✅ Test all commands interactively first
2. ✅ Include the canary string
3. ✅ Use absolute paths
4. ✅ Fail fast with `set -e`
5. ✅ Document what each section does
6. ❌ Don't hardcode answers
7. ❌ Don't use random values without seeds

---

## Related Videos

- [Running your task](/portal/docs/creating-tasks/videos/running-your-task)
- [Creating tests for your task](/portal/docs/creating-tasks/videos/creating-tests)
