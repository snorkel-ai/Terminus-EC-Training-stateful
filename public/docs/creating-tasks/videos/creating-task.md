# Video: Creating a Task

Learn how to create a new task from scratch using the task creation wizard.

## Video Tutorial

<video-loom id="92c2e195ac1c4b1e9b1177668dfcb81a" title="Creating a Task"></video-loom>

## What You'll Learn

- How to use the task creation wizard
- Setting up task metadata (name, description, tags)
- Understanding the generated file structure
- Getting your task ready for development

## Creating a New Task

### Using the CLI Wizard

```bash
uv run stb tasks create
```

The wizard will prompt you for:

1. **Task name** — A unique, descriptive identifier (e.g., `parse-json-logs`)
2. **Description** — What the agent needs to accomplish
3. **Category** — Select from the task taxonomy
4. **Tags** — 3-6 descriptive tags
5. **Difficulty** — Easy, Medium, or Hard
6. **Time estimate** — Expected completion time

### Generated Structure

After running the wizard, you'll have:

```
harbor_tasks/<task-name>/
├── task.yaml           # Task instructions and metadata
├── Dockerfile          # Environment setup
├── docker-compose.yaml # Service orchestration
├── solution/
│   └── solve.sh        # Oracle solution script
└── tests/
    ├── run-tests.sh    # Test runner
    └── test_outputs.py # Pytest validation
```

## Tips for Good Task Names

| ✅ Good | ❌ Bad |
|---------|--------|
| `parse-json-logs` | `task1` |
| `debug-python-import` | `my-task` |
| `configure-nginx-ssl` | `test` |

## Next Steps

After creating your task:

1. **Edit `task.yaml`** — Write clear, unambiguous instructions
2. **Set up Docker** — Configure the environment
3. **Run your task** — Test the environment interactively
4. **Write the solution** — Create `solve.sh`
5. **Add tests** — Implement `test_outputs.py`

---

## Related Videos

- [Running your task](/portal/docs/creating-tasks/videos/running-your-task)
- [Creating a solution.sh](/portal/docs/creating-tasks/videos/creating-solution)
- [Creating tests for your task](/portal/docs/creating-tasks/videos/creating-tests)
