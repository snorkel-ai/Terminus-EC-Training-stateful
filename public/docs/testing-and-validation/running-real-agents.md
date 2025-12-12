# Testing Agent Performance

Test your task against real AI agents to validate difficulty and ensure your task challenges frontier models appropriately.

## Prerequisites

**Get your API key from Snorkel via email.** If you haven't received one, DM Puyun or Alejandro on Slack.

> **Note:** You'll need Harbor CLI installed to run agents locally. See [Environment Setup](/portal/docs/getting-started/environment-setup) for installation instructions.

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

---

## Interpreting Results

### Pass

The agent successfully completed the task. Run each agent 5 times to establish a reliable pass rate.

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

Run each agent **5 times** to get a reliable pass rate:

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
Run 4 (GPT-5): FAIL
Run 5 (GPT-5): PASS
Run 1 (Claude): FAIL
Run 2 (Claude): FAIL
Run 3 (Claude): FAIL
Run 4 (Claude): FAIL
Run 5 (Claude): FAIL

GPT-5: 2/5 = 40%
Claude: 0/5 = 0%

Best: 40% → Hard difficulty ✓
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

- [Run CI/LLMaJ checks](/portal/docs/testing-and-validation/ci-feedback-training) — Learn how to iterate on CI feedback
- [Submit your task](/portal/docs/submitting-tasks/submission-checklist)
