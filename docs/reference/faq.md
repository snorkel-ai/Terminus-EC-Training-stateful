# Frequently Asked Questions

Common questions about TerminalBench and the task creation process.

---

## Getting Started

### Do I need to attend onboarding to get started?

No, live onboarding is not required. We encourage attending so you can ask questions, but recordings and slides are available on this site. You can start immediately after reviewing the materials.

### I didn't receive an assessment. Do I need to take one?

No, there is currently no assessment for this project. You can start familiarizing yourself with the task format and begin working immediately.

### How do I receive my API keys?

You should receive an email with your API key shortly after joining. If you haven't received it within a day or two, please reach out to Puyun Tafreshi or Alejandro Sanchez on Slack. You only need the OpenAI key—our infrastructure allows you to run Anthropic models using this key.

---

## Task Creation

### How do I get served a task?

You are NOT served tasks like in other Snorkel projects. You will ideate and create tasks completely from scratch. See the [Creating a Task](/portal/docs/creating-tasks/videos/creating-task) guide.

### How do I get an idea for my task?

You can either:
- Come up with a task from scratch
- Take an idea from the shared task ideas sheet
- Use existing ideas as "inspiration" for similar or more complex tasks

### How do I claim an existing task idea?

Go to the "Task Gallery" tab, search for the desired task, click on the task card and click "Claim Task".

### How do I make a hard task?

**Important:** Tasks with > 80% pass rate will NOT be accepted.

Strategies for harder tasks:

1. **Debugging-style tasks** — Figuring out root causes requires reasoning
2. **Niche knowledge** — Use publicly available but rarely-trained information
3. **Bespoke rules** — Custom rules buried among common patterns
4. **Multi-step complexity** — More steps = more chances for failure

See [Difficulty Guidelines](/portal/docs/understanding-tasks/difficulty-guidelines) for details.

---

## Submission & Review

### What are the Office Hours sessions?

Open forums for asking questions—general or task-specific. Not required, but useful for learning from others' questions. Check Slack for the schedule.

### How long does review take?

- Initial review: 1-3 business days
- Follow-up reviews: 1-2 business days
- Total: Usually 3-7 days

### What if my task is declined?

You'll receive feedback explaining why. Common reasons include:
- Too easy (> 80% pass rate)
- Unclear requirements
- Similar task exists
- Missing components

You can often revise and resubmit, or appeal if you disagree.

---

## Technical

### Why do CI checks pass locally but fail in the PR?

Common causes:
- Different Python version (CI uses specific versions)
- Missing dependencies
- Environment differences

Check the CI logs for the specific error.

### How do I test against real agents?

After receiving your API key:

```bash
export OPENAI_API_KEY=<your-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1

# GPT-5
harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/<task>

# Claude
harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/<task>
```

### Portkey / API key issues — agent won't connect

**90% of Portkey issues are solved by setting the base URL:**

```bash
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

Make sure you have BOTH environment variables set:

```bash
export OPENAI_API_KEY=<your-portkey-api-key>
export OPENAI_BASE_URL=https://api.portkey.ai/v1
```

> **Note:** The same API key works for both GPT-5 and Claude models through Portkey.

### Are the quality checks on the platform using different models or prompts than what is used on GitHub?

No, Snorkel is not doing anything differently on the platform compared to GitHub. The system uses the following configuration:
- Total Agents: There are 10 agents in total.
- Claude Agents: 5 agents use Claude Sonnet 4.5 via Claude Code.
- GPT Agents: 5 agents use GPT 4.5 via Codex.

For more detailed information on running agents, please refer to the [Testing Agent Performance](/portal/docs/testing-and-validation/running-real-agents) guide.

### How should I handle Provider List error appearing in my logs for GPT agents?

The Provider List output is just a warning message. It is not an indication of a task failure and should be ignored during troubleshooting.

### Docker won't start. What do I do?

1. Ensure Docker Desktop is running
2. On macOS, enable socket access in Settings → Advanced
3. Try:
```bash
sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker
```

---

## Payment

### When do I get paid?

- Billing week: Friday–Thursday (UTC)
- Payment submitted ~1 week after billing week ends
- Deposit arrives 1-2 weeks after submission

### How do I track my payment?

- Platform status "Payout Submitted" = Payment on the way
- If > 1 week after that with no deposit, reach out to Snorkel

### Do I get paid per submission?

No, you get paid per **accepted** submission. Tasks must pass all automated checks AND peer review.

---

## Still Have Questions?

- **Slack:** `#ec-terminus-submission`
- **Office Hours:** Check Slack for schedule
- **Documentation:** Use search (⌘K) to find topics
