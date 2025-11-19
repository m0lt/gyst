-- Create Demo User for Development
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fjfswufsvfdrrotvmajv/editor

-- Demo credentials:
-- Email: demo@gyst.app
-- Password: DemoGyst2024!

-- Insert demo user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@gyst.app',
  crypt('DemoGyst2024!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create identity for the user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'demo@gyst.app'
ON CONFLICT (provider, id) DO NOTHING;

-- Output success message
SELECT
  'Demo user created successfully!' as message,
  'Email: demo@gyst.app' as email,
  'Password: DemoGyst2024!' as password;
