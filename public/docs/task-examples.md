# Example Tasks

Learn from these example tasks that demonstrate our quality standards.

## Example 1: LRU Cache Implementation

**Difficulty:** Medium | **Domain:** Data Structures | **Time:** 25 min

### Problem Statement

Implement a Least Recently Used (LRU) cache with O(1) time complexity for both `get` and `put` operations.

### Why This is a Good Task

✅ **Clear requirements** — Specific time complexity constraint  
✅ **Multiple operations** — Tests both retrieval and insertion  
✅ **Standard problem** — Well-understood with known solutions  
✅ **Testable** — Easy to verify correctness  

### Key Test Cases

```python
def test_lru_cache():
    cache = LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    assert cache.get(1) == 1
    cache.put(3, 3)  # Evicts key 2
    assert cache.get(2) == -1
    cache.put(4, 4)  # Evicts key 1
    assert cache.get(1) == -1
    assert cache.get(3) == 3
    assert cache.get(4) == 4
```

---

## Example 2: Debug Memory Leak

**Difficulty:** Hard | **Domain:** Systems | **Time:** 45 min

### Problem Statement

The following server code has a memory leak that causes it to crash after running for several hours. Find and fix the leak.

```python
# Buggy code provided to the agent
class ConnectionPool:
    def __init__(self):
        self.connections = {}
        self.history = []
    
    def get_connection(self, host):
        if host not in self.connections:
            self.connections[host] = create_connection(host)
        self.history.append({
            'host': host,
            'time': time.time(),
            'connection': self.connections[host]
        })
        return self.connections[host]
```

### Why This is a Good Task

✅ **Real-world scenario** — Memory leaks are common production issues  
✅ **Requires analysis** — Must understand the code to find the bug  
✅ **Not obvious** — The leak is subtle (history grows unbounded)  
✅ **Verifiable** — Can measure memory before/after fix  

---

## Example 3: Optimize Query Performance

**Difficulty:** Medium | **Domain:** Databases | **Time:** 30 min

### Problem Statement

The following query takes 30+ seconds on a table with 10M rows. Optimize it to run in under 1 second without changing the result.

```sql
-- Current slow query
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01'
GROUP BY u.id
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 100;
```

### Why This is a Good Task

✅ **Performance-focused** — Clear optimization goal  
✅ **Requires expertise** — Need to understand query plans  
✅ **Measurable** — Can time before/after  
✅ **Multiple approaches** — Indexes, query rewrite, etc.  

---

## Example 4: Implement Retry Logic

**Difficulty:** Easy-Medium | **Domain:** Web | **Time:** 20 min

### Problem Statement

Implement a `retry` decorator that:
- Retries a function up to N times on failure
- Uses exponential backoff between retries
- Only retries on specified exception types
- Returns the successful result or raises the last exception

### Expected Behavior

```python
@retry(max_attempts=3, backoff_base=2, exceptions=(ConnectionError,))
def fetch_data(url):
    return requests.get(url)

# If fetch_data fails with ConnectionError:
# - 1st retry after 2 seconds
# - 2nd retry after 4 seconds
# - 3rd retry after 8 seconds
# - Then raises ConnectionError if still failing
```

### Why This is a Good Task

✅ **Practical utility** — Common pattern in production code  
✅ **Multiple requirements** — Tests several features  
✅ **Decorator pattern** — Tests Python understanding  
✅ **Testable** — Can mock failures and verify behavior  

---

## Anti-Examples: Tasks to Avoid

### ❌ Too Easy

> "Write a function that reverses a string"

**Problem:** One-liner in most languages, no challenge for AI.

### ❌ Too Vague

> "Build a web scraper"

**Problem:** No specific requirements, impossible to verify.

### ❌ Requires External Resources

> "Query the Twitter API to get trending topics"

**Problem:** Requires API credentials, network access.

### ❌ Ambiguous Success Criteria

> "Make this code better"

**Problem:** "Better" is subjective without specific metrics.

---

## Task Inspiration

Looking for ideas? Consider tasks involving:

- **Concurrency bugs** — Race conditions, deadlocks
- **Algorithm implementation** — With specific constraints
- **Code refactoring** — With measurable improvement goals
- **Security vulnerabilities** — Find and fix issues
- **Performance optimization** — With benchmarks

---

Next: [Submission Process](/portal/docs/submission-process)
