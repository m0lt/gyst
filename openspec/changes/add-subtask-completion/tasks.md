# Implementation Tasks: Subtask Completion Tracking

## 1. Database Schema
- [x] 1.1 Create migration file `20251119_add_subtasks_to_instances.sql`
- [x] 1.2 Add `subtasks_completed JSONB` column to `task_instances` table
- [x] 1.3 Add column comment for documentation
- [x] 1.4 Apply migration to database

## 2. Backend Implementation
- [x] 2.1 Extend todo page query to include `task_subtasks` relation
- [x] 2.2 Create `updateSubtasksCompleted` server action
- [x] 2.3 Update `completeTaskInstance` to save subtask completion data
- [x] 2.4 Add validation and error handling
- [x] 2.5 Add revalidatePath for UI refresh

## 3. Todo List - Accordion View
- [x] 3.1 Add state for expanded instances (accordion)
- [x] 3.2 Create `toggleSubtasks` function for expand/collapse
- [x] 3.3 Create `calculateSubtaskProgress` function
- [x] 3.4 Implement accordion button with subtask count
- [x] 3.5 Add Progress component showing completion percentage
- [x] 3.6 Render subtask list with checkboxes when expanded
- [x] 3.7 Implement optimistic UI updates with `useOptimistic` hook
- [x] 3.8 Create `handleToggleSubtask` with background server action
- [x] 3.9 Add visual feedback (checkmark, strikethrough)

## 4. Complete Task Modal
- [x] 4.1 Add `subtasksCompleted` state initialized from instance
- [x] 4.2 Create `toggleSubtask` function for modal
- [x] 4.3 Create `calculateProgress` function
- [x] 4.4 Add Progress component to modal
- [x] 4.5 Render subtask checkboxes with required badges
- [x] 4.6 Update `handleSubmit` to include subtasks in completion data
- [x] 4.7 Add debug logging for troubleshooting

## 5. Internationalization
- [x] 5.1 Add translation keys to `lib/i18n/locales/en.json`:
  - `todo.subtasksCompleted`
  - `tasks.subtasksCount` (with plural form)
  - `tasks.subtask.*` (various subtask-related keys)
- [x] 5.2 Add German translations to `lib/i18n/locales/de.json`
- [x] 5.3 Use `t()` calls throughout components

## 6. Performance Optimization
- [x] 6.1 Implement `useOptimistic` for instant checkbox feedback
- [x] 6.2 Remove blocking `router.refresh()` calls from checkbox handlers
- [x] 6.3 Run server actions in background
- [x] 6.4 Add automatic revert on error

## 7. Testing & Validation
- [ ] 7.1 Test subtask accordion expand/collapse
- [ ] 7.2 Test subtask checkbox toggling (instant feedback)
- [ ] 7.3 Test progress bar updates
- [ ] 7.4 Test subtask completion in modal
- [ ] 7.5 Test completion with subtasks data persistence
- [ ] 7.6 Test optimistic updates with network failure
- [ ] 7.7 Verify both EN and DE translations
