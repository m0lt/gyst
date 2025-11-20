# Implementation Tasks: Task Reactivation

## 1. Backend Implementation
- [x] 1.1 Create `reactivateTaskInstance` server action in `app/actions/task-instances.ts`
- [x] 1.2 Update task instance status from "completed" to "pending"
- [x] 1.3 Clear `completed_at` timestamp
- [x] 1.4 Preserve completion history (mood, photo, notes, actual_minutes, subtasks_completed)
- [x] 1.5 Add revalidatePath for UI refresh

## 2. Frontend Implementation
- [x] 2.1 Import `reactivateTaskInstance` action in todo-list.tsx
- [x] 2.2 Import `RotateCcw` icon from lucide-react
- [x] 2.3 Create `handleReactivate` function with confirmation dialog
- [x] 2.4 Add reactivate button to completed tasks section
- [x] 2.5 Implement error handling and notifications

## 3. Internationalization
- [x] 3.1 Add translation keys to `lib/i18n/locales/en.json`:
  - `todo.reactivate`
  - `todo.reactivateConfirm`
  - `todo.taskReactivated`
  - `todo.taskReactivatedDesc`
  - `todo.failedToReactivate`
- [x] 3.2 Add German translations to `lib/i18n/locales/de.json`
- [x] 3.3 Replace hardcoded strings with `t()` calls

## 4. Testing & Validation
- [ ] 4.1 Test reactivating a completed task
- [ ] 4.2 Verify completion history is preserved
- [ ] 4.3 Test error handling scenarios
- [ ] 4.4 Verify both EN and DE translations display correctly
- [ ] 4.5 Test confirmation dialog cancellation
