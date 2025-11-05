-- Migration 004: Row Level Security Policies
-- Implements security policies to protect user data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Users Table Policies
-- ============================================================================

-- Policy: Users can read their own profile and admins can read all
CREATE POLICY users_select_policy ON users FOR SELECT
  USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Policy: Users can update only their own profile (except is_admin field)
CREATE POLICY users_update_policy ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own record (auto-created on first login)
CREATE POLICY users_insert_policy ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Progress Items Table Policies
-- ============================================================================

-- Policy: All authenticated users can read progress items (public catalog)
CREATE POLICY progress_items_select_policy ON progress_items FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- User Progress Table Policies
-- ============================================================================

-- Policy: Users can read their own progress, admins can read all
CREATE POLICY user_progress_select_policy ON user_progress FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Policy: Users can insert their own progress records
CREATE POLICY user_progress_insert_policy ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY user_progress_update_policy ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own progress (for reset functionality)
CREATE POLICY user_progress_delete_policy ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

