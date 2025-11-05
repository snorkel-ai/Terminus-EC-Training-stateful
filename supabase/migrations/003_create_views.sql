-- Migration 003: Database Views for Admin Dashboard
-- Creates materialized views for efficient admin queries

-- View: User statistics with completion percentage and activity status
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
  u.id,
  u.github_username,
  u.email,
  u.github_avatar_url,
  u.created_at,
  u.last_active,
  COUNT(CASE WHEN up.completed THEN 1 END) as completed_count,
  COUNT(up.id) as total_items,
  ROUND(100.0 * COUNT(CASE WHEN up.completed THEN 1 END) / NULLIF(COUNT(up.id), 0), 1) as completion_percentage,
  CASE 
    WHEN u.last_active > now() - interval '7 days' THEN 'active'
    WHEN u.last_active > now() - interval '30 days' THEN 'inactive'
    ELSE 'dormant'
  END as status
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id, u.github_username, u.email, u.github_avatar_url, u.created_at, u.last_active;

-- View: Section completion rates across all users
CREATE OR REPLACE VIEW v_section_stats AS
SELECT 
  pi.id,
  pi.title,
  pi.category,
  pi.display_order,
  COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) as completed_by,
  COUNT(DISTINCT u.id) as total_users,
  ROUND(100.0 * COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) / 
    NULLIF(COUNT(DISTINCT u.id), 0), 1) as completion_rate
FROM progress_items pi
CROSS JOIN users u
LEFT JOIN user_progress up ON pi.id = up.progress_item_id AND u.id = up.user_id
GROUP BY pi.id, pi.title, pi.category, pi.display_order
ORDER BY pi.display_order;

-- View: Overall platform statistics
CREATE OR REPLACE VIEW v_platform_stats AS
WITH user_completions AS (
  SELECT 
    u.id,
    ROUND(100.0 * COUNT(CASE WHEN up.completed THEN 1 END) / NULLIF(COUNT(up.id), 0), 1) as completion_percentage
  FROM users u
  LEFT JOIN user_progress up ON u.id = up.user_id
  GROUP BY u.id
)
SELECT 
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT u.id) FILTER (WHERE u.last_active > now() - interval '7 days') as active_users_7d,
  COUNT(DISTINCT u.id) FILTER (WHERE u.last_active > now() - interval '30 days') as active_users_30d,
  COUNT(DISTINCT u.id) FILTER (WHERE u.created_at > now() - interval '7 days') as new_users_7d,
  COUNT(DISTINCT u.id) FILTER (WHERE u.created_at > now() - interval '30 days') as new_users_30d,
  ROUND(AVG(uc.completion_percentage), 1) as avg_completion_percentage
FROM users u
LEFT JOIN user_completions uc ON u.id = uc.id;

