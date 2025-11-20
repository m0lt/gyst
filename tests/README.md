# RLS Policy Tests

This directory contains tests for verifying Row Level Security (RLS) policies in the Supabase database.

## Prerequisites

Before running the RLS tests, you need to create two test users in your Supabase project:

### Test User 1
- Email: `test-user-1@gyst-test.com`
- Password: `test-password-123`

### Test User 2
- Email: `test-user-2@gyst-test.com`
- Password: `test-password-456`

### Creating Test Users

You can create these users via:

1. **Supabase Dashboard**:
   - Go to Authentication → Users
   - Click "Add user"
   - Enter email and password
   - Repeat for second user

2. **SQL**:
   ```sql
   -- This will trigger the profile creation automatically
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES
     ('test-user-1@gyst-test.com', crypt('test-password-123', gen_salt('bf')), NOW()),
     ('test-user-2@gyst-test.com', crypt('test-password-456', gen_salt('bf')), NOW());
   ```

3. **Supabase Auth API** (recommended):
   ```bash
   # Create test user 1
   curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
     -H 'apikey: YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"email":"test-user-1@gyst-test.com","password":"test-password-123"}'

   # Create test user 2
   curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
     -H 'apikey: YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"email":"test-user-2@gyst-test.com","password":"test-password-456"}'
   ```

## Running the Tests

Once test users are created:

```bash
# Run all tests
npm run test

# Run only RLS tests
npm run test rls-policies

# Run tests in watch mode
npm run test:watch
```

## What's Being Tested

The RLS policy tests verify that:

### Profiles Table
- ✅ Users can view their own profile
- ✅ Users cannot view other users' profiles
- ✅ Users can update their own profile
- ✅ Users cannot update other users' profiles

### Task Categories Table
- ✅ All users can view predefined categories
- ✅ Users can create their own categories
- ✅ Users can view their own categories
- ✅ Users cannot view other users' custom categories
- ✅ Users cannot modify other users' categories

### Tasks Table
- ✅ Users can create their own tasks
- ✅ Users can view their own tasks
- ✅ Users cannot view other users' tasks
- ✅ Users can update their own tasks
- ✅ Users cannot update other users' tasks
- ✅ Users can delete their own tasks
- ✅ Users cannot delete other users' tasks

### Task Completions Table
- ✅ Users can create completions for their own tasks
- ✅ Users cannot view other users' completions

### Notification Preferences Table
- ✅ Users can manage their own notification preferences
- ✅ Users cannot view other users' preferences

### Calendar Connections Table
- ✅ Users can manage their own calendar connections
- ✅ Users cannot view other users' calendar connections

## Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Cleanup

Test data is automatically cleaned up after each test run. However, the test users will remain in your database. You can delete them manually if needed.

## Troubleshooting

### "Failed to sign in as user X"
- Ensure test users are created in Supabase
- Check that email/password match exactly
- Verify users' email is confirmed

### "RLS policy violation" errors in tests that should pass
- Check that RLS policies are enabled in your database
- Run the initial migration: `20251117154809_initial_gyst_schema.sql`
- Verify the `is_admin()` function exists (for admin tests)

### Tests timeout
- Check your internet connection (tests make actual API calls to Supabase)
- Increase timeout in vitest.config.ts if needed
