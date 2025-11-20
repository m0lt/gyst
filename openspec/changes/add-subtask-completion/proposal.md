# Change: Add Subtask Completion Tracking

## Why
Users need to track which subtasks were completed for each task instance. This provides better progress visibility and helps users understand their task completion patterns. Currently, subtasks are defined on task templates but there's no way to track which specific subtasks were completed during each task execution.

## What Changes
- Add database column to track subtask completion status per task instance
- Display subtasks with interactive checkboxes in todo list
- Show subtask progress with accordion UI and progress bar
- Track subtask completion in both modal and card view
- Implement optimistic UI updates for instant checkbox feedback
- Add subtask completion to task completion flow
- Add i18n translations for subtask UI elements

## Impact
- Affected specs: task-completion, task-management
- Affected code:
  - Database: `supabase/migrations/20251119_add_subtasks_to_instances.sql`
  - `app/protected/todo/page.tsx` - fetch task_subtasks relation
  - `components/todo/todo-list.tsx` - accordion UI, progress tracking, optimistic updates
  - `components/todo/complete-task-modal.tsx` - subtask checkboxes with progress bar
  - `app/actions/task-instances.ts` - updateSubtasksCompleted, save on completion
  - `lib/i18n/locales/en.json` - English translations
  - `lib/i18n/locales/de.json` - German translations
