# Database Setup Instructions

## Problem

Die direkte Datenbankverbindung (Port 5432) ist blockiert, daher müssen die Migrationen manuell über die **Supabase Dashboard SQL Editor** ausgeführt werden.

## 🎯 Migrationen ausführen (Manuell)

### 1. Öffne den Supabase SQL Editor

Gehe zu: https://supabase.com/dashboard/project/fjfswufsvfdrrotvmajv/sql

### 2. Führe die folgenden Migrationen aus

Kopiere jede SQL-Datei und führe sie im SQL Editor aus:

---

#### **Migration 1: Add weekly_digest_enabled**

```sql
-- File: 20251119000001_add_weekly_digest_preference.sql

-- Add weekly_digest_enabled field to notification_preferences
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN notification_preferences.weekly_digest_enabled IS 'Whether user wants to receive weekly digest emails';
```

---

#### **Migration 2: Add language field**

```sql
-- File: 20251119000002_add_profile_language.sql

-- Add language field to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

COMMENT ON COLUMN profiles.language IS 'User preferred language (en, de, etc.)';
```

---

#### **Migration 3: Storage Policies**

```sql
-- File: 20251119000003_storage_policies.sql

-- Storage Policies for user-uploads bucket

-- Allow authenticated users to upload avatars to their own folder
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = 'avatars'
);
```

---

## ✅ Verification

Nach dem Ausführen der Migrationen, überprüfe ob alles funktioniert:

1. **Check Columns exist:**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'profiles' AND column_name = 'language';

   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'notification_preferences' AND column_name = 'weekly_digest_enabled';
   ```

2. **Check Storage Policies:**
   ```sql
   SELECT policyname, tablename, permissive, roles, cmd
   FROM pg_policies
   WHERE tablename = 'objects';
   ```

3. **Reload Supabase Schema Cache:**
   - Gehe zu: Project Settings → API → "Reload schema cache"
   - Oder warte 1-2 Minuten für Auto-Refresh

## 📦 Storage Bucket

Der `user-uploads` Bucket wurde bereits erstellt via Script:
- ✅ Bucket: `user-uploads`
- ✅ Public Access: Enabled
- ✅ File Size Limit: 5MB
- ✅ Allowed Types: image/jpeg, image/png, image/webp, image/gif

## 🔄 Nach den Migrationen

Restart the dev server um den Schema Cache zu aktualisieren:
```bash
# Kill current server
pkill -f "next dev"

# Start fresh
npm run dev
```

## 🎯 Result

Nach erfolgreicher Migration sollten funktionieren:
- ✅ Avatar Upload mit Crop/Rotate/Zoom
- ✅ Language Switcher (EN/DE)
- ✅ Timezone Selector
- ✅ Weekly Digest Opt-out
