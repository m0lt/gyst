# Implementation Tasks

## 1. Backend Implementation
- [x] 1.1 Add `getPausedTasksForDate` server action in `app/actions/calendar.ts`
  - Query tasks with `is_active = false` for user and specific date
  - Include category and scheduling information
  - Return same structure as task instances
- [x] 1.2 Update `CalendarData` type to include optional `pausedTasks` array
- [x] 1.3 Modify `getCalendarData` to optionally fetch paused tasks

## 2. Frontend Components - Paused Tasks Section
- [x] 2.1 Add paused tasks section to `components/calendar/day-view.tsx`
  - Create `getPausedTasksForDay()` helper function
  - Display paused tasks in dedicated section below unscheduled
  - Use muted/desaturated colors and pause icon
  - Show "Resume" button for each paused task
  - Show empty state when no paused tasks
- [x] 2.2 Implement resume functionality in day-view
  - Use existing `toggleTaskActive()` server action
  - Refresh calendar data after resume
  - Show success notification

## 3. Frontend Components - Unscheduled Tasks Timeline
- [x] 3.1 Restructure unscheduled tasks display in `components/calendar/day-view.tsx`
  - Remove grid card layout (lines 70-99)
  - Add special timeline row at top (before hourly timeline starts)
  - Use horizontal layout similar to scheduled tasks
  - Label row with "Anytime today" or "No specific time"
  - Maintain click-to-edit functionality
  - Show completion status with visual styling
- [x] 3.2 Update timeline layout to accommodate unscheduled row
  - Add unscheduled row before hours.map()
  - Consistent styling with hourly rows
  - Responsive layout for multiple unscheduled tasks

## 4. Internationalization
- [x] 4.1 Add translation keys to `lib/i18n/locales/en.json`
  - `calendar.paused`: "Paused Tasks"
  - `calendar.pausedEmpty`: "No paused tasks for this day"
  - `calendar.anytimeToday`: "Anytime today"
  - `calendar.noSpecificTime`: "No specific time"
  - `calendar.resumeTask`: "Resume"
- [x] 4.2 Add German translations to `lib/i18n/locales/de.json`
  - `calendar.paused`: "Pausierte Aufgaben"
  - `calendar.pausedEmpty`: "Keine pausierten Aufgaben für diesen Tag"
  - `calendar.anytimeToday`: "Irgendwann heute"
  - `calendar.noSpecificTime`: "Keine bestimmte Zeit"
  - `calendar.resumeTask`: "Fortsetzen"

## 5. Optional: Week View Enhancement
- [x] 5.1 Consider adding paused tasks to `components/calendar/week-view.tsx`
  - Show paused tasks for the week
  - Similar visual treatment as day-view
  - Compact representation due to space constraints
- [x] 5.2 Add unscheduled tasks row to week-view timeline
  - Display unscheduled tasks in dedicated row before hourly slots
  - Compact vertical layout per day column
  - Click-to-edit functionality maintained

## 6. Testing & Validation
- [ ] 6.1 Test paused tasks section displays correctly in day-view
- [ ] 6.2 Test resume functionality works and refreshes data
- [ ] 6.3 Test unscheduled tasks appear in timeline row
- [ ] 6.4 Test empty states for both sections
- [ ] 6.5 Test i18n works for both EN and DE
- [ ] 6.6 Test responsive layout on mobile/tablet
- [ ] 6.7 Verify click-to-edit still works for unscheduled tasks
