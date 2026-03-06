# Creating a Task

Learn how to create a new task from scratch using the task skeleton template.

## Getting Started

To create a new task, you'll start with the task skeleton template and customize it for your specific task.

## Step 1: Download the Task Skeleton

Download the task skeleton ZIP file from the training site:

<pdf-download src="/Terminus-EC-Training-stateful/template-task.zip" title="Download Task Skeleton Template"></pdf-download>

## Step 2: Extract and Rename

1. **Extract the ZIP file** to your desired location
2. **Rename the unzipped folder** to match your task name

**Naming conventions:**
- Use kebab-case (lowercase, hyphens)
- Be descriptive but concise
- Examples: `parse-json-logs`, `debug-python-import`, `configure-nginx-ssl`

**Good task names:**
- ✅ `parse-json-logs`
- ✅ `debug-python-import`
- ✅ `configure-nginx-ssl`

**Bad task names:**
- ❌ `task1`
- ❌ `my-task`
- ❌ `test`

## Task Structure

After extracting and renaming, you'll have a folder structure like this:

```
your-task-name/
├── instruction.md      # Task instructions (markdown)
├── task.toml           # Task configuration and metadata
├── environment/        # Environment definition folder
│   ├── Dockerfile      # OR docker-compose.yaml
│   └── [build files]   # Additional environment files
├── solution/           # Oracle solution (optional)
│   └── solve.sh        # Solution script + dependencies
└── tests/              # Test verification
    ├── test.sh         # Test execution script
    └── [test files]    # Test dependencies
```

> **Note:** This structure follows the Harbor 2.0 task format. See [Task Components](/portal/docs/understanding-tasks/task-components) for details on each file.

## Next Steps

After downloading and renaming your task skeleton:

1. **Edit `instruction.md`** — Write clear, unambiguous task instructions
   - [Guide: Writing task instructions](/portal/docs/creating-tasks/writing-task-yaml)

2. **Configure `task.toml`** — Set up metadata and configuration
   - [Guide: Task Components](/portal/docs/understanding-tasks/task-components)

3. **Set up environment** — Configure Docker in the `environment/` folder
   - [Guide: Creating Docker environment](/portal/docs/creating-tasks/creating-docker-environment)

4. **Write the solution** — Create `solution/solve.sh`
   - [Guide: Writing oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)

5. **Create tests** — Write `tests/test.sh` and test files
   - [Guide: Writing tests](/portal/docs/creating-tasks/writing-tests)

6. **Test locally** — Run the oracle agent to verify your task works
   - [Guide: Oracle agent](/portal/docs/testing-and-validation/oracle-agent)

---

## Related Resources

- [Running your task](/portal/docs/creating-tasks/videos/running-your-task)
- [Writing oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)
- [Writing tests](/portal/docs/creating-tasks/writing-tests)
- [Task Components](/portal/docs/understanding-tasks/task-components)
- [Task Requirements](/portal/docs/understanding-tasks/task-requirements)
