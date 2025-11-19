## ADDED Requirements

### Requirement: Task Creation
Users SHALL be able to create tasks with comprehensive scheduling options.

#### Scenario: Create simple daily task
- **WHEN** user clicks "Add Task" and enters title "Water plants"
- **AND** selects category "Household" and frequency "Daily"
- **THEN** task is created with default values (start date today, recurring)
- **AND** task appears in dashboard task list

#### Scenario: Create task with subtasks
- **WHEN** user creates task "Weekly cleaning" with frequency "Weekly"
- **AND** adds subtasks: "Vacuum", "Dust", "Mop floors"
- **THEN** task is created with has_subtasks = true
- **AND** all subtasks are stored with sort_order
- **AND** task shows "3 subtasks" in dashboard

#### Scenario: Create custom frequency task
- **WHEN** user creates task "Change bed sheets" with frequency "Custom"
- **AND** sets custom_frequency_days to 14
- **THEN** task recurs every 14 days from start_date
- **AND** next occurrence is calculated correctly

#### Scenario: Create task with photo proof requirement
- **WHEN** user creates task "Gym workout" and enables "Require photo proof"
- **THEN** task.requires_photo_proof is set to true
- **AND** completion flow will mandate photo upload

---

### Requirement: Task Editing
Users SHALL be able to edit existing tasks while preserving completion history.

#### Scenario: Edit task title and description
- **WHEN** user edits task title from "Morning jog" to "Morning run"
- **AND** adds description "30 minutes cardio"
- **THEN** task is updated with new values
- **AND** completion history remains intact
- **AND** updated_at timestamp is refreshed

#### Scenario: Change task frequency
- **WHEN** user changes task frequency from "Daily" to "Weekly"
- **AND** selects preferred day of week (e.g., Monday)
- **THEN** recurrence_pattern is updated
- **AND** current_streak is recalculated based on new frequency
- **AND** user sees notification about streak adjustment

#### Scenario: Move task occurrence
- **WHEN** user has task due today but wants to postpone to tomorrow
- **AND** selects "Move this occurrence only"
- **THEN** a new task_completion record is NOT created
- **AND** next due_date is calculated as tomorrow
- **AND** streak is preserved (counts as "used break" if applicable)

---

### Requirement: Task Deletion
Users SHALL be able to delete tasks with soft-delete behavior.

#### Scenario: Soft delete active task
- **WHEN** user clicks "Delete" on task "Daily meditation"
- **AND** confirms deletion
- **THEN** task.deleted_at is set to NOW()
- **AND** task.is_active is set to false
- **AND** task no longer appears in active task list
- **AND** completion history is preserved for statistics

#### Scenario: Permanently delete archived task
- **WHEN** admin user views deleted tasks
- **AND** clicks "Permanently delete" on task deleted > 30 days ago
- **THEN** task record and all associated data is removed from database
- **AND** completion statistics are recalculated

---

### Requirement: Task Filtering
Users SHALL be able to filter tasks by multiple criteria.

#### Scenario: Filter by category
- **WHEN** user selects "Health" category filter
- **THEN** only tasks with category_id matching "Health" are displayed
- **AND** count shows "X tasks" in category

#### Scenario: Filter by frequency
- **WHEN** user filters by "Daily" frequency
- **THEN** only daily recurring tasks are shown
- **AND** filter persists across page reloads (stored in local state)

#### Scenario: Filter by active status
- **WHEN** user toggles "Show archived tasks"
- **THEN** tasks with is_active = false are included in results
- **AND** archived tasks are visually differentiated (e.g., grayed out)

---

### Requirement: Task Search
Users SHALL be able to search tasks by title and description.

#### Scenario: Search by task title
- **WHEN** user types "plant" in search box
- **THEN** tasks with "plant" in title are shown (case-insensitive)
- **AND** matching text is highlighted
- **AND** search is instant (no submit button needed)

#### Scenario: Search with no results
- **WHEN** user searches for "xyz123"
- **AND** no tasks match
- **THEN** empty state is shown with "No tasks found"
- **AND** user sees option to "Create task" with pre-filled title

---

### Requirement: Task Bulk Actions
Users SHALL be able to perform actions on multiple tasks simultaneously.

#### Scenario: Bulk archive tasks
- **WHEN** user selects 5 tasks via checkboxes
- **AND** clicks "Archive selected"
- **THEN** all selected tasks are set to is_active = false
- **AND** user sees success toast "5 tasks archived"

#### Scenario: Bulk category change
- **WHEN** user selects 3 tasks currently in "Misc" category
- **AND** chooses "Change category to Health"
- **THEN** all selected tasks have category_id updated
- **AND** tasks appear under new category in dashboard

---

### Requirement: Task Time Estimation
Users SHALL provide estimated duration and track actual time spent.

#### Scenario: Set initial time estimate
- **WHEN** user creates task "Meal prep" with estimated_minutes = 60
- **THEN** task shows "~1 hour" in task card
- **AND** calendar integration uses this for scheduling

#### Scenario: Update estimate based on actual data
- **WHEN** task has 5 completions with actual_minutes [45, 50, 55, 48, 52]
- **THEN** actual_minutes_avg is calculated as 50
- **AND** task card shows "Estimated: 1h, Avg actual: 50 min"
- **AND** user sees suggestion to update estimate

#### Scenario: No time estimate provided
- **WHEN** user creates task without estimated_minutes
- **THEN** field is NULL
- **AND** calendar scheduling uses default buffer (e.g., 30 min)
- **AND** user sees prompt to add estimate after first completion

---

### Requirement: Task Validation
System SHALL validate task data to ensure consistency.

#### Scenario: Title is required
- **WHEN** user tries to save task with empty title
- **THEN** validation error is shown: "Title is required"
- **AND** form does not submit
- **AND** title field is highlighted in error state

#### Scenario: Custom frequency requires days value
- **WHEN** user selects frequency "Custom" but leaves custom_frequency_days empty
- **THEN** validation error is shown: "Please specify number of days"
- **AND** default value of 7 days is suggested

#### Scenario: Start date cannot be in future if recurring
- **WHEN** user sets start_date to tomorrow for recurring task
- **THEN** warning is shown: "Task will not appear until start date"
- **AND** user can proceed or adjust date

---

### Requirement: Task Permissions
System SHALL enforce user ownership of tasks via RLS.

#### Scenario: User can only view own tasks
- **WHEN** user A requests GET /api/tasks
- **THEN** only tasks with user_id = A's ID are returned
- **AND** user B's tasks are not visible

#### Scenario: User cannot edit another user's task
- **WHEN** user A tries to PATCH /api/tasks/:id for user B's task
- **THEN** 403 Forbidden error is returned
- **AND** no changes are persisted

#### Scenario: Admin can view all tasks
- **WHEN** admin user requests GET /api/tasks with admin=true flag
- **THEN** tasks from all users are returned (for admin dashboard)
- **AND** user information is included in response
