## ADDED Requirements

### Requirement: Email Notifications
System SHALL send task reminders via email using Resend.

#### Scenario: Send task reminder email
- **WHEN** task due time approaches
- **THEN** email is sent with progressive tone based on preferences

### Requirement: Web Push Notifications
System SHALL send browser push notifications.

#### Scenario: Subscribe to push notifications
- **WHEN** user grants browser permission
- **THEN** push subscription is stored and notifications are sent
