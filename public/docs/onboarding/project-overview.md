# Project Overview

Understand the goals, context, and your role in the TerminalBench project.

## Project Goal

This project aims to develop a high-quality dataset in the style of Terminal-Bench. Terminal-Bench is a suite of multi-step agentic tasks executed in a Command-Line Interface (CLI) environment, designed to benchmark the performance of AI models.

You will design these tasks and include the necessary components to be compatible with the Terminus framework.

## What is Terminal-Bench?

Terminal-Bench evaluates AI coding agents on real-world engineering tasks. Unlike simple code completion benchmarks, it tests:

- **Multi-step reasoning** — Tasks require chaining multiple commands
- **Environment interaction** — Agents work in real Docker containers
- **Practical skills** — Real debugging, configuration, and development tasks

> **Explore existing tasks:** [https://www.tbench.ai/registry/terminal-bench-core/0.1.1](https://www.tbench.ai/registry/terminal-bench-core/0.1.1)
>
> While this project is NOT affiliated with the official Terminal-Bench project, we closely mimic its style.

## Your Role

As a Coding Expert, you will:

1. **Design tasks** that challenge frontier AI models
2. **Write oracle solutions** that demonstrate correct completion
3. **Create tests** that verify task completion
4. **Iterate on feedback** from automated checks and peer review

### Target Difficulty

Tasks should target **< 80% accuracy** for GPT-5 or Claude Sonnet 4.5. This means:

| Difficulty | Pass Rate | Description |
|------------|-----------|-------------|
| Hard | < 40% | Requires deep expertise, multi-step reasoning |
| Medium | < 60% | Moderate complexity, some domain knowledge |
| Easy | < 80% | Straightforward but still challenging |

> **Important:** Tasks with > 80% pass rate will NOT be accepted.

## Evaluation Process

Each task undergoes:

1. **Automated CI checks** — Technical requirements (syntax, structure, etc.)
2. **LLM-as-Judge (LLMaJ)** — Quality evaluation using GPT-5
3. **Peer review** — Human expert verification
4. **Agent evaluation** — Run against GPT-5 and Claude Sonnet 4.5 (5 times each)

## Estimated Time

- **Per task:** 2-5 hours
- **Includes:** Design, development, testing, iteration

## Resources

| Resource | Link |
|----------|------|
| Slack Channel | `#ec-terminus-submission` |
| Terminal-Bench Site | [https://www.tbench.ai/](https://www.tbench.ai/) |
| GitHub Repository | [https://github.com/snorkel-ai/snorkel-tb-tasks](https://github.com/snorkel-ai/snorkel-tb-tasks) |
| Support | Expert Support Form (for payments, non-project questions) |

## Important Notes

- This project is currently run **outside** the Snorkel Expert Platform UI
- You will **not** be "served" tasks — you create them from scratch
- You can take task ideas from the shared sheet or create your own

---

## Next Steps

- [Understand task components](/portal/docs/understanding-tasks/task-components)
- [Learn the task taxonomy](/portal/docs/understanding-tasks/task-taxonomy)
- [See example tasks](/portal/docs/understanding-tasks/example-tasks)
