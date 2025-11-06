-- Migration: Core Schema v2
-- Following Supabase Official Auth Patterns
-- Reference: https://supabase.com/docs/guides/auth/quickstarts/react
-- 
-- Key Changes from v1:
-- 1. Renamed 'users' → 'profiles' (Supabase naming convention)
-- 2. Removed is_admin column (now in auth.users.raw_user_meta_data)
-- 3. Simplified RLS policies (no recursion)
-- 4. Added auto-profile-creation trigger
-- 5. Proper SECURITY DEFINER usage

-- ============================================================================
-- PROFILES TABLE (extends auth.users with custom data)
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  github_username TEXT,
  github_avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Extended user profiles - links to auth.users';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id - set by Supabase Auth';
COMMENT ON COLUMN profiles.email IS 'Denormalized from auth.users for admin queries';

-- Indexes for admin dashboard queries
CREATE INDEX idx_profiles_github_username ON profiles(github_username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- PROGRESS ITEMS (trackable training content)
-- ============================================================================

CREATE TABLE progress_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('guideline', 'video', 'resource')),
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_core BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE progress_items IS 'Catalog of 19 trackable training items';
COMMENT ON COLUMN progress_items.is_core IS 'Required for onboarding completion';

CREATE INDEX idx_progress_items_category ON progress_items(category);
CREATE INDEX idx_progress_items_display_order ON progress_items(display_order);

-- ============================================================================
-- USER PROGRESS (tracks completion per user)
-- ============================================================================

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_item_id TEXT NOT NULL REFERENCES progress_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, progress_item_id)
);

COMMENT ON TABLE user_progress IS 'Tracks which items each user has completed';

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_item_id ON user_progress(progress_item_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed) WHERE completed = true;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when user signs up (Supabase pattern)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, github_username, github_avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    github_username = COALESCE(EXCLUDED.github_username, profiles.github_username),
    github_avatar_url = COALESCE(EXCLUDED.github_avatar_url, profiles.github_avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-creates profile when user signs up via Supabase Auth';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (Simple policies, zero recursion)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read their own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Profiles: Users can only update their own profile
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Progress Items: All authenticated users can read catalog
CREATE POLICY progress_items_select_all ON progress_items
  FOR SELECT
  TO authenticated
  USING (true);

-- User Progress: Users can fully manage their own progress
CREATE POLICY user_progress_all_own ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: Admin access to all data is via v_admin_user_stats view, not policies
-- This avoids RLS recursion issues

