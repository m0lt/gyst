# Task Completion - Delta Specification

## ADDED Requirements

### Requirement: Task Instance Reactivation
Users SHALL be able to reactivate completed tasks back to pending status.

#### Scenario: Reactivate completed task
- **WHEN** user clicks reactivate button on a completed task instance
- **THEN** task status is changed from "completed" to "pending"
- **AND** completed_at timestamp is cleared
- **AND** task appears in pending tasks list

#### Scenario: Preserve completion history
- **WHEN** user reactivates a task that was previously completed
- **THEN** completion history is preserved (mood, photo, notes, actual_minutes, subtasks_completed)
- **AND** user can see previous completion data if they complete the task again

#### Scenario: Reactivation confirmation
- **WHEN** user clicks reactivate button
- **THEN** confirmation dialog is displayed with task title
- **AND** user can confirm or cancel the reactivation

#### Scenario: Reactivation error handling
- **WHEN** reactivation fails due to server error or network issue
- **THEN** error notification is displayed to user
- **AND** task remains in completed status
