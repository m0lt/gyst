# Task Management - Delta Specification

## ADDED Requirements

### Requirement: Subtask Definition on Task Templates
Task templates SHALL support defining subtasks that can be tracked during task execution.

#### Scenario: View task subtasks
- **WHEN** task template includes subtasks
- **THEN** subtasks are stored in `task_subtasks` table
- **AND** each subtask has id, title, is_required flag, and sort_order
- **AND** subtasks are ordered by sort_order when displayed

#### Scenario: Subtask metadata
- **WHEN** viewing task subtasks
- **THEN** each subtask can be marked as required or optional
- **AND** required subtasks are visually distinguished with badge
- **AND** subtasks maintain sort order for consistent display
