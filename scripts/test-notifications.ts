/**
 * Test Script for Notification System
 *
 * This script helps you test the notification system by:
 * 1. Creating test notification queue entries
 * 2. Sending test push notifications
 * 3. Sending test emails
 *
 * Run with: npx tsx scripts/test-notifications.ts
 */

import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

async function testPushNotification(userId: string) {
  console.log('\n🔔 Testing Push Notifications...\n');

  // Get user's push subscriptions
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('❌ Error fetching subscriptions:', error.message);
    return;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log('⚠️  No push subscriptions found for user. Please enable push notifications in the browser first.');
    return;
  }

  console.log(`✅ Found ${subscriptions.length} subscription(s)`);

  // Send test notification to each subscription
  for (const sub of subscriptions) {
    try {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };

      const payload = JSON.stringify({
        title: '🧪 Test Notification',
        body: 'This is a test push notification from Gyst!',
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'test-notification',
        data: {
          url: '/protected/notifications',
          timestamp: new Date().toISOString(),
        },
      });

      await webpush.sendNotification(pushSubscription, payload);
      console.log('✅ Push notification sent successfully!');
      console.log('   Check your browser for the notification.');
    } catch (err: any) {
      console.error('❌ Failed to send push notification:', err.message);
      if (err.statusCode === 410) {
        console.log('   Subscription expired - cleaning up...');
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
    }
  }
}

async function queueTestNotification(userId: string) {
  console.log('\n📬 Queueing Test Notification...\n');

  const { data, error } = await supabase
    .from('notification_queue')
    .insert({
      user_id: userId,
      type: 'task_reminder',
      channel: 'email',
      subject: '🧪 Test Email Notification',
      body: 'This is a test notification queued in the system.',
      tone: 'friendly',
      template_name: 'task_reminder',
      template_data: {
        userName: 'Test User',
        taskTitle: 'Test Task',
        taskDescription: 'This is a test task reminder',
        taskUrl: 'http://localhost:3000/protected/tasks',
      },
      scheduled_for: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error queueing notification:', error.message);
    return;
  }

  console.log('✅ Notification queued successfully!');
  console.log('   ID:', data.id);
  console.log('   View at: http://localhost:3000/protected/notifications');
}

async function sendTestEmail(userId: string) {
  console.log('\n📧 Testing Email Service...\n');

  // Get user email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email, display_name')
    .eq('id', userId)
    .single();

  if (profileError || !profile?.email) {
    console.error('❌ Could not find user email');
    return;
  }

  console.log(`📮 Sending test email to: ${profile.email}`);
  console.log('\n⚠️  Note: Email sending requires Resend domain verification');
  console.log('   For now, this will queue the email in the notification_queue table');

  await queueTestNotification(userId);
}

async function checkDatabaseTables(userId: string) {
  console.log('\n🔍 Checking Database Tables...\n');

  // Check notification_preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId);

  console.log('📋 Notification Preferences:');
  if (prefsError) {
    console.log('   ❌ Error:', prefsError.message);
  } else if (!prefs || prefs.length === 0) {
    console.log('   ⚠️  No preferences set yet');
  } else {
    console.log('   ✅ Found preferences:', {
      email_enabled: prefs[0].email_enabled,
      push_enabled: prefs[0].push_enabled,
      max_per_day: prefs[0].max_per_day,
      quiet_hours: `${prefs[0].quiet_hours_start} - ${prefs[0].quiet_hours_end}`,
    });
  }

  // Check push_subscriptions
  const { data: subs, error: subsError } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  console.log('\n📱 Push Subscriptions:');
  if (subsError) {
    console.log('   ❌ Error:', subsError.message);
  } else if (!subs || subs.length === 0) {
    console.log('   ⚠️  No subscriptions yet');
  } else {
    console.log(`   ✅ Found ${subs.length} subscription(s)`);
    subs.forEach((sub, i) => {
      console.log(`   ${i + 1}. Endpoint: ${sub.endpoint.substring(0, 50)}...`);
    });
  }

  // Check notification_queue
  const { data: queue, error: queueError } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\n📨 Notification Queue (last 5):');
  if (queueError) {
    console.log('   ❌ Error:', queueError.message);
  } else if (!queue || queue.length === 0) {
    console.log('   ⚠️  No notifications in queue');
  } else {
    console.log(`   ✅ Found ${queue.length} notification(s):`);
    queue.forEach((notif, i) => {
      const status = notif.sent_at ? '✅ Sent' : notif.failed_at ? '❌ Failed' : '⏳ Pending';
      console.log(`   ${i + 1}. [${status}] ${notif.type} - ${notif.channel}`);
    });
  }
}

async function main() {
  console.log('🧪 Gyst Notification System Test Script\n');
  console.log('========================================\n');

  // Get user ID from command line or use default
  const userId = process.argv[2];

  if (!userId) {
    console.log('❌ Usage: npx tsx scripts/test-notifications.ts <user-id>');
    console.log('\nTo get your user ID:');
    console.log('1. Log in to your app');
    console.log('2. Open browser console');
    console.log('3. Run: localStorage.getItem("supabase.auth.token")');
    console.log('4. Or check the Supabase Auth dashboard\n');
    process.exit(1);
  }

  console.log(`👤 Testing for user: ${userId}\n`);

  // Menu
  console.log('Select test to run:');
  console.log('1. Check database tables');
  console.log('2. Send test push notification');
  console.log('3. Queue test notification');
  console.log('4. Test email (queue only)');
  console.log('5. Run all tests\n');

  const testType = process.argv[3] || '5';

  switch (testType) {
    case '1':
      await checkDatabaseTables(userId);
      break;
    case '2':
      await testPushNotification(userId);
      break;
    case '3':
      await queueTestNotification(userId);
      break;
    case '4':
      await sendTestEmail(userId);
      break;
    case '5':
      await checkDatabaseTables(userId);
      await queueTestNotification(userId);
      await testPushNotification(userId);
      break;
    default:
      console.log('❌ Invalid option');
  }

  console.log('\n✅ Test completed!\n');
}

main().catch(console.error);
