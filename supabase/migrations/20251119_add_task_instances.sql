-- Add task instances table for daily todos
-- This separates task templates (tasks) from actual scheduled instances

-- Create mood enum for tracking user sentiment
CREATE TYPE task_mood AS ENUM (
  'happy',
  'neutral',
  'sad'
);

-- Create status enum for task instances
CREATE TYPE task_instance_status AS ENUM (
  'pending',      -- Scheduled but not done
  'completed',    -- Done!
  'skipped',      -- User chose to skip
  'rescheduled'   -- Moved to another day
);

-- Task instances table
CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Scheduling
  due_date DATE NOT NULL,
  scheduled_time TIME, -- Preferred time from task template

  -- Status tracking
  status task_instance_status NOT NULL DEFAULT 'pending',

  -- Completion data (filled when status = 'completed')
  completed_at TIMESTAMPTZ,
  actual_minutes INT, -- How long it actually took
  mood task_mood, -- How user felt doing it
  photo_url TEXT, -- Proof photo from Supabase Storage
  notes TEXT, -- User notes about completion

  -- Rescheduling tracking
  original_due_date DATE, -- If rescheduled, the original date
  reschedule_reason TEXT, -- Why it was rescheduled

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one instance per task per day
  CONSTRAINT unique_task_instance_per_day UNIQUE(task_id, due_date)
);

-- Indexes for performance
CREATE INDEX idx_task_instances_task_id ON task_instances(task_id);
CREATE INDEX idx_task_instances_user_id ON task_instances(user_id);
CREATE INDEX idx_task_instances_due_date ON task_instances(due_date);
CREATE INDEX idx_task_instances_status ON task_instances(status);
CREATE INDEX idx_task_instances_user_due_date ON task_instances(user_id, due_date);

-- Update trigger
CREATE OR REPLACE FUNCTION update_task_instances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_instances_updated_at
  BEFORE UPDATE ON task_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_task_instances_updated_at();

-- RLS Policies
ALTER TABLE task_instances ENABLE ROW LEVEL SECURITY;

-- Users can only see their own task instances
CREATE POLICY task_instances_select_policy ON task_instances
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own task instances
CREATE POLICY task_instances_insert_policy ON task_instances
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own task instances
CREATE POLICY task_instances_update_policy ON task_instances
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own task instances
CREATE POLICY task_instances_delete_policy ON task_instances
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to generate instances for a task (will be called by application)
CREATE OR REPLACE FUNCTION generate_task_instances(
  p_task_id UUID,
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS SETOF task_instances AS $$
DECLARE
  v_task RECORD;
  v_current_date DATE;
  v_instance_id UUID;
BEGIN
  -- Get task details
  SELECT * INTO v_task FROM tasks WHERE id = p_task_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or access denied';
  END IF;

  -- Generate instances based on frequency
  v_current_date := p_start_date;

  WHILE v_current_date <= p_end_date LOOP
    -- Check if instance already exists
    IF NOT EXISTS (
      SELECT 1 FROM task_instances
      WHERE task_id = p_task_id AND due_date = v_current_date
    ) THEN
      -- Create instance
      INSERT INTO task_instances (
        task_id,
        user_id,
        due_date,
        scheduled_time,
        status
      ) VALUES (
        p_task_id,
        p_user_id,
        v_current_date,
        v_task.preferred_time,
        'pending'
      )
      RETURNING * INTO v_instance_id;
    END IF;

    -- Increment date based on frequency
    CASE v_task.frequency
      WHEN 'daily' THEN
        v_current_date := v_current_date + INTERVAL '1 day';
      WHEN 'weekly' THEN
        v_current_date := v_current_date + INTERVAL '7 days';
      WHEN 'monthly' THEN
        v_current_date := v_current_date + INTERVAL '1 month';
      WHEN 'custom' THEN
        v_current_date := v_current_date + (v_task.custom_frequency_days || ' days')::INTERVAL;
      ELSE
        EXIT;
    END CASE;
  END LOOP;

  -- Return all instances for this task in the date range
  RETURN QUERY
    SELECT * FROM task_instances
    WHERE task_id = p_task_id
      AND due_date BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
