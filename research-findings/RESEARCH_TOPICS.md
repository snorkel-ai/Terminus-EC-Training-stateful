# Research Topics Backlog

This document tracks research questions to explore as PostHog data accumulates.

> 💡 **How to use:** Pick a topic, ask me the questions, and I'll query PostHog and generate a dated report in `research-findings/YYYY-MM-DD/`.

---

## 🎯 User Journey & Conversion

### Time to First Action
**Question:** "What's the average time from a user's first login ($identify) to their first task claim (task_claimed)?"

**Why it matters:** Measures onboarding friction. Long times suggest confusion or blockers.

**Status:** ⬜ Not started

---

### Task Abandonment Analysis
**Question:** "How many users claim a task but never submit it? Break down by task category and difficulty."

**Why it matters:** Identifies which tasks are too hard, unclear, or have other blockers.

**Status:** ⬜ Not started

---

### Full Task Funnel
**Question:** "What's the conversion rate from task_claimed → task_started → task_submitted_for_review → task_accepted? Show drop-off at each step."

**Why it matters:** Reveals where users get stuck in the task lifecycle.

**Status:** ⬜ Not started

---

## 📋 Task Performance

### High-View, Low-Claim Tasks
**Question:** "Which specific tasks (by task_id) get viewed the most but never claimed? Show top 10."

**Why it matters:** These tasks look interesting but have a blocker (difficulty, unclear description, etc.)

**Status:** ⬜ Not started

---

### Time to Complete by Category
**Question:** "What's the average time from task_started to task_submitted_for_review, broken down by task_category?"

**Why it matters:** Validates difficulty ratings. Categories with long completion times might need better docs.

**Status:** ⬜ Not started

---

### Abandonment by Category
**Question:** "Which task categories have the highest abandonment rate (task_abandoned events)? Compare to claim rate."

**Why it matters:** Identifies category-level problems that need investigation.

**Status:** ⬜ Not started

---

## 📚 Content & Onboarding Effectiveness

### Most Viewed Docs
**Question:** "Which docs (by doc_slug) are viewed most frequently? Show top 15."

**Why it matters:** Content prioritization - most viewed docs should be highest quality.

**Status:** ⬜ Not started

---

### Onboarding Completion Impact
**Question:** "Do users who complete all onboarding steps (onboarding_all_completed) have higher task completion rates than those who skip?"

**Why it matters:** Validates whether onboarding is actually helping users succeed.

**Status:** ⬜ Not started

---

### Skeleton Template Effectiveness
**Question:** "What percentage of users download the skeleton template (skeleton_downloaded)? Do they have higher submission rates than users who don't?"

**Why it matters:** Measures if the template is a key success factor.

**Status:** ⬜ Not started

---

### Video Engagement
**Question:** "What percentage of users who start a video (docs_video_started) complete it (docs_video_completed)? Does video watching correlate with task success?"

**Why it matters:** Decides whether to invest more in video content.

**Status:** ⬜ Not started

---

## 🔄 Retention & Power Users

### Tasks per User Distribution
**Question:** "How many tasks does the average user complete (task_accepted)? Show the distribution - how many complete 1, 2, 3+ tasks?"

**Why it matters:** Identifies power users vs one-timers. Helps understand user value.

**Status:** ⬜ Not started

---

### Return Rate After First Submission
**Question:** "How many users return within 7 days after their first task_submitted_for_review? What do they do when they return?"

**Why it matters:** Early retention signal. Users who return are likely to become regulars.

**Status:** ⬜ Not started

---

### Pre-Abandonment Behavior
**Question:** "What events do users trigger in the hour before abandoning a task (task_abandoned)? Look for patterns."

**Why it matters:** Root cause analysis for abandonment. Might reveal UX issues or missing docs.

**Status:** ⬜ Not started

---

### Session Frequency
**Question:** "How many sessions per week do active users have? What's the distribution?"

**Why it matters:** Engagement depth. Are users checking in daily or just once?

**Status:** ⬜ Not started

---

## 🏷️ Special Segments

### Special Pay Task Performance
**Question:** "Do tasks with is_special=true get claimed faster? Do they have different completion rates?"

**Why it matters:** Validates whether special pay incentive is working.

**Status:** ⬜ Not started

---

### Difficulty vs Success Rate
**Question:** "What's the completion rate (task_accepted / task_claimed) for each difficulty level (1-5)?"

**Why it matters:** Calibrates difficulty ratings. If hard tasks have same completion rate, they might be mis-rated.

**Status:** ⬜ Not started

---

### New vs Returning User Behavior
**Question:** "How do users in their first week behave differently from users who've been active 30+ days?"

**Why it matters:** Tailoring experience for new vs experienced users.

**Status:** ⬜ Not started

---

## ✅ Completed Research

| Date | Topic | Report |
|------|-------|--------|
| 2025-12-11 | Task Card Insights | [TASK_CARD_INSIGHTS.md](./2025-12-11/TASK_CARD_INSIGHTS.md) |
| 2025-12-11 | User Intent (Docs vs Tasks) | [USER_INTENT_ANALYSIS.md](./2025-12-11/USER_INTENT_ANALYSIS.md) |

---

## 📅 Suggested Schedule

| Week | Focus Area | Key Questions |
|------|------------|---------------|
| Jan 8 | Re-run baseline | Repeat Dec 11 analysis with full month of data |
| Jan 15 | Task Performance | High-view/low-claim, abandonment by category |
| Jan 22 | Onboarding | Completion impact, skeleton effectiveness |
| Jan 29 | Retention | Tasks per user, return rate analysis |
