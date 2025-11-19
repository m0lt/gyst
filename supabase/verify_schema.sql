-- Verify Gyst Database Schema

-- 1. List all tables
SELECT
  'Tables created' as check_type,
  schemaname,
  tablename,
  CASE
    WHEN rowsecurity THEN 'RLS Enabled ✓'
    ELSE 'RLS Missing ✗'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'task_categories', 'tasks', 'task_subtasks',
    'task_completions', 'streaks', 'ai_suggestions',
    'calendar_connections', 'calendar_events',
    'notification_preferences', 'notification_queue', 'push_subscriptions'
  )
ORDER BY tablename;

-- 2. Count policies per table
SELECT
  'RLS Policies' as check_type,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 3. Verify predefined categories seeded
SELECT
  'Seeded Categories' as check_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_predefined = TRUE) as predefined_count
FROM task_categories;

-- 4. Verify functions exist
SELECT
  'Functions' as check_type,
  proname as function_name
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'is_admin',
    'soft_delete_task',
    'update_task_stats_on_completion',
    'calculate_task_streak',
    'update_updated_at_column',
    'create_default_notification_preferences'
  )
ORDER BY proname;

-- 5. Check views
SELECT
  'Views' as check_type,
  viewname
FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN ('v_active_tasks', 'v_user_stats')
ORDER BY viewname;
