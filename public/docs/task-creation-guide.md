# Task Creation Guide

This step-by-step guide walks you through creating a complete, high-quality task from start to finish.

## Task Structure

Every task consists of these components:

```
task/
├── README.md           # Problem statement
├── starter/            # Code given to the agent
│   └── solution.py     # Template with function signatures
├── solution/           # Reference solution
│   └── solution.py     # Your verified solution
├── tests/              # Verification tests
│   └── test_solution.py
└── metadata.json       # Task metadata
```

## Step 1: Define the Problem

Start with a clear problem statement in `README.md`:

```markdown
# Task: Implement Rate Limiter

## Problem Statement

Implement a rate limiter class that limits the number of requests 
a user can make within a sliding time window.

## Requirements

- `RateLimiter(max_requests: int, window_seconds: int)`
- `is_allowed(user_id: str) -> bool`: Returns True if request is allowed
- Must handle concurrent requests safely
- Memory efficient for large numbers of users

## Constraints

- 1 ≤ max_requests ≤ 1000
- 1 ≤ window_seconds ≤ 3600
- User IDs are alphanumeric strings, max length 64

## Examples

```python
limiter = RateLimiter(max_requests=3, window_seconds=60)
limiter.is_allowed("user1")  # True (1st request)
limiter.is_allowed("user1")  # True (2nd request)
limiter.is_allowed("user1")  # True (3rd request)
limiter.is_allowed("user1")  # False (rate limited)
```
```

## Step 2: Create Starter Code

Provide a template in `starter/solution.py`:

```python
from typing import Optional
import time

class RateLimiter:
    """
    A sliding window rate limiter.
    
    Args:
        max_requests: Maximum number of requests allowed in the window
        window_seconds: Size of the sliding window in seconds
    """
    
    def __init__(self, max_requests: int, window_seconds: int):
        # TODO: Initialize your data structures
        pass
    
    def is_allowed(self, user_id: str) -> bool:
        """
        Check if a request from the given user is allowed.
        
        Args:
            user_id: Unique identifier for the user
            
        Returns:
            True if the request is allowed, False otherwise
        """
        # TODO: Implement rate limiting logic
        pass
```

### Starter Code Guidelines

- Include all required function/class signatures
- Add docstrings explaining expected behavior
- Include type hints
- Mark implementation points with `TODO`
- Don't include any solution logic

## Step 3: Write Your Solution

Implement the complete solution in `solution/solution.py`:

```python
from collections import defaultdict
from threading import Lock
import time

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self.lock = Lock()
    
    def is_allowed(self, user_id: str) -> bool:
        current_time = time.time()
        window_start = current_time - self.window_seconds
        
        with self.lock:
            # Remove expired requests
            self.requests[user_id] = [
                t for t in self.requests[user_id] 
                if t > window_start
            ]
            
            # Check if under limit
            if len(self.requests[user_id]) < self.max_requests:
                self.requests[user_id].append(current_time)
                return True
            
            return False
```

## Step 4: Create Test Cases

Write comprehensive tests in `tests/test_solution.py`:

```python
import pytest
import time
from solution import RateLimiter

class TestRateLimiter:
    def test_basic_allows_under_limit(self):
        """Requests under the limit should be allowed."""
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user1") == True
    
    def test_blocks_over_limit(self):
        """Requests over the limit should be blocked."""
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user1") == False
    
    def test_separate_users(self):
        """Different users have independent limits."""
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user2") == True
        assert limiter.is_allowed("user1") == False
    
    def test_window_expiry(self):
        """Requests should be allowed after window expires."""
        limiter = RateLimiter(max_requests=1, window_seconds=1)
        assert limiter.is_allowed("user1") == True
        assert limiter.is_allowed("user1") == False
        time.sleep(1.1)
        assert limiter.is_allowed("user1") == True
    
    def test_edge_case_empty_user_id(self):
        """Empty user ID should still work."""
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        assert limiter.is_allowed("") == True
        assert limiter.is_allowed("") == False
```

### Test Guidelines

- Cover happy path scenarios
- Include edge cases (empty input, boundaries)
- Test error conditions
- Aim for 5-10 meaningful test cases
- Each test should test one specific behavior

## Step 5: Add Metadata

Create `metadata.json`:

```json
{
  "id": "rate-limiter-sliding-window",
  "title": "Implement Rate Limiter",
  "difficulty": "medium",
  "domain": "systems",
  "tags": ["concurrency", "data-structures", "rate-limiting"],
  "estimated_time_minutes": 30,
  "author": "your-github-username",
  "created_at": "2024-01-15"
}
```

## Step 6: Verify Your Task

Before submitting, verify everything works:

```bash
# Run the tests against your solution
cd task/
cp solution/solution.py starter/solution.py
pytest tests/ -v

# All tests should pass
```

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|--------------|
| Ambiguous requirements | Have a colleague read your problem statement |
| Tests too easy | Include edge cases and performance tests |
| Solution in starter code | Review starter code for hints |
| Missing constraints | Explicitly state all limits and assumptions |

---

Next: [Example Tasks](/portal/docs/task-examples) to see these principles in action.
