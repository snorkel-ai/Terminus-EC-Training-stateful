/**
 * Automated Research Report Generator
 * 
 * This script queries PostHog and generates markdown research reports.
 * Run manually: node scripts/generate-research-report.js
 * Or via GitHub Actions on a schedule.
 * 
 * Required environment variables:
 * - POSTHOG_API_KEY: Your PostHog personal API key
 * - POSTHOG_PROJECT_ID: Your PostHog project ID (default: 263586)
 */

const fs = require('fs');
const path = require('path');

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '263586';
const POSTHOG_HOST = 'https://us.posthog.com';

if (!POSTHOG_API_KEY) {
  console.error('Error: POSTHOG_API_KEY environment variable is required');
  process.exit(1);
}

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
const outputDir = path.join(__dirname, '..', 'research-findings', today);

async function runHogQLQuery(query) {
  const response = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: query,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`PostHog API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getTaskCardInsights() {
  // Average views per user
  const avgViewsQuery = `
    WITH per_user AS (
      SELECT person_id, count() AS views_per_user
      FROM events
      WHERE event = 'task_card_viewed'
        AND timestamp >= now() - INTERVAL 30 DAY
      GROUP BY person_id
    )
    SELECT
      count() as total_users,
      sum(views_per_user) as total_views,
      avg(views_per_user) as avg_views_per_user
    FROM per_user
  `;

  // Views by category
  const categoryQuery = `
    SELECT 
      properties.task_category as category, 
      count() as views
    FROM events
    WHERE event = 'task_card_viewed'
      AND timestamp >= now() - INTERVAL 30 DAY
    GROUP BY category
    ORDER BY views DESC
  `;

  // Gallery to task card conversion
  const conversionQuery = `
    SELECT
      count(DISTINCT if(event = 'gallery_viewed', person_id, NULL)) as gallery_viewers,
      count(DISTINCT if(event = 'task_card_viewed', person_id, NULL)) as card_viewers
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
  `;

  const [avgViews, categories, conversion] = await Promise.all([
    runHogQLQuery(avgViewsQuery),
    runHogQLQuery(categoryQuery),
    runHogQLQuery(conversionQuery),
  ]);

  return { avgViews, categories, conversion };
}

async function getUserIntentInsights() {
  const query = `
    SELECT
      count(DISTINCT person_id) as total_active_users,
      count(DISTINCT if(event = 'doc_viewed', person_id, NULL)) as doc_viewers,
      count(DISTINCT if(event = 'gallery_viewed', person_id, NULL)) as gallery_viewers
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
  `;

  const bothQuery = `
    SELECT count(DISTINCT e_gallery.person_id) as both_users
    FROM events AS e_gallery
    WHERE e_gallery.event = 'gallery_viewed'
      AND e_gallery.timestamp >= now() - INTERVAL 30 DAY
      AND e_gallery.person_id IN (
        SELECT DISTINCT e_doc.person_id
        FROM events AS e_doc
        WHERE e_doc.event = 'doc_viewed'
          AND e_doc.timestamp >= now() - INTERVAL 30 DAY
      )
  `;

  const [counts, both] = await Promise.all([
    runHogQLQuery(query),
    runHogQLQuery(bothQuery),
  ]);

  return { counts, both };
}

function generateTaskCardMarkdown(data) {
  const avgRow = data.avgViews.results[0] || [0, 0, 0];
  const totalUsers = avgRow[0];
  const totalViews = avgRow[1];
  const avgPerUser = avgRow[2]?.toFixed(1) || '0';

  const convRow = data.conversion.results[0] || [0, 0];
  const galleryViewers = convRow[0];
  const cardViewers = convRow[1];
  const conversionRate = galleryViewers > 0 
    ? ((cardViewers / galleryViewers) * 100).toFixed(1) 
    : '0';

  let categoryTable = '| Category | Views |\n|----------|-------|\n';
  for (const row of data.categories.results || []) {
    categoryTable += `| ${row[0] || 'Unknown'} | ${row[1]} |\n`;
  }

  return `# Task Card Viewing Analysis

> Generated: ${today} | Data source: PostHog | Automated Report

---

## Summary Metrics

| Metric | Value |
|--------|-------|
| **Average cards viewed per user** | **${avgPerUser} task cards** |
| **Total unique users** (last 30 days) | ${totalUsers} users |
| **Total task card views** | ${totalViews} views |
| **Gallery → Card conversion** | ${conversionRate}% |

---

## Views by Category

${categoryTable}

---

## Related Resources

- [PostHog Dashboard](https://us.posthog.com/project/${POSTHOG_PROJECT_ID}/dashboard/849433)
- [Analytics Documentation](../../docs/ANALYTICS.md)
- [User Intent Analysis](./USER_INTENT_ANALYSIS.md)
`;
}

function generateUserIntentMarkdown(data) {
  const countsRow = data.counts.results[0] || [0, 0, 0];
  const totalActive = countsRow[0];
  const docViewers = countsRow[1];
  const galleryViewers = countsRow[2];
  const bothUsers = data.both.results[0]?.[0] || 0;

  const docsOnly = docViewers - bothUsers;
  const galleryOnly = galleryViewers - bothUsers;
  const neither = totalActive - docsOnly - galleryOnly - bothUsers;

  const pctNeither = ((neither / totalActive) * 100).toFixed(1);
  const pctBoth = ((bothUsers / totalActive) * 100).toFixed(1);
  const pctDocsOnly = ((docsOnly / totalActive) * 100).toFixed(1);
  const pctGalleryOnly = ((galleryOnly / totalActive) * 100).toFixed(1);

  return `# User Intent Analysis: Docs vs Tasks

> Generated: ${today} | Data source: PostHog | Automated Report

---

## User Segmentation (Last 30 Days)

| Segment | Users | % of Active Users |
|---------|-------|-------------------|
| **Neither docs nor gallery** | ${neither} | ${pctNeither}% |
| **Both docs AND gallery** | ${bothUsers} | ${pctBoth}% |
| **Docs only** (no gallery) | ${docsOnly} | ${pctDocsOnly}% |
| **Gallery only** (no docs) | ${galleryOnly} | ${pctGalleryOnly}% |
| **Total active users** | ${totalActive} | 100% |

---

## Visual Breakdown

\`\`\`
Active Users (${totalActive})
├── Neither docs nor gallery: ${neither} (${pctNeither}%)
├── Both docs AND gallery:    ${bothUsers} (${pctBoth}%)
├── Docs only:                ${docsOnly} (${pctDocsOnly}%)
└── Gallery only:             ${galleryOnly} (${pctGalleryOnly}%)
\`\`\`

---

## Related Resources

- [Task Card Insights](./TASK_CARD_INSIGHTS.md)
- [Analytics Documentation](../../docs/ANALYTICS.md)
- [PostHog Dashboard](https://us.posthog.com/project/${POSTHOG_PROJECT_ID}/dashboard/849433)
`;
}

async function main() {
  console.log(`Generating research report for ${today}...`);

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Fetch data and generate reports
  console.log('Fetching task card insights...');
  const taskCardData = await getTaskCardInsights();
  const taskCardMd = generateTaskCardMarkdown(taskCardData);
  fs.writeFileSync(path.join(outputDir, 'TASK_CARD_INSIGHTS.md'), taskCardMd);
  console.log('✓ Generated TASK_CARD_INSIGHTS.md');

  console.log('Fetching user intent insights...');
  const userIntentData = await getUserIntentInsights();
  const userIntentMd = generateUserIntentMarkdown(userIntentData);
  fs.writeFileSync(path.join(outputDir, 'USER_INTENT_ANALYSIS.md'), userIntentMd);
  console.log('✓ Generated USER_INTENT_ANALYSIS.md');

  console.log(`\nReports saved to: ${outputDir}`);
}

main().catch((err) => {
  console.error('Error generating report:', err);
  process.exit(1);
});
