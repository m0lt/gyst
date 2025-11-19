-- Gyst Database Schema
-- PostgreSQL via Supabase
-- Version: 1.0.0

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE task_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'custom'
);

CREATE TYPE notification_tone AS ENUM (
  'encouraging',
  'neutral',
  'pushy',
  'scolding'
);

CREATE TYPE calendar_provider AS ENUM (
  'google',
  'microsoft',
  'apple'
);

CREATE TYPE user_role AS ENUM (
  'user',
  'admin'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- ----------------------------------------------------------------------------

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'de')),
  timezone TEXT DEFAULT 'UTC',
  role user_role DEFAULT 'user',

  -- Onboarding data
  onboarding_completed BOOLEAN DEFAULT FALSE,
  lives_alone BOOLEAN,
  has_plants BOOLEAN,
  has_pets BOOLEAN,
  plays_instruments BOOLEAN,
  preferred_task_time TEXT, -- e.g., 'morning', 'evening'

  -- Theme preferences
  current_theme TEXT DEFAULT 'mucha-classic',
  prefers_dark_mode BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ----------------------------------------------------------------------------
-- Task Categories
-- ----------------------------------------------------------------------------

CREATE TABLE task_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT, -- hex code
  icon TEXT, -- icon name from lucide-react
  is_predefined BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_category_slug UNIQUE(user_id, slug),
  CONSTRAINT unique_predefined_slug UNIQUE(slug) WHERE is_predefined = TRUE
);

CREATE INDEX idx_task_categories_user_id ON task_categories(user_id);
CREATE INDEX idx_task_categories_slug ON task_categories(slug);

-- Seed predefined categories
INSERT INTO task_categories (name, slug, description, color, icon, is_predefined, sort_order) VALUES
  ('Household', 'household', 'Home maintenance and chores', '#C4A77D', 'home', TRUE, 1),
  ('Health', 'health', 'Physical and mental wellbeing', '#8BC4A0', 'heart', TRUE, 2),
  ('Fitness', 'fitness', 'Exercise and movement', '#A08BBF', 'dumbbell', TRUE, 3),
  ('Learning', 'learning', 'Education and skill development', '#E8A87C', 'book-open', TRUE, 4),
  ('Finances', 'finances', 'Money management', '#D4AF37', 'piggy-bank', TRUE, 5),
  ('Digital', 'digital', 'Digital organization and hygiene', '#4A90A4', 'smartphone', TRUE, 6),
  ('Relationships', 'relationships', 'Social connections', '#D15B5B', 'users', TRUE, 7),
  ('Miscellaneous', 'misc', 'Other tasks', '#8A8A8A', 'more-horizontal', TRUE, 8);

-- ----------------------------------------------------------------------------
-- Tasks
-- ----------------------------------------------------------------------------

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES task_categories(id) ON DELETE SET NULL,

  -- Task details
  title TEXT NOT NULL,
  description TEXT,
  frequency task_frequency NOT NULL DEFAULT 'daily',
  custom_frequency_days INT, -- For 'custom' frequency
  estimated_minutes INT, -- User's estimate
  actual_minutes_avg INT, -- Calculated from completions

  -- Scheduling
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  preferred_time TIME,

  -- Recurrence
  is_recurring BOOLEAN DEFAULT TRUE,
  recurrence_pattern JSONB, -- { dayOfWeek: 1, dayOfMonth: 15, etc. }

  -- Completion tracking
  completion_count INT DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  earned_breaks INT DEFAULT 0, -- Breaks earned from milestones
  used_breaks INT DEFAULT 0,   -- Breaks consumed to maintain streak

  -- Options
  requires_photo_proof BOOLEAN DEFAULT FALSE,
  has_subtasks BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CHECK (estimated_minutes > 0 OR estimated_minutes IS NULL),
  CHECK (actual_minutes_avg > 0 OR actual_minutes_avg IS NULL)
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_frequency ON tasks(frequency);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE is_active = TRUE;
CREATE INDEX idx_tasks_is_active ON tasks(is_active);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at);

-- Soft delete trigger
CREATE OR REPLACE FUNCTION soft_delete_task()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    NEW.is_active := FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_soft_delete
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_task();

-- ----------------------------------------------------------------------------
-- Task Subtasks
-- ----------------------------------------------------------------------------

CREATE TABLE task_subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_subtasks_task_id ON task_subtasks(task_id);

-- ----------------------------------------------------------------------------
-- Task Completions
-- ----------------------------------------------------------------------------

CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  completed_at TIMESTAMPTZ DEFAULT NOW(),
  actual_minutes INT, -- Time task actually took
  photo_url TEXT, -- Supabase Storage URL
  notes TEXT,

  -- Subtask completion
  subtasks_completed JSONB, -- { subtask_id: boolean }

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX idx_task_completions_completed_at ON task_completions(completed_at);

-- Update task stats on completion
CREATE OR REPLACE FUNCTION update_task_stats_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  avg_minutes INT;
BEGIN
  -- Update completion count and last completed
  UPDATE tasks
  SET
    completion_count = completion_count + 1,
    last_completed_at = NEW.completed_at
  WHERE id = NEW.task_id;

  -- Update average actual minutes
  SELECT ROUND(AVG(actual_minutes))::INT INTO avg_minutes
  FROM task_completions
  WHERE task_id = NEW.task_id AND actual_minutes IS NOT NULL;

  UPDATE tasks
  SET actual_minutes_avg = avg_minutes
  WHERE id = NEW.task_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_completion_stats
  AFTER INSERT ON task_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_task_stats_on_completion();

-- ----------------------------------------------------------------------------
-- Streaks
-- ----------------------------------------------------------------------------

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Streak data
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_completions INT DEFAULT 0,
  completion_rate DECIMAL(5,2), -- Percentage

  -- Break tracking
  earned_breaks INT DEFAULT 0,
  used_breaks INT DEFAULT 0,
  available_breaks INT DEFAULT 0,

  -- Milestone tracking
  last_milestone_at TIMESTAMPTZ,
  next_milestone INT, -- e.g., 7, 30, 100 days

  -- Metadata
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_task_streak UNIQUE(task_id)
);

CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_current_streak ON streaks(current_streak DESC);

-- Calculate streaks (called periodically or after completion)
CREATE OR REPLACE FUNCTION calculate_task_streak(p_task_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_frequency task_frequency;
  v_start_date DATE;
  v_completions INT[];
  v_current_streak INT := 0;
  v_longest_streak INT := 0;
  v_total INT;
  v_rate DECIMAL;
BEGIN
  -- Get task details
  SELECT user_id, frequency, start_date INTO v_user_id, v_frequency, v_start_date
  FROM tasks WHERE id = p_task_id;

  -- Get completion dates
  SELECT ARRAY_AGG(DATE(completed_at) ORDER BY completed_at)
  INTO v_completions
  FROM task_completions
  WHERE task_id = p_task_id;

  -- Calculate streaks based on frequency
  -- (Simplified logic, expand based on frequency)
  v_total := COALESCE(array_length(v_completions, 1), 0);

  -- Calculate current streak (consecutive days)
  IF v_total > 0 THEN
    -- Logic to count consecutive completions
    -- This is simplified, needs frequency-specific logic
    v_current_streak := v_total; -- Placeholder
  END IF;

  -- Update or insert streak record
  INSERT INTO streaks (task_id, user_id, current_streak, longest_streak, total_completions, available_breaks)
  VALUES (p_task_id, v_user_id, v_current_streak, v_longest_streak, v_total, 0)
  ON CONFLICT (task_id)
  DO UPDATE SET
    current_streak = EXCLUDED.current_streak,
    longest_streak = GREATEST(streaks.longest_streak, EXCLUDED.current_streak),
    total_completions = EXCLUDED.total_completions,
    last_calculated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- AI Suggestions
-- ----------------------------------------------------------------------------

CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Suggestion data
  suggested_tasks JSONB NOT NULL, -- Array of task objects
  prompt_context JSONB, -- User context used for generation
  model TEXT DEFAULT 'gpt-4-turbo',

  -- Lifecycle
  is_applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX idx_ai_suggestions_expires_at ON ai_suggestions(expires_at);

-- ----------------------------------------------------------------------------
-- Calendar Integrations
-- ----------------------------------------------------------------------------

CREATE TABLE calendar_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  provider calendar_provider NOT NULL,
  provider_account_id TEXT NOT NULL,
  provider_account_email TEXT,

  -- OAuth tokens (encrypted)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,

  -- Sync settings
  is_active BOOLEAN DEFAULT TRUE,
  sync_enabled BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  sync_errors INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_provider UNIQUE(user_id, provider, provider_account_id)
);

CREATE INDEX idx_calendar_connections_user_id ON calendar_connections(user_id);
CREATE INDEX idx_calendar_connections_provider ON calendar_connections(provider);

-- ----------------------------------------------------------------------------
-- Calendar Events (synced from external calendars)
-- ----------------------------------------------------------------------------

CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_connection_id UUID NOT NULL REFERENCES calendar_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Event details
  external_event_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,

  -- Gyst integration
  is_task_related BOOLEAN DEFAULT FALSE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  blocks_scheduling BOOLEAN DEFAULT TRUE, -- Used for availability calculation

  -- Sync metadata
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_external_event UNIQUE(calendar_connection_id, external_event_id)
);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_task_id ON calendar_events(task_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_blocks_scheduling ON calendar_events(blocks_scheduling) WHERE blocks_scheduling = TRUE;

-- ----------------------------------------------------------------------------
-- Notification Preferences
-- ----------------------------------------------------------------------------

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES task_categories(id) ON DELETE CASCADE, -- NULL = global

  -- Channels
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT FALSE,

  -- Timing
  max_per_day INT DEFAULT 5,
  quiet_hours_start TIME, -- e.g., 22:00
  quiet_hours_end TIME,   -- e.g., 08:00

  -- Tone progression
  tone_progression notification_tone[] DEFAULT ARRAY['encouraging', 'neutral', 'pushy']::notification_tone[],
  current_tone_index INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_category_prefs UNIQUE(user_id, category_id)
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- ----------------------------------------------------------------------------
-- Notification Queue
-- ----------------------------------------------------------------------------

CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,

  -- Notification details
  type TEXT NOT NULL, -- 'task_reminder', 'streak_milestone', 'weekly_digest'
  channel TEXT NOT NULL, -- 'email', 'push'
  tone notification_tone DEFAULT 'neutral',

  -- Content
  subject TEXT,
  body TEXT,
  template_name TEXT,
  template_data JSONB,

  -- Delivery
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX idx_notification_queue_scheduled_for ON notification_queue(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX idx_notification_queue_sent_at ON notification_queue(sent_at);

-- ----------------------------------------------------------------------------
-- Push Subscriptions (Web Push)
-- ----------------------------------------------------------------------------

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Push subscription object (from browser)
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL, -- { p256dh, auth }

  -- Metadata
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_endpoint UNIQUE(user_id, endpoint)
);

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Task Categories
CREATE POLICY "Users can view predefined categories" ON task_categories
  FOR SELECT USING (is_predefined = TRUE);

CREATE POLICY "Users can view own categories" ON task_categories
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own categories" ON task_categories
  FOR ALL USING (user_id = auth.uid());

-- Tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (user_id = auth.uid());

-- Task Subtasks
CREATE POLICY "Users can view own task subtasks" ON task_subtasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_subtasks.task_id
        AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own task subtasks" ON task_subtasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_subtasks.task_id
        AND tasks.user_id = auth.uid()
    )
  );

-- Task Completions
CREATE POLICY "Users can view own completions" ON task_completions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own completions" ON task_completions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Streaks
CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (user_id = auth.uid());

-- AI Suggestions
CREATE POLICY "Users can view own suggestions" ON ai_suggestions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own suggestions" ON ai_suggestions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Calendar Connections
CREATE POLICY "Users can manage own calendar connections" ON calendar_connections
  FOR ALL USING (user_id = auth.uid());

-- Calendar Events
CREATE POLICY "Users can view own calendar events" ON calendar_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own calendar events" ON calendar_events
  FOR ALL USING (user_id = auth.uid());

-- Notification Preferences
CREATE POLICY "Users can manage own notification preferences" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- Notification Queue (read-only for users)
CREATE POLICY "Users can view own notifications" ON notification_queue
  FOR SELECT USING (user_id = auth.uid());

-- Push Subscriptions
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_categories_updated_at BEFORE UPDATE ON task_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_connections_updated_at BEFORE UPDATE ON calendar_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active tasks with category info
CREATE OR REPLACE VIEW v_active_tasks AS
SELECT
  t.*,
  tc.name AS category_name,
  tc.color AS category_color,
  tc.icon AS category_icon,
  s.current_streak,
  s.longest_streak,
  s.available_breaks,
  (
    SELECT COUNT(*)
    FROM task_subtasks ts
    WHERE ts.task_id = t.id
  ) AS subtask_count
FROM tasks t
LEFT JOIN task_categories tc ON t.category_id = tc.id
LEFT JOIN streaks s ON t.id = s.task_id
WHERE t.is_active = TRUE
  AND t.deleted_at IS NULL;

-- User statistics summary
CREATE OR REPLACE VIEW v_user_stats AS
SELECT
  p.id AS user_id,
  p.full_name,
  COUNT(DISTINCT t.id) AS total_tasks,
  COUNT(DISTINCT CASE WHEN t.is_active THEN t.id END) AS active_tasks,
  COALESCE(SUM(t.completion_count), 0) AS total_completions,
  COALESCE(AVG(s.current_streak), 0)::INT AS avg_streak,
  COALESCE(MAX(s.current_streak), 0) AS max_streak,
  COUNT(DISTINCT tc.id) AS total_categories
FROM profiles p
LEFT JOIN tasks t ON p.id = t.user_id AND t.deleted_at IS NULL
LEFT JOIN streaks s ON t.id = s.task_id
LEFT JOIN task_categories tc ON p.id = tc.user_id
GROUP BY p.id, p.full_name;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Seed notification preferences for new users (via trigger)
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id, category_id, email_enabled, push_enabled, max_per_day)
  VALUES (NEW.id, NULL, TRUE, FALSE, 5); -- Global default

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_default_notifications
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- ============================================================================
-- COMMENTS (for documentation)
-- ============================================================================

COMMENT ON TABLE profiles IS 'Extended user profiles with onboarding data and preferences';
COMMENT ON TABLE tasks IS 'Core task entity with scheduling and completion tracking';
COMMENT ON TABLE task_completions IS 'Historical record of task completions';
COMMENT ON TABLE streaks IS 'Calculated streak data for gamification';
COMMENT ON TABLE ai_suggestions IS 'Cached AI-generated task suggestions';
COMMENT ON TABLE calendar_connections IS 'External calendar OAuth connections';
COMMENT ON TABLE calendar_events IS 'Events synced from external calendars';
COMMENT ON TABLE notification_queue IS 'Queued notifications for async delivery';
