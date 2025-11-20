# Proposal: Add Task Instance Detail Modal

## Problem Statement

Currently, when users click on a task in the calendar or todo list, they immediately see the task edit modal (TaskFormModal), which is designed for editing the recurring task template. This is problematic because:

1. **Wrong Context**: Users clicking on a task instance want to see details about that specific instance (date, time, completion status), not edit the recurring template
2. **Missing Information**: There's no way to view important instance-specific data like AI-generated images, scheduled time, subtasks status, or completion history
3. **Action Confusion**: Quick actions like "reschedule this instance" or "skip this instance" require opening separate modals

## Proposed Solution

Create a new **TaskInstanceDetailModal** component that serves as a comprehensive view for a specific task instance. This modal will:

1. **Display Instance Information**:
   - Task title and description
   - Scheduled date and time
   - Category with color/icon
   - Priority level
   - Estimated vs scheduled duration
   - AI-generated task image (if available)
   - Completion photo (if completed)
   - Subtasks with completion status
   - Completion notes and mood (if completed)

2. **Provide Quick Actions**:
   - Complete button (opens CompleteTaskModal)
   - Reschedule button (opens RescheduleTaskModal)
   - Skip button (marks instance as skipped)
   - Edit Task Template button (opens TaskFormModal for the underlying task)

3. **Integration Points**:
   - Replace current click behavior in calendar day-view
   - Replace current click behavior in calendar week-view
   - Use in todo list when clicking task cards

## Success Criteria

- Users can view all relevant information about a task instance in one place
- Quick actions (complete, reschedule, skip) are accessible without closing the modal
- The modal is visually distinct from the edit modal
- Performance: Modal loads instance data efficiently
- i18n: All text is translatable (EN/DE support)

## Impact

- **User Experience**: Significantly improved - users get contextual information about the specific instance they clicked
- **Developer Experience**: Clear separation of concerns between instance details and template editing
- **Performance**: Minimal - just a new component with existing data
- **Code Complexity**: Low - reuses existing server actions and UI components

## Alternatives Considered

1. **Expand existing modals**: Would create confusion and bloat existing components
2. **Inline details in calendar**: Not enough space, especially in week view
3. **Separate detail page**: Breaks user flow, requires navigation away from calendar/todo

## Dependencies

- Existing server actions for task instances (no new actions needed)
- Existing UI components (Dialog, Button, Badge, etc.)
- Existing modals (CompleteTaskModal, RescheduleTaskModal) for actions

## Timeline

- Backend: None required (using existing data structures)
- Frontend: 1 component + integration in 3 views (day-view, week-view, todo-list)
- i18n: New translation keys
- Testing: Manual testing in calendar and todo views
