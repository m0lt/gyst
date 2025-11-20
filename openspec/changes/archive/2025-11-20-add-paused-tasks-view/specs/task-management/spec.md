# Task Management Specification Delta

## ADDED Requirements

### Requirement: Paused Tasks Visibility
The system SHALL provide a dedicated view for paused tasks (tasks with `is_active = false`) to allow users to review and manage temporarily inactive tasks.

#### Scenario: Display paused tasks
- **WHEN** user navigates to the tasks page
- **THEN** a "Paused Tasks" section is displayed below the active tasks list
- **AND** all tasks with `is_active = false` are shown in this section
- **AND** each paused task displays: title, description, category, and schedule information

#### Scenario: Empty paused tasks state
- **WHEN** user has no paused tasks (all tasks have `is_active = true`)
- **THEN** the "Paused Tasks" section displays an empty state message
- **AND** the message reads "No paused tasks" (localized)

#### Scenario: Resume paused task
- **WHEN** user clicks the "Resume" button on a paused task
- **THEN** the task's `is_active` field is set to `true`
- **AND** the task is removed from the paused tasks section
- **AND** the task appears in the active tasks list
- **AND** the task's instances reappear in calendar and todo list

### Requirement: Paused Tasks API
The system SHALL provide a server action to fetch paused tasks for the authenticated user.

#### Scenario: Fetch paused tasks for user
- **WHEN** `getPausedTasks(userId)` is called
- **THEN** all tasks with `is_active = false` for the user are returned
- **AND** tasks include related data: category, scheduling information
- **AND** tasks are ordered by `updated_at` DESC (most recently paused first)

#### Scenario: Unauthorized access
- **WHEN** `getPausedTasks` is called without authentication
- **THEN** an authentication error is thrown
- **AND** no tasks are returned

### Requirement: Visual Distinction
Paused tasks SHALL be visually distinguished from active tasks to indicate their inactive status.

#### Scenario: Paused task styling
- **WHEN** paused tasks are displayed
- **THEN** they use muted/desaturated colors
- **AND** they include a pause icon indicator
- **AND** they are clearly separated from active tasks via section header

### Requirement: Internationalization Support
All paused tasks UI text SHALL be internationalized supporting both English and German languages.

#### Scenario: English locale
- **WHEN** user's locale is set to English
- **THEN** section header displays "Paused Tasks"
- **AND** empty state displays "No paused tasks"
- **AND** resume button displays "Resume"

#### Scenario: German locale
- **WHEN** user's locale is set to German (de)
- **THEN** section header displays "Pausierte Aufgaben"
- **AND** empty state displays "Keine pausierten Aufgaben"
- **AND** resume button displays "Fortsetzen"
