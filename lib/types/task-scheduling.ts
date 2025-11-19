/**
 * Task Scheduling Types
 * Extended types for enhanced task scheduling features
 */

// Task Priority Levels
export type TaskPriority = 'low' | 'medium' | 'high';

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

// Recurrence Pattern Interface
export interface RecurrencePattern {
  // Weekly: specific days of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  daysOfWeek?: number[];

  // Monthly: specific days of month (1-31)
  daysOfMonth?: number[];

  // Custom interval
  interval?: number;
  unit?: 'days' | 'weeks' | 'months';

  // Weekdays only (Mon-Fri)
  weekdaysOnly?: boolean;

  // Exclusion dates (ISO date strings)
  exclusionDates?: string[];
}

// Extended Task Type (augments database Task type)
export interface TaskScheduling {
  priority: TaskPriority;
  scheduled_duration: number | null; // minutes
  tags: string[];
  reminder_minutes_before: number | null;
  recurrence_pattern: RecurrencePattern | null;
}

// Form Data for Task Creation/Update
export interface TaskSchedulingFormData {
  priority?: TaskPriority;
  scheduled_duration?: number | null;
  tags?: string[];
  reminder_minutes_before?: number | null;
  recurrence_pattern?: RecurrencePattern | null;
}

// Common reminder options (in minutes)
export const REMINDER_OPTIONS = [
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
] as const;

// Recurrence frequency options
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export const RECURRENCE_FREQUENCIES: RecurrenceFrequency[] = [
  'daily',
  'weekly',
  'monthly',
  'custom',
];

// Days of week (for weekly recurrence)
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
] as const;
