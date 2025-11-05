-- Migration 005: Seed Progress Items
-- Populates the progress_items table with all trackable content

-- ============================================================================
-- Guideline Sections (9 items) - Core required content
-- ============================================================================

INSERT INTO progress_items (id, category, title, display_order, is_core) VALUES
('guideline-overview', 'guideline', 'Project Overview', 1, true),
('guideline-components', 'guideline', 'Task Components', 2, true),
('guideline-taxonomy', 'guideline', 'Task Type Taxonomy', 3, true),
('guideline-workflow', 'guideline', 'Setup + Workflow', 4, true),
('guideline-requirements', 'guideline', 'Task Requirements', 5, true),
('guideline-examples', 'guideline', 'Example Tasks', 6, true),
('guideline-ci-quality', 'guideline', 'CI + Quality Control', 7, true),
('guideline-rates', 'guideline', 'Rate Schedule', 8, true),
('guideline-review', 'guideline', 'Review Guidelines', 9, true);

-- ============================================================================
-- Walkthrough Videos (4 items) - Core required content
-- ============================================================================

INSERT INTO progress_items (id, category, title, display_order, is_core) VALUES
('video-creating-task', 'video', 'Creating a Task', 10, true),
('video-running-task', 'video', 'Running Your Task', 11, true),
('video-solution', 'video', 'Creating a solution.sh', 12, true),
('video-tests', 'video', 'Creating Tests', 13, true);

-- ============================================================================
-- Resources (6 items) - Optional content
-- ============================================================================

INSERT INTO progress_items (id, category, title, display_order, is_core) VALUES
('resource-workbook', 'resource', 'CI Feedback Training', 14, false),
('resource-oracle', 'resource', 'Oracle Training', 15, false),
('resource-onboarding', 'resource', 'Onboarding Materials', 16, false),
('resource-feedback', 'resource', 'Feedback Slides', 17, false),
('resource-faq', 'resource', 'FAQ', 18, false),
('resource-glossary', 'resource', 'Glossary', 19, false);

-- Total: 19 trackable items (13 core, 6 optional)

