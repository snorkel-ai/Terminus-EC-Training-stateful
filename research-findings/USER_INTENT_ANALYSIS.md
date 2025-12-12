# User Intent Analysis: Docs vs Tasks

> Generated: December 11, 2025 | Data source: PostHog | Time range: Last 30 days

This document analyzes how users split their attention between documentation and task discovery.

---

## User Segmentation

| Segment | Users | % of Active Users |
|---------|-------|-------------------|
| **Neither docs nor gallery** | 134 | 56.1% |
| **Both docs AND gallery** | 62 | 25.9% |
| **Docs only** (no gallery) | 24 | 10.0% |
| **Gallery only** (no docs) | 19 | 8.0% |
| **Total active users** | 239 | 100% |

---

## Visual Breakdown

```
Active Users (239)
├── Neither docs nor gallery: 134 (56%) ← Largest segment
├── Both docs AND gallery:     62 (26%) ← Engaged users
├── Docs only:                 24 (10%) ← Learning-focused
└── Gallery only:              19 (8%)  ← Task-focused
```

---

## Key Insights

### 1. 56% of active users aren't exploring docs OR tasks

This is the biggest opportunity. These users are logging in but not engaging with core content. They might be:
- Checking their profile or existing tasks
- Just looking around
- Stuck or confused on what to do next

**Recommendation:** Consider adding prompts on the landing page to guide users toward docs or tasks.

### 2. Docs and tasks go together

62 users (74% of doc viewers, 77% of gallery viewers) do BOTH. Users who learn also want to work.

**Recommendation:** Cross-link between docs and relevant tasks. Consider "Suggested tasks" after doc completion.

### 3. Pure "learners" are rare

Only 24 users (10%) view docs without ever checking tasks. This suggests docs are mainly used as task support, not standalone learning.

**Recommendation:** Docs are serving their purpose as task enablement. Keep them practical and task-focused.

### 4. Few task-first users

Only 19 users (8%) go straight to tasks without reading docs. Your onboarding is working to guide people through docs first.

**Recommendation:** This is healthy behavior. Users are preparing before diving in.

---

## Overlap Analysis

| Metric | Value |
|--------|-------|
| Total doc viewers | 86 |
| Total gallery viewers | 81 |
| Users who did both | 62 |
| % of doc viewers who also browse tasks | **72%** |
| % of gallery viewers who also read docs | **77%** |

The high overlap suggests users understand that reading docs and finding tasks are complementary activities.

---

## Recommendations

1. **Target the 134 "inactive" users**
   - What are they doing on the platform?
   - Add tracking for profile views, existing task management
   - Consider email nudges to re-engage

2. **Reduce friction to gallery**
   - Add "Browse tasks" CTA on landing page
   - Show task recommendations based on completed onboarding

3. **Connect docs to tasks**
   - Add "Related tasks" sections in documentation
   - After onboarding completion, prompt users to claim their first task

---

## PostHog Query

```sql
SELECT
    count(DISTINCT doc_users.person_id) AS doc_viewed_users,
    count(DISTINCT gallery_users.person_id) AS gallery_viewed_users,
    count(DISTINCT both_users.person_id) AS both_users
FROM
    (
        SELECT DISTINCT person_id
        FROM events
        WHERE event = 'doc_viewed'
          AND timestamp >= now() - INTERVAL 30 DAY
    ) AS doc_users
CROSS JOIN
    (
        SELECT DISTINCT person_id
        FROM events
        WHERE event = 'gallery_viewed'
          AND timestamp >= now() - INTERVAL 30 DAY
    ) AS gallery_users
CROSS JOIN
    (
        SELECT DISTINCT e_gallery.person_id
        FROM events AS e_gallery
        WHERE e_gallery.event = 'gallery_viewed'
          AND e_gallery.timestamp >= now() - INTERVAL 30 DAY
          AND e_gallery.person_id IN (
              SELECT DISTINCT e_doc.person_id
              FROM events AS e_doc
              WHERE e_doc.event = 'doc_viewed'
                AND e_doc.timestamp >= now() - INTERVAL 30 DAY
          )
    ) AS both_users
```

---

## Related Resources

- [Task Card Insights](./TASK_CARD_INSIGHTS.md)
- [Analytics Documentation](../docs/ANALYTICS.md)
- [PostHog Dashboard](https://us.posthog.com/project/263586/dashboard/849433)
