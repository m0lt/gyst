#!/usr/bin/env tsx

/**
 * Setup Supabase Storage Buckets
 * Run with: npx tsx scripts/setup-storage.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupStorage() {
  console.log("🚀 Setting up Supabase Storage...\n");

  // Create user-uploads bucket
  console.log("📦 Creating 'user-uploads' bucket...");
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket(
    "user-uploads",
    {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    }
  );

  if (bucketError) {
    if (bucketError.message.includes("already exists")) {
      console.log("✓ Bucket 'user-uploads' already exists");
    } else {
      console.error("❌ Error creating bucket:", bucketError);
      return;
    }
  } else {
    console.log("✓ Created bucket 'user-uploads'");
  }

  // Set up storage policy for authenticated users
  console.log("\n🔐 Setting up storage policies...");

  // Policy 1: Allow authenticated users to upload to their own folder
  const uploadPolicy = {
    name: "Allow users to upload their own avatars",
    definition: `bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = auth.uid()::text`,
    check: null,
  };

  // Policy 2: Allow public read access
  const readPolicy = {
    name: "Allow public read access to avatars",
    definition: `bucket_id = 'user-uploads'`,
    check: null,
  };

  console.log("✓ Storage bucket setup complete!");
  console.log("\n📝 Note: You may need to manually configure RLS policies in Supabase Dashboard:");
  console.log("   1. Go to: Storage → Policies → user-uploads");
  console.log("   2. Add policy for INSERT: Allow authenticated users to upload");
  console.log("   3. Add policy for SELECT: Allow public read access");
  console.log("\nOr run these SQL commands in the Supabase SQL Editor:\n");
  console.log(`
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
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
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
  `);
}

setupStorage().catch(console.error);
