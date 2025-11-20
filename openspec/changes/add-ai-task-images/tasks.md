# Implementation Tasks: AI-Generated Task Images

## 1. Database Schema
- [x] 1.1 Add `ai_image_url` column to tasks table (TEXT, nullable)
- [x] 1.2 Add `ai_image_prompt` column to tasks table (TEXT, nullable) - store the prompt used
- [x] 1.3 Add `ai_image_generated_at` column to tasks table (TIMESTAMP, nullable)

## 2. Backend API
- [x] 2.1 Create server action `generateTaskImage(taskId, title, description)`
- [x] 2.2 Integrate OpenAI DALL-E API (check if already configured, or add config)
- [x] 2.3 Create Mucha-style prompt template from task title/description
- [x] 2.4 Handle image download from DALL-E URL
- [x] 2.5 Upload image to Supabase Storage (bucket: task-images)
- [x] 2.6 Update task record with image URL and metadata
- [x] 2.7 Add error handling and user feedback

## 3. UI Components - Task Form Modal
- [x] 3.1 Add "Generate AI Image" button to task-form.tsx
- [x] 3.2 Add loading state during image generation
- [x] 3.3 Show generated image preview in modal
- [x] 3.4 Add option to regenerate image if user doesn't like it
- [x] 3.5 Handle errors gracefully with user-friendly messages

## 4. UI Components - Task List
- [x] 4.1 Add image display to task-list.tsx items
- [x] 4.2 Create Art Nouveau placeholder image/component
- [ ] 4.3 Add lazy loading for task images
- [ ] 4.4 Add hover effect to enlarge image preview
- [x] 4.5 Ensure responsive layout with images

## 5. Assets
- [ ] 5.1 Create/source Art Nouveau ornament placeholder SVG
- [ ] 5.2 Optimize placeholder for performance

## 6. Translation Keys
- [ ] 6.1 Add translation keys for image generation UI
- [ ] 6.2 Update both en.json and de.json

## 7. Storage Configuration
- [ ] 7.1 Create Supabase Storage bucket "task-images"
- [ ] 7.2 Set appropriate access policies (authenticated users)
- [ ] 7.3 Configure image size limits and file types

## 8. Testing
- [ ] 8.1 Test image generation with various task titles
- [ ] 8.2 Test placeholder display for tasks without images
- [ ] 8.3 Test error handling (API failures, storage failures)
- [ ] 8.4 Test image regeneration
- [ ] 8.5 Test responsive layout with images
- [ ] 8.6 Verify i18n works correctly
- [ ] 8.7 Test performance with many tasks with images

## 9. Documentation
- [ ] 9.1 Document OpenAI API key configuration
- [ ] 9.2 Document Supabase Storage bucket setup
- [ ] 9.3 Add user documentation for AI image feature
