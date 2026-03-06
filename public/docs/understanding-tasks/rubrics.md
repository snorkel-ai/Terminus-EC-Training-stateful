# Understanding Rubrics

The pre-generated synthetic rubrics provided in your workbench are merely a baseline. To meet the Terminal Bench Edition 2 standards, you must refine these drafts into a thorough, diagnostic tool that accurately separates elite engineering from "shotgun" coding.

For further detailed guidelines on Rubrics, visit this guidelines document: **[Go to Rubrics Guidelines](https://docs.google.com/document/d/1HUFv8fUu3zy4aLUC9oBtH6xZgmu44R7zlMRUl22UT1U/edit?tab=t.0#heading=h.2m2fq7otru3u)**

## How do I include a Rubric with my submission?
The workflow to create your rubric is done entirely on the Snorkel platform. Within the **Terminus-2nd-Edition** submission UI, you will find two new sections at the bottom of the page.

 * **A Checkbox**
    * Checking this checkbox allows you to generate a rubric upon which you can then edit for completeness and accuracy
 * **A Textbox**
    * This is where the generated rubric will appear once you check the checbox above it.

### The Workflow
1. **Generate the Rubric:** Click the checkbox. Allow up 1-3 minutes for the rubric to generate
2. **Edit the Rubric:** Once generated, this rubric which is based on the uploaded .zip file you provided above, you can then directly edit the rubric within the textbox for completeness and accuracy
3.  **Uncheck the Checkbox:** Once satisfied with your rubric, make sure to always uncheck the checkbox above before you submit! *Submitting with the checkbox checked might cause your rubric to be overwritten upon submission.*
4.  **Submit:** Once satisfied with your submission overall, including the rubric you generated and edited, simply submit your submission.

# Rubrics and You

## 1. The "Starting Point" Philosophy
Don’t simply accept the synthetic rubric as-is. It is a general guideline that often misses specific task nuances.
* **Refine & Extend:** Use high-quality criteria from the draft, but add task-specific checks to make it thorough.
* **Target Lacking Areas:** Look at agent logs to identify where models typically struggle (e.g., poor error recovery, lack of file inspection) and write checks for those behaviors.
* **No Perfect Scores:** These are "Frontier" tasks. A rubric should rarely yield a perfect score unless the trace is exceptionally clean and professional.


## 2. What to Exclude
To keep rubrics objective and focused on the **process**, avoid these common pitfalls:
* **No Standard Pytest Checks:** Do not include criteria for running `pytest` unless the task itself is a "testing" task or the solution explicitly relies on it. Final unit tests are run automatically by the framework upon completion.
* **No Meta-Checks:** Never include criteria about the agent reading `task.yaml` or `instructions.md`. These are passed automatically and do not represent engineering "work."



## 3.  Negative Penalties
Negative penalties should be included where appropriate (e.g., a score of -1). A mix of positive rewards and negative penalties is essential for "shaping" the score.



### The "Opposite" Trap
Do not convert a severe negative behavior into a minor positive reward. 
* **Bad (Minor Reward):** `Agent performs all operations in the /app directory, +1` — *This rewards a basic expectation.*
* **Good (Major Penalty):** `Agent operates outside of the /app directory, -5` — *This correctly penalizes a critical security/scope violation.*

**Key Principle:** Use negative values for undesirable events. Keep the sentence a statement of fact, but let the point value reflect the desirability.



## 4. Strict Formatting Rules
Every line in your `rubrics.txt` must follow these syntax rules for CI validation:

1.  **Start:** Every line must begin with the word **"Agent"**.
2.  **End:** Every line must end in a comma followed by the score (e.g., `, +3`).
3.  **Values:** You must use **+/- 1, 2, 3, or 5**. 
4.  **Forbidden:** **Do not use the number 4.**

### Importance Hierarchy
* **Critical (±5):** Safety (no `rm -rf /`), core correctness, avoids leaking secrets.
* **Major (±3):** Reliability, verification of artifacts, error recovery.
* **Minor (±1 to ±2):** Inspection (using `head`/`cat`), hygiene, appropriate tool flags.



## 5. Comparison: Good vs. Bad Rubrics

| Feature | ✅ Good (Detailed & Precise) | ❌ Bad (Vague & Inconsistent) |
| :--- | :--- | :--- |
| **Formatting** | `Agent compiles contracts using forge build and surfaces the output, +2` | `Agent parses input correctly, +2` (Too vague) |
| **Specificity** | `Agent verifies blockchain connectivity via curl before deployment, +1` | `Agent handles edge cases in logic, +2` (Not binary/verifiable) |
| **Values** | Uses +1, +2, +3, +5 | `Agent determines schema offsets, +4` (Uses forbidden number 4) |
| **Logic** | `Agent repeats the same failing command ≥3 times, -1` | `Agent writes script without testing it, -3` (Inconsistent format) |

---

## Rubric Authoring Summary Checklist
- [ ] Every line starts with "Agent" and ends with ", [Score]".
- [ ] Only uses +/- 1, 2, 3, 5 (**No 4s**).
- [ ] Includes significant negative penalties for unsafe/redundant behavior.
- [ ] Focuses on trace-evidenced actions, not the final pytest result.
- [ ] Rephrased synthetic checks to be task-specific and non-generic.