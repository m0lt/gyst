# Change: Add Paused Tasks View

## Why

Users need visibility into their paused tasks to manage them effectively. Currently, when tasks are paused (via `is_active = false`), they disappear from the calendar and todo list without any way to:
- See which tasks are currently paused
- Understand why tasks were paused
- Quickly reactivate paused tasks
- Review paused tasks periodically

This creates a "black hole" where paused tasks are forgotten and never resumed.

## What Changes

**New UI Components:**
- Create a dedicated "Paused Tasks" section/card in the tasks page
- Display all tasks with `is_active = false`
- Show task metadata (title, description, category, schedule info)
- Add quick "Resume" action button for each paused task
- Include visual distinction from active tasks (muted colors, pause icon)

**Backend Changes:**
- Add server action `getPausedTasks(userId: string)` to fetch paused tasks
- Modify task filtering logic to separate active and paused tasks

**Translation Updates:**
- Add i18n keys for paused tasks section in `en.json` and `de.json`:
  - Section header ("Paused Tasks")
  - Empty state message ("No paused tasks")
  - Resume button label
  - Task count indicator

**Already Implemented (Prerequisites):**
- ✅ Calendar filtering: Only shows active task instances
- ✅ Todo filtering: Only shows active task instances
- ✅ `toggleTaskActive` action: Can pause/resume tasks
- ✅ Task list UI: Has pause/resume buttons

## Impact

**Affected specs:**
- task-management (new spec delta)

**Affected code:**
- API: `app/actions/tasks.ts` (add `getPausedTasks` action)
- UI Components:
  - `app/protected/tasks/page.tsx` (add paused tasks section)
  - `components/tasks/paused-tasks-card.tsx` (new component)
- Translations: `lib/i18n/locales/en.json`, `lib/i18n/locales/de.json`

**Benefits:**
- Users can track paused tasks
- Easier task lifecycle management
- Reduced "lost tasks" problem
- Better task organization

**Breaking Changes:**
None - this is purely additive functionality
