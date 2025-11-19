"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskPriority, RecurrencePattern } from "@/lib/types/task-scheduling";

type CreateTaskInput = {
  title: string;
  description: string;
  category_id: string;
  frequency: "daily" | "weekly" | "custom";
  user_id: string;
  // Enhanced scheduling fields
  priority?: TaskPriority;
  scheduled_duration?: number | null;
  tags?: string[];
  reminder_minutes_before?: number | null;
  preferred_time?: string | null;
  recurrence_pattern?: RecurrencePattern | null;
};

type UpdateTaskInput = Partial<Omit<CreateTaskInput, 'user_id'>> & {
  id: string;
};

export async function createTask(input: CreateTaskInput) {
  const supabase = await createClient();

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
      user_id: input.user_id,
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

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
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
  // Handle both string taskId and full input object
  const input = typeof taskIdOrInput === "string"
    ? { taskId: taskIdOrInput, userId: "" }
    : taskIdOrInput;
  const supabase = await createClient();

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
  const breakCredits = calculateBreakCredits(streakResult.currentStreak);

  const { data: existingStreak } = await supabase
    .from("streaks")
    .select("*")
    .eq("task_id", input.taskId)
    .single();

  const previousStreak = existingStreak?.current_streak || 0;

  const streakData = {
    task_id: input.taskId,
    user_id: input.userId,
    current_streak: streakResult.currentStreak,
    longest_streak: streakResult.longestStreak,
    total_completions: streakResult.totalCompletions,
    completion_rate: streakResult.completionRate,
    earned_breaks: breakCredits,
    available_breaks: existingStreak
      ? existingStreak.available_breaks + (breakCredits - (existingStreak.earned_breaks || 0))
      : breakCredits,
    last_calculated_at: now.toISOString(),
  };

  if (existingStreak) {
    await supabase
      .from("streaks")
      .update(streakData)
      .eq("id", existingStreak.id);
  } else {
    await supabase.from("streaks").insert(streakData);
  }

  // Check for milestone
  const milestoneCheck = hasReachedMilestone(
    streakResult.currentStreak,
    previousStreak
  );

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");

  return {
    success: true,
    completion,
    streakResult,
    milestone: milestoneCheck.reached ? milestoneCheck.milestone : null,
    earnedBreakCredits: milestoneCheck.reached
      ? breakCredits - (existingStreak?.earned_breaks || 0)
      : 0,
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
