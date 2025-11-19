/**
 * Streak Calculation Utilities
 * Calculates task streaks based on completion history and frequency
 */

export type TaskFrequency = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface CompletionRecord {
  completed_at: Date | string;
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  isActiveToday: boolean;
  missedDays: number;
}

/**
 * Calculates task streak based on frequency and completion history
 */
export function calculateTaskStreak(
  completions: CompletionRecord[],
  frequency: TaskFrequency,
  customFrequencyDays?: number,
  startDate?: Date | string
): StreakResult {
  if (!completions || completions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
      isActiveToday: false,
      missedDays: 0,
    };
  }

  // Convert completion dates to Date objects and sort
  const completionDates = completions
    .map((c) => new Date(c.completed_at))
    .sort((a, b) => a.getTime() - b.getTime());

  const totalCompletions = completionDates.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate expected interval in days based on frequency
  const expectedInterval = getExpectedInterval(frequency, customFrequencyDays);

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(
    completionDates,
    today,
    expectedInterval
  );

  // Calculate longest streak
  const longestStreak = calculateLongestStreak(
    completionDates,
    expectedInterval
  );

  // Check if completed today
  const lastCompletion = completionDates[completionDates.length - 1];
  const isActiveToday = isSameDay(lastCompletion, today);

  // Calculate completion rate
  const start = startDate ? new Date(startDate) : completionDates[0];
  const daysSinceStart = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const expectedCompletions = Math.floor(daysSinceStart / expectedInterval) + 1;
  const completionRate =
    expectedCompletions > 0
      ? Math.min(100, (totalCompletions / expectedCompletions) * 100)
      : 0;

  // Calculate missed days
  const missedDays = calculateMissedDays(
    completionDates,
    today,
    expectedInterval
  );

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate: Math.round(completionRate * 100) / 100,
    isActiveToday,
    missedDays,
  };
}

/**
 * Get expected interval in days for a given frequency
 */
function getExpectedInterval(
  frequency: TaskFrequency,
  customFrequencyDays?: number
): number {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30; // Approximate
    case "yearly":
      return 365;
    case "custom":
      return customFrequencyDays || 1;
    default:
      return 1;
  }
}

/**
 * Calculate current active streak
 */
function calculateCurrentStreak(
  completionDates: Date[],
  today: Date,
  expectedInterval: number
): number {
  if (completionDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date(today);

  // Start from the most recent completion and work backwards
  for (let i = completionDates.length - 1; i >= 0; i--) {
    const completionDate = completionDates[i];

    // Check if this completion is within the expected interval from currentDate
    const daysDiff = Math.floor(
      (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Allow some flexibility: completion can be up to 1 day late
    if (daysDiff <= expectedInterval + 1) {
      streak++;
      // Move currentDate back by the expected interval
      currentDate = new Date(
        completionDate.getTime() - expectedInterval * 24 * 60 * 60 * 1000
      );
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest streak in history
 */
function calculateLongestStreak(
  completionDates: Date[],
  expectedInterval: number
): number {
  if (completionDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completionDates.length; i++) {
    const prevDate = completionDates[i - 1];
    const currDate = completionDates[i];

    const daysDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if this completion continues the streak
    if (daysDiff <= expectedInterval + 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Streak broken, reset
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculate number of missed days/occurrences
 */
function calculateMissedDays(
  completionDates: Date[],
  today: Date,
  expectedInterval: number
): number {
  if (completionDates.length === 0) return 0;

  const lastCompletion = completionDates[completionDates.length - 1];
  const daysSinceLastCompletion = Math.floor(
    (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last completion was within the expected interval, no missed days
  if (daysSinceLastCompletion <= expectedInterval) {
    return 0;
  }

  // Calculate how many intervals have been missed
  return Math.floor(daysSinceLastCompletion / expectedInterval);
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Calculate break credits earned based on streak milestones
 * Earn 1 break credit for every 7-day streak
 */
export function calculateBreakCredits(currentStreak: number): number {
  return Math.floor(currentStreak / 7);
}

/**
 * Determine the next milestone for streak celebration
 */
export function getNextMilestone(currentStreak: number): number {
  const milestones = [7, 14, 30, 50, 100, 365, 500, 1000];

  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }

  // If past all milestones, return next 100 increment
  return Math.ceil(currentStreak / 100) * 100 + 100;
}

/**
 * Check if current streak has reached a milestone
 */
export function hasReachedMilestone(
  currentStreak: number,
  previousStreak: number
): { reached: boolean; milestone?: number } {
  const milestones = [7, 14, 30, 50, 100, 365, 500, 1000];

  for (const milestone of milestones) {
    if (previousStreak < milestone && currentStreak >= milestone) {
      return { reached: true, milestone };
    }
  }

  return { reached: false };
}
