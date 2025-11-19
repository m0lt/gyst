# Implementation Tasks: Enhanced Task Scheduling

## 1. Database Schema Updates
- [ ] 1.1 Create migration file for task scheduling enhancements
- [ ] 1.2 Add `priority` enum type (low, medium, high)
- [ ] 1.3 Add `priority` column to tasks table (default: medium)
- [ ] 1.4 Add `scheduled_duration` column (integer, minutes)
- [ ] 1.5 Add `tags` column (text array, default: empty array)
- [ ] 1.6 Add `reminder_minutes_before` column (integer, nullable)
- [ ] 1.7 Add database indexes for priority and tags
- [ ] 1.8 Test migration locally

## 2. Type Definitions
- [ ] 2.1 Regenerate `database.types.ts` with new schema
- [ ] 2.2 Create TypeScript type for `RecurrencePattern` interface
- [ ] 2.3 Create TypeScript enum for `TaskPriority`
- [ ] 2.4 Update Task type interfaces in codebase

## 3. Backend API Updates
- [ ] 3.1 Update `app/actions/tasks.ts` - createTask to include new fields
- [ ] 3.2 Update `app/actions/tasks.ts` - updateTask to include new fields
- [ ] 3.3 Add validation for priority values
- [ ] 3.4 Add validation for scheduled_duration (> 0)
- [ ] 3.5 Add validation for reminder_minutes_before (>= 0)
- [ ] 3.6 Add validation for recurrence_pattern JSON structure

## 4. Translation Keys
- [ ] 4.1 Add task scheduling keys to `lib/i18n/locales/en.json`:
  - tasks.scheduling.* (title, time, duration, priority, tags, etc.)
  - tasks.priority.* (low, medium, high labels)
  - tasks.recurrence.* (enhanced options)
  - tasks.reminder.* (reminder settings)
  - tasks.modal.* (modal-specific texts)
- [ ] 4.2 Add German translations to `lib/i18n/locales/de.json`

## 5. UI Components - Task Form Modal
- [ ] 5.1 Create `components/tasks/task-form-modal.tsx` (dialog wrapper)
- [ ] 5.2 Create `components/tasks/task-form.tsx` (form component)
- [ ] 5.3 Add time picker component for preferred_time
- [ ] 5.4 Add duration input (number input with minutes)
- [ ] 5.5 Add priority selector (radio buttons or dropdown)
- [ ] 5.6 Add tags input with autocomplete (suggest existing tags)
- [ ] 5.7 Add reminder settings (dropdown with common options)
- [ ] 5.8 Add enhanced recurrence options:
  - Daily: Every day / Weekdays only / Custom interval
  - Weekly: Select specific days (checkboxes)
  - Monthly: Select specific days of month
  - Custom: Every N days/weeks
- [ ] 5.9 Add form validation for all new fields
- [ ] 5.10 Ensure all text uses i18n translation keys

## 6. UI Updates - Tasks Page
- [ ] 6.1 Update `app/protected/tasks/page.tsx`:
  - Remove inline task creation form
  - Add "New Task" button (top right or floating action button)
  - Integrate TaskFormModal
- [ ] 6.2 Update `components/tasks/task-list.tsx`:
  - Display priority badge/icon
  - Display scheduled time if set
  - Display duration if set
  - Display tags as badges
  - Show reminder icon if reminder is set
- [ ] 6.3 Add filter options for priority
- [ ] 6.4 Add filter options for tags
- [ ] 6.5 Ensure all text uses i18n translation keys

## 7. Testing
- [ ] 7.1 Test task creation with all new fields
- [ ] 7.2 Test task update with scheduling fields
- [ ] 7.3 Test recurrence pattern variations
- [ ] 7.4 Test tag autocomplete functionality
- [ ] 7.5 Test priority filtering
- [ ] 7.6 Test tag filtering
- [ ] 7.7 Test form validation
- [ ] 7.8 Test i18n (switch between English and German)
- [ ] 7.9 Test mobile responsiveness of modal
- [ ] 7.10 Test accessibility (keyboard navigation, screen readers)

## 8. Documentation
- [ ] 8.1 Update component documentation
- [ ] 8.2 Add comments for recurrence_pattern JSON structure
- [ ] 8.3 Document reminder_minutes_before expected values
