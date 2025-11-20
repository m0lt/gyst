# Implementation Tasks

## 1. Backend Implementation
- [x] 1.1 Create `getPausedTasks` server action in `app/actions/tasks.ts`
  - Query tasks with `is_active = false` for user
  - Include category and scheduling information
  - Order by `updated_at` DESC (most recently paused first)

## 2. Frontend Components
- [x] 2.1 Create `PausedTasksCard` component in `components/tasks/paused-tasks-card.tsx`
  - Display paused tasks in a card/section
  - Show task title, description, category
  - Include "Resume" button for each task
  - Show empty state when no paused tasks
  - Use muted/desaturated colors to distinguish from active tasks
- [x] 2.2 Integrate into tasks page at `app/protected/tasks/page.tsx`
  - Fetch paused tasks in server component
  - Pass data to PausedTasksCard component
  - Position below active tasks list

## 3. Internationalization
- [x] 3.1 Add translation keys to `lib/i18n/locales/en.json`
  - `tasks.paused.title`: "Paused Tasks"
  - `tasks.paused.empty`: "No paused tasks"
  - `tasks.paused.resume`: "Resume"
  - `tasks.paused.count`: "{{count}} paused task(s)"
- [x] 3.2 Add German translations to `lib/i18n/locales/de.json`
  - `tasks.paused.title`: "Pausierte Aufgaben"
  - `tasks.paused.empty`: "Keine pausierten Aufgaben"
  - `tasks.paused.resume`: "Fortsetzen"
  - `tasks.paused.count`: "{{count}} pausierte Aufgabe(n)"

## 4. Testing & Validation
- [x] 4.1 Test paused tasks display correctly
- [x] 4.2 Test resume functionality works
- [x] 4.3 Test empty state displays
- [x] 4.4 Test i18n works for both EN and DE
- [x] 4.5 Verify styling matches Art Nouveau theme
