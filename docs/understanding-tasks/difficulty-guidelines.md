# Difficulty Guidelines

Task difficulty is determined by accuracy when run against frontier AI models. This guide helps you design tasks at the right difficulty level.

## Difficulty Levels

| Level | Accuracy 
|-------|-----------
| **Hard** | < 40% 
| **Medium** | < 60%
| **Easy** | < 80%

> **Important:** Tasks with > 80% pass rate will NOT be accepted.

## Evaluation Process

Each task is evaluated against:
- **GPT-5.2** with Codex agent
- **Claude Opus 4.6** with Claude Code agent
- **5 runs each** to determine average accuracy

The difficulty is based on whichever model performs better.

## Designing for Difficulty

### For Hard Tasks (< 40%)

Hard tasks require one or more of:

- **Deep domain expertise** — Knowledge LLMs haven't seen much
- **Complex multi-step reasoning** — 10+ sequential steps
- **Subtle debugging** — Root cause analysis required
- **Niche tools/languages** — Less common technologies

**Techniques:**
- Use bespoke rules buried in common patterns
- Require understanding of obscure documentation
- Create debugging tasks where the root cause isn't obvious
- Use domain-specific knowledge (blockchains, scientific computing)

### For Medium Tasks (< 60%)

Medium tasks typically involve:

- **Moderate complexity** — 5-10 steps
- **Some domain knowledge** — Common but not trivial
- **Clear requirements** — But non-obvious solution

**Techniques:**
- Combine multiple familiar concepts
- Add edge cases that require careful handling
- Include configuration that's easy to miss

### For Easy Tasks (< 80%)

Easy tasks should still be:

- **Non-trivial** — Not one-liners
- **Multi-step** — At least 3-5 steps
- **Testable** — Clear success criteria

**Techniques:**
- Standard tasks with one or two tricky aspects
- Well-known problems with specific constraints
- Setup tasks with multiple requirements

## Common Mistakes

### Making Tasks Too Easy

| Mistake | Impact |
|---------|--------|
| Single-step solutions | Agents solve immediately |
| Obvious debugging | Pattern matching succeeds |
| Common tutorials | In training data |
| Simple API usage | Well-documented |

### Making Tasks Unfair

| Mistake | Impact |
|---------|--------|
| Impossible requirements | No one can solve |
| Ambiguous instructions | Luck determines success |
| Time-dependent | Results vary randomly |
| External dependencies | Environment issues |

## Testing Your Difficulty

Before submitting, verify difficulty by:

### 1. Run Against Oracle Agent

```bash
harbor run --agent oracle --path <task-folder>
```

This should PASS. If it doesn't, your task may have issues.

### 2. Run Against Real Agents

```bash
# GPT-5
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p <task-folder>

# Claude Sonnet 4.5
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p <task-folder>
```

Run at least 2-3 times to gauge pass rate.

### 3. Analyze Failures

When agents fail:
- Is it for a **good reason** (task difficulty)?
- Or a **bad reason** (unclear instructions)?

Good failures: Agent misunderstood complexity, missed edge case
Bad failures: Ambiguous requirements, environment issues

## Adjusting Difficulty

### To Make Harder:

- Add more steps
- Include hidden requirements
- Use niche knowledge
- Create debugging scenarios
- Add edge cases

### To Make Easier:

- Reduce step count
- Make requirements more explicit
- Use common technologies
- Provide more hints in instructions
- Simplify the environment

---

## Next Steps

- [Start creating your task](/portal/docs/creating-tasks/videos/creating-task)
- [Review CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
