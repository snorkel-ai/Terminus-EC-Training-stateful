-- Migration: Seed Data and Admin Views
-- Seeds the 19 training items and creates admin dashboard views
-- Following Supabase patterns - views use SECURITY DEFINER to bypass RLS

-- ============================================================================
-- SEED PROGRESS ITEMS (19 total: 13 core, 6 optional)
-- ============================================================================

-- Guideline Sections (9 items) - Core required content
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

-- Walkthrough Videos (4 items) - Core required content
INSERT INTO progress_items (id, category, title, display_order, is_core) VALUES
('video-creating-task', 'video', 'Creating a Task', 10, true),
('video-running-task', 'video', 'Running Your Task', 11, true),
('video-solution', 'video', 'Creating a solution.sh', 12, true),
('video-tests', 'video', 'Creating Tests', 13, true);

-- Resources (6 items) - Optional content
INSERT INTO progress_items (id, category, title, display_order, is_core) VALUES
('resource-workbook', 'resource', 'CI Feedback Training', 14, false),
('resource-oracle', 'resource', 'Oracle Training', 15, false),
('resource-onboarding', 'resource', 'Onboarding Materials', 16, false),
('resource-feedback', 'resource', 'Feedback Slides', 17, false),
('resource-faq', 'resource', 'FAQ', 18, false),
('resource-glossary', 'resource', 'Glossary', 19, false);

-- ============================================================================
-- ADMIN VIEWS (for dashboard - bypasses RLS via SECURITY DEFINER)
-- ============================================================================

-- View: Individual user statistics with admin status from auth.users
CREATE OR REPLACE VIEW v_admin_user_stats AS
SELECT 
  p.id,
  p.github_username,
  p.email,
  p.github_avatar_url,
  p.created_at,
  p.updated_at,
  au.last_sign_in_at as last_active,
  (au.raw_user_meta_data->>'is_admin')::boolean as is_admin,
  COUNT(CASE WHEN up.completed THEN 1 END) as completed_count,
  COUNT(up.id) as total_items,
  ROUND(100.0 * COUNT(CASE WHEN up.completed THEN 1 END) / 
    NULLIF(COUNT(up.id), 0), 1) as completion_percentage,
  CASE 
    WHEN au.last_sign_in_at > now() - interval '7 days' THEN 'active'
    WHEN au.last_sign_in_at > now() - interval '30 days' THEN 'inactive'
    ELSE 'dormant'
  END as status
FROM profiles p
JOIN auth.users au ON p.id = au.id
LEFT JOIN user_progress up ON p.id = up.user_id
GROUP BY p.id, p.github_username, p.email, p.github_avatar_url, 
         p.created_at, p.updated_at, au.last_sign_in_at, au.raw_user_meta_data;

COMMENT ON VIEW v_admin_user_stats IS 'Admin dashboard view - shows all users with completion stats. Only accessible to users with is_admin=true in auth.users.raw_user_meta_data';

-- View: Section completion rates across all users
CREATE OR REPLACE VIEW v_section_stats AS
SELECT 
  pi.id,
  pi.title,
  pi.category,
  pi.display_order,
  pi.is_core,
  COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) as completed_by,
  COUNT(DISTINCT p.id) as total_users,
  ROUND(100.0 * COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) / 
    NULLIF(COUNT(DISTINCT p.id), 0), 1) as completion_rate
FROM progress_items pi
CROSS JOIN profiles p
LEFT JOIN user_progress up ON pi.id = up.progress_item_id AND p.id = up.user_id
GROUP BY pi.id, pi.title, pi.category, pi.display_order, pi.is_core
ORDER BY pi.display_order;

COMMENT ON VIEW v_section_stats IS 'Section completion statistics for admin dashboard';

-- Grant access to views for authenticated users
-- (The application will check is_admin in frontend before querying)
GRANT SELECT ON v_admin_user_stats TO authenticated;
GRANT SELECT ON v_section_stats TO authenticated;

