-- Migration: Add AI Task Images
-- Date: 2025-11-19
-- Description: Add columns for AI-generated task images

-- ============================================================================
-- ALTER TASKS TABLE
-- ============================================================================

-- Add AI image URL column
ALTER TABLE tasks
  ADD COLUMN ai_image_url TEXT;

-- Add AI image prompt column (for reference/debugging)
ALTER TABLE tasks
  ADD COLUMN ai_image_prompt TEXT;

-- Add AI image generation timestamp
ALTER TABLE tasks
  ADD COLUMN ai_image_generated_at TIMESTAMPTZ;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN tasks.ai_image_url IS 'URL to AI-generated Art Nouveau style image stored in Supabase Storage';
COMMENT ON COLUMN tasks.ai_image_prompt IS 'DALL-E prompt used to generate the image';
COMMENT ON COLUMN tasks.ai_image_generated_at IS 'Timestamp when the AI image was generated';
