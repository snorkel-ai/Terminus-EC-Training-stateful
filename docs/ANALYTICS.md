# PostHog Analytics & Telemetry Documentation

This document describes all PostHog events, funnels, and insights used in the Terminus EC Training Portal.

## Quick Links

- **Dashboard:** https://us.posthog.com/project/263586/dashboard/849433
- **User Onboarding Funnel:** https://us.posthog.com/project/263586/insights/rgWMwx3v
- **Full Funnel (Auth to Payout):** https://us.posthog.com/project/263586/insights/SH3fhzjC
- **Task Abandonment Analysis:** https://us.posthog.com/project/263586/insights/2h6Vx1qD
- **Task Abandonment by Category:** https://us.posthog.com/project/263586/insights/b7Jnp7j1

---

## User Identification

### `posthog.identify()`
**Location:** `src/contexts/AuthContext.jsx`

Called when a user logs in to associate their identity with analytics.

| Property | Type | Description |
|----------|------|-------------|
| `email` | string | User's email address |
| `github_username` | string | GitHub username |
| `name` | string | Full name (first + last) |
| `created_at` | timestamp | Account creation date |

---

## Events

### Page View Events

#### `landing_page_viewed`
**Location:** `src/components/LandingPage.jsx`

Fired when a user views the authenticated landing page (home page after login).

| Property | Type | Description |
|----------|------|-------------|
| `has_profile` | boolean | Whether user has a profile loaded |
| `has_github_username` | boolean | Whether user has a GitHub username set |

---

### Onboarding Events

#### `onboarding_step_completed`
**Location:** `src/components/ui/OnboardingResources.jsx`

Fired when a user marks an onboarding resource as complete.

| Property | Type | Description |
|----------|------|-------------|
| `resource_id` | string | ID of the resource (e.g., `onboarding-platform`) |
| `resource_label` | string | Display name (e.g., "Platform Onboarding") |
| `source` | string | `individual_card` or `mark_all_complete` |

#### `onboarding_all_completed`
**Location:** `src/components/ui/OnboardingResources.jsx`

Fired when a user clicks "I have onboarded already" to skip all onboarding.

| Property | Type | Description |
|----------|------|-------------|
| `resources_completed` | array | List of resource IDs marked complete |
| `count` | number | Number of resources marked complete |

---

### Navigation Events

#### `browse_tasks_clicked`
**Location:** `src/components/MyTasksSection.jsx`, `src/components/Layout/Header.jsx`

Fired when a user clicks the "Browse tasks" button on the landing page or "Task gallery" in the header navigation.

| Property | Type | Description |
|----------|------|-------------|
| `source` | string | `landing_page_footer`, `landing_page_empty_state`, or `header_nav` |
| `active_task_count` | number | Number of active tasks the user has (only for landing page sources) |

#### `gallery_viewed`
**Location:** `src/components/Tasks/TasksView.jsx`

Fired when a user views the task gallery page.

| Property | Type | Description |
|----------|------|-------------|
| `total_tasks` | number | Total number of tasks in the gallery |
| `available_tasks` | number | Number of unclaimed tasks |

---

### Task Lifecycle Events

#### `task_card_viewed`
**Location:** `src/components/ui/TaskDetailModal.jsx`

Fired when a user opens a task detail modal to view task information.

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `task_category` | string | Task category |
| `task_subcategory` | string | Task subcategory |
| `task_difficulty` | number | Difficulty rating (1-5) |
| `is_special` | boolean | Whether task has special pay |

#### `task_claimed`
**Location:** `src/hooks/useTasks.js`

Fired when a user claims/selects a task.

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `category` | string | Task category |
| `subcategory` | string | Task subcategory |

#### `task_started`
**Location:** `src/hooks/useTasks.js`

Fired when a user starts working on a task (status: `in_progress`).

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `category` | string | Task category |
| `subcategory` | string | Task subcategory |

#### `task_submitted_for_review`
**Location:** `src/hooks/useTasks.js`

Fired when a user submits a task for review (status: `waiting_review`).

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `category` | string | Task category |
| `subcategory` | string | Task subcategory |

#### `task_accepted`
**Location:** `src/hooks/useTasks.js`

Fired when a task is accepted (status: `accepted`).

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `category` | string | Task category |
| `subcategory` | string | Task subcategory |

#### `task_abandoned`
**Location:** `src/hooks/useTasks.js`

Fired when a user abandons/releases a task.

| Property | Type | Description |
|----------|------|-------------|
| `task_id` | uuid | Task identifier |
| `task_category` | string | Task category |
| `task_subcategory` | string | Task subcategory |
| `task_status_at_abandon` | string | Status when abandoned: `claimed` or `in_progress` |
| `task_difficulty` | number | Difficulty rating |

---

### Documentation Events

#### `doc_viewed`
**Location:** `src/components/Docs/DocsLayout.jsx`

Fired when a user views a documentation page.

| Property | Type | Description |
|----------|------|-------------|
| `doc_slug` | string | URL slug of the document |
| `doc_title` | string | Document title |
| `doc_section` | string | Section the doc belongs to |
| `navigation_source` | string | How user navigated (sidebar, search, etc.) |

#### `docs_search_opened`
**Location:** `src/components/Docs/DocsLayout.jsx`

Fired when a user opens the docs search modal.

| Property | Type | Description |
|----------|------|-------------|
| `trigger` | string | `keyboard` (Cmd+K) or `button` |
| `current_doc_slug` | string | Current document being viewed |

#### `docs_search_performed`
**Location:** `src/components/Docs/DocsSearch.jsx`

Fired when a user performs a search in documentation.

| Property | Type | Description |
|----------|------|-------------|
| `search_query` | string | The search term |
| `results_count` | number | Number of results found |
| `has_results` | boolean | Whether any results were found |

#### `docs_search_result_clicked`
**Location:** `src/components/Docs/DocsLayout.jsx`

Fired when a user clicks a search result.

| Property | Type | Description |
|----------|------|-------------|
| `search_query` | string | The search term used |
| `selected_doc_slug` | string | Document that was clicked |
| `current_doc_slug` | string | Document user was on |

#### `docs_viewed`
**Location:** `src/components/ui/OnboardingResources.jsx`

Fired when a user clicks to view docs from onboarding cards.

| Property | Type | Description |
|----------|------|-------------|
| `resource_id` | string | Onboarding resource ID |
| `resource_label` | string | Resource display name |

---

### Video Events

#### `docs_video_started`
**Location:** `src/components/Docs/VideoEmbed.jsx`

Fired when a user starts playing a video (local or Loom).

| Property | Type | Description |
|----------|------|-------------|
| `video_src` | string | Video source URL or Loom ID |
| `video_title` | string | Video title |
| `video_type` | string | `local` or `loom` |

#### `docs_video_completed`
**Location:** `src/components/Docs/VideoEmbed.jsx`

Fired when a local video finishes playing.

| Property | Type | Description |
|----------|------|-------------|
| `video_src` | string | Video source URL |
| `video_title` | string | Video title |
| `video_type` | string | `local` |

---

### Download Events

#### `skeleton_downloaded`
**Locations:** 
- `src/components/ui/OnboardingResources.jsx`
- `src/components/ExpertPlatformWalkthrough.jsx`
- `src/components/Docs/PdfDownload.jsx`

Fired when a user downloads the task skeleton template.

| Property | Type | Description |
|----------|------|-------------|
| `file_name` | string | `template-task.zip` |
| `file_title` | string | Display name |
| `source` | string | Where downloaded from (`walkthrough`, `docs`, etc.) |

#### `docs_file_downloaded`
**Location:** `src/components/Docs/PdfDownload.jsx`

Fired when a user downloads a non-skeleton file from docs.

| Property | Type | Description |
|----------|------|-------------|
| `file_name` | string | Name of downloaded file |
| `file_title` | string | Display title |
| `file_type` | string | Type label |
| `source` | string | `docs` |

---

## Funnels

### User Onboarding Funnel (10 steps)

Tracks the complete user journey from login to task completion:

1. **User Login** (`$identify`)
2. **Viewed Landing Page** (`landing_page_viewed`)
3. **Completed Onboarding Step** (`onboarding_step_completed`) - *optional, users may skip*
4. **Clicked Browse Tasks** (`browse_tasks_clicked`)
5. **Viewed Task Gallery** (`gallery_viewed`)
6. **Opened Task Card** (`task_card_viewed`)
7. **Claimed a Task** (`task_claimed`)
8. **Started Working** (`task_started`)
9. **Submitted for Review** (`task_submitted_for_review`)
10. **Task Accepted** (`task_accepted`)

> **Note:** Step 3 (onboarding) is optional. Users can navigate directly to Browse Tasks without completing onboarding. Consider creating a separate funnel that skips step 3 to measure direct conversion paths.

**Settings:**
- Window: 30 days
- Order: Sequential
- Filter: Test accounts excluded

### Full Funnel (Auth to Payout)

Same 9 steps as above, displayed in horizontal layout.

---

## Insights

### Task Abandonment Analysis
- **Type:** Line chart (trends)
- **Metric:** `task_abandoned` events over time
- **Breakdown:** `task_status_at_abandon`
- **Purpose:** Understand when users abandon tasks (before or after starting)

### Task Abandonment by Category
- **Type:** Bar chart
- **Metric:** `task_abandoned` event count
- **Breakdown:** `task_category`
- **Purpose:** Identify which categories have highest abandonment

---

## Best Practices

### Adding New Events

1. Use `usePostHog()` hook from `posthog-js/react`
2. Check `if (posthog)` before calling `capture()`
3. Use snake_case for event names
4. Use snake_case for property names
5. Include relevant context (IDs, categories, sources)

```jsx
import { usePostHog } from 'posthog-js/react';

function MyComponent() {
  const posthog = usePostHog();
  
  const handleAction = () => {
    if (posthog) {
      posthog.capture('my_event_name', {
        some_property: 'value',
        another_property: 123,
      });
    }
  };
}
```

### Naming Conventions

- **Events:** `noun_verb` format (e.g., `task_claimed`, `docs_search_opened`)
- **Properties:** Descriptive, lowercase with underscores
- **Sources:** Use `source` property to track where actions originate

### Updating Funnels

When adding events that affect the user journey:
1. Check if event should be in funnel sequence
2. Update both funnels for consistency
3. Update this documentation
