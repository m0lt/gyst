## ADDED Requirements

### Requirement: Dashboard Overview
Users SHALL see a comprehensive overview of all active tasks and current progress.

#### Scenario: View dashboard with active tasks
- **WHEN** user navigates to /dashboard
- **THEN** all active tasks are displayed grouped by category
- **AND** each task shows: title, frequency, next due date, current streak
- **AND** tasks due today are highlighted
- **AND** page loads in < 2 seconds

#### Scenario: Empty dashboard for new user
- **WHEN** new user with no tasks views dashboard
- **THEN** welcome message is shown: "Welcome to Gyst! Let's get organized"
- **AND** prominent "Add your first task" button is displayed
- **AND** optional AI suggestion prompt: "Let AI suggest tasks for you"

#### Scenario: Dashboard shows overdue tasks
- **WHEN** user has 3 tasks with due_date in the past
- **THEN** overdue section is shown at top with red indicator
- **AND** tasks are sorted by how overdue (oldest first)
- **AND** quick action "Complete now" is available

---

### Requirement: Task Grouping
Tasks SHALL be grouped and organized for easy scanning.

#### Scenario: Group by category
- **WHEN** user views dashboard
- **THEN** tasks are grouped under category headings (Health, Household, etc.)
- **AND** each category shows task count (e.g., "Health (5)")
- **AND** categories can be collapsed/expanded
- **AND** expansion state persists in localStorage

#### Scenario: Group by due date
- **WHEN** user toggles "Group by due date" view
- **THEN** tasks are reorganized into: Today, Tomorrow, This Week, Later
- **AND** each group is collapsible
- **AND** overdue tasks appear in separate group at top

#### Scenario: Custom sort order
- **WHEN** user drags task "Morning routine" above "Evening routine"
- **THEN** task.sort_order is updated
- **AND** new order persists on page reload
- **AND** sort order is per-category

---

### Requirement: Quick Actions
Users SHALL perform common task actions directly from dashboard.

#### Scenario: Quick complete task
- **WHEN** user clicks checkmark icon on task "Drink water"
- **THEN** task completion modal appears
- **AND** user can add quick note or skip to complete
- **AND** task is marked complete with completion_at = NOW()
- **AND** streak is updated immediately

#### Scenario: Snooze task to later today
- **WHEN** user clicks "Snooze" on task due now
- **AND** selects "2 hours" from preset options
- **THEN** task due_date is updated to 2 hours from now
- **AND** task moves to "Later today" group
- **AND** notification is rescheduled

#### Scenario: Skip task occurrence
- **WHEN** user clicks "Skip once" on task "Gym workout"
- **THEN** task is marked as skipped (uses 1 break credit if available)
- **AND** next occurrence is calculated
- **AND** streak is preserved
- **AND** skip is recorded in completion history

---

### Requirement: Progress Indicators
Users SHALL see visual progress feedback for motivation.

#### Scenario: Category completion rings
- **WHEN** user has completed 3 out of 5 tasks in "Health" category today
- **THEN** circular progress ring shows 60% completion
- **AND** ring color matches category theme color
- **AND** animation fills ring smoothly when task completed

#### Scenario: Overall daily progress
- **WHEN** user has 10 tasks due today and completes 7
- **THEN** dashboard header shows "7/10 complete (70%)"
- **AND** progress bar is visually prominent
- **AND** celebration animation plays at 100%

#### Scenario: Streak visualization
- **WHEN** user has task with 15-day current streak
- **THEN** flame icon or chain icon is shown
- **AND** streak count is displayed: "15 day streak 🔥"
- **AND** next milestone is indicated (e.g., "5 days until 20-day badge")

---

### Requirement: Filtering and Views
Users SHALL switch between different dashboard views.

#### Scenario: View only today's tasks
- **WHEN** user activates "Today" filter
- **THEN** only tasks with due_date = today are shown
- **AND** count updates: "5 tasks due today"
- **AND** filter persists in URL query parameter

#### Scenario: View upcoming tasks (next 7 days)
- **WHEN** user switches to "Upcoming" view
- **THEN** tasks due within next 7 days are shown
- **AND** grouped by date (Tomorrow, Wednesday, Thursday, etc.)
- **AND** tasks not due are hidden

#### Scenario: Focus mode (single category)
- **WHEN** user clicks "Focus on Health"
- **THEN** only Health category tasks are shown
- **AND** other categories are hidden (not just collapsed)
- **AND** exit focus mode button is prominently displayed

---

### Requirement: Dashboard Statistics Summary
Users SHALL see high-level statistics at a glance.

#### Scenario: Daily completion rate
- **WHEN** user views dashboard header
- **THEN** today's completion percentage is shown
- **AND** comparison to yesterday is indicated (e.g., "+10% vs yesterday")
- **AND** color codes: green (good), yellow (okay), red (poor)

#### Scenario: Weekly streak summary
- **WHEN** user has 3 active streaks running
- **THEN** dashboard shows "🔥 3 streaks active"
- **AND** clicking expands to show which tasks
- **AND** longest current streak is highlighted

#### Scenario: Upcoming milestones
- **WHEN** user is 2 days away from 30-day milestone
- **THEN** milestone card is shown: "2 days until 30-day streak!"
- **AND** progress bar shows days remaining
- **AND** clicking navigates to streak detail page

---

### Requirement: Responsive Layout
Dashboard SHALL adapt to different screen sizes seamlessly.

#### Scenario: Mobile dashboard view
- **WHEN** user views dashboard on mobile (< 768px width)
- **THEN** tasks are displayed in single column
- **AND** category headers are sticky on scroll
- **AND** quick actions are swipe gestures (swipe right = complete)
- **AND** all features are touch-friendly (min 44px tap targets)

#### Scenario: Desktop dashboard view
- **WHEN** user views dashboard on desktop (> 1024px width)
- **THEN** tasks are displayed in 2-3 column grid
- **AND** sidebar shows statistics summary
- **AND** hover states reveal quick actions
- **AND** keyboard shortcuts are enabled (e.g., "n" for new task)

#### Scenario: Tablet landscape view
- **WHEN** user views dashboard on tablet in landscape
- **THEN** 2-column layout is used
- **AND** calendar widget is shown in right sidebar
- **AND** touch and keyboard inputs both work

---

### Requirement: Real-time Updates
Dashboard SHALL update automatically when data changes.

#### Scenario: Task completed updates UI
- **WHEN** user completes task via quick action
- **THEN** task moves to "Completed" section without page reload
- **AND** completion ring animates to new percentage
- **AND** streak count updates immediately
- **AND** Confetti animation plays if milestone reached

#### Scenario: New task appears immediately
- **WHEN** user creates task in modal/drawer
- **AND** saves it
- **THEN** task appears in appropriate category group
- **AND** dashboard re-sorts to accommodate new task
- **AND** scroll position adjusts to show new task

---

### Requirement: Dashboard Customization
Users SHALL personalize their dashboard layout.

#### Scenario: Toggle dark mode
- **WHEN** user clicks theme toggle in dashboard header
- **THEN** dark mode is applied immediately
- **AND** preference is saved to profile.prefers_dark_mode
- **AND** all components respect dark mode colors

#### Scenario: Change theme palette
- **WHEN** user selects "Mucha Emerald" theme from theme selector
- **THEN** Art Nouveau color palette updates
- **AND** all category colors, progress rings, buttons update
- **AND** theme preference is persisted to profile.current_theme

#### Scenario: Rearrange dashboard widgets
- **WHEN** user drags "Statistics" widget above "Categories"
- **THEN** widget order is saved to user preferences
- **AND** order persists on reload
- **AND** reset to default option is available

---

### Requirement: Dashboard Performance
Dashboard SHALL load and update performantly.

#### Scenario: Fast initial load
- **WHEN** user navigates to /dashboard
- **THEN** page renders initial HTML in < 500ms (SSR)
- **AND** interactive elements are ready in < 2s
- **AND** images/icons lazy load as user scrolls

#### Scenario: Efficient updates
- **WHEN** user completes 1 task out of 50 total
- **THEN** only affected task card re-renders
- **AND** progress indicators update via CSS transition
- **AND** no full page re-render occurs

#### Scenario: Smooth animations
- **WHEN** user interacts with dashboard elements
- **THEN** all animations run at 60fps
- **AND** no janky scrolling or layout shifts
- **AND** animations respect prefers-reduced-motion
