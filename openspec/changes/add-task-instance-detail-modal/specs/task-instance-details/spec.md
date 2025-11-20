# Task Instance Details

Capability for viewing comprehensive details about a specific task instance and performing quick actions.

## ADDED Requirements

### Requirement: Task Instance Detail Modal Display
**ID**: `task-instance-detail-modal.display`
**Priority**: High
**Status**: Proposed

The system SHALL provide a modal dialog that displays comprehensive information about a specific task instance including:
- Task title and description
- Scheduled date and time
- Category with visual indicator (color/icon)
- Priority level
- Duration information (estimated and scheduled)
- AI-generated image (if available)
- Subtasks with completion status
- Completion information (if completed)

#### Scenario: User views pending task instance details

**Given** a user is viewing their calendar or todo list
**And** there is a pending task instance for "Morning Workout" scheduled for today at 07:00
**And** the task has an AI-generated image and 3 subtasks
**When** the user clicks on the task
**Then** a detail modal SHALL open
**And** the modal SHALL display "Morning Workout" as the title
**And** the modal SHALL show today's date and "07:00" as scheduled time
**And** the modal SHALL display the category with its color and icon
**And** the modal SHALL show the AI-generated image
**And** the modal SHALL list all 3 subtasks with their completion status
**And** the modal SHALL show action buttons: "Complete", "Reschedule", "Skip"

#### Scenario: User views completed task instance details

**Given** a user is viewing their calendar
**And** there is a completed task instance for "Team Meeting"
**And** the task was completed 2 hours ago with mood "happy"
**And** the completion includes a photo and notes
**When** the user clicks on the completed task
**Then** the detail modal SHALL open
**And** the modal SHALL display completion information section
**And** the section SHALL show the completion timestamp
**And** the section SHALL display the mood as "happy" with icon
**And** the section SHALL show the actual time taken
**And** the section SHALL display the completion photo
**And** the section SHALL show the completion notes
**And** the "Complete" button SHALL be hidden

### Requirement: Task Instance Quick Actions
**ID**: `task-instance-detail-modal.actions`
**Priority**: High
**Status**: Proposed

The detail modal SHALL provide quick action buttons for task instance management:
- Complete button - opens completion modal
- Reschedule button - opens reschedule modal
- Skip button - marks instance as skipped with confirmation
- Edit Task Template button - opens task edit modal

#### Scenario: User completes task from detail modal

**Given** a user has opened the detail modal for a pending task
**And** the "Complete" button is visible
**When** the user clicks "Complete"
**Then** the CompleteTaskModal SHALL open
**And** the detail modal SHALL remain open in the background
**When** the user completes the task in CompleteTaskModal
**Then** the CompleteTaskModal SHALL close
**And** the detail modal SHALL close
**And** the calendar/todo list SHALL refresh with updated data

#### Scenario: User reschedules task from detail modal

**Given** a user has opened the detail modal for a task due today
**When** the user clicks "Reschedule"
**Then** the RescheduleTaskModal SHALL open
**When** the user selects a new date and confirms
**Then** the RescheduleTaskModal SHALL close
**And** the detail modal SHALL close
**And** the task SHALL be moved to the new date
**And** a success notification SHALL appear

#### Scenario: User skips task from detail modal

**Given** a user has opened the detail modal for a pending task
**When** the user clicks "Skip"
**Then** a confirmation dialog SHALL appear with message "Are you sure you want to skip this task?"
**When** the user confirms
**Then** the task instance status SHALL be updated to "skipped"
**And** the detail modal SHALL close
**And** the task SHALL be marked as skipped in the view
**And** a success notification SHALL appear

#### Scenario: User opens task template editor from detail modal

**Given** a user has opened the detail modal for any task instance
**When** the user clicks "Edit Task Template"
**Then** the TaskFormModal SHALL open for editing the recurring task
**And** the detail modal SHALL close
**When** the user saves changes to the task template
**Then** all future instances SHALL reflect the updated template

### Requirement: Subtasks Display in Detail Modal
**ID**: `task-instance-detail-modal.subtasks`
**Priority**: Medium
**Status**: Proposed

The detail modal SHALL display subtasks in a read-only view with:
- Checkbox indicators (read-only, showing current state)
- Subtask titles
- Required/optional badges
- Progress bar showing completion percentage
- Proper sorting by sort_order

#### Scenario: User views task with mixed subtask completion

**Given** a task instance has 5 subtasks
**And** 3 subtasks are marked as completed
**And** 2 subtasks are marked as required
**When** the user opens the detail modal
**Then** the modal SHALL display a subtasks section
**And** the section SHALL show a progress bar at 60% (3/5)
**And** the section SHALL list all 5 subtasks in order
**And** 3 subtasks SHALL show checked indicators
**And** 2 subtasks SHALL show unchecked indicators
**And** required subtasks SHALL display a "Required" badge
**And** the indicators SHALL be read-only (not clickable)

### Requirement: Calendar and Todo List Integration
**ID**: `task-instance-detail-modal.integration`
**Priority**: High
**Status**: Proposed

The detail modal SHALL replace the current edit modal behavior when users click on task instances in:
- Calendar day view
- Calendar week view
- Todo list

The system SHALL pass full task instance data to the modal and handle post-action data refresh.

#### Scenario: User clicks task in calendar day view

**Given** a user is viewing the calendar in day view
**And** there is a task scheduled for 10:00 AM
**When** the user clicks on the task
**Then** the TaskInstanceDetailModal SHALL open
**And** the TaskFormModal SHALL NOT open automatically
**When** the user performs any action and closes the modal
**Then** the calendar data SHALL refresh to show updated state

#### Scenario: User clicks task in week view

**Given** a user is viewing the calendar in week view
**And** there is a task on Wednesday at 2:00 PM
**When** the user clicks on the task
**Then** the TaskInstanceDetailModal SHALL open
**And** all task instance details SHALL be visible
**When** the user closes the modal
**Then** they SHALL return to the week view

#### Scenario: User clicks task in todo list

**Given** a user is viewing the todo list
**And** there are multiple pending tasks for today
**When** the user clicks on any task card
**Then** the TaskInstanceDetailModal SHALL open
**And** the modal SHALL display full details for that specific instance
**When** the user completes or reschedules the task
**Then** the todo list SHALL refresh to reflect changes

### Requirement: Visual Design and UX
**ID**: `task-instance-detail-modal.design`
**Priority**: Medium
**Status**: Proposed

The detail modal SHALL have a clear visual hierarchy, responsive design, and proper handling of different states (pending, completed, skipped).

#### Scenario: Modal displays with proper visual hierarchy

**Given** a user opens a task instance detail modal
**Then** the modal SHALL have a fixed header with task title
**And** the main content area SHALL be scrollable
**And** sections SHALL be clearly separated with spacing
**And** the category color SHALL be used as a visual accent
**And** icons SHALL be used for each section (calendar, clock, checklist)
**And** the action buttons SHALL be in a fixed footer
**And** the modal SHALL be responsive on mobile, tablet, and desktop

#### Scenario: Modal handles missing optional data

**Given** a task instance has no AI image
**And** the task has no subtasks
**When** the user opens the detail modal
**Then** the modal SHALL NOT show an empty image section
**And** the modal SHALL NOT show an empty subtasks section
**And** only populated sections SHALL be visible

### Requirement: Internationalization
**ID**: `task-instance-detail-modal.i18n`
**Priority**: High
**Status**: Proposed

All text in the detail modal SHALL be translatable with support for English and German locales. Date and time formatting SHALL respect the user's locale.

#### Scenario: Modal displays in German locale

**Given** a user has selected German (de) as their language
**And** a task is scheduled for "2025-01-15" at "14:30"
**When** the user opens the detail modal
**Then** section headings SHALL appear in German
**And** button labels SHALL appear in German
**And** the date SHALL be formatted according to German conventions
**And** the time SHALL be formatted as "14:30"
**And** all confirmation messages SHALL be in German

#### Scenario: Modal displays in English locale

**Given** a user has selected English (en) as their language
**And** a task is scheduled for "2025-01-15" at "14:30"
**When** the user opens the detail modal
**Then** all text SHALL appear in English
**And** the date SHALL be formatted according to English conventions
**And** all notifications SHALL be in English
