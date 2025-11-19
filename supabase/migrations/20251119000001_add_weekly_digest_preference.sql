-- Add weekly_digest_enabled field to notification_preferences
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN notification_preferences.weekly_digest_enabled IS 'Whether user wants to receive weekly digest emails';
