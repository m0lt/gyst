# Change: Add Task Instance Reactivation

## Why
Users need the ability to undo task completions in case of accidental completion or if they want to complete the same task again on the same day. Currently, once a task is marked as completed, there's no way to revert it back to pending status.

## What Changes
- Add reactivation functionality to completed tasks
- Preserve completion history when reactivating (mood, photo, notes, subtasks)
- Add reactivate button to completed tasks in Todo list
- Implement server action for task reactivation
- Add i18n translations (EN/DE) for reactivation UI

## Impact
- Affected specs: task-completion
- Affected code:
  - `app/actions/task-instances.ts` - new `reactivateTaskInstance` server action
  - `components/todo/todo-list.tsx` - reactivate button and handler
  - `lib/i18n/locales/en.json` - English translations
  - `lib/i18n/locales/de.json` - German translations
