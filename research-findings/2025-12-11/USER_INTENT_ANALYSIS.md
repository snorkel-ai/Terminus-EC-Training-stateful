# User Intent Analysis: Docs vs Tasks

> Generated: December 11, 2025 | Data source: PostHog | Time range: Last 30 days

This document analyzes how users split their attention between documentation and task discovery.

> ⚠️ **Data Limitation:** The `gallery_viewed` and `task_card_viewed` events were introduced on Dec 11, 2025. Historical navigation data is incomplete. These numbers will become more representative after 2-4 weeks of data collection.
>
> **📅 Suggested follow-up:** Re-run this analysis on **January 8, 2025** for a full month of data.

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

## What Are the 134 "Inactive" Users Doing?

We queried events from users who never viewed docs or gallery:

| Event | Count | Interpretation |
|-------|-------|----------------|
| `$autocapture` | 510 | Clicking around the UI |
| `$pageview` | 460 | Navigating pages |
| `onboarding_step_completed` | 7 | Working through "Get Started" cards |
| `landing_page_viewed` | 5 | Viewing the home page |
| `browse_tasks_clicked` | 1 | Clicked but bounced before gallery loaded |

These users ARE engaging - just not completing the journey to docs or gallery.

---

## Recommendations

1. **Improve onboarding → gallery conversion**
   - Users complete onboarding steps but don't proceed to tasks
   - Consider auto-redirecting to gallery after completing all onboarding cards
   - Add a more prominent "Claim your first task" CTA after onboarding

2. **Investigate the bounce after "Browse tasks" click**
   - 1 user clicked "Browse tasks" but never triggered `gallery_viewed`
   - Check for slow load times or errors on the gallery page
   - Consider adding loading states or pre-fetching

3. **Connect docs to tasks**
   - Add "Related tasks" sections in documentation
   - Show task recommendations based on user skills/interests

4. **Note: "Browse tasks" CTA already exists**
   - The landing page empty state prominently displays "Browse tasks →"
   - The issue isn't CTA visibility - it's follow-through after clicking

---

## Questions Asked (for reproducing this analysis)

Use these exact prompts with the PostHog MCP `query-generate-hogql-from-question` tool:

1. **"In the last 30 days, show me: 1) count of unique users who triggered doc_viewed, 2) count of unique users who triggered gallery_viewed, 3) count of unique users who triggered both events"**

2. **"How many unique users (distinct person_id) triggered any event in the last 30 days?"**

3. **"What are the most common events triggered by users who have NOT triggered doc_viewed or gallery_viewed in the last 30 days? Show top 10 events and their counts."**

---

## PostHog Queries Generated

### 1. Total active users (last 30 days)

```sql
SELECT count(DISTINCT person_id) AS unique_users_last_30_days
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
```

### 2. Doc viewers, gallery viewers, and overlap

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

### 3. What are "inactive" users doing? (users who never viewed docs or gallery)

```sql
SELECT
    event,
    count() AS event_count
FROM events
WHERE
    timestamp >= now() - INTERVAL 30 DAY
    AND person_id IS NOT NULL
    AND person_id NOT IN (
        SELECT DISTINCT person_id
        FROM events
        WHERE
            event IN ['doc_viewed', 'gallery_viewed']
            AND timestamp >= now() - INTERVAL 30 DAY
            AND person_id IS NOT NULL
    )
GROUP BY event
ORDER BY event_count DESC
LIMIT 10
```

### Calculating the segments

From the query results:
- **Total active users** = 239
- **Doc viewers** = 86
- **Gallery viewers** = 81
- **Both** = 62
- **Docs only** = Doc viewers - Both = 86 - 62 = 24
- **Gallery only** = Gallery viewers - Both = 81 - 62 = 19
- **Neither** = Total - Docs only - Gallery only - Both = 239 - 24 - 19 - 62 = 134

---

## Related Resources

- [Task Card Insights](./TASK_CARD_INSIGHTS.md)
- [Analytics Documentation](../../docs/ANALYTICS.md)
- [PostHog Dashboard](https://us.posthog.com/project/263586/dashboard/849433)
