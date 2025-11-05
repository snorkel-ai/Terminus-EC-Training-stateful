-- Migration 007: Fix RLS for User Insert/Upsert
-- Simplify policies to prevent recursion and allow upserts

-- Drop existing problematic policies
DROP POLICY IF EXISTS users_select_policy ON users;
DROP POLICY IF EXISTS user_progress_select_policy ON user_progress;

-- Drop the helper function since it causes recursion
DROP FUNCTION IF EXISTS is_admin();

-- Recreate users SELECT policy - users can ONLY read their own record
-- Admins will use the v_user_stats view which bypasses RLS
CREATE POLICY users_select_policy ON users FOR SELECT
  USING (auth.uid() = id);

-- Recreate user_progress SELECT policy - users can ONLY read their own progress
-- Admins will query via views
CREATE POLICY user_progress_select_policy ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

