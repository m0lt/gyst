# Change: Add AI-Generated Task Images

## Why
Users want visual representation of their tasks in the Art Nouveau style of Alphonse Mucha to enhance the aesthetic experience and make tasks more engaging and memorable.

## What Changes
- Add optional AI image generation for tasks using OpenAI DALL-E
- Add "Generate AI Image" button in task creation/editing modal
- Store generated image URL in tasks table
- Display generated images in task list with Art Nouveau placeholder fallback
- Generate images based on task title and description in Mucha's Art Nouveau style

## Impact
- Affected specs: task-management
- Affected code:
  - Database: Add `ai_image_url` column to tasks table
  - Backend: New server action `generateTaskImage`
  - UI: Update task-form modal with image generation button
  - UI: Update task-list to display images/placeholders
  - Assets: Add Art Nouveau placeholder image
- API costs: OpenAI DALL-E API calls (user-initiated, optional)

## Benefits
- Enhanced visual appeal matching app's Art Nouveau theme
- More engaging task management experience
- Memorable visual associations with tasks
- User control over when images are generated (cost-effective)
