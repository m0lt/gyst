## ADDED Requirements

### Requirement: Streak Calculation
System SHALL accurately calculate and maintain streak counts based on task completion history.

#### Scenario: Calculate daily task streak
- **WHEN** user completes daily task "Morning pages" for 5 consecutive days
- **THEN** current_streak is incremented to 5
- **AND** longest_streak is updated to 5 (if not already higher)
- **AND** streak is recalculated after each completion

#### Scenario: Streak breaks on missed day
- **WHEN** user has 10-day streak on daily task
- **AND** misses completion yesterday
- **THEN** current_streak resets to 0
- **AND** longest_streak remains 10
- **AND** user sees notification: "Streak broken. Start fresh today!"

#### Scenario: Weekly task streak calculation
- **WHEN** user completes weekly task "Meal prep" on designated day (Sunday) for 4 weeks
- **THEN** current_streak is 4 weeks
- **AND** missing one Sunday breaks streak
- **AND** completing on different day of week does not count for streak

#### Scenario: Custom frequency streak
- **WHEN** user has task with 14-day frequency
- **AND** completes it every 14 days (±1 day grace period)
- **THEN** streak increments correctly
- **AND** grace period allows flexibility without breaking streak

---

### Requirement: Break Credits System
Users SHALL earn and use break credits to preserve streaks when life circumstances prevent completion.

#### Scenario: Earn break credit at milestone
- **WHEN** user reaches 7-day streak milestone
- **THEN** 1 break credit is awarded
- **AND** user sees celebration: "7 days! Earned 1 break credit"
- **AND** earned_breaks count increments

#### Scenario: Use break credit to preserve streak
- **WHEN** user is about to break 15-day streak by missing today
- **AND** has 2 available break credits
- **AND** chooses "Use break" option
- **THEN** used_breaks increments to 1
- **AND** available_breaks decrements to 1
- **AND** current_streak remains 15
- **AND** completion history shows "Break used" for that day

#### Scenario: No break credits available
- **WHEN** user misses task and has 0 available_breaks
- **THEN** "Use break" option is disabled/grayed out
- **AND** streak breaks normally
- **AND** user sees message: "No breaks available. Complete tasks to earn more!"

#### Scenario: Break credit milestones
- **WHEN** user reaches streak milestones
- **THEN** break credits are awarded as follows:
  - 7 days: 1 credit
  - 30 days: 2 credits
  - 100 days: 5 credits
  - 365 days: 10 credits

---

### Requirement: Visual Streak Display
Users SHALL see engaging visual representations of their streaks.

#### Scenario: Streak flame indicator
- **WHEN** user has active streak ≥ 3 days
- **THEN** flame emoji or icon is shown: "🔥 5 day streak"
- **AND** flame intensity/color increases with streak length
  - 3-6 days: small flame, yellow
  - 7-29 days: medium flame, orange
  - 30-99 days: large flame, red
  - 100+ days: multi-color flame, animated

#### Scenario: Circular progress ring
- **WHEN** user views task card with streak
- **THEN** circular ring visualizes streak progress to next milestone
- **AND** ring fills as streak grows (e.g., 15/30 days = 50% filled)
- **AND** ring completes at milestone with celebration animation

#### Scenario: Streak calendar heatmap
- **WHEN** user views task detail page
- **THEN** calendar heatmap shows completion pattern (like GitHub contributions)
- **AND** each day is colored based on completion: green (done), gray (not due), red (missed)
- **AND** hovering over day shows details: "Completed in 45 min"

---

### Requirement: Streak Milestones
System SHALL recognize and celebrate streak achievements.

#### Scenario: Reach 7-day milestone
- **WHEN** user completes task for 7th consecutive day
- **THEN** confetti animation plays on screen
- **AND** modal appears: "Amazing! 7 day streak unlocked 🎉"
- **AND** break credit is awarded
- **AND** achievement is logged for statistics

#### Scenario: Reach 30-day milestone
- **WHEN** user achieves 30-day streak
- **THEN** special badge is displayed on task card
- **AND** email/push notification sent: "You did it! 30 days strong!"
- **AND** 2 break credits awarded
- **AND** user can share achievement on social media (future)

#### Scenario: Milestone notification
- **WHEN** user is 1 day away from milestone
- **THEN** notification is sent: "Tomorrow you'll reach 30 days! Don't break the chain"
- **AND** dashboard highlights task with special indicator
- **AND** motivational quote is displayed

---

### Requirement: Streak Recovery
Users SHALL have options to recover from broken streaks under certain conditions.

#### Scenario: Same-day late completion
- **WHEN** user missed task "yesterday" (< 24 hours ago)
- **AND** completes it now (backdated)
- **THEN** option to "Complete for yesterday" is shown
- **AND** if selected, streak is retroactively preserved
- **AND** completion_at is set to yesterday

#### Scenario: Vacation mode
- **WHEN** user activates "Vacation mode" for date range
- **THEN** tasks in that range are marked as "excused"
- **AND** streaks are not broken during vacation
- **AND** vacation days don't count toward streak (frozen)
- **AND** user must activate before vacation starts (no retroactive)

---

### Requirement: Competitive Streak Leaderboard (Future)
System SHALL support comparing streaks with friends for motivation.

#### Scenario: View personal leaderboard
- **WHEN** user views "My Streaks" page
- **THEN** all tasks with streaks are ranked by current_streak descending
- **AND** top 3 streaks are highlighted with medals (🥇🥈🥉)
- **AND** user sees total active streaks count

---

### Requirement: Streak Statistics
Users SHALL access detailed streak analytics.

#### Scenario: View streak history
- **WHEN** user clicks on task with streak
- **THEN** detail modal shows:
  - Current streak: X days
  - Longest streak: Y days
  - Total completions: Z
  - Completion rate: N%
  - Break credits: A earned, B used, C available
- **AND** historical chart shows streak over time

#### Scenario: Category streak summary
- **WHEN** user views category "Health"
- **THEN** average streak across all Health tasks is calculated
- **AND** best performing task is highlighted
- **AND** total milestones reached in category is shown

---

### Requirement: Streak Persistence
Streak data SHALL be accurately persisted and resilient to data issues.

#### Scenario: Streak survives task edit
- **WHEN** user edits task title or description
- **THEN** streak data remains unchanged
- **AND** completion history is preserved

#### Scenario: Streak recalculation on frequency change
- **WHEN** user changes task from daily to weekly
- **THEN** current_streak is recalculated based on new frequency
- **AND** user sees warning: "Changing frequency will recalculate your streak"
- **AND** option to cancel is provided

#### Scenario: Manual streak recalculation
- **WHEN** admin triggers streak recalculation for user
- **THEN** calculate_task_streak() function runs for all tasks
- **AND** streaks table is updated with fresh data
- **AND** discrepancies are logged for review
