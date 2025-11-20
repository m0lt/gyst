"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskPriority, RecurrencePattern } from "@/lib/types/task-scheduling";

type CreateTaskInput = {
  title: string;
  description: string;
  category_id: string;
  frequency: "daily" | "weekly" | "custom";
  // Enhanced scheduling fields
  priority?: TaskPriority;
  scheduled_duration?: number | null;
  tags?: string[];
  reminder_minutes_before?: number | null;
  preferred_time?: string | null;
  recurrence_pattern?: RecurrencePattern | null;
};

type UpdateTaskInput = Partial<CreateTaskInput> & {
  id: string;
};

export async function createTask(input: CreateTaskInput) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Validate inputs
  if (input.scheduled_duration && input.scheduled_duration <= 0) {
    throw new Error("Scheduled duration must be greater than 0");
  }
  if (input.reminder_minutes_before && input.reminder_minutes_before < 0) {
    throw new Error("Reminder minutes must be >= 0");
  }

  // Normalize tags to lowercase
  const normalizedTags = input.tags?.map(tag => tag.toLowerCase()) || [];

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description || null,
      category_id: input.category_id,
      frequency: input.frequency,
      user_id: user.id,
      is_active: true,
      // Enhanced scheduling fields
      priority: input.priority || 'medium',
      scheduled_duration: input.scheduled_duration || null,
      tags: normalizedTags,
      reminder_minutes_before: input.reminder_minutes_before || null,
      preferred_time: input.preferred_time || null,
      recurrence_pattern: input.recurrence_pattern || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw new Error(error.message || "Failed to create task");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  return data;
}

export async function updateTask(input: UpdateTaskInput) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Validate inputs
  if (input.scheduled_duration !== undefined && input.scheduled_duration !== null && input.scheduled_duration <= 0) {
    throw new Error("Scheduled duration must be greater than 0");
  }
  if (input.reminder_minutes_before !== undefined && input.reminder_minutes_before !== null && input.reminder_minutes_before < 0) {
    throw new Error("Reminder minutes must be >= 0");
  }

  // Normalize tags to lowercase if provided
  const normalizedTags = input.tags?.map(tag => tag.toLowerCase());

  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description || null;
  if (input.category_id !== undefined) updateData.category_id = input.category_id;
  if (input.frequency !== undefined) updateData.frequency = input.frequency;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.scheduled_duration !== undefined) updateData.scheduled_duration = input.scheduled_duration;
  if (normalizedTags !== undefined) updateData.tags = normalizedTags;
  if (input.reminder_minutes_before !== undefined) updateData.reminder_minutes_before = input.reminder_minutes_before;
  if (input.preferred_time !== undefined) updateData.preferred_time = input.preferred_time;
  if (input.recurrence_pattern !== undefined) updateData.recurrence_pattern = input.recurrence_pattern;

  const { data, error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw new Error(error.message || "Failed to update task");
  }

  // Update future task instances if schedule-related fields were changed
  const today = new Date().toISOString().split('T')[0];

  if (input.preferred_time !== undefined) {
    // Update scheduled_time for all future instances (including today and beyond)
    await supabase
      .from("task_instances")
      .update({ scheduled_time: input.preferred_time })
      .eq("task_id", input.id)
      .eq("user_id", user.id)
      .gte("due_date", today)
      .is("completed_at", null); // Only update non-completed instances
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  revalidatePath("/protected/calendar");
  return data;
}

export async function completeTask(
  taskIdOrInput: string | {
    taskId: string;
    actualMinutes?: number;
    photoFile?: File;
    notes?: string;
    subtasksCompleted?: string[];
    userId: string;
  }
) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Handle both string taskId and full input object
  const input = typeof taskIdOrInput === "string"
    ? { taskId: taskIdOrInput, userId: user.id }
    : { ...taskIdOrInput, userId: user.id }; // Always use authenticated user's ID

  // Get the current task with all completions for streak calculation
  const { data: task } = await supabase
    .from("tasks")
    .select("*, task_completions(completed_at)")
    .eq("id", input.taskId)
    .single();

  if (!task) {
    throw new Error("Task not found");
  }

  let photoUrl: string | null = null;

  // Upload photo if provided
  if (input.photoFile) {
    const fileExt = input.photoFile.name.split(".").pop();
    const fileName = `${input.userId}/${input.taskId}/${Date.now()}.${fileExt}`;

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

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("task-completions").getPublicUrl(uploadData.path);

    photoUrl = publicUrl;
  }

  const now = new Date();

  // Create completion record
  const { data: completion, error: completionError } = await supabase
    .from("task_completions")
    .insert({
      task_id: input.taskId,
      user_id: input.userId,
      completed_at: now.toISOString(),
      actual_minutes: input.actualMinutes || null,
      photo_url: photoUrl,
      notes: input.notes || null,
      subtasks_completed: input.subtasksCompleted
        ? JSON.stringify(input.subtasksCompleted)
        : null,
    })
    .select()
    .single();

  if (completionError) {
    console.error("Error creating completion:", completionError);
    throw new Error("Failed to create completion record");
  }

  // Get all completions for streak calculation
  const { data: allCompletions } = await supabase
    .from("task_completions")
    .select("completed_at")
    .eq("task_id", input.taskId)
    .order("completed_at", { ascending: true });

  if (!allCompletions) {
    throw new Error("Failed to fetch completions");
  }

  // Calculate streak using our utility
  const { calculateTaskStreak, hasReachedMilestone, calculateBreakCredits } = await import(
    "@/lib/utils/streak-calculator"
  );

  const streakResult = calculateTaskStreak(
    allCompletions,
    task.frequency,
    task.custom_frequency_days || undefined,
    task.start_date
  );

  // Calculate new average actual minutes
  let newActualMinutesAvg = task.actual_minutes_avg || null;
  if (input.actualMinutes) {
    const { data: completionsWithMinutes } = await supabase
      .from("task_completions")
      .select("actual_minutes")
      .eq("task_id", input.taskId)
      .not("actual_minutes", "is", null);

    if (completionsWithMinutes && completionsWithMinutes.length > 0) {
      const totalMinutes = completionsWithMinutes.reduce(
        (sum, c) => sum + (c.actual_minutes || 0),
        0
      );
      newActualMinutesAvg = Math.round(totalMinutes / completionsWithMinutes.length);
    }
  }

  // Update task
  const { error: taskUpdateError } = await supabase
    .from("tasks")
    .update({
      last_completed_at: now.toISOString(),
      completion_count: (task.completion_count || 0) + 1,
      actual_minutes_avg: newActualMinutesAvg,
    })
    .eq("id", input.taskId);

  if (taskUpdateError) {
    console.error("Error updating task:", taskUpdateError);
    throw new Error("Failed to update task");
  }

  // Update or create streak record
  const { data: existingStreak } = await supabase
    .from("streaks")
    .select("*")
    .eq("task_id", input.taskId)
    .single();

  const previousStreak = existingStreak?.current_streak || 0;

  // Check for milestone
  const milestoneCheck = hasReachedMilestone(
    streakResult.currentStreak,
    previousStreak
  );

  // Import getCreditsForMilestone to award credits only for the specific milestone reached
  const { getCreditsForMilestone } = await import("@/lib/utils/streak-calculator");

  let newCreditsEarned = 0;
  let updateMilestoneData: { last_milestone_at?: string; next_milestone?: number } = {};

  if (milestoneCheck.reached && milestoneCheck.milestone) {
    // Award credits for the specific milestone reached
    newCreditsEarned = getCreditsForMilestone(milestoneCheck.milestone);
    updateMilestoneData = {
      last_milestone_at: now.toISOString(),
      next_milestone: milestoneCheck.milestone, // Track which milestone was reached
    };
  }

  const streakData = {
    task_id: input.taskId,
    user_id: input.userId,
    current_streak: streakResult.currentStreak,
    longest_streak: streakResult.longestStreak,
    total_completions: streakResult.totalCompletions,
    completion_rate: streakResult.completionRate,
    earned_breaks: (existingStreak?.earned_breaks || 0) + newCreditsEarned,
    available_breaks: (existingStreak?.available_breaks || 0) + newCreditsEarned,
    used_breaks: existingStreak?.used_breaks || 0,
    last_calculated_at: now.toISOString(),
    ...updateMilestoneData,
  };

  if (existingStreak) {
    await supabase
      .from("streaks")
      .update(streakData)
      .eq("id", existingStreak.id);
  } else {
    await supabase.from("streaks").insert(streakData);
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");

  return {
    success: true,
    completion,
    streakResult,
    milestone: milestoneCheck.reached ? milestoneCheck.milestone : null,
    earnedBreakCredits: newCreditsEarned,
  };
}

/**
 * Use a break credit to preserve streak when missing a task
 */
export async function useBreakCredit(taskId: string) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Get the streak record
  const { data: streak, error: streakError } = await supabase
    .from("streaks")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", user.id)
    .single();

  if (streakError || !streak) {
    throw new Error("Streak record not found");
  }

  // Check if user has available break credits
  if ((streak.available_breaks || 0) <= 0) {
    throw new Error("No break credits available");
  }

  // Update streak record: decrement available_breaks, increment used_breaks
  const { error: updateError } = await supabase
    .from("streaks")
    .update({
      available_breaks: (streak.available_breaks || 0) - 1,
      used_breaks: (streak.used_breaks || 0) + 1,
    })
    .eq("id", streak.id);

  if (updateError) {
    console.error("Error using break credit:", updateError);
    throw new Error("Failed to use break credit");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");

  return {
    success: true,
    remainingBreaks: (streak.available_breaks || 0) - 1,
  };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
}

export async function toggleTaskActive(taskId: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ is_active: isActive })
    .eq("id", taskId);

  if (error) {
    console.error("Error toggling task:", error);
    throw new Error("Failed to toggle task");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
}

// ============================================================================
// SUBTASK MANAGEMENT
// ============================================================================

type CreateSubtaskInput = {
  taskId: string;
  title: string;
  isRequired?: boolean;
  sortOrder?: number;
};

type UpdateSubtaskInput = {
  id: string;
  title?: string;
  isRequired?: boolean;
  sortOrder?: number;
};

/**
 * Create a new subtask for a task
 */
export async function createSubtask(input: CreateSubtaskInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("task_subtasks")
    .insert({
      task_id: input.taskId,
      title: input.title,
      is_required: input.isRequired ?? false,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating subtask:", error);
    throw new Error(error.message || "Failed to create subtask");
  }

  // Update has_subtasks flag on parent task
  await supabase
    .from("tasks")
    .update({ has_subtasks: true })
    .eq("id", input.taskId);

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  return data;
}

/**
 * Update an existing subtask
 */
export async function updateSubtask(input: UpdateSubtaskInput) {
  const supabase = await createClient();

  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.isRequired !== undefined) updateData.is_required = input.isRequired;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("task_subtasks")
    .update(updateData)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating subtask:", error);
    throw new Error(error.message || "Failed to update subtask");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  return data;
}

/**
 * Delete a subtask
 */
export async function deleteSubtask(subtaskId: string, taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("task_subtasks")
    .delete()
    .eq("id", subtaskId);

  if (error) {
    console.error("Error deleting subtask:", error);
    throw new Error("Failed to delete subtask");
  }

  // Check if task still has subtasks
  const { data: remainingSubtasks } = await supabase
    .from("task_subtasks")
    .select("id")
    .eq("task_id", taskId);

  // Update has_subtasks flag
  if (remainingSubtasks && remainingSubtasks.length === 0) {
    await supabase
      .from("tasks")
      .update({ has_subtasks: false })
      .eq("id", taskId);
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
}

/**
 * Reorder subtasks for a task
 */
export async function reorderSubtasks(taskId: string, subtaskIds: string[]) {
  const supabase = await createClient();

  // Update each subtask's sort_order based on its position in the array
  const updates = subtaskIds.map((id, index) => ({
    id,
    sort_order: index,
  }));

  for (const update of updates) {
    await supabase
      .from("task_subtasks")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id)
      .eq("task_id", taskId); // Safety check
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
}

/**
 * Get all paused tasks for the authenticated user
 */
export async function getPausedTasks() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_categories (
        id,
        name,
        color,
        icon
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", false)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching paused tasks:", error);
    throw new Error(error.message || "Failed to fetch paused tasks");
  }

  return data || [];
}
