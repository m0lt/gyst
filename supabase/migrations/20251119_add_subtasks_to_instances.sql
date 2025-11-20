-- Add subtasks_completed field to task_instances
ALTER TABLE task_instances
ADD COLUMN subtasks_completed JSONB DEFAULT NULL;

COMMENT ON COLUMN task_instances.subtasks_completed IS 'JSONB object mapping subtask_id to boolean (completed or not)';
