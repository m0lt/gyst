## ADDED Requirements

### Requirement: User Preferences
Users SHALL configure notification, theme, and language preferences.

#### Scenario: Update notification preferences
- **WHEN** user adjusts notification settings per category
- **THEN** preferences are saved and applied to future notifications

### Requirement: Data Export
Users SHALL export their data.

#### Scenario: Export user data as JSON
- **WHEN** user requests data export
- **THEN** all tasks, completions, and settings are downloaded as JSON
