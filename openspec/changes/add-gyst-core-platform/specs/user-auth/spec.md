## MODIFIED Requirements

### Requirement: User Registration
System SHALL extend Supabase authentication with onboarding flow.

#### Scenario: New user completes onboarding
- **WHEN** user registers and completes onboarding questions
- **THEN** profile record is created with onboarding_completed = true
- **AND** AI suggestions are generated based on answers

### Requirement: User Profile Management
Users SHALL manage extended profile information.

#### Scenario: Update profile preferences
- **WHEN** user updates timezone or language
- **THEN** profile is updated and UI reflects changes immediately
