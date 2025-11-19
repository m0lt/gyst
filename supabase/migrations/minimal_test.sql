-- Minimal Test Migration
-- Run this to test if basic setup works

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Simple enum
DO $$ BEGIN
  CREATE TYPE task_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly', 'custom');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (minimal version)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Simple policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Test if it worked
SELECT 'Migration test successful!' as status;
