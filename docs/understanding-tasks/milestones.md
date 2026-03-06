# Understanding Milestones

In Terminal Bench Edition 2, we are moving beyond "all-or-nothing" task completion. To better evaluate the reasoning traces of frontier agents, a subset of tasks now incorporates **Milestones**.

## What are Milestones?

Milestones divide a complex, multi-step engineering task into standalone, sequential subtasks. Instead of the agent wandering blindly toward a final state, Milestones provide a structured path that allows the Harbor framework to assign incremental rewards and validate the agent's process.


> **The Milestone Rule**
>
> A Milestone task must be designed so that each stage is a prerequisite for the next. The agent must explicitly signal completion of a milestone before the framework validates the environment and allows progression.


## Milestone Components

To implement milestones correctly in your task, you must align four specific components:

### 1. Instructions (`instruction.md`)
Your prompt must clearly outline the requirements for each milestone. Use headings or numbered lists that map directly to the task objectives.

### 2. Verifiers (`tests/`)
Unlike standard tasks with a single test script, milestone tasks use unit test verifiers aligned to each stage. 
- **Deterministic Checks:** Each milestone verifier must trigger a pass/fail state.
- **State Persistence:** The environment must remain stable between milestone validations.

### 3. Rubrics (`rubrics_x.txt`)
You must provide individual rubric files (e.g., `rubrics_1.txt`, `rubrics_2.txt`) for every milestone. These rubrics define the criteria for a **LLM-as-a-Judge (LLMaJ)** to evaluate the agent's "trace" or "thinking" during that specific phase.

### 4. Metadata (`task.toml`)
You must specify the total count and provide a text description for every stage. Include these 2 fields if your task has Milestones:
* `number_of_milestones`: Total count (integer).
* `milestone_descriptions`: A string describing the desired outcome of each stage.



</details>

## Best Practices for Milestones

* **No "Leaky" Milestones:** Ensure Milestone 2 cannot be completed if Milestone 1 fails.
* **Clear Boundaries:** An agent should know exactly when they have finished a milestone based on your `instruction.md`.
* **Balance:** Avoid over-segmenting. Most milestone tasks should have between 2 and 5 milestones. If a task requires 10 milestones, attempt to combine milestones that are closely related or index on challenging parts of the task.

---