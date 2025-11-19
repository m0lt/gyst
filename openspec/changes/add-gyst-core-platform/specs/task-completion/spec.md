## ADDED Requirements

### Requirement: Photo Proof Upload
Users SHALL upload photos as completion proof for tasks.

#### Scenario: Complete task with photo
- **WHEN** user completes task requiring photo and uploads image
- **THEN** photo is stored in Supabase Storage and linked to completion

### Requirement: Time Tracking
Users SHALL record actual time spent on tasks.

#### Scenario: Log actual time
- **WHEN** user completes task and logs 45 minutes
- **THEN** actual_minutes is stored and average is recalculated
