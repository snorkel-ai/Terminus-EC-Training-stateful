# Welcome to TerminalBench

You've joined a community of experts pushing the boundaries of agentic AI. This documentation will help you get started and succeed as a contributor.

## What is TerminalBench?

TerminalBench is a benchmark for evaluating AI coding agents on real-world engineering tasks. Your job is to create tasks that challenge today's best models—tasks that require genuine engineering reasoning, multi-step problem solving, and practical skills.

Unlike simple code completion benchmarks, TerminalBench tests:

- **Multi-step reasoning** — Tasks require chaining multiple commands
- **Environment interaction** — Agents work in real Docker containers
- **Practical skills** — Real debugging, configuration, and development tasks

> **Your work matters.** 
> 
> Every accepted task directly advances the development of AI coding agents by revealing their current limitations and pushing them to improve.

> **Explore existing tasks:** [Browse our Task Gallery](https://snorkel-ai.github.io/Terminus-EC-Training-stateful/portal/tasks)
>
> While this project is NOT affiliated with the official Terminal-Bench project, we closely mimic its style.

## How This Works

1. **You create tasks** — Engineering challenges that test AI capabilities
2. **AI agents attempt them** — We run frontier models against your tasks
3. **Results inform development** — Tasks that stump AI guide future improvements
4. **You get paid** — Accepted tasks earn payouts based on difficulty

## Your Role as a Coding Expert

As a Coding Expert, you will:

1. **Design tasks** that challenge frontier AI models
2. **Write oracle solutions** that demonstrate correct completion
3. **Create tests** that verify task completion
4. **Iterate on feedback** from automated checks and peer review

Tasks should target **< 80% accuracy** for GPT-5 or Claude Sonnet 4.5:

| Difficulty | Pass Rate | Description |
|------------|-----------|-------------|
| Hard | < 40% | Requires deep expertise, multi-step reasoning |
| Medium | < 60% | Moderate complexity, some domain knowledge |
| Easy | < 80% | Straightforward but still challenging |

> **Important:** Tasks with > 80% pass rate will NOT be accepted.

**Important Notes:**
- You will **not** be "served" tasks—you need to create them from scratch
- You can take task ideas from the task gallery or create your own

## Evaluation Process

Each task undergoes:

1. **Automated CI checks** — Technical requirements (syntax, structure, etc.)
2. **LLM-as-Judge (LLMaJ)** — Quality evaluation using GPT-5
3. **Peer review** — Human expert verification
4. **Agent evaluation** — Run against GPT-5 and Claude Sonnet 4.5 (5 times each)

## Estimated Time

- **Per task:** 2-5 hours
- **Includes:** Design, development, testing, iteration

## Quick Links

| Resource | Description |
|----------|-------------|
| [Quick Start Guide](/portal/docs/getting-started/quick-start) | Get up and running in 10 minutes |
| [What Makes a Good Task](/portal/docs/understanding-tasks/what-makes-a-good-task) | Learn to create high-quality tasks |
| [Task Components](/portal/docs/understanding-tasks/task-components) | Understand task structure |
| [FAQ](/portal/docs/reference/faq) | Common questions answered |

## Need Help?

| Resource | Link |
|----------|------|
| Slack Channel | `#ec-terminus-submission` |
| Office Hours | Weekly sessions to answer questions |

---

Ready to dive in? Start with the [Quick Start Guide](/portal/docs/getting-started/quick-start).
