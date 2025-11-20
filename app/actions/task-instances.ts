"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TaskMood = "happy" | "neutral" | "sad";
export type TaskInstanceStatus = "pending" | "completed" | "skipped" | "rescheduled";

type CompleteTaskInstanceInput = {
  instanceId: string;
  mood?: TaskMood;
  actualMinutes?: number;
  photoFile?: File;
  notes?: string;
  subtasksCompleted?: Record<string, boolean>;
};

type RescheduleTaskInstanceInput = {
  instanceId: string;
  newDueDate: string; // ISO date string
  reason?: string;
  applyToFuture?: boolean; // If true, reschedules all future instances
};

/**
 * Get task instances for a specific date range
 */
export async function getTaskInstances(startDate: string, endDate: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("task_instances")
    .select(`
      *,
      tasks (
        id,
        title,
        description,
        category_id,
        priority,
        scheduled_duration,
        ai_image_url,
        task_categories (
          id,
          name,
          color,
          icon
        )
      )
    `)
    .eq("user_id", user.id)
    .gte("due_date", startDate)
    .lte("due_date", endDate)
    .order("due_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    console.error("Error fetching task instances:", error);
    throw new Error(error.message || "Failed to fetch task instances");
  }

  return data;
}

/**
 * Get today's task instances
 */
export async function getTodayTaskInstances() {
  const today = new Date().toISOString().split("T")[0];
  return getTaskInstances(today, today);
}

/**
 * Generate task instances for active tasks
 * This should be called daily (e.g., via cron job or on user login)
 */
export async function generateInstancesForActiveTasks(days: number = 7) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Get all active tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (tasksError) {
    throw new Error(tasksError.message || "Failed to fetch tasks");
  }

  // Generate instances for each task
  for (const task of tasks || []) {
    await supabase.rpc("generate_task_instances", {
      p_task_id: task.id,
      p_user_id: user.id,
      p_start_date: startDate,
      p_end_date: endDate,
    });
  }

  // Note: No revalidatePath here since this is called during page render
  // Individual actions (complete, reschedule, skip) will revalidate
  return { success: true, count: tasks?.length || 0 };
}

/**
 * Complete a task instance
 */
export async function completeTaskInstance(input: CompleteTaskInstanceInput) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  let photoUrl: string | null = null;

  // Upload photo if provided
  if (input.photoFile) {
    const fileExt = input.photoFile.name.split(".").pop();
    const fileName = `${user.id}/task-instances/${input.instanceId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("task-completions")
      .upload(fileName, input.photoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      throw new Error("Failed to upload photo");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("task-completions")
      .getPublicUrl(uploadData.path);

    photoUrl = publicUrl;
  }

  // Update instance
  const { data, error } = await supabase
    .from("task_instances")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      mood: input.mood || null,
      actual_minutes: input.actualMinutes || null,
      photo_url: photoUrl,
      notes: input.notes || null,
      subtasks_completed: input.subtasksCompleted || null,
    })
    .eq("id", input.instanceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error completing task instance:", error);
    throw new Error(error.message || "Failed to complete task instance");
  }

  revalidatePath("/protected/todo");
  return data;
}

/**
 * Skip a task instance
 */
export async function skipTaskInstance(instanceId: string, reason?: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("task_instances")
    .update({
      status: "skipped",
      notes: reason || null,
    })
    .eq("id", instanceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error skipping task instance:", error);
    throw new Error(error.message || "Failed to skip task instance");
  }

  revalidatePath("/protected/todo");
  return data;
}

/**
 * Reschedule a task instance
 */
export async function rescheduleTaskInstance(input: RescheduleTaskInstanceInput) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get the instance
  const { data: instance, error: instanceError } = await supabase
    .from("task_instances")
    .select("*, tasks(*)")
    .eq("id", input.instanceId)
    .eq("user_id", user.id)
    .single();

  if (instanceError || !instance) {
    throw new Error("Task instance not found");
  }

  if (input.applyToFuture) {
    // Update the task template's start date or recurrence pattern
    // This is a more complex operation - for now, just reschedule this instance
    // TODO: Implement permanent rescheduling logic
  }

  // Update this instance
  const { data, error } = await supabase
    .from("task_instances")
    .update({
      due_date: input.newDueDate,
      original_due_date: instance.original_due_date || instance.due_date,
      reschedule_reason: input.reason || null,
      status: "rescheduled",
    })
    .eq("id", input.instanceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error rescheduling task instance:", error);
    throw new Error(error.message || "Failed to reschedule task instance");
  }

  // Create a new instance for the new date
  const { error: createError } = await supabase
    .from("task_instances")
    .insert({
      task_id: instance.task_id,
      user_id: user.id,
      due_date: input.newDueDate,
      scheduled_time: instance.scheduled_time,
      status: "pending",
    });

  if (createError && createError.code !== "23505") { // Ignore unique constraint violation
    console.error("Error creating rescheduled instance:", createError);
  }

  revalidatePath("/protected/todo");
  return data;
}

/**
 * Update subtasks completion status for a task instance
 */
export async function updateSubtasksCompleted(
  instanceId: string,
  subtasksCompleted: Record<string, boolean>
) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("task_instances")
    .update({
      subtasks_completed: subtasksCompleted,
    })
    .eq("id", instanceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating subtasks:", error);
    throw new Error(error.message || "Failed to update subtasks");
  }

  revalidatePath("/protected/todo");
  return data;
}

/**
 * Reactivate a completed task instance (set it back to pending)
 */
export async function reactivateTaskInstance(instanceId: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("task_instances")
    .update({
      status: "pending",
      completed_at: null,
      // Keep the completion data as history (mood, photo, notes, actual_minutes, subtasks_completed)
      // This allows users to see what they did before if they complete it again
    })
    .eq("id", instanceId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error reactivating task instance:", error);
    throw new Error(error.message || "Failed to reactivate task instance");
  }

  revalidatePath("/protected/todo");
  return data;
}

/**
 * Delete a task instance
 */
export async function deleteTaskInstance(instanceId: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("task_instances")
    .delete()
    .eq("id", instanceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting task instance:", error);
    throw new Error(error.message || "Failed to delete task instance");
  }

  revalidatePath("/protected/todo");
  return { success: true };
}
