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
A placeholder string that must be present at the top of certain files (task.yaml, solution.sh, Dockerfile, test_outputs.py). Used for validation and tracking.

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

## H

### Harbor
The CLI tool used in the GitHub workflow for running tasks, agents, and checks. Commands start with `uv run harbor`.

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

### PR (Pull Request)
A request to merge changes from your branch into the main branch. In GitHub workflow, tasks are submitted via PRs.

### Privileged Mode
A Docker setting that gives containers root-level access. **Not allowed** in TerminalBench tasks.

---

## R

### run-tests.sh
Script that executes the pytest tests to verify task completion. Must set up its own virtual environment using uv.

### Ruff
A fast Python linter. All Python code in tasks must pass Ruff checks.

---

## S

### Snorkel Expert Platform
The web-based platform for managing tasks and submissions. Alternative to the GitHub workflow.

### solve.sh / solution.sh
The oracle solution script that demonstrates how to complete the task. Located in `solution/solve.sh`.

### STB
The CLI tool (`stb`) used for task creation. Run `uv run stb tasks create` to start the wizard.

---

## T

### Task
A coding challenge designed to test AI agent capabilities. Consists of:
- Instructions (task.yaml)
- Environment (Dockerfile)
- Solution (solve.sh)
- Tests (test_outputs.py)

### task.yaml
The main configuration file containing the task instruction (shown to agents) and metadata (not shown to agents).

### TB
The CLI tool used in the Platform workflow. Commands start with `tb`.

### Terminal-Bench
The original benchmark project that TerminalBench is modeled after. See [tbench.ai](https://www.tbench.ai/).

### Terminus
The internal name for this TerminalBench project at Snorkel.

### test_outputs.py
The pytest file containing tests that verify task completion. Must have informative docstrings on all tests.

### Timeout
Maximum time (in seconds) allowed for an agent to complete a task. Specified in task.yaml.

---

## U

### UV
A fast Python package manager. Used for dependency management and running commands (`uv run`).

---

## Need a Term Added?

If you encounter a term that should be in this glossary, let us know on Slack!
