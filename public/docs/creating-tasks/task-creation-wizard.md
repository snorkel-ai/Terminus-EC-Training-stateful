# Task Creation Wizard

The `stb tasks create` command guides you through setting up a new task with all required files.

## Running the Wizard

From your `snorkel-tb-tasks` directory:

```bash
uv run stb tasks create
```

## Wizard Steps

### 1. Task Name

```
Enter a unique name for your task: my-debug-task
```

- Use kebab-case (lowercase, hyphens)
- Be descriptive but concise
- Must be unique in the repository

### 2. Task Description

```
Provide the task description: Fix the memory leak in the data processing pipeline
```

Write a brief summary of what the agent needs to accomplish.

### 3. Interactive Commands

```
Does this task require interactive commands? [y/N]: n
```

Most tasks don't need this. Only say "yes" if you need vim, editors, or interactive shells in your solution.

### 4. Category

```
Enter a category: debugging
```

Choose from the [task taxonomy](/portal/docs/understanding-tasks/task-taxonomy):
- system-administration
- build-and-dependency-management
- data-processing
- games
- software-engineering
- machine-learning
- debugging
- security
- scientific-computing

### 5. Tags

```
Enter 3-6 tags (space-separated): python memory-leak debugging performance
```

Tags help with discoverability and organization.

### 6. Difficulty

```
Enter difficulty (easy/medium/hard): medium
```

Based on expected pass rate:
- easy: < 80% pass rate
- medium: < 60% pass rate
- hard: < 40% pass rate

### 7. Time Estimates

```
Expert completion time (minutes): 30
Junior completion time (minutes): 90
```

Estimate how long it would take:
- **Expert:** Domain expert (L5+ at Google)
- **Junior:** L3 engineer at Google

## Created File Structure

After running the wizard, you'll have:

```
harbor_tasks/my-debug-task/
├── task.yaml           # Pre-filled with your inputs
├── Dockerfile          # Basic Python template
├── docker-compose.yaml # Standard configuration
├── solution/
│   └── solve.sh        # Empty solution template
└── tests/
    ├── run-tests.sh    # Test runner template
    └── test_outputs.py # Empty test file
```

## Next Steps

After creation:

1. **Edit task.yaml** — Write detailed instructions
   - [Guide: Writing task.yaml](/portal/docs/creating-tasks/writing-task-yaml)

2. **Set up Dockerfile** — Configure the environment
   - [Guide: Creating Docker environment](/portal/docs/creating-tasks/creating-docker-environment)

3. **Write solution** — Create the oracle solution
   - [Guide: Writing oracle solution](/portal/docs/creating-tasks/writing-oracle-solution)

4. **Create tests** — Write verification tests
   - [Guide: Writing tests](/portal/docs/creating-tasks/writing-tests)

5. **Test locally** — Run the oracle agent
   - [Guide: Oracle agent](/portal/docs/testing-and-validation/oracle-agent)

## Tips

### Naming Conventions

| Good | Bad |
|------|-----|
| `fix-memory-leak-python` | `task1` |
| `setup-nginx-ssl` | `my-task` |
| `debug-async-queue` | `FIX_BUG` |

### Category Selection

Choose the category that best describes the **primary** activity. A debugging task that involves system administration should still be categorized as `debugging` if that's the main focus.

### Time Estimates

- Be realistic — underestimating hurts task quality
- Expert time should be 15-60 minutes
- If expert time is < 15 min, task is likely too easy
- If expert time is > 60 min, consider breaking into multiple tasks
