# Running Real Agents & Local Testing

Test your task locally against real AI agents and run CI checks before submitting. By testing locally, you can quickly identify issues, refine your task design, and validate solutions before submitting.

## Prerequisites

**Clone the Terminal-Bench repository:**

```bash
git clone https://github.com/laude-institute/terminal-bench
cd terminal-bench
```

**Get your API key from Snorkel via email.** If you haven't received one, DM Puyun or Alejandro on Slack.

## Environment Setup

Set the following environment variables:

```bash
export OPENAI_API_KEY=<your-portkey-api-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

> **Tip:** Add these to your `~/.bashrc` or `~/.zshrc` for persistence.

## Available Models

| Model | Command Flag |
|-------|--------------|
| GPT-5 | `openai/@openai-tbench/gpt-5` |
| Claude Sonnet 4.5 | `openai/@anthropic-tbench/claude-sonnet-4-5-20250929` |

## Running Agents

### GPT-5

```bash
uv run harbor run \
  -a terminus-2 \
  -m openai/@openai-tbench/gpt-5 \
  -p harbor_tasks/<task-name>
```

### Claude Sonnet 4.5

```bash
uv run harbor run \
  -a terminus-2 \
  -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 \
  -p harbor_tasks/<task-name>
```

### Platform Workflow (tb commands)

```bash
# GPT-5
tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id <task-id>

# Claude Sonnet 4.5
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id <task-id>
```

---

## Run CI and LLMaJ Checks Locally

Before submitting, run the same automated checks that CI will perform. This enables faster iteration without waiting for CI pipelines.

### GitHub Workflow

```bash
# Run all checks on your task
uv run harbor tasks check harbor_tasks/<task-name> --model openai/@openai-tbench/gpt-5
```

### Platform Workflow (tb commands)

```bash
# GPT-5
tb tasks check <task-id> --model openai/@openai-tbench/gpt-5

# Claude Sonnet 4.5
tb tasks check <task-id> --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929
```

### What Gets Checked

Running locally will validate:

**CI Checks:**
- `pinned_dependencies` — All deps have pinned versions
- `typos` — No spelling errors
- `tests_or_solution_in_image` — Solution not baked into Docker
- `check_canary` — Canary strings present
- `check_dockerfile_references` — All files referenced exist
- `ruff` — Python linting passes
- `validate_task_fields` — task.yaml is complete

**LLMaJ Checks:**
- `behavior_in_task_description` — Requirements stated clearly
- `behavior_in_tests` — Tests verify behavior
- `informative_test_docstrings` — Tests have good docstrings
- `anti_cheating_measures` — Task can't be gamed
- `hardcoded_solution` — Solution isn't trivially derivable

---

## Interpreting Results

### Pass

The agent successfully completed the task. Run multiple times to establish pass rate.

### Fail - Good

The agent failed for a legitimate reason:
- Didn't understand the complexity
- Made reasoning errors
- Missed edge cases

This is what we want! The task is challenging.

### Fail - Bad

The agent failed due to task issues:
- Unclear instructions
- Ambiguous requirements
- Environment problems

This means your task needs revision.

## Determining Difficulty

Run each agent **2-3 times** minimum:

| Pass Rate | Difficulty |
|-----------|------------|
| 0-40% | Hard |
| 40-60% | Medium |
| 60-80% | Easy |
| > 80% | **Too Easy - Rejected** |

### Example Testing

```
Run 1 (GPT-5): FAIL
Run 2 (GPT-5): PASS
Run 3 (GPT-5): FAIL
Run 1 (Claude): FAIL
Run 2 (Claude): FAIL

GPT-5: 1/3 = 33%
Claude: 0/2 = 0%

Best: 33% → Hard difficulty ✓
```

## Analyzing Failures

When an agent fails:

1. **Watch the terminal recording** — See what the agent tried
2. **Check the analysis** — Review identified issues
3. **Read the debug pane** — Understand why it failed

Ask yourself:
- Did the agent fail for a **good reason** (task difficulty)?
- Or a **bad reason** (unclear instructions)?

### Good Failure Reasons

- Agent made reasoning errors
- Agent missed subtle requirements
- Agent didn't have domain knowledge
- Multi-step complexity confused agent

### Bad Failure Reasons

- Instructions were ambiguous
- Environment had issues
- Tests were too strict
- Required information was missing

## Adjusting Difficulty

### Task Too Easy?

- Add more steps
- Include hidden requirements
- Use niche knowledge
- Create debugging scenarios

### Task Too Hard?

- Simplify requirements
- Make instructions clearer
- Reduce step count
- Provide more hints

---

## Next Steps

- [Run CI/LLMaJ checks](/portal/docs/testing-and-validation/ci-checks-reference)
- [Submit your task](/portal/docs/submitting-tasks/submission-checklist)
