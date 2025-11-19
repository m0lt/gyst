-- Migration: Enhanced Task Scheduling
-- Date: 2025-11-19
-- Description: Add priority, tags, duration, and reminder fields to tasks table

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Create priority enum
CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high'
);

-- ============================================================================
-- ALTER TASKS TABLE
-- ============================================================================

-- Add priority column (default to medium)
ALTER TABLE tasks
  ADD COLUMN priority task_priority DEFAULT 'medium' NOT NULL;

-- Add scheduled duration column (in minutes)
ALTER TABLE tasks
  ADD COLUMN scheduled_duration INT CHECK (scheduled_duration > 0 OR scheduled_duration IS NULL);

-- Add tags column (array of text)
ALTER TABLE tasks
  ADD COLUMN tags TEXT[] DEFAULT '{}' NOT NULL;

-- Add reminder settings column (minutes before preferred_time)
ALTER TABLE tasks
  ADD COLUMN reminder_minutes_before INT CHECK (reminder_minutes_before >= 0 OR reminder_minutes_before IS NULL);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for priority filtering
CREATE INDEX idx_tasks_priority ON tasks(priority) WHERE is_active = TRUE;

-- Index for tag filtering using GIN (Generalized Inverted Index)
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN tasks.priority IS 'Task priority level: low, medium (default), or high';
COMMENT ON COLUMN tasks.scheduled_duration IS 'Planned duration for the task in minutes';
COMMENT ON COLUMN tasks.tags IS 'Flexible categorization tags (lowercase for consistency)';
COMMENT ON COLUMN tasks.reminder_minutes_before IS 'Minutes before preferred_time to send reminder (null = no reminder)';
COMMENT ON COLUMN tasks.recurrence_pattern IS 'JSONB pattern for flexible recurrence: {"daysOfWeek": [1,3,5], "daysOfMonth": [1,15], "interval": 3, "unit": "days", "weekdaysOnly": true}';

-- ============================================================================
-- DATA MIGRATION
-- ============================================================================

-- No data migration needed - new columns have safe defaults
-- priority defaults to 'medium'
-- tags defaults to empty array
-- scheduled_duration and reminder_minutes_before default to null
