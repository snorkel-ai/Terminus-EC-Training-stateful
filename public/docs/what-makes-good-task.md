# What Makes a Good Task

Creating high-quality tasks is both an art and a science. This guide covers what separates excellent tasks from mediocre ones.

## The Core Principle

> **A good task is one that an expert human can solve confidently, but that challenges or stumps current AI coding agents.**

We're not looking for trivia or trick questions. We want genuine engineering challenges that require:

- Multi-step reasoning
- Domain expertise
- Practical problem-solving skills

## Characteristics of Great Tasks

### 1. Clear Problem Statement

The task should be unambiguous. A skilled engineer should understand exactly what's being asked.

**✅ Good:**
> "Implement a function that finds the longest palindromic substring in a given string. The function should return the substring itself, not its length. If there are multiple palindromes of the same maximum length, return the one that appears first."

**❌ Bad:**
> "Write code for palindromes."

### 2. Appropriate Difficulty

Tasks should be challenging but solvable. Aim for problems that:

- Take an expert 15-60 minutes to solve
- Require actual thinking, not just recall
- Have multiple possible approaches

### 3. Verifiable Solutions

Every task must have a way to verify correctness:

```python
# Example: Task with clear verification
def test_lru_cache():
    cache = LRUCache(capacity=2)
    cache.put(1, 1)
    cache.put(2, 2)
    assert cache.get(1) == 1  # Returns 1
    cache.put(3, 3)           # Evicts key 2
    assert cache.get(2) == -1 # Returns -1 (not found)
```

### 4. Real-World Relevance

The best tasks mirror actual engineering challenges:

- Debugging production issues
- Implementing standard algorithms
- Optimizing performance
- Writing robust error handling

### 5. Edge Cases Included

Consider and test edge cases:

| Scenario | Example |
|----------|---------|
| Empty input | Empty string, empty array |
| Single element | Array of one item |
| Large input | Performance with 10M elements |
| Boundary values | Integer overflow, precision limits |
| Invalid input | Null, undefined, wrong types |

## What to Avoid

### ❌ Trivia Questions

Don't test memorization:
> "What is the time complexity of heapsort?"

Instead, test application:
> "Given a stream of integers, implement a data structure that efficiently returns the median at any time."

### ❌ Ambiguous Requirements

Don't leave room for interpretation that affects the solution:
> "Make the function faster."

Be specific:
> "Optimize the function to run in O(n log n) time complexity."

### ❌ Tasks That Require External Resources

Don't require:
- API keys or accounts
- Specific hardware
- Non-standard libraries
- Internet access during execution

### ❌ Overly Simple Tasks

If GPT-4 can solve it in one shot without thinking, it's too easy:
> "Write a function to add two numbers."

## Task Categories

| Category | Example Tasks |
|----------|---------------|
| **Algorithms** | Graph traversal, dynamic programming, optimization |
| **Systems** | Memory management, concurrency, networking |
| **Debugging** | Find and fix bugs in provided code |
| **Optimization** | Improve performance of working but slow code |
| **Design** | Implement a class/module meeting specific requirements |

## Quality Checklist

Before submitting, verify:

- [ ] Problem statement is clear and complete
- [ ] Constraints are explicitly stated
- [ ] Expected input/output format is defined
- [ ] At least 5 test cases, including edge cases
- [ ] Solution exists and is verifiable
- [ ] Difficulty is appropriate (not trivial, not impossible)
- [ ] No external dependencies required

---

Next: [Task Creation Guide](/portal/docs/task-creation-guide) for step-by-step instructions.
