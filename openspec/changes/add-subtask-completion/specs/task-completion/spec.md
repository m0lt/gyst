# Task Completion - Delta Specification

## ADDED Requirements

### Requirement: Subtask Completion Tracking
Users SHALL be able to track which subtasks were completed during task execution.

#### Scenario: Display subtasks in todo list
- **WHEN** user views a task instance with subtasks in todo list
- **THEN** subtask count and progress are displayed
- **AND** user can expand accordion to see individual subtasks
- **AND** progress bar shows completion percentage

#### Scenario: Toggle subtask in todo list
- **WHEN** user clicks subtask checkbox in accordion view
- **THEN** checkbox state updates instantly (optimistic UI)
- **AND** subtask completion is saved to database in background
- **AND** progress bar updates to reflect new completion percentage

#### Scenario: Complete task with subtasks
- **WHEN** user opens completion modal for task with subtasks
- **THEN** all subtasks are listed with checkboxes
- **AND** current completion state is pre-filled from instance
- **AND** progress bar shows completion percentage
- **AND** user can toggle subtask completion before submitting

#### Scenario: Save subtask completion data
- **WHEN** user completes a task
- **THEN** subtask completion data is saved to `subtasks_completed` JSONB field
- **AND** data structure is `{ [subtaskId: string]: boolean }`
- **AND** user can see which subtasks were completed in future views

#### Scenario: Optimistic UI updates
- **WHEN** user toggles subtask checkbox
- **THEN** UI updates immediately without waiting for server
- **AND** server action runs in background
- **AND** UI reverts automatically if server action fails

### Requirement: Subtask Progress Visualization
Users SHALL see visual progress indicators for subtask completion.

#### Scenario: Progress bar in accordion
- **WHEN** user views task with subtasks
- **THEN** progress bar shows percentage completed
- **AND** count shows "X/Y completed" format
- **AND** progress updates when subtasks are toggled

#### Scenario: Progress bar in modal
- **WHEN** user opens completion modal
- **THEN** progress bar shows current completion percentage
- **AND** bar updates live as user toggles subtasks
- **AND** percentage text updates accordingly
