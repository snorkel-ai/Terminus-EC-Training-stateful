# Task Card Viewing Analysis

> Generated: December 11, 2025 | Data source: PostHog

This document contains insights about how users interact with task cards in the gallery.

> ⚠️ **Data Note:** The `task_card_viewed` event was first deployed on December 11, 2025 at 12:39 PM PST. Early metrics reflect ~8 hours of data collection. Normalized rates below account for this.

---

## Data Context

| Metric | Value |
|--------|-------|
| **Total platform users** | 239 |
| **Event tracking started** | Dec 11, 2025 @ 12:39 PM PST |
| **Users captured so far** | 18 |

---

## Normalized Engagement Rates

### Among Active Users (Since Tracking Started)

| Metric | Count | % of Active Users |
|--------|-------|-------------------|
| **Active users** (since tracking started) | 158 | 100% |
| **Users who viewed a task card** | 7 | **4.4%** |

### Gallery → Task Card Funnel

| Step | Users | Conversion |
|------|-------|------------|
| Visited gallery | 70 | 100% |
| Opened a task card | 18 | **25.7%** |

**Key takeaway:** About 1 in 4 gallery visitors clicks into a task card to learn more.

---

## Average Task Cards Opened Per User

| Metric | Value |
|--------|-------|
| **Average cards viewed per user** | **4.6 task cards** |
| **Total unique users** (last 30 days) | 18 users |
| **Total task card views** | 72 views |

### Distribution of Views Per User

| Cards Viewed | Number of Users |
|--------------|-----------------|
| 1 card | 6 users (33%) |
| 2 cards | 4 users (22%) |
| 3-5 cards | 4 users (22%) |
| 6+ cards | 4 users (22%) |

A few power users (viewing 14-17 cards) are pulling the average up. The **median user views about 2 cards**.

---

## Most Viewed Categories

| Category | Views |
|----------|-------|
| System Setup & Configuration | 27 |
| Software Engineering & Development | 12 |
| Scientific Computing & Analysis | 11 |
| Data Processing & Scripting | 7 |
| Machine Learning & AI | 6 |
| Debugging & Troubleshooting | 4 |
| Security & Cryptography | 3 |
| Interactive Challenges & Games | 2 |

**System Setup & Configuration** is the clear leader with over 2x the views of the next category.

---

## Conversion: View → Claim

| Metric | Value |
|--------|-------|
| **Conversion rate** | **50%** |
| Users who viewed a card | 18 |
| Users who claimed a task | 9 |
| **Avg time to claim** | 42 seconds |
| **Median time to claim** | 26 seconds |

Half of users who open a task card go on to claim a task, and they decide quickly (within ~30 seconds). This suggests the task details are clear and compelling.

---

## Insights & Recommendations

1. **~26% gallery-to-card click rate** - About 1 in 4 gallery visitors opens a task card. This is healthy but suggests room to improve task preview cards.

2. **Browsing behavior is focused** - Users view ~5 cards on average before deciding, suggesting good task discoverability

3. **System Setup tasks are hot** - Consider adding more tasks in this category or featuring it more prominently

4. **Quick decision making** - The 26-second median claim time shows users know what they want; ensure key info is above the fold in task cards

5. **50% drop-off opportunity** - Half of viewers don't claim. Consider:
   - Adding a "save for later" feature
   - Following up with users who viewed but didn't claim
   - Analyzing which specific task cards have lower conversion

6. **Low gallery traffic** - Only 4.4% of active users opened a task card. Most users are focused on other areas (docs, profile, existing tasks). Consider:
   - Promoting task discovery on the landing page
   - Adding task recommendations based on user skills

---

## Metrics to Watch Over Time

| Metric | Current | Why It Matters |
|--------|---------|----------------|
| **Gallery → Task Card rate** | 25.7% | Are task titles/previews compelling enough? |
| **Task Card → Claim rate** | 50% | Is the card info sufficient to decide? |
| **Cards per session** | 4.6 avg | Do users browse or know exactly what they want? |
| **Active → Gallery rate** | ~44% | Are we driving users toward task discovery? |

---

## PostHog Queries Used

### Gallery to task card conversion

```json
{
  "kind": "TrendsQuery",
  "dateRange": { "date_from": "-30d" },
  "series": [
    { "event": "gallery_viewed", "kind": "EventsNode", "math": "dau" },
    { "event": "task_card_viewed", "kind": "EventsNode", "math": "dau" }
  ]
}
```

### Average views per user with distribution

```sql
WITH per_user AS (
    SELECT
        person_id,
        count() AS views_per_user
    FROM events
    WHERE
        event = 'task_card_viewed'
        AND timestamp >= now() - INTERVAL 30 DAY
    GROUP BY person_id
)
SELECT
    (SELECT avg(views_per_user) FROM per_user) AS avg_views_per_user,
    views_per_user,
    count() AS users_with_this_view_count
FROM per_user
GROUP BY views_per_user
ORDER BY views_per_user ASC
```

### View to claim funnel

```json
{
  "kind": "FunnelsQuery",
  "dateRange": { "date_from": "-30d" },
  "series": [
    { "event": "task_card_viewed", "kind": "EventsNode" },
    { "event": "task_claimed", "kind": "EventsNode" }
  ],
  "funnelsFilter": {
    "funnelOrderType": "ordered",
    "funnelWindowInterval": 14,
    "funnelWindowIntervalUnit": "day"
  }
}
```

### Views by category

```json
{
  "kind": "TrendsQuery",
  "dateRange": { "date_from": "all" },
  "series": [
    { "event": "task_card_viewed", "kind": "EventsNode", "math": "total" }
  ],
  "breakdownFilter": {
    "breakdowns": [{ "property": "task_category", "type": "event" }]
  }
}
```

---

## Related Resources

- [PostHog Dashboard](https://us.posthog.com/project/263586/dashboard/849433)
- [Analytics Documentation](../docs/ANALYTICS.md)
- [User Intent Analysis](./USER_INTENT_ANALYSIS.md)
