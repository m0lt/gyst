# Change: Enhanced Task Scheduling for Calendar & Todo List Integration

## Why

Users need more detailed scheduling options to effectively plan their tasks in calendars and todo lists. Current task system only supports basic frequency (daily/weekly/monthly) without time-based scheduling, priorities, or flexible recurrence patterns. This limits the ability to:
- Display tasks in calendar views with specific times
- Organize tasks by priority and urgency
- Set reminders based on task timing
- Tag tasks for flexible categorization
- Plan tasks based on available time slots

## What Changes

**Database Schema Enhancements:**
- Add `priority` enum (low, medium, high) to tasks table
- Add `scheduled_duration` (integer, minutes) for planned task duration
- Add `tags` (text array) for flexible categorization
- Add `reminder_minutes_before` (integer) for reminder timing
- Enhance `recurrence_pattern` JSONB structure with:
  - Specific days of week (for weekly tasks)
  - Specific days of month (for monthly tasks)
  - Interval-based patterns (every N days/weeks)
  - Exclusion dates (holidays, vacations)

**UI Changes:**
- Replace task creation form on `/protected/tasks` with a "New Task" button
- Implement modal-based task creation workflow
- Add scheduling fields to task form:
  - Time picker for `preferred_time`
  - Duration input for `scheduled_duration`
  - Priority selector
  - Tag input (autocomplete)
  - Enhanced recurrence options
  - Reminder settings
- Update task list to show scheduling information

**Translation Updates:**
- Add i18n keys for all new UI elements in `en.json` and `de.json`

## Impact

**Affected specs:**
- task-management (new spec)

**Affected code:**
- Database: `supabase/migrations/` (new migration for schema changes)
- Types: `database.types.ts` (updated task types)
- API: `app/actions/tasks.ts` (update task creation/update actions)
- UI Components:
  - `app/protected/tasks/page.tsx` (convert to button + modal)
  - `components/tasks/task-form.tsx` (new modal form)
  - `components/tasks/task-list.tsx` (display scheduling info)
- Translations: `lib/i18n/locales/en.json`, `lib/i18n/locales/de.json`

**Benefits:**
- Tasks can be displayed in calendar views
- Better task organization and prioritization
- More flexible scheduling options
- Improved reminder system
- Enhanced user productivity

**Breaking Changes:**
None - all changes are additive to existing schema
