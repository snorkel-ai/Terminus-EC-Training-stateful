# Glossary

Key terms and definitions used throughout TerminalBench.

---

## A

### Agent
An AI system that can write, execute, and iterate on code autonomously. Unlike simple code completion, agents can plan multi-step solutions, execute commands, read results, and recover from errors.

### Agentic AI
AI systems designed to take actions and make decisions autonomously rather than simply responding to prompts. Agentic coding AI can execute code, read results, and iterate toward a goal.

---

## B

### Benchmark
A standardized set of tasks used to measure and compare the performance of AI systems. TerminalBench is a benchmark for evaluating coding agents.

### Branch
A separate line of development in Git. Each task should be developed on its own branch (e.g., `username/task-name`) before being merged.

---

## C

### Canary String
A placeholder string that must be present at the top of certain files (`instruction.md`, `solution/solve.sh`, `environment/Dockerfile`, `tests/test_outputs.py`). Used for validation and tracking.

### CI (Continuous Integration)
Automated systems that run tests and checks when code is submitted. In TerminalBench, CI validates task structure, dependencies, and quality.

### Claude Code
Anthropic's agentic coding system that uses Claude Sonnet 4.5. One of the models used to evaluate task difficulty.

### Codex
OpenAI's code-focused agent. Used with GPT-5 to evaluate task difficulty.

---

## D

### Difficulty Level
Classification based on agent pass rate:
- **Easy:** < 80% pass rate
- **Medium:** < 60% pass rate
- **Hard:** < 40% pass rate

### Dockerfile
A script that defines how to build a Docker container. In TerminalBench, it sets up the task environment with all required dependencies.

### docker-compose.yaml
Configuration file that defines how containers, volumes, and networks are orchestrated for a task.

---

## F

### Frontier Model
The most capable AI models available at any given time. Currently includes GPT-5 and Claude Sonnet 4.5.

---

## G

### Ground Truth
The verified correct solution for a task. In TerminalBench, this is the oracle solution (`solve.sh`).

---

---

## L

### LLMaJ (LLM-as-Judge)
Using a language model (GPT-5) to evaluate task quality. LLMaJ checks assess things like test coverage, clarity, and anti-cheating measures.

---

## O

### Oracle Agent
A special agent that runs your `solution.sh` script to verify the task is solvable. If the Oracle can't complete your task, it's broken.

### Oracle Solution
The expert-authored step-by-step solution contained in `solution/solve.sh`. Must reliably complete the task when executed.

---

## P

### Pass Rate
The percentage of times an agent successfully completes a task. Calculated from multiple runs (typically 5) against each model.

### Privileged Mode
A Docker setting that gives containers root-level access. **Not allowed** in TerminalBench tasks.

---

## R

### tests/test.sh
Script that executes the pytest tests to verify task completion. Must set up its own virtual environment using uv and produce a reward file (`/logs/verifier/reward.txt` or `/logs/verifier/reward.json`).

### Ruff
A fast Python linter. All Python code in tasks must pass Ruff checks.

---

## S

### Snorkel Expert Platform
The web-based platform for managing tasks and submissions. Alternative to the GitHub workflow.

### solve.sh / solution.sh
The oracle solution script that demonstrates how to complete the task. Located in `solution/solve.sh`.

### Harbor
The CLI tool (`harbor`) used for running agents and validating tasks. Run `harbor run --agent oracle --path harbor_tasks/<task-name>` to test your task.

---

## T

### Task
A coding challenge designed to test AI agent capabilities. Consists of:
- Instructions (`instruction.md`)
- Configuration (`task.toml`)
- Environment (`environment/Dockerfile`)
- Solution (`solution/solve.sh`)
- Tests (`tests/test.sh`, `tests/test_outputs.py`)

### instruction.md
The task instruction file in markdown format, shown to agents. Contains clear, unambiguous requirements.

### task.toml
The task configuration file in TOML format, containing metadata and settings. Replaces `task.yaml` in Harbor 2.0.

### Terminal-Bench
The original benchmark project that TerminalBench is modeled after. See [tbench.ai](https://www.tbench.ai/).

### Terminus
The internal name for this TerminalBench project at Snorkel.

### test_outputs.py
The pytest file containing tests that verify task completion. Must have informative docstrings on all tests.

### Timeout
Maximum time (in seconds) allowed for an agent to complete a task. Specified in `task.toml` under `[agent].timeout_sec`.

---

## Need a Term Added?

If you encounter a term that should be in this glossary, let us know on Slack!
