"use server";

import { createClient } from "@/lib/supabase/server";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CompletionRateData {
  date: string;
  completed: number;
  total: number;
  rate: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StreakHistoryPoint {
  date: string;
  streak: number;
}

export interface TimeSpentData {
  category: string;
  totalMinutes: number;
  avgMinutes: number;
  count: number;
}

export interface PersonalRecord {
  id: string;
  title: string;
  value: string | number;
  date?: string;
  description: string;
  icon: string;
}

export interface StatisticsSummary {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalTimeSpent: number;
  longestStreak: number;
  currentStreak: number;
  totalCategories: number;
  activeTasksToday: number;
}

/**
 * Get statistics summary for the user
 */
export async function getStatisticsSummary(
  userId: string
): Promise<StatisticsSummary> {
  const supabase = await createClient();

  // Get total and completed tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, completion_count")
    .eq("user_id", userId);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.completion_count > 0).length || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get total time spent
  const { data: completions } = await supabase
    .from("task_completions")
    .select("actual_minutes")
    .eq("user_id", userId);

  const totalTimeSpent = completions?.reduce((sum, c) => sum + (c.actual_minutes || 0), 0) || 0;

  // Get streak information
  const { data: streaks } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", userId);

  const currentStreak = streaks?.[0]?.current_streak || 0;
  const longestStreak = Math.max(...(streaks?.map(s => s.longest_streak) || [0]));

  // Get total categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id")
    .or(`user_id.eq.${userId},is_predefined.eq.true`);

  const totalCategories = categories?.length || 0;

  // Get active tasks today
  const today = new Date().toISOString().split('T')[0];
  const { data: todayCompletions } = await supabase
    .from("task_completions")
    .select("id")
    .eq("user_id", userId)
    .gte("completed_at", today);

  const activeTasksToday = todayCompletions?.length || 0;

  return {
    totalTasks,
    completedTasks,
    completionRate,
    totalTimeSpent,
    longestStreak,
    currentStreak,
    totalCategories,
    activeTasksToday,
  };
}

/**
 * Get completion rate data over time
 */
export async function getCompletionRateData(
  userId: string,
  dateRange: DateRange
): Promise<CompletionRateData[]> {
  const supabase = await createClient();

  // Get all tasks for the user
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, frequency, created_at")
    .eq("user_id", userId)
    .lte("created_at", dateRange.to.toISOString());

  if (!tasks) return [];

  // Get completions in date range
  const { data: completions } = await supabase
    .from("task_completions")
    .select("task_id, completed_at")
    .eq("user_id", userId)
    .gte("completed_at", dateRange.from.toISOString())
    .lte("completed_at", dateRange.to.toISOString());

  // Group completions by date
  const completionsByDate = new Map<string, Set<string>>();
  completions?.forEach(c => {
    const date = format(new Date(c.completed_at), "yyyy-MM-dd");
    if (!completionsByDate.has(date)) {
      completionsByDate.set(date, new Set());
    }
    completionsByDate.get(date)!.add(c.task_id);
  });

  // Generate data for each day in range
  const result: CompletionRateData[] = [];
  const currentDate = new Date(dateRange.from);

  while (currentDate <= dateRange.to) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const completedCount = completionsByDate.get(dateStr)?.size || 0;

    // Count tasks that should be done on this day (daily tasks created before this date)
    const expectedTasks = tasks.filter(t => {
      const createdAt = new Date(t.created_at);
      return createdAt <= currentDate && t.frequency === "daily";
    }).length;

    const rate = expectedTasks > 0 ? (completedCount / expectedTasks) * 100 : 0;

    result.push({
      date: format(currentDate, "MMM dd"),
      completed: completedCount,
      total: expectedTasks,
      rate: Math.round(rate),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * Get category breakdown
 */
export async function getCategoryBreakdown(
  userId: string,
  dateRange?: DateRange
): Promise<CategoryBreakdown[]> {
  const supabase = await createClient();

  // Build query for completions
  let query = supabase
    .from("task_completions")
    .select(`
      task_id,
      tasks!inner(
        category_id,
        categories!inner(name, color)
      )
    `)
    .eq("user_id", userId);

  if (dateRange) {
    query = query
      .gte("completed_at", dateRange.from.toISOString())
      .lte("completed_at", dateRange.to.toISOString());
  }

  const { data: completions } = await query;

  if (!completions) return [];

  // Count completions by category
  const categoryMap = new Map<string, { count: number; color: string }>();

  completions.forEach((c: any) => {
    const categoryName = c.tasks.categories.name;
    const categoryColor = c.tasks.categories.color;

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, { count: 0, color: categoryColor });
    }
    categoryMap.get(categoryName)!.count++;
  });

  const total = completions.length;

  // Convert to array and calculate percentages
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      percentage: Math.round((data.count / total) * 100),
      color: data.color,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get streak history over time
 */
export async function getStreakHistory(
  userId: string,
  dateRange: DateRange
): Promise<StreakHistoryPoint[]> {
  const supabase = await createClient();

  // Get all completions for calculating historical streaks
  const { data: completions } = await supabase
    .from("task_completions")
    .select("task_id, completed_at")
    .eq("user_id", userId)
    .lte("completed_at", dateRange.to.toISOString())
    .order("completed_at", { ascending: true });

  if (!completions) return [];

  // Calculate streak for each day in range
  const result: StreakHistoryPoint[] = [];
  const currentDate = new Date(dateRange.from);

  while (currentDate <= dateRange.to) {
    const dateStr = format(currentDate, "yyyy-MM-dd");

    // Count unique tasks completed up to this day
    const completionsUpToDate = completions.filter(
      c => new Date(c.completed_at) <= currentDate
    );

    // Simple streak calculation: count consecutive days with completions
    let streak = 0;
    let checkDate = new Date(currentDate);

    while (true) {
      const checkDateStr = format(checkDate, "yyyy-MM-dd");
      const hasCompletion = completions.some(
        c => format(new Date(c.completed_at), "yyyy-MM-dd") === checkDateStr
      );

      if (!hasCompletion) break;

      streak++;
      checkDate.setDate(checkDate.getDate() - 1);

      // Limit lookback to prevent infinite loop
      if (streak > 365) break;
    }

    result.push({
      date: format(currentDate, "MMM dd"),
      streak,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * Get time spent analysis by category
 */
export async function getTimeSpentData(
  userId: string,
  dateRange?: DateRange
): Promise<TimeSpentData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("task_completions")
    .select(`
      actual_minutes,
      tasks!inner(
        category_id,
        categories!inner(name)
      )
    `)
    .eq("user_id", userId)
    .not("actual_minutes", "is", null);

  if (dateRange) {
    query = query
      .gte("completed_at", dateRange.from.toISOString())
      .lte("completed_at", dateRange.to.toISOString());
  }

  const { data: completions } = await query;

  if (!completions) return [];

  // Group by category
  const categoryMap = new Map<string, { total: number; count: number }>();

  completions.forEach((c: any) => {
    const categoryName = c.tasks.categories.name;
    const minutes = c.actual_minutes || 0;

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, { total: 0, count: 0 });
    }
    const data = categoryMap.get(categoryName)!;
    data.total += minutes;
    data.count++;
  });

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      totalMinutes: data.total,
      avgMinutes: Math.round(data.total / data.count),
      count: data.count,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}

/**
 * Get personal records and achievements
 */
export async function getPersonalRecords(
  userId: string
): Promise<PersonalRecord[]> {
  const supabase = await createClient();

  // Get all necessary data
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, completion_count, created_at")
    .eq("user_id", userId);

  const { data: completions } = await supabase
    .from("task_completions")
    .select("id, task_id, actual_minutes, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });

  const { data: streaks } = await supabase
    .from("streaks")
    .select("longest_streak, last_completion_date")
    .eq("user_id", userId);

  if (!tasks || !completions || !streaks) return [];

  const records: PersonalRecord[] = [];

  // Longest streak
  const longestStreak = Math.max(...streaks.map(s => s.longest_streak || 0), 0);
  if (longestStreak > 0) {
    records.push({
      id: "longest-streak",
      title: "Longest Streak",
      value: `${longestStreak} days`,
      description: "Your best consecutive completion streak",
      icon: "flame",
    });
  }

  // Most completed task
  const mostCompletedTask = tasks.reduce((max, task) =>
    task.completion_count > (max?.completion_count || 0) ? task : max
  , tasks[0]);

  if (mostCompletedTask && mostCompletedTask.completion_count > 0) {
    records.push({
      id: "most-completed",
      title: "Most Completed Task",
      value: mostCompletedTask.completion_count,
      description: mostCompletedTask.title,
      icon: "trophy",
    });
  }

  // Total completions
  records.push({
    id: "total-completions",
    title: "Total Completions",
    value: completions.length,
    description: "All-time task completions",
    icon: "check-circle",
  });

  // Busiest day
  const completionsByDate = new Map<string, number>();
  completions.forEach(c => {
    const date = format(new Date(c.completed_at), "yyyy-MM-dd");
    completionsByDate.set(date, (completionsByDate.get(date) || 0) + 1);
  });

  const busiestDay = Array.from(completionsByDate.entries())
    .reduce((max, [date, count]) => count > max.count ? { date, count } : max,
      { date: "", count: 0 });

  if (busiestDay.count > 0) {
    records.push({
      id: "busiest-day",
      title: "Busiest Day",
      value: busiestDay.count,
      date: format(new Date(busiestDay.date), "MMM dd, yyyy"),
      description: "Most tasks completed in one day",
      icon: "calendar",
    });
  }

  // Average daily completions
  const daysSinceFirst = completions.length > 0
    ? Math.ceil((Date.now() - new Date(completions[0].completed_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (daysSinceFirst > 0) {
    const avgDaily = (completions.length / daysSinceFirst).toFixed(1);
    records.push({
      id: "avg-daily",
      title: "Average Daily",
      value: avgDaily,
      description: "Average tasks completed per day",
      icon: "trending-up",
    });
  }

  // Most productive hour (if we have actual_minutes data)
  const completionsWithTime = completions.filter(c => c.actual_minutes);
  if (completionsWithTime.length > 0) {
    const totalMinutes = completionsWithTime.reduce((sum, c) => sum + (c.actual_minutes || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    records.push({
      id: "total-time",
      title: "Total Time Invested",
      value: `${hours}h ${minutes}m`,
      description: "Time spent completing tasks",
      icon: "clock",
    });
  }

  return records;
}

/**
 * Export statistics as CSV
 */
export async function exportStatisticsCSV(
  userId: string,
  dateRange: DateRange
): Promise<string> {
  const supabase = await createClient();

  const { data: completions } = await supabase
    .from("task_completions")
    .select(`
      completed_at,
      actual_minutes,
      notes,
      tasks!inner(
        title,
        categories!inner(name)
      )
    `)
    .eq("user_id", userId)
    .gte("completed_at", dateRange.from.toISOString())
    .lte("completed_at", dateRange.to.toISOString())
    .order("completed_at", { ascending: true });

  if (!completions) return "";

  // Build CSV
  const headers = ["Date", "Task", "Category", "Time (min)", "Notes"];
  const rows = completions.map((c: any) => [
    format(new Date(c.completed_at), "yyyy-MM-dd HH:mm"),
    `"${c.tasks.title.replace(/"/g, '""')}"`,
    c.tasks.categories.name,
    c.actual_minutes || "",
    c.notes ? `"${c.notes.replace(/"/g, '""')}"` : "",
  ]);

  return [
    headers.join(","),
    ...rows.map(row => row.join(",")),
  ].join("\n");
}
