# Enhance Calendar Task Sections

## Why

Currently, the calendar view has two limitations:

1. **Paused tasks are hidden**: When tasks are paused (`is_active = false`), they completely disappear from the calendar view. Users lose visibility into what tasks are paused and can't easily resume them from the calendar interface.

2. **Unscheduled tasks poor visibility**: Tasks without a specific time (`scheduled_time = null`) are shown in a grid card layout above the timeline. This separates them visually from the timeline and makes it harder to see the full day's workload at a glance.

**Goals**:
- Provide visibility into paused tasks within the calendar context
- Integrate unscheduled tasks into the timeline view for better overview
- Maintain clear visual distinction between scheduled, unscheduled, and paused tasks

## What Changes

### 1. Add Paused Tasks Section
- Create new section in day-view (and potentially week-view) to display paused tasks
- Show paused tasks for the selected day with visual distinction (muted colors, pause icon)
- Include "Resume" button to reactivate tasks directly from calendar
- Position below unscheduled tasks section

### 2. Unscheduled Tasks as Timeline Row
- Move unscheduled tasks from grid card layout into the timeline
- Display as a special row at the top of the hourly timeline (before 00:00)
- Use a "No specific time" or "Anytime today" label instead of hour label
- Maintain horizontal layout similar to scheduled task blocks
- Keep existing task interaction (click to edit)

### 3. Backend Changes
- Add `getPausedTasksForDate(userId, date)` server action to fetch paused tasks for a specific day
- Modify `getCalendarData()` to optionally include paused tasks (separate from active tasks)

### 4. Internationalization
- Add translation keys for:
  - `calendar.paused`: "Paused Tasks" / "Pausierte Aufgaben"
  - `calendar.pausedEmpty`: "No paused tasks" / "Keine pausierten Aufgaben"
  - `calendar.anytimeToday`: "Anytime today" / "Irgendwann heute"
  - `calendar.noSpecificTime`: "No specific time" / "Keine bestimmte Zeit"

## Impact

### Changed Files
- `app/actions/calendar.ts` - Add getPausedTasksForDate(), modify CalendarData type
- `components/calendar/day-view.tsx` - Add paused section, restructure unscheduled display
- `components/calendar/week-view.tsx` - Consider adding paused tasks (optional)
- `lib/i18n/locales/en.json` - Add English translations
- `lib/i18n/locales/de.json` - Add German translations

### New Specs
- `calendar` spec - Add requirements for paused tasks visibility and unscheduled task timeline integration

### Breaking Changes
- None (visual changes only, no API breaking changes)

### Dependencies
- Requires the paused tasks feature (is_active field on tasks table)
- Uses existing task instance and task data structures
