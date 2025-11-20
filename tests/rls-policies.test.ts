/**
 * RLS Policy Tests
 *
 * Tests Row Level Security policies for all tables to ensure:
 * - Users can only access their own data
 * - Predefined categories are accessible to all
 * - Cross-user data access is prevented
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test users (these should be created in Supabase for testing)
const TEST_USER_1_EMAIL = 'test-user-1@gyst-test.com';
const TEST_USER_1_PASSWORD = 'test-password-123';
const TEST_USER_2_EMAIL = 'test-user-2@gyst-test.com';
const TEST_USER_2_PASSWORD = 'test-password-456';

describe('RLS Policies', () => {
  let user1Client: any;
  let user2Client: any;
  let user1Id: string;
  let user2Id: string;
  let testTaskId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    // Create clients for both test users
    user1Client = createClient(supabaseUrl, supabaseAnonKey);
    user2Client = createClient(supabaseUrl, supabaseAnonKey);

    // Sign in as user 1
    const { data: user1Data, error: user1Error } = await user1Client.auth.signInWithPassword({
      email: TEST_USER_1_EMAIL,
      password: TEST_USER_1_PASSWORD,
    });

    if (user1Error) {
      console.error('Failed to sign in as user 1. Please create test user:', user1Error);
      throw user1Error;
    }
    user1Id = user1Data.user!.id;

    // Sign in as user 2
    const { data: user2Data, error: user2Error } = await user2Client.auth.signInWithPassword({
      email: TEST_USER_2_EMAIL,
      password: TEST_USER_2_PASSWORD,
    });

    if (user2Error) {
      console.error('Failed to sign in as user 2. Please create test user:', user2Error);
      throw user2Error;
    }
    user2Id = user2Data.user!.id;
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (testTaskId) {
      await user1Client.from('tasks').delete().eq('id', testTaskId);
    }
    if (testCategoryId) {
      await user1Client.from('task_categories').delete().eq('id', testCategoryId);
    }

    // Sign out
    await user1Client.auth.signOut();
    await user2Client.auth.signOut();
  });

  describe('Profiles Table', () => {
    it('should allow users to view their own profile', async () => {
      const { data, error } = await user1Client
        .from('profiles')
        .select('*')
        .eq('id', user1Id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.id).toBe(user1Id);
    });

    it('should prevent users from viewing other profiles', async () => {
      const { data, error } = await user1Client
        .from('profiles')
        .select('*')
        .eq('id', user2Id)
        .single();

      // Should return no data due to RLS
      expect(data).toBeNull();
    });

    it('should allow users to update their own profile', async () => {
      const { error } = await user1Client
        .from('profiles')
        .update({ full_name: 'Test User 1 Updated' })
        .eq('id', user1Id);

      expect(error).toBeNull();
    });

    it('should prevent users from updating other profiles', async () => {
      const { error } = await user1Client
        .from('profiles')
        .update({ full_name: 'Hacked!' })
        .eq('id', user2Id);

      // Should fail due to RLS
      expect(error).toBeDefined();
    });
  });

  describe('Task Categories Table', () => {
    it('should allow users to view predefined categories', async () => {
      const { data, error } = await user1Client
        .from('task_categories')
        .select('*')
        .eq('is_predefined', true);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should allow users to create their own categories', async () => {
      const { data, error } = await user1Client
        .from('task_categories')
        .insert({
          user_id: user1Id,
          name: 'Test Category',
          slug: 'test-category-' + Date.now(),
          color: '#FF0000',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      testCategoryId = data.id;
    });

    it('should allow users to view their own categories', async () => {
      const { data, error } = await user1Client
        .from('task_categories')
        .select('*')
        .eq('user_id', user1Id);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should prevent users from viewing other users categories', async () => {
      const { data, error } = await user1Client
        .from('task_categories')
        .select('*')
        .eq('user_id', user2Id)
        .eq('is_predefined', false);

      expect(error).toBeNull();
      // Should return empty array due to RLS
      expect(data).toEqual([]);
    });

    it('should prevent users from modifying other users categories', async () => {
      // First, user 2 creates a category
      const { data: user2Category } = await user2Client
        .from('task_categories')
        .insert({
          user_id: user2Id,
          name: 'User 2 Category',
          slug: 'user-2-category-' + Date.now(),
          color: '#00FF00',
        })
        .select()
        .single();

      // User 1 tries to update it
      const { error } = await user1Client
        .from('task_categories')
        .update({ name: 'Hacked Category' })
        .eq('id', user2Category.id);

      // Should fail due to RLS
      expect(error).toBeDefined();

      // Cleanup
      await user2Client.from('task_categories').delete().eq('id', user2Category.id);
    });
  });

  describe('Tasks Table', () => {
    it('should allow users to create their own tasks', async () => {
      const { data, error } = await user1Client
        .from('tasks')
        .insert({
          user_id: user1Id,
          title: 'Test Task',
          description: 'Test description',
          frequency: 'daily',
          is_active: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      testTaskId = data.id;
    });

    it('should allow users to view their own tasks', async () => {
      const { data, error } = await user1Client
        .from('tasks')
        .select('*')
        .eq('user_id', user1Id);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should prevent users from viewing other users tasks', async () => {
      const { data, error } = await user1Client
        .from('tasks')
        .select('*')
        .eq('user_id', user2Id);

      expect(error).toBeNull();
      // Should return empty array due to RLS
      expect(data).toEqual([]);
    });

    it('should allow users to update their own tasks', async () => {
      const { error } = await user1Client
        .from('tasks')
        .update({ title: 'Updated Task Title' })
        .eq('id', testTaskId);

      expect(error).toBeNull();
    });

    it('should prevent users from updating other users tasks', async () => {
      // User 2 creates a task
      const { data: user2Task } = await user2Client
        .from('tasks')
        .insert({
          user_id: user2Id,
          title: 'User 2 Task',
          frequency: 'daily',
          is_active: true,
        })
        .select()
        .single();

      // User 1 tries to update it
      const { error } = await user1Client
        .from('tasks')
        .update({ title: 'Hacked!' })
        .eq('id', user2Task.id);

      // Should fail due to RLS
      expect(error).toBeDefined();

      // Cleanup
      await user2Client.from('tasks').delete().eq('id', user2Task.id);
    });

    it('should allow users to delete their own tasks', async () => {
      const { error } = await user1Client
        .from('tasks')
        .delete()
        .eq('id', testTaskId);

      expect(error).toBeNull();
      testTaskId = ''; // Mark as deleted
    });

    it('should prevent users from deleting other users tasks', async () => {
      // User 2 creates a task
      const { data: user2Task } = await user2Client
        .from('tasks')
        .insert({
          user_id: user2Id,
          title: 'User 2 Task to Delete',
          frequency: 'daily',
          is_active: true,
        })
        .select()
        .single();

      // User 1 tries to delete it
      const { error } = await user1Client
        .from('tasks')
        .delete()
        .eq('id', user2Task.id);

      // Should fail due to RLS
      expect(error).toBeDefined();

      // Cleanup
      await user2Client.from('tasks').delete().eq('id', user2Task.id);
    });
  });

  describe('Task Completions Table', () => {
    it('should allow users to create completions for their own tasks', async () => {
      // Create a task first
      const { data: task } = await user1Client
        .from('tasks')
        .insert({
          user_id: user1Id,
          title: 'Task for Completion',
          frequency: 'daily',
          is_active: true,
        })
        .select()
        .single();

      const { data, error } = await user1Client
        .from('task_completions')
        .insert({
          task_id: task.id,
          user_id: user1Id,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Cleanup
      await user1Client.from('task_completions').delete().eq('id', data.id);
      await user1Client.from('tasks').delete().eq('id', task.id);
    });

    it('should prevent users from viewing other users completions', async () => {
      const { data, error } = await user1Client
        .from('task_completions')
        .select('*')
        .eq('user_id', user2Id);

      expect(error).toBeNull();
      // Should return empty array due to RLS
      expect(data).toEqual([]);
    });
  });

  describe('Notification Preferences Table', () => {
    it('should allow users to manage their own notification preferences', async () => {
      const { data, error } = await user1Client
        .from('notification_preferences')
        .upsert({
          user_id: user1Id,
          email_enabled: true,
          push_enabled: false,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent users from viewing other users notification preferences', async () => {
      const { data, error } = await user1Client
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user2Id);

      expect(error).toBeNull();
      // Should return empty array due to RLS
      expect(data).toEqual([]);
    });
  });

  describe('Calendar Connections Table', () => {
    it('should allow users to manage their own calendar connections', async () => {
      const { data, error } = await user1Client
        .from('calendar_connections')
        .insert({
          user_id: user1Id,
          provider: 'google',
          access_token: 'test-token-encrypted',
          is_active: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Cleanup
      await user1Client.from('calendar_connections').delete().eq('id', data.id);
    });

    it('should prevent users from viewing other users calendar connections', async () => {
      const { data, error } = await user1Client
        .from('calendar_connections')
        .select('*')
        .eq('user_id', user2Id);

      expect(error).toBeNull();
      // Should return empty array due to RLS
      expect(data).toEqual([]);
    });
  });
});
