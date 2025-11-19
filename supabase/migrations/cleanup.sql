-- Cleanup Script: Drop all Gyst tables
-- Run this BEFORE running the main migration if you get errors

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
