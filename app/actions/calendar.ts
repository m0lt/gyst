"use server";

import { createClient } from "@/lib/supabase/server";
import { addDays, startOfDay, endOfDay, parseISO, format } from "date-fns";

/**
 * Calendar event from external calendar
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  is_task_related: boolean;
  task_id?: string;
  blocks_scheduling: boolean;
  provider?: string;
}

/**
 * Task instance scheduled for a specific date
 */
export interface TaskInstance {
  id: string;
  task_id: string;
  due_date: string;
  scheduled_time?: string;
  status: string;
  completed_at?: string;
  task?: {
    title: string;
    description?: string;
    estimated_minutes?: number;
    scheduled_duration?: number;
    category_id?: string;
    category?: {
      name: string;
      color?: string;
      icon?: string;
    };
  };
}

/**
 * Paused task (task with is_active = false)
 */
export interface PausedTask {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  priority: string;
  preferred_time?: string;
  scheduled_duration?: number;
  task_categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

/**
 * Combined calendar data for a date range
 */
export interface CalendarData {
  taskInstances: TaskInstance[];
  externalEvents: CalendarEvent[];
  pausedTasks?: PausedTask[];
}

/**
 * Get all calendar data (task instances + external events) for a date range
 * Optionally includes paused tasks
 */
export async function getCalendarData(
  userId: string,
  startDate: Date,
  endDate: Date,
  includePaused: boolean = true
): Promise<CalendarData> {
  const supabase = await createClient();

  const startStr = format(startOfDay(startDate), "yyyy-MM-dd");
  const endStr = format(endOfDay(endDate), "yyyy-MM-dd");

  // Get task instances - simplified query without double nesting
  // Only show instances from active (non-paused) tasks
  const { data: taskInstances, error: taskError } = await supabase
    .from("task_instances")
    .select(`
      *,
      tasks!inner (
        title,
        description,
        estimated_minutes,
        scheduled_duration,
        category_id,
        is_active,
        task_categories (
          name,
          color,
          icon
        )
      )
    `)
    .eq("user_id", userId)
    .eq("tasks.is_active", true)
    .gte("due_date", startStr)
    .lte("due_date", endStr)
    .order("due_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (taskError) {
    console.error("❌ Error fetching task instances:", taskError);
    console.error("Error code:", taskError.code);
    console.error("Error message:", taskError.message);
    console.error("Error hint:", taskError.hint);
    console.error("Error details:", taskError.details);
  } else {
    console.log("✅ Successfully fetched task instances:", taskInstances?.length || 0);
    if (taskInstances && taskInstances.length > 0) {
      console.log("📊 All tasks with durations:");
      taskInstances.slice(0, 10).forEach((instance: any, index: number) => {
        const title = instance.tasks?.title || 'Untitled';
        const scheduled = instance.tasks?.scheduled_duration;
        const estimated = instance.tasks?.estimated_minutes;
        const calculated = scheduled || estimated || 30;
        console.log(`  ${index + 1}. "${title}": scheduled=${scheduled}, estimated=${estimated}, final=${calculated}min`);
      });
    }
  }

  // Get external calendar events
  const { data: externalEvents, error: eventsError } = await supabase
    .from("calendar_events")
    .select(`
      id,
      external_event_id,
      title,
      description,
      start_time,
      end_time,
      all_day,
      location,
      is_task_related,
      task_id,
      blocks_scheduling,
      calendar_connection:calendar_connections (
        provider
      )
    `)
    .eq("user_id", userId)
    .gte("start_time", startStr)
    .lte("end_time", endStr)
    .order("start_time", { ascending: true });

  if (eventsError) {
    console.error("Error fetching external events:", eventsError);
  }

  // Map the response to match our interface (tasks -> task)
  const mappedInstances = (taskInstances || []).map((instance: any) => ({
    ...instance,
    task: instance.tasks ? {
      ...instance.tasks,
      category: instance.tasks.task_categories,
    } : undefined,
  }));

  // Get paused tasks if requested
  let pausedTasks: PausedTask[] = [];
  if (includePaused) {
    pausedTasks = await getPausedTasksForDate(userId, startDate);
  }

  return {
    taskInstances: mappedInstances as unknown as TaskInstance[],
    externalEvents: (externalEvents || []).map((event: any) => ({
      ...event,
      provider: event.calendar_connection?.provider,
    })) as CalendarEvent[],
    pausedTasks,
  };
}

/**
 * Reschedule a task instance to a new date/time
 */
export async function rescheduleTaskInstance(
  instanceId: string,
  userId: string,
  newDate: Date,
  newTime?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const updateData: any = {
    due_date: format(newDate, "yyyy-MM-dd"),
    updated_at: new Date().toISOString(),
  };

  if (newTime !== undefined) {
    updateData.scheduled_time = newTime;
  }

  const { error } = await supabase
    .from("task_instances")
    .update(updateData)
    .eq("id", instanceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error rescheduling task instance:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Generate task instances for a date range (if they don't exist yet)
 * This ensures we always have instances to display in the calendar
 */
export async function generateTaskInstancesForRange(
  userId: string,
  days: number = 90
): Promise<{ success: boolean; generated: number }> {
  const supabase = await createClient();

  // Get all active recurring tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .eq("is_recurring", true);

  if (tasksError || !tasks) {
    console.error("Error fetching tasks:", tasksError);
    return { success: false, generated: 0 };
  }

  let generatedCount = 0;
  const endDate = addDays(new Date(), days);

  for (const task of tasks) {
    // Skip if no recurrence info
    if (!task.recurrence_pattern && !task.frequency) continue;

    // Get existing instances for this task
    const { data: existingInstances } = await supabase
      .from("task_instances")
      .select("due_date")
      .eq("task_id", task.id)
      .eq("user_id", userId);

    const existingDates = new Set(
      existingInstances?.map((i) => i.due_date) || []
    );

    // Generate instances based on recurrence pattern or frequency
    const instances = generateInstancesFromRecurrence(
      task,
      new Date(),
      endDate,
      existingDates
    );

    if (instances.length > 0) {
      const { error: insertError } = await supabase
        .from("task_instances")
        .insert(
          instances.map((date) => ({
            task_id: task.id,
            user_id: userId,
            due_date: format(date, "yyyy-MM-dd"),
            scheduled_time: task.preferred_time,
            status: "pending",
          }))
        );

      if (!insertError) {
        generatedCount += instances.length;
      }
    }
  }

  return { success: true, generated: generatedCount };
}

/**
 * Helper function to generate instance dates from recurrence pattern
 */
function generateInstancesFromRecurrence(
  task: any,
  startDate: Date,
  endDate: Date,
  existingDates: Set<string>
): Date[] {
  const instances: Date[] = [];

  // Use frequency if recurrence_pattern is not set
  const frequency = task.frequency || (typeof task.recurrence_pattern === 'string' ? task.recurrence_pattern : null);
  const patternOptions = (task.recurrence_pattern && typeof task.recurrence_pattern === 'object') ? task.recurrence_pattern : {};
  const weekdaysOnly = patternOptions.weekdaysOnly || false;

  let currentDate = startOfDay(startDate);

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");

    if (!existingDates.has(dateStr)) {
      let shouldInclude = false;

      // Check if weekdays only and skip weekends
      if (weekdaysOnly) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          currentDate = addDays(currentDate, 1);
          continue;
        }
      }

      switch (frequency) {
        case "daily":
          shouldInclude = true;
          break;
        case "weekly":
          // Same day of week as task start
          if (task.start_date || task.created_at) {
            const referenceDate = task.start_date ? parseISO(task.start_date) : parseISO(task.created_at);
            const taskDay = referenceDate.getDay();
            shouldInclude = currentDate.getDay() === taskDay;
          }
          break;
        case "monthly":
          // Same date of month as task start
          if (task.start_date || task.created_at) {
            const referenceDate = task.start_date ? parseISO(task.start_date) : parseISO(task.created_at);
            const taskDate = referenceDate.getDate();
            shouldInclude = currentDate.getDate() === taskDate;
          }
          break;
      }

      if (shouldInclude) {
        instances.push(new Date(currentDate));
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return instances;
}

/**
 * Get external calendar events for a date range
 */
export async function getExternalEvents(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select(`
      *,
      calendar_connection:calendar_connections (
        provider,
        name
      )
    `)
    .eq("user_id", userId)
    .gte("start_time", format(startDate, "yyyy-MM-dd"))
    .lte("end_time", format(endDate, "yyyy-MM-dd"))
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching external events:", error);
    return [];
  }

  return (data || []).map((event: any) => ({
    ...event,
    provider: event.calendar_connection?.provider,
  }));
}

/**
 * Update existing task instances to use preferred_time from their tasks
 * Only updates future instances (today and beyond) that are not completed
 */
export async function updateTaskInstancesWithPreferredTime(
  userId: string
): Promise<{ success: boolean; updated: number }> {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  // Get all tasks with preferred_time
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, preferred_time")
    .eq("user_id", userId)
    .not("preferred_time", "is", null);

  if (tasksError || !tasks) {
    console.error("Error fetching tasks:", tasksError);
    return { success: false, updated: 0 };
  }

  let updatedCount = 0;

  // Update instances for each task - only future instances
  for (const task of tasks) {
    const { error: updateError } = await supabase
      .from("task_instances")
      .update({ scheduled_time: task.preferred_time })
      .eq("task_id", task.id)
      .eq("user_id", userId)
      .gte("due_date", today)
      .is("scheduled_time", null)
      .is("completed_at", null); // Only update non-completed instances

    if (!updateError) {
      updatedCount++;
    }
  }

  return { success: true, updated: updatedCount };
}

/**
 * Check if a time slot has scheduling conflicts with external events
 */
export async function checkSchedulingConflicts(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<{
  hasConflict: boolean;
  conflicts: CalendarEvent[];
}> {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId)
    .eq("blocks_scheduling", true)
    .or(
      `and(start_time.lte.${endTime.toISOString()},end_time.gte.${startTime.toISOString()})`
    );

  if (error) {
    console.error("Error checking conflicts:", error);
    return { hasConflict: false, conflicts: [] };
  }

  return {
    hasConflict: (events?.length || 0) > 0,
    conflicts: (events || []) as CalendarEvent[],
  };
}

/**
 * Get paused tasks for a specific date
 * Returns tasks with is_active = false that would have instances on the given date
 */
export async function getPausedTasksForDate(
  userId: string,
  date: Date
): Promise<PausedTask[]> {
  const supabase = await createClient();

  const dateStr = format(date, "yyyy-MM-dd");

  // Get paused tasks that have instances on this date
  // This shows what tasks are paused but would normally appear on this day
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      frequency,
      priority,
      preferred_time,
      scheduled_duration,
      task_categories (
        id,
        name,
        color,
        icon
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", false)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching paused tasks:", error);
    return [];
  }

  // Map to PausedTask interface
  return (tasks || []).map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    frequency: task.frequency,
    priority: task.priority,
    preferred_time: task.preferred_time,
    scheduled_duration: task.scheduled_duration,
    task_categories: task.task_categories,
  }));
}
