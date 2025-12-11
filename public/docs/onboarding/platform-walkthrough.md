# Expert Platform Walkthrough

Complete step-by-step guide for creating and submitting tasks through the Snorkel Expert Platform.

## High-Level Tasking Workflow

Tasking will be performed through the terminus-project project on the Snorkel Expert Platform. Once you are granted access, you should:

1. Clone the open-source Terminal-Bench repo to give you access to the `tb` commands used for running the agents and programmatic checks locally
2. Go to the training site and download the task file skeleton
3. Rename the task folder to match your intended task name
4. Create your task instruction, an Oracle solution that passes, and Python tests
5. Iterate on your submission until all CI/Evals pass
6. Create a ZIP file for your task folder
7. Submit your ZIP file on the Platform

---

## Initial Setup (One-Time)

Clone the Terminal-Bench repository:

```bash
git clone https://github.com/laude-institute/terminal-bench.git
```

This gives you access to the `tb` commands used for running agents and programmatic checks locally.

---

## Completing a Task

### Step 1: Download the Task Skeleton

Download the ZIP file of the task skeleton from the training site:

<pdf-download src="/Terminus-EC-Training-stateful/template-task.zip" title="Download Task Skeleton (ZIP)"></pdf-download>

### Step 2: Extract and Rename

Extract and rename your task folder to match your intended task name.

### Step 3: Configure Docker Environment

Edit the created Dockerfile using a text editor to set up your task environment:

- Add any dependencies of the task, such as additional required packages
- If you require a multi-container environment or other custom configuration, see the [Docker environment documentation](/portal/docs/creating-tasks/creating-docker-environment) for more information

### Step 4: Docker Troubleshooting

If you encounter Docker issues:

1. Ensure you have a recent installation of Docker Desktop
2. On macOS, enable the option in Advanced Settings: **"Allow the default Docker socket to be used (requires password)."**
3. Try the following commands:

```bash
sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker
```

### Step 5: Enter Your Task Container

Enter your task container in interactive mode:

```bash
tb tasks interact -t <task-name>
```

### Step 6: Test Your Solution

While interacting with your task container, test your solution idea to make sure that it works as expected.

- Once solution is verified, record it and exit the container

### Step 7: Create Solution File

Modify the solution file (`solution.sh`) with the verified commands from the previous step:

- This file will be used by the OracleAgent to ensure the task is solvable
- If you need to run commands that are not possible to run with a bash script (e.g. vim), use a `solution.yaml` file to configure interactive commands

### Step 8: Write Tests

Update the `tests/test_outputs.py` file to verify task completion:

- Create pytest unit tests to ensure that the task was completed correctly
- If tests require any file dependencies, place them in the `tests/` directory

### Step 9: Run Oracle Agent

Test your task solution passes and meets all the requirements specified in the tests:

```bash
tb run --agent oracle --task-id <task-name>
```

> **Note:** You will need to clone the Terminal-Bench repo in order to run these `tb` commands.

### Step 10: Test with Real Agents

1. Receive API key from Snorkel via email
2. Update environment variables:

```bash
export OPENAI_API_KEY=<Portkey API key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

3. Run with one of the available models:

**GPT-5:**
```bash
tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id <task_id>
```

**Claude Sonnet 4.5:**
```bash
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id <task_id>
```

### Step 11: Run CI/LLMaJ Locally

Run CI/LLMaJ checks locally on your task:

**GPT-5:**
```bash
tb tasks check <task_id> --model openai/@openai/gpt-5
```

**Claude Sonnet 4.5:**
```bash
tb tasks check <task_id> --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929
```

### Step 12: Create ZIP File

Create a ZIP file of your task folder:

> **Important:** Select all the individual files inside the task folder and compress them — do not compress the whole folder directly.

### Step 13: Submit

Submit your task on the Snorkel Expert Platform in the terminus-project project.

---

## Task Walkthrough Videos

Watch these step-by-step videos to learn how to create and test your task:

### 1. Running Your Task

<video-loom id="22449b76123d41e6abff0efb39d0b960" title="Running your task"></video-loom>

### 2. Creating a solution.sh

<video-loom id="140f2cf8f16d404abf5cbd7dcc66b7cb" title="Creating a solution.sh"></video-loom>

### 3. Creating Tests for Your Task

<video-loom id="a00541ff2787464c84bf4601415ee624" title="Creating tests for your task"></video-loom>

---

## Next Steps

- [Understand task components](/portal/docs/understanding-tasks/task-components)
- [Review the submission checklist](/portal/docs/submitting-tasks/submission-checklist)
- [Learn about CI checks](/portal/docs/testing-and-validation/ci-checks-reference)
