-- Migration 006: Fix RLS Infinite Recursion
-- Creates a helper function to check admin status without recursion

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS users_select_policy ON users;
DROP POLICY IF EXISTS user_progress_select_policy ON user_progress;

-- Create a function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate users select policy using the function
CREATE POLICY users_select_policy ON users FOR SELECT
  USING (
    auth.uid() = id OR is_admin()
  );

-- Recreate user_progress select policy using the function
CREATE POLICY user_progress_select_policy ON user_progress FOR SELECT
  USING (
    auth.uid() = user_id OR is_admin()
  );

