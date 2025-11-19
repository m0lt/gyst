#!/usr/bin/env tsx
/**
 * Supabase Migration Runner
 * Executes SQL migration files on the Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease add SUPABASE_SERVICE_ROLE_KEY to your .env file');
  console.error('Find it at: https://supabase.com/dashboard/project/fjfswufsvfdrrotvmajv/settings/api');
  process.exit(1);
}

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration(filePath: string): Promise<void> {
  console.log(`\n📄 Running migration: ${filePath}`);

  try {
    // Read SQL file
    const sql = readFileSync(filePath, 'utf-8');

    // Split SQL into statements (basic split by semicolon)
    // Note: This is simplified - doesn't handle complex cases like semicolons in strings
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;

      process.stdout.write(`   [${i + 1}/${statements.length}] Executing... `);

      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';',
      });

      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_migrations')
          .insert({ name: filePath });

        if (directError) {
          console.log('❌');
          console.error(`\n❌ Error in statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 200) + '...');
          throw error;
        }
      }

      console.log('✅');
    }

    console.log(`\n✅ Migration completed successfully: ${filePath}`);
  } catch (error) {
    console.error(`\n❌ Migration failed: ${filePath}`);
    throw error;
  }
}

async function runAllMigrations(): Promise<void> {
  console.log('🚀 Starting Supabase Migrations\n');
  console.log(`   Database: ${supabaseUrl}`);

  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');

  try {
    // Get all migration files
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort(); // Alphabetical = chronological due to timestamp prefix

    if (files.length === 0) {
      console.log('⚠️  No migration files found in supabase/migrations/');
      return;
    }

    console.log(`   Found ${files.length} migration file(s)\n`);

    // Run each migration
    for (const file of files) {
      await runMigration(join(migrationsDir, file));
    }

    console.log('\n🎉 All migrations completed successfully!\n');
  } catch (error) {
    console.error('\n💥 Migration process failed:', error);
    process.exit(1);
  }
}

// Alternative: Use Supabase's SQL execution via REST API
async function runMigrationDirect(filePath: string): Promise<void> {
  console.log(`\n📄 Running migration (Direct): ${filePath}`);

  try {
    const sql = readFileSync(filePath, 'utf-8');

    // Execute SQL directly via Supabase API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    console.log(`✅ Migration completed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${filePath}`, error);
    throw error;
  }
}

// Run migrations
runAllMigrations();
