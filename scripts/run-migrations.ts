#!/usr/bin/env tsx

/**
 * Run Database Migrations via Supabase Management API
 * Run with: npx tsx scripts/run-migrations.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigrations() {
  console.log("🚀 Running Database Migrations...\n");

  const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .filter((file) => file.startsWith("20251119")) // Only run new migrations
    .sort();

  if (migrationFiles.length === 0) {
    console.log("✓ No new migrations to run");
    return;
  }

  console.log(`Found ${migrationFiles.length} migration(s):\n`);

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`📄 Running: ${file}`);

    try {
      // Execute SQL using Supabase client
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

      if (error) {
        // If exec_sql function doesn't exist, show manual instructions
        if (error.message.includes("function") || error.code === "42883") {
          console.log("⚠️  Direct SQL execution not available via SDK");
          console.log("\n📝 Please run this migration manually in Supabase SQL Editor:");
          console.log(`\n--- ${file} ---`);
          console.log(sql);
          console.log("\n");
        } else {
          throw error;
        }
      } else {
        console.log("✓ Success\n");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      console.log("\n📝 Please run this migration manually in Supabase SQL Editor:");
      console.log(`\n--- ${file} ---`);
      console.log(sql);
      console.log("\n");
    }
  }

  console.log("🎉 Migration process complete!");
  console.log("\n💡 Tip: Visit https://supabase.com/dashboard/project/fjfswufsvfdrrotvmajv/sql");
  console.log("   to run the SQL commands manually if needed.");
}

runMigrations().catch(console.error);
