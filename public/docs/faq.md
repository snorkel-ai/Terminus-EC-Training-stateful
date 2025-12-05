# Frequently Asked Questions

Common questions about TerminalBench and the task creation process.

---

## Getting Started

### How do I get started?

1. Complete the [Quick Start Guide](/portal/docs/quick-start)
2. Watch the platform onboarding video
3. Join the Slack channel
4. Study [example tasks](/portal/docs/task-examples)
5. Create your first task!

### Do I need to be an expert programmer?

You should have solid programming experience in at least one domain. We're looking for people who can create challenges that require genuine expertise to solve—not necessarily polyglots who know every language.

### What programming languages can I use?

Currently we accept tasks in:
- Python
- JavaScript/TypeScript
- Go
- Rust
- Java
- C/C++

If you want to submit in another language, ask in Slack first.

---

## Task Creation

### How difficult should my tasks be?

Tasks should take an experienced engineer 15-60 minutes to solve. They should require thinking, not just typing. If GPT-4 can solve it immediately without effort, it's too easy.

### Can I submit tasks in any domain?

Yes! We accept tasks in:
- Algorithms & Data Structures
- Systems Programming
- Web Development
- DevOps & Infrastructure
- Data Engineering
- Security
- And more...

### How many tasks can I submit?

There's no limit! Quality matters more than quantity. Submit as many high-quality tasks as you can create.

### What if my task is similar to an existing one?

Variations are okay if they test different aspects or add meaningful complexity. Duplicates or trivially different tasks will be declined.

---

## Review Process

### How long does review take?

- Initial review: 1-3 business days
- Follow-up reviews: 1-2 business days
- Total time: Usually 3-7 days

### What happens if my task is declined?

You'll receive feedback explaining why. Common reasons:
- Too easy / too hard
- Unclear requirements
- Similar task already exists
- Missing test cases

You can often revise and resubmit.

### Can I appeal a decision?

Yes. Reply to the review with your reasoning. If you still disagree, escalate to the #terminalbench-support Slack channel.

---

## Payments

### How much do I get paid per task?

Payouts vary by difficulty and quality:

| Difficulty | Range |
|------------|-------|
| Easy | $X - $Y |
| Medium | $Y - $Z |
| Hard | $Z - $W |
| Expert | $W+ |

*Actual amounts communicated separately.*

### When do I get paid?

Payments are processed on a regular schedule after task acceptance. Check Slack for specific payment dates.

### How do I receive payment?

Payment methods are set up during onboarding. Contact support if you need to update your payment information.

---

## Technical Questions

### My tests pass locally but fail in CI. What's wrong?

Common causes:
- Different Python/Node version
- Missing dependencies
- Timing-dependent tests
- Environment-specific paths

Check the CI logs for specific errors.

### Can I use external libraries?

Standard library: Yes
Common libraries (numpy, requests): Usually yes
Obscure libraries: Ask first

The goal is for tasks to be solvable without special setup.

### How do I test time-dependent code?

Use dependency injection or mock time:

```python
# Bad: Hard to test
def is_expired():
    return time.time() > self.expiry

# Good: Testable
def is_expired(self, current_time=None):
    current_time = current_time or time.time()
    return current_time > self.expiry
```

---

## Platform Issues

### I can't log in to the platform

1. Clear your browser cache
2. Try incognito/private mode
3. Check if you're using the right email
4. Contact support on Slack

### I can't push to the repository

1. Verify your SSH key is set up
2. Confirm you have repository access
3. Make sure you're on a feature branch (not main)
4. Check for Git errors in terminal

### The portal is showing errors

1. Refresh the page
2. Clear browser cache
3. Try a different browser
4. Report the issue on Slack with screenshots

---

## Still Have Questions?

- **Slack:** #terminalbench-support
- **Office Hours:** Check Slack for schedule
- **Documentation:** Use search (⌘K) to find topics

---

*Last updated: December 2024*
