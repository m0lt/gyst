# Task Management - AI Image Generation

## ADDED Requirements

### Requirement: AI Image Generation
The system SHALL allow users to generate AI-created images for tasks in the Art Nouveau style of Alphonse Mucha.

#### Scenario: Generate image for new task
- **WHEN** user creates a task and clicks "Generate AI Image"
- **THEN** system generates an Art Nouveau style image based on task title and description
- **AND** displays the generated image in the task form
- **AND** saves the image URL to the task record

#### Scenario: Generate image for existing task
- **WHEN** user edits a task and clicks "Generate AI Image"
- **THEN** system generates a new image (or regenerates if one exists)
- **AND** replaces the previous image URL with the new one

#### Scenario: Image generation fails
- **WHEN** AI image generation fails (API error, network issue)
- **THEN** system displays user-friendly error message
- **AND** keeps any existing image unchanged
- **AND** allows user to retry generation

### Requirement: Image Display
The system SHALL display task images in the task list with graceful fallback.

#### Scenario: Display task with AI image
- **WHEN** task has an AI-generated image
- **THEN** display the image as a thumbnail in the task list item
- **AND** allow hover to see larger preview

#### Scenario: Display task without AI image
- **WHEN** task does not have an AI-generated image
- **THEN** display Art Nouveau ornament placeholder
- **AND** maintain consistent visual layout

#### Scenario: Image loading
- **WHEN** task images are being loaded
- **THEN** show placeholder during loading
- **AND** lazy-load images for performance

### Requirement: Image Storage
The system SHALL store generated images in Supabase Storage with proper access control.

#### Scenario: Upload generated image
- **WHEN** AI generates an image
- **THEN** download image from DALL-E URL
- **AND** upload to Supabase Storage bucket "task-images"
- **AND** store public URL in task record

#### Scenario: Access control
- **WHEN** user requests task image
- **THEN** verify user is authenticated
- **AND** allow access to their own task images only

### Requirement: Prompt Engineering
The system SHALL generate consistent Art Nouveau style prompts for DALL-E.

#### Scenario: Create image prompt
- **WHEN** generating image for task
- **THEN** create prompt using task title and description
- **AND** add Mucha Art Nouveau style instructions
- **AND** ensure decorative, elegant, vintage aesthetic
- **AND** store the prompt used for reference

#### Scenario: Prompt template
- **GIVEN** task title "Morning Meditation" and description "10 minutes of mindfulness"
- **THEN** prompt should be: "[Title + Description] in the style of Alphonse Mucha, Art Nouveau, decorative borders, elegant flowing lines, muted vintage colors, ornamental details, 1890s poster art"

### Requirement: User Control
The system SHALL give users full control over AI image generation.

#### Scenario: Optional generation
- **WHEN** creating or editing a task
- **THEN** AI image generation is optional (button-triggered)
- **AND** task can be saved without generating an image

#### Scenario: Regenerate image
- **WHEN** user doesn't like generated image
- **THEN** allow clicking "Generate AI Image" again
- **AND** generate a new image
- **AND** replace the previous one

### Requirement: Internationalization
The system SHALL provide translated UI text for AI image features.

#### Scenario: Display in user's language
- **WHEN** user interacts with AI image generation
- **THEN** all buttons, labels, and messages use translation keys
- **AND** display in user's selected language (English or German)
