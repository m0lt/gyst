# Task Management - Scheduling Enhancements

## ADDED Requirements

### Requirement: Task Priority
The system SHALL support task prioritization with three levels: low, medium, and high.

#### Scenario: Create task with priority
- **WHEN** user creates a new task
- **THEN** user can select priority (low, medium, high)
- **AND** priority defaults to medium if not specified

#### Scenario: Display priority in task list
- **WHEN** user views task list
- **THEN** each task displays its priority level with visual indicator (color/badge)
- **AND** tasks can be filtered by priority level

### Requirement: Scheduled Duration
The system SHALL allow users to specify the planned duration for each task in minutes.

#### Scenario: Set task duration
- **WHEN** user creates or edits a task
- **THEN** user can input scheduled duration in minutes
- **AND** duration must be a positive integer or null

#### Scenario: Display duration
- **WHEN** user views task details
- **THEN** scheduled duration is displayed (e.g., "30 min", "1h 15min")

### Requirement: Task Tags
The system SHALL support flexible task categorization using tags.

#### Scenario: Add tags to task
- **WHEN** user creates or edits a task
- **THEN** user can add multiple tags
- **AND** tag input provides autocomplete from existing tags
- **AND** tags are stored as lowercase for consistency

#### Scenario: Filter by tags
- **WHEN** user views task list
- **THEN** user can filter tasks by one or multiple tags
- **AND** tasks matching any selected tag are displayed

#### Scenario: Display tags
- **WHEN** user views task list
- **THEN** each task displays its tags as small badges
- **AND** clicking a tag badge filters by that tag

### Requirement: Task Reminders
The system SHALL allow users to set reminder timing for tasks.

#### Scenario: Configure reminder
- **WHEN** user creates or edits a task with preferred_time
- **THEN** user can set reminder timing (e.g., 15min, 30min, 1h before)
- **AND** reminder_minutes_before is stored as integer

#### Scenario: Reminder defaults
- **WHEN** user sets preferred_time without specifying reminder
- **THEN** no reminder is set (reminder_minutes_before is null)

### Requirement: Enhanced Recurrence Patterns
The system SHALL support detailed recurrence patterns for flexible task scheduling.

#### Scenario: Weekly recurrence with specific days
- **WHEN** user creates weekly recurring task
- **THEN** user can select specific days of week (e.g., Mon, Wed, Fri)
- **AND** recurrence_pattern stores selected days as array: `{"daysOfWeek": [1, 3, 5]}`

#### Scenario: Monthly recurrence with specific dates
- **WHEN** user creates monthly recurring task
- **THEN** user can select specific days of month (e.g., 1st, 15th)
- **AND** recurrence_pattern stores dates as array: `{"daysOfMonth": [1, 15]}`

#### Scenario: Interval-based recurrence
- **WHEN** user selects custom frequency
- **THEN** user can set interval (e.g., every 3 days, every 2 weeks)
- **AND** recurrence_pattern stores: `{"interval": 3, "unit": "days"}`

#### Scenario: Daily weekdays only
- **WHEN** user creates daily recurring task
- **THEN** user can select "Weekdays only" option
- **AND** recurrence_pattern stores: `{"weekdaysOnly": true}`

### Requirement: Modal-Based Task Creation
The system SHALL provide a modal dialog for task creation and editing.

#### Scenario: Open task creation modal
- **WHEN** user clicks "New Task" button on tasks page
- **THEN** modal dialog opens with task creation form
- **AND** all scheduling fields are available (time, duration, priority, tags, recurrence, reminders)

#### Scenario: Close modal without saving
- **WHEN** user clicks cancel or clicks outside modal
- **THEN** modal closes without creating task
- **AND** form data is cleared

#### Scenario: Create task from modal
- **WHEN** user fills form and clicks save
- **THEN** task is created with all specified fields
- **AND** modal closes
- **AND** task appears in task list
- **AND** success message is displayed

### Requirement: Internationalization
The system SHALL provide all UI text in multiple languages using i18n translation keys.

#### Scenario: All scheduling UI translated
- **WHEN** system displays task scheduling UI
- **THEN** all labels, buttons, and messages use i18n keys from translation files
- **AND** both English (en.json) and German (de.json) translations exist
- **AND** no hardcoded user-facing strings exist in components

#### Scenario: Language switching
- **WHEN** user switches language preference
- **THEN** all task scheduling UI updates to selected language
- **AND** priority levels, recurrence options, and reminder settings are translated
