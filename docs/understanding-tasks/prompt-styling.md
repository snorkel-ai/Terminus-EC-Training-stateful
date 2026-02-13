# Instruction Prompt Styling

The `instruction.md` file is the primary interface between the task and the AI agent. To ensure Terminal Bench Edition 2 reflects real-world usage, we follow **strict** styling guidelines for how your prompt should be written. The goal is to avoid "over-explained" prompts that are typical of synthetic datasets, and instead mimic the precise but natural language human engineers use when interacting with AI agents in the real world.

## The Core Philosophy

Prompts should be **precise, concise, and authentic.** In a production environment, a user doesn't provide a 10-page specification; they provide a context-rich summary and a set of actionable requirements. Your instructions should reflect this.

> **Important:** Prompts should **NOT** be LLM-generated. We want to avoid the "GPT-style" of writing (verbose, repetitive, and overly polite) in favor of professional human technical communication.

---

## Structural Requirements

Every `instruction.md` must adhere to the following length and structure constraints:

### 1. Problem Description (1-2 Paragraphs)
Provide a high-level overview of the issue or the goal. State the "why" and the current state of the environment.
* **Do:** Use technical shorthand where appropriate.
* **Don't:** Provide a history of the programming language or unnecessary fluff.

### 2. Requirements (Max 2 Paragraphs / 20 Bullets)
List the specific constraints, expected outputs, or milestones. 
* **Limit:** No more than 20 bullet points total.
* **Clarity:** Ensure that requirements are measurable but not "spoon-fed." The agent should have to reason about *how* to implement the requirement.

---

## Human-Centric vs. Synthetic Styling



To maintain authenticity, compare these two styles:

| Feature | Synthetic (Avoid) | Human-Centric (Target) |
| :--- | :--- | :--- |
| **Tone** | "You are an expert programmer. Your goal is to..." | "We need to migrate the existing SQLite schema to..." |
| **Length** | 500+ words of redundant context. | 150-200 words of actionable info. |
| **Guidance** | "First, use the `ls` command to see files, then..." | "The source data is in `/data`. Output the result to..." |
| **Formatting** | Over-use of bolding and flowery transitions. | Standard technical Markdown. |

---

## Example Prompt Style

### `instruction.md`

The legacy log-processing script in `scripts/parser.py` is failing to handle the new multi-line stack traces coming from our Java services. This is causing the ETL pipeline to drop critical error events.

You need to refactor the parser to support these multi-line events and ensure they are correctly grouped by timestamp.

**Requirements:**
* Modify `parser.py` to recognize log entries starting with a `[` as a new record.
* Any lines not starting with `[` should be appended to the previous record's `message` field.
* The script must output a valid JSONL file to `output/cleaned_logs.jsonl`.
* Ensure the parser handles files up to 500MB without exceeding 1GB of RAM.
* Run the existing validation script `tests/verify_format.sh` to confirm the output structure.

---

## Final Checklist
- [ ] Is the problem described in 2 paragraphs or less?
- [ ] Are there fewer than 20 bullet points?
- [ ] Does it sound like a senior engineer speaking to a peer?
- [ ] Have you removed all "LLM-isms" (e.g., "Certainly! I will help you...")?