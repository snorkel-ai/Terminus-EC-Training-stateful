-- Migration 001: Initial Schema
-- Creates the core tables for user management and progress tracking

-- Users table: Extended profile with admin tracking
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT,
  github_avatar_url TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);

-- Index for admin queries
CREATE INDEX idx_users_last_active ON users(last_active DESC);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Progress items table: Catalog of all trackable content
CREATE TABLE progress_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('guideline', 'video', 'resource')),
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_core BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_items_category ON progress_items(category);
CREATE INDEX idx_progress_items_display_order ON progress_items(display_order);

-- User progress table: Tracks completion status
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_item_id TEXT NOT NULL REFERENCES progress_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, progress_item_id)
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_item_id ON user_progress(progress_item_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed) WHERE completed = true;

