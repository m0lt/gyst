"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  sendTaskReminder,
  sendWeeklyDigest,
  type TaskReminderData,
  type WeeklyDigestData,
} from "@/lib/notifications/email-service";

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  category_id: string | null;
  email_enabled: boolean;
  push_enabled: boolean;
  weekly_digest_enabled: boolean;
  max_per_day: number;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  tone_progression: string[];
  current_tone_index: number;
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId: string, categoryId?: string | null) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId);

    // Handle null/undefined category_id properly
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    } else {
      query = query.is("category_id", null);
    }

    const { data, error } = await query.maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    // If there's an error, log it but don't throw - just return null
    if (error) {
      console.warn("Could not fetch notification preferences (this is OK for new users):", error.message || error);
      return null;
    }

    // Return null if no preferences exist yet (this is OK)
    return data;
  } catch (error) {
    // Catch any unexpected errors
    console.warn("Unexpected error fetching notification preferences:", error);
    return null;
  }
}

/**
 * Update or create user's notification preferences
 */
export async function updateNotificationPreferences(
  preferences: NotificationPreferences
) {
  const supabase = await createClient();

  let query = supabase
    .from("notification_preferences")
    .select("id")
    .eq("user_id", preferences.user_id);

  // Handle null/undefined category_id properly
  if (preferences.category_id) {
    query = query.eq("category_id", preferences.category_id);
  } else {
    query = query.is("category_id", null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    // Update existing preferences
    const { data, error} = await supabase
      .from("notification_preferences")
      .update({
        email_enabled: preferences.email_enabled,
        push_enabled: preferences.push_enabled,
        weekly_digest_enabled: preferences.weekly_digest_enabled,
        max_per_day: preferences.max_per_day,
        quiet_hours_start: preferences.quiet_hours_start,
        quiet_hours_end: preferences.quiet_hours_end,
        tone_progression: preferences.tone_progression,
        current_tone_index: preferences.current_tone_index,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating notification preferences:", error);
      throw new Error("Failed to update notification preferences");
    }

    revalidatePath("/protected/settings");
    return data;
  } else {
    // Create new preferences
    const { data, error } = await supabase
      .from("notification_preferences")
      .insert({
        user_id: preferences.user_id,
        category_id: preferences.category_id,
        email_enabled: preferences.email_enabled,
        push_enabled: preferences.push_enabled,
        weekly_digest_enabled: preferences.weekly_digest_enabled,
        max_per_day: preferences.max_per_day,
        quiet_hours_start: preferences.quiet_hours_start,
        quiet_hours_end: preferences.quiet_hours_end,
        tone_progression: preferences.tone_progression,
        current_tone_index: preferences.current_tone_index,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification preferences:", error);
      throw new Error("Failed to create notification preferences");
    }

    revalidatePath("/protected/settings");
    return data;
  }
}

/**
 * Queue a task reminder notification
 */
export async function queueTaskReminder(
  userId: string,
  taskId: string,
  scheduledFor: Date
) {
  const supabase = await createClient();

  // Get user's email and preferences
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, display_name")
    .eq("id", userId)
    .single();

  if (!profile?.email) {
    throw new Error("User email not found");
  }

  // Get task details
  const { data: task } = await supabase
    .from("tasks")
    .select("title, description")
    .eq("id", taskId)
    .single();

  if (!task) {
    throw new Error("Task not found");
  }

  // Check if email notifications are enabled
  const preferences = await getNotificationPreferences(userId);
  if (!preferences?.email_enabled) {
    return { success: false, reason: "Email notifications disabled" };
  }

  // Check quiet hours
  if (isInQuietHours(scheduledFor, preferences)) {
    return { success: false, reason: "In quiet hours" };
  }

  // Check daily limit
  const canSend = await checkDailyLimit(userId, preferences.max_per_day);
  if (!canSend) {
    return { success: false, reason: "Daily limit reached" };
  }

  // Queue the notification
  const { data, error } = await supabase
    .from("notification_queue")
    .insert({
      user_id: userId,
      task_id: taskId,
      type: "task_reminder",
      channel: "email",
      tone: preferences.tone_progression[preferences.current_tone_index] || "neutral",
      template_name: "task_reminder",
      template_data: {
        userName: profile.display_name || "there",
        taskTitle: task.title,
        taskDescription: task.description,
        taskUrl: `${process.env.NEXT_PUBLIC_APP_URL}/protected/tasks`,
      },
      scheduled_for: scheduledFor.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error queuing notification:", error);
    throw new Error("Failed to queue notification");
  }

  return { success: true, id: data.id };
}

/**
 * Send task reminder email immediately
 */
export async function sendTaskReminderEmail(
  userId: string,
  taskId: string
) {
  const supabase = await createClient();

  // Get user's email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, display_name")
    .eq("id", userId)
    .single();

  if (!profile?.email) {
    throw new Error("User email not found");
  }

  // Get task details
  const { data: task } = await supabase
    .from("tasks")
    .select("title, description")
    .eq("id", taskId)
    .single();

  if (!task) {
    throw new Error("Task not found");
  }

  const reminderData: TaskReminderData = {
    userName: profile.display_name || "there",
    taskTitle: task.title,
    taskDescription: task.description || undefined,
    taskUrl: `${process.env.NEXT_PUBLIC_APP_URL}/protected/tasks`,
  };

  return await sendTaskReminder(profile.email, reminderData);
}

/**
 * Send weekly digest email
 */
export async function sendWeeklyDigestEmail(userId: string) {
  const supabase = await createClient();

  // Get user's email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, display_name")
    .eq("id", userId)
    .single();

  if (!profile?.email) {
    throw new Error("User email not found");
  }

  // Get statistics for the week
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();

  // Get completed tasks this week
  const { data: completions } = await supabase
    .from("task_completions")
    .select("*, tasks(category_id, task_categories(name))")
    .eq("user_id", userId)
    .gte("completed_at", startDate.toISOString())
    .lte("completed_at", endDate.toISOString());

  // Get total active tasks
  const { count: totalTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true);

  // Calculate top categories
  const categoryMap = new Map<string, number>();
  completions?.forEach((completion: any) => {
    const categoryName = completion.tasks?.task_categories?.name || "Uncategorized";
    categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, completedCount]) => ({ name, completedCount }))
    .sort((a, b) => b.completedCount - a.completedCount)
    .slice(0, 3);

  // Get longest streak
  const { data: streaks } = await supabase
    .from("streaks")
    .select("longest_streak")
    .eq("user_id", userId)
    .order("longest_streak", { ascending: false })
    .limit(1)
    .single();

  // Get upcoming tasks
  const { data: upcomingTasks } = await supabase
    .from("tasks")
    .select("title, due_date")
    .eq("user_id", userId)
    .eq("is_active", true)
    .not("due_date", "is", null)
    .gte("due_date", new Date().toISOString())
    .order("due_date", { ascending: true })
    .limit(5);

  const digestData: WeeklyDigestData = {
    userName: profile.display_name || "there",
    startDate: startDate.toLocaleDateString(),
    endDate: endDate.toLocaleDateString(),
    completedTasksCount: completions?.length || 0,
    totalTasksCount: totalTasks || 0,
    completionRate: totalTasks ? Math.round(((completions?.length || 0) / totalTasks) * 100) : 0,
    longestStreak: streaks?.longest_streak || 0,
    topCategories,
    upcomingTasks: upcomingTasks?.map(t => ({
      title: t.title,
      dueDate: new Date(t.due_date!).toLocaleDateString(),
    })) || [],
  };

  return await sendWeeklyDigest(profile.email, digestData);
}

/**
 * Check if a time is within quiet hours
 */
function isInQuietHours(
  time: Date,
  preferences: { quiet_hours_start: string | null; quiet_hours_end: string | null }
): boolean {
  if (!preferences.quiet_hours_start || !preferences.quiet_hours_end) {
    return false;
  }

  const timeStr = time.toTimeString().slice(0, 5); // HH:MM
  const start = preferences.quiet_hours_start;
  const end = preferences.quiet_hours_end;

  // Handle overnight quiet hours (e.g., 22:00 - 08:00)
  if (start > end) {
    return timeStr >= start || timeStr < end;
  }

  return timeStr >= start && timeStr < end;
}

/**
 * Check if user has reached daily notification limit
 */
async function checkDailyLimit(userId: string, maxPerDay: number): Promise<boolean> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("notification_queue")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .not("sent_at", "is", null);

  return (count || 0) < maxPerDay;
}

/**
 * Save push subscription for a user
 */
export async function savePushSubscription(
  userId: string,
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
) {
  const supabase = await createClient();

  // Convert subscription to storable format
  const subscriptionData = {
    user_id: userId,
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };

  // Check if subscription already exists
  const { data: existing } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("endpoint", subscription.endpoint)
    .single();

  if (existing) {
    // Update existing subscription
    const { error } = await supabase
      .from("push_subscriptions")
      .update({
        keys: subscriptionData.keys,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating push subscription:", error);
      throw new Error("Failed to update push subscription");
    }
  } else {
    // Create new subscription
    const { error } = await supabase
      .from("push_subscriptions")
      .insert(subscriptionData);

    if (error) {
      console.error("Error saving push subscription:", error);
      throw new Error("Failed to save push subscription");
    }
  }

  revalidatePath("/protected/settings/notifications");
  return { success: true };
}

/**
 * Remove push subscription for a user
 */
export async function removePushSubscription(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing push subscription:", error);
    throw new Error("Failed to remove push subscription");
  }

  revalidatePath("/protected/settings/notifications");
  return { success: true };
}

/**
 * Get all push subscriptions for a user
 */
export async function getPushSubscriptions(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching push subscriptions:", error);
    throw new Error("Failed to fetch push subscriptions");
  }

  return data;
}

/**
 * Get all notifications for a user
 */
export async function getNotifications(userId: string, limit = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notification_queue")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }

  return data;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notification_queue")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Error deleting notification:", error);
    throw new Error("Failed to delete notification");
  }

  revalidatePath("/protected/notifications");
  return { success: true};
}

/**
 * Generate weekly digest preview data
 */
export async function generateDigestPreview(userId: string) {
  const supabase = await createClient();

  // Get user's display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  // Get statistics for the week
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();

  // Get completed tasks this week
  const { data: completions } = await supabase
    .from("task_completions")
    .select("*, tasks(category_id, task_categories(name))")
    .eq("user_id", userId)
    .gte("completed_at", startDate.toISOString())
    .lte("completed_at", endDate.toISOString());

  // Get total active tasks
  const { count: totalTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true);

  // Calculate top categories
  const categoryMap = new Map<string, number>();
  completions?.forEach((completion: any) => {
    const categoryName = completion.tasks?.task_categories?.name || "Uncategorized";
    categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, completedCount]) => ({ name, completedCount }))
    .sort((a, b) => b.completedCount - a.completedCount)
    .slice(0, 3);

  // Get longest streak
  const { data: streaks } = await supabase
    .from("streaks")
    .select("longest_streak")
    .eq("user_id", userId)
    .order("longest_streak", { ascending: false })
    .limit(1)
    .single();

  // Get upcoming tasks
  const { data: upcomingTasks } = await supabase
    .from("tasks")
    .select("title, due_date")
    .eq("user_id", userId)
    .eq("is_active", true)
    .not("due_date", "is", null)
    .gte("due_date", new Date().toISOString())
    .order("due_date", { ascending: true })
    .limit(5);

  return {
    userName: profile?.display_name || "there",
    startDate: startDate.toLocaleDateString(),
    endDate: endDate.toLocaleDateString(),
    completedTasksCount: completions?.length || 0,
    totalTasksCount: totalTasks || 0,
    completionRate: totalTasks ? Math.round(((completions?.length || 0) / totalTasks) * 100) : 0,
    longestStreak: streaks?.longest_streak || 0,
    topCategories,
    upcomingTasks: upcomingTasks?.map(t => ({
      title: t.title,
      dueDate: new Date(t.due_date!).toLocaleDateString(),
    })) || [],
  };
}
