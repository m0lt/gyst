-- ===================================================================
-- GYST DATABASE MIGRATION - FINAL VERSION
-- Run this complete file in Supabase SQL Editor
-- ===================================================================

SELECT 'Starting cleanup...' as status;

-- Drop views first
DROP VIEW IF EXISTS v_user_stats CASCADE;
DROP VIEW IF EXISTS v_active_tasks CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS push_subscriptions CASCADE;
DROP TABLE IF EXISTS notification_queue CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS calendar_connections CASCADE;
DROP TABLE IF EXISTS ai_suggestions CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS task_completions CASCADE;
DROP TABLE IF EXISTS task_subtasks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS task_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS create_default_notification_preferences() CASCADE;
DROP FUNCTION IF EXISTS calculate_task_streak(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_task_stats_on_completion() CASCADE;
DROP FUNCTION IF EXISTS soft_delete_task() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS calendar_provider CASCADE;
DROP TYPE IF EXISTS notification_tone CASCADE;
DROP TYPE IF EXISTS task_frequency CASCADE;

SELECT 'Cleanup complete. Creating schema...' as status;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE task_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly', 'custom');
CREATE TYPE notification_tone AS ENUM ('encouraging', 'neutral', 'pushy', 'scolding');
CREATE TYPE calendar_provider AS ENUM ('google', 'microsoft', 'apple');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'de')),
  timezone TEXT DEFAULT 'UTC',
  role user_role DEFAULT 'user',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  lives_alone BOOLEAN,
  has_plants BOOLEAN,
  has_pets BOOLEAN,
  plays_instruments BOOLEAN,
  preferred_task_time TEXT,
  current_theme TEXT DEFAULT 'mucha-classic',
  prefers_dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Task Categories
CREATE TABLE task_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  is_predefined BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_category_slug UNIQUE(user_id, slug)
);

CREATE INDEX idx_task_categories_user_id ON task_categories(user_id);
CREATE INDEX idx_task_categories_slug ON task_categories(slug);
CREATE UNIQUE INDEX unique_predefined_slug ON task_categories(slug) WHERE is_predefined = TRUE;

-- Seed categories
INSERT INTO task_categories (name, slug, description, color, icon, is_predefined, sort_order) VALUES
  ('Household', 'household', 'Home maintenance and chores', '#C4A77D', 'home', TRUE, 1),
  ('Health', 'health', 'Physical and mental wellbeing', '#8BC4A0', 'heart', TRUE, 2),
  ('Fitness', 'fitness', 'Exercise and movement', '#A08BBF', 'dumbbell', TRUE, 3),
  ('Learning', 'learning', 'Education and skill development', '#E8A87C', 'book-open', TRUE, 4),
  ('Finances', 'finances', 'Money management', '#D4AF37', 'piggy-bank', TRUE, 5),
  ('Digital', 'digital', 'Digital organization', '#4A90A4', 'smartphone', TRUE, 6),
  ('Relationships', 'relationships', 'Social connections', '#D15B5B', 'users', TRUE, 7),
  ('Miscellaneous', 'misc', 'Other tasks', '#8A8A8A', 'more-horizontal', TRUE, 8);

SELECT 'Categories created and seeded' as status;
