-- Add language field to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

COMMENT ON COLUMN profiles.language IS 'User preferred language (en, de, etc.)';
