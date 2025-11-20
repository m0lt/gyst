# Implementation Tasks

## 1. Backend Enhancements (Optional)
- [ ] 1.1 Review existing TaskInstance type in `app/actions/calendar.ts`
  - Ensure all needed fields are included (ai_image_url, photo_url, mood, notes, subtasks_completed)
  - No changes needed if fields already exist
- [ ] 1.2 Create `getTaskInstanceDetails` server action if needed
  - Fetch full instance with task, subtasks, category, completion data
  - Return comprehensive instance object for detail view

## 2. Create TaskInstanceDetailModal Component
- [ ] 2.1 Create `components/tasks/task-instance-detail-modal.tsx`
  - Accept TaskInstance prop with all related data
  - Display task title, description, category (with color/icon)
  - Show scheduled date and time in readable format
  - Display priority badge
  - Show estimated vs scheduled duration
- [ ] 2.2 Add AI-generated image display
  - Show task.ai_image_url if available
  - Fallback to placeholder or category color background
  - Proper image sizing and aspect ratio
- [ ] 2.3 Add subtasks section
  - Display list of subtasks with completion status
  - Show progress bar (X of Y completed)
  - Read-only checkboxes showing current state
  - Mark required subtasks with badge
- [ ] 2.4 Add completion information section (if completed)
  - Show completion timestamp
  - Display mood icon and label
  - Show actual time taken vs estimated
  - Display completion photo if available
  - Show completion notes
- [ ] 2.5 Add action buttons section
  - Complete button (primary) - opens CompleteTaskModal
  - Reschedule button (secondary) - opens RescheduleTaskModal
  - Skip button (secondary) - calls skipTaskInstance
  - Edit Task Template button (tertiary/ghost) - opens TaskFormModal
  - Cancel/Close button
- [ ] 2.6 Handle modal states
  - Manage open/close state
  - Handle nested modals (CompleteTaskModal, RescheduleTaskModal)
  - Call onSuccess callback after actions complete
  - Refresh data after successful actions

## 3. Integration - Calendar Day View
- [ ] 3.1 Update `components/calendar/day-view.tsx`
  - Import TaskInstanceDetailModal
  - Change handleTaskClick to open detail modal instead of edit modal
  - Keep TaskFormModal available but not as default
  - Pass full task instance data to detail modal
  - Handle onSuccess to refresh calendar data

## 4. Integration - Calendar Week View
- [ ] 4.1 Update `components/calendar/week-view.tsx`
  - Import TaskInstanceDetailModal
  - Change handleTaskClick to open detail modal instead of edit modal
  - Pass full task instance data to detail modal
  - Handle onSuccess to refresh calendar data

## 5. Integration - Todo List
- [ ] 5.1 Update `components/todo/todo-list.tsx`
  - Import TaskInstanceDetailModal
  - Add click handler to task cards
  - Open detail modal on card click
  - Pass full task instance data to detail modal
  - Handle onSuccess to refresh todo list

## 6. Server Actions for Quick Actions
- [ ] 6.1 Verify/create `skipTaskInstance` in `app/actions/task-instances.ts`
  - Mark instance as skipped
  - Update status and skipped_at timestamp
  - Return success/error response
- [ ] 6.2 Ensure existing actions work with modal
  - completeTaskInstance - already exists
  - rescheduleTaskInstance - already exists

## 7. Internationalization
- [ ] 7.1 Add translation keys to `lib/i18n/locales/en.json`
  - `taskInstance.details`: "Task Details"
  - `taskInstance.scheduledFor`: "Scheduled for"
  - `taskInstance.estimatedTime`: "Estimated time"
  - `taskInstance.scheduledTime`: "Scheduled time"
  - `taskInstance.subtasks`: "Subtasks"
  - `taskInstance.completionInfo`: "Completion Information"
  - `taskInstance.completedAt`: "Completed at"
  - `taskInstance.actualTime`: "Actual time"
  - `taskInstance.mood`: "Mood"
  - `taskInstance.notes`: "Notes"
  - `taskInstance.proofPhoto`: "Proof Photo"
  - `taskInstance.complete`: "Complete Task"
  - `taskInstance.reschedule`: "Reschedule"
  - `taskInstance.skip`: "Skip"
  - `taskInstance.editTemplate`: "Edit Task Template"
  - `taskInstance.skipConfirm`: "Are you sure you want to skip this task?"
- [ ] 7.2 Add German translations to `lib/i18n/locales/de.json`
  - `taskInstance.details`: "Aufgabendetails"
  - `taskInstance.scheduledFor`: "Geplant für"
  - `taskInstance.estimatedTime`: "Geschätzte Zeit"
  - `taskInstance.scheduledTime`: "Eingeplante Zeit"
  - `taskInstance.subtasks`: "Teilaufgaben"
  - `taskInstance.completionInfo`: "Abschlussinformationen"
  - `taskInstance.completedAt`: "Abgeschlossen um"
  - `taskInstance.actualTime`: "Tatsächliche Zeit"
  - `taskInstance.mood`: "Stimmung"
  - `taskInstance.notes`: "Notizen"
  - `taskInstance.proofPhoto`: "Beweisfoto"
  - `taskInstance.complete`: "Aufgabe abschließen"
  - `taskInstance.reschedule`: "Verschieben"
  - `taskInstance.skip`: "Überspringen"
  - `taskInstance.editTemplate`: "Aufgabenvorlage bearbeiten"
  - `taskInstance.skipConfirm`: "Möchtest du diese Aufgabe wirklich überspringen?"

## 8. Styling & UX
- [ ] 8.1 Design modal layout
  - Header with task title and close button
  - Main content area with scrollable sections
  - Fixed footer with action buttons
  - Responsive design for mobile/tablet/desktop
- [ ] 8.2 Add visual hierarchy
  - Use proper spacing between sections
  - Category color accent
  - Icons for sections (calendar, clock, checklist, etc.)
  - Proper typography hierarchy
- [ ] 8.3 Handle different states
  - Pending task (show all action buttons)
  - Completed task (show completion info, hide complete button)
  - Skipped task (show skip info)
  - Loading states for actions

## 9. Testing & Validation
- [ ] 9.1 Test modal display with various task types
  - Task with AI image
  - Task without image
  - Task with subtasks
  - Task without subtasks
  - Completed task
  - Pending task
- [ ] 9.2 Test action buttons
  - Complete button opens CompleteTaskModal
  - Reschedule button opens RescheduleTaskModal
  - Skip button marks as skipped
  - Edit Template button opens TaskFormModal
  - All actions refresh data properly
- [ ] 9.3 Test integrations
  - Calendar day view task clicks
  - Calendar week view task clicks
  - Todo list task clicks
- [ ] 9.4 Test i18n
  - All text appears in English
  - All text appears in German
  - Date/time formatting respects locale
- [ ] 9.5 Test responsive design
  - Mobile view (320px+)
  - Tablet view (768px+)
  - Desktop view (1024px+)
