# calendar Specification

## ADDED Requirements

### Requirement: Paused Tasks Visibility in Calendar
The calendar SHALL display paused tasks for the selected day to provide visibility into temporarily inactive tasks.

#### Scenario: Display paused tasks in day view
- **WHEN** user views a day in the calendar
- **THEN** a "Paused Tasks" section is displayed
- **AND** all paused tasks (`is_active = false`) for that day are shown
- **AND** each paused task displays: title, description, category, and visual pause indicator
- **AND** paused tasks use muted/desaturated colors to distinguish from active tasks

#### Scenario: Empty paused tasks state
- **WHEN** user views a day with no paused tasks
- **THEN** the "Paused Tasks" section displays an empty state message
- **AND** the message reads "No paused tasks for this day" (localized)

#### Scenario: Resume paused task from calendar
- **WHEN** user clicks "Resume" button on a paused task in calendar
- **THEN** the task's `is_active` field is set to `true`
- **AND** the calendar data is refreshed
- **AND** the task appears in the regular timeline (if it has a scheduled_time) or unscheduled section (if no scheduled_time)
- **AND** a success notification is displayed

### Requirement: Unscheduled Tasks Timeline Integration
Tasks without a specific time SHALL be integrated into the timeline view for better overview.

#### Scenario: Display unscheduled tasks in timeline
- **WHEN** user views a day with unscheduled tasks (tasks with `scheduled_time = null`)
- **THEN** a special timeline row is displayed at the top
- **AND** the row label shows "Anytime today" or "No specific time" (localized)
- **AND** unscheduled tasks are displayed horizontally in this row
- **AND** tasks maintain the same visual style as scheduled tasks
- **AND** completion status is visually indicated

#### Scenario: Interact with unscheduled tasks
- **WHEN** user clicks on an unscheduled task in the timeline
- **THEN** the task edit modal opens
- **AND** user can edit task details including scheduling a specific time
- **AND** after saving changes, the calendar refreshes

#### Scenario: No unscheduled tasks
- **WHEN** user views a day with no unscheduled tasks
- **THEN** the unscheduled timeline row is not displayed
- **AND** the hourly timeline starts immediately

### Requirement: Paused Tasks API
The system SHALL provide a server action to fetch paused tasks for a specific date.

#### Scenario: Fetch paused tasks for date
- **WHEN** `getPausedTasksForDate(userId, date)` is called
- **THEN** all tasks with `is_active = false` for the user are returned
- **AND** only tasks that would have instances on the specified date are included
- **AND** tasks include related data: category, scheduling information
- **AND** tasks are ordered by `updated_at` DESC (most recently paused first)

#### Scenario: Unauthorized access
- **WHEN** `getPausedTasksForDate` is called without authentication
- **THEN** an authentication error is thrown
- **AND** no tasks are returned

### Requirement: Calendar Data Structure
The calendar data structure SHALL support both active and paused tasks.

#### Scenario: Calendar data includes paused tasks
- **WHEN** `getCalendarData` is called with `includePaused = true`
- **THEN** the returned `CalendarData` object includes a `pausedTasks` array
- **AND** `pausedTasks` contains tasks with `is_active = false`
- **AND** regular `taskInstances` contains only active tasks (`is_active = true`)

### Requirement: Internationalization Support
All calendar task section UI text SHALL be internationalized supporting both English and German languages.

#### Scenario: English locale - paused tasks
- **WHEN** user's locale is set to English
- **THEN** paused section header displays "Paused Tasks"
- **AND** empty state displays "No paused tasks for this day"
- **AND** resume button displays "Resume"

#### Scenario: German locale - paused tasks
- **WHEN** user's locale is set to German (de)
- **THEN** paused section header displays "Pausierte Aufgaben"
- **AND** empty state displays "Keine pausierten Aufgaben für diesen Tag"
- **AND** resume button displays "Fortsetzen"

#### Scenario: English locale - unscheduled tasks
- **WHEN** user's locale is set to English
- **THEN** unscheduled timeline row label displays "Anytime today" or "No specific time"

#### Scenario: German locale - unscheduled tasks
- **WHEN** user's locale is set to German (de)
- **THEN** unscheduled timeline row label displays "Irgendwann heute" or "Keine bestimmte Zeit"
