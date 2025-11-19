## ADDED Requirements

### Requirement: External Calendar Sync
System SHALL sync with Google Calendar and Microsoft 365.

#### Scenario: Connect Google Calendar
- **WHEN** user authorizes Google Calendar access
- **THEN** events are imported and synced bidirectionally

### Requirement: Availability Calculation
System SHALL calculate optimal task scheduling based on calendar events.

#### Scenario: Suggest task time slots
- **WHEN** AI suggests task scheduling
- **THEN** calendar blockers are considered to find free slots
