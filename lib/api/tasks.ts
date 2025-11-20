import { handleServerAction, safeServerAction, type Result } from "./client";
import {
  createTask,
  completeTask,
  deleteTask,
  toggleTaskActive,
  useBreakCredit,
} from "@/app/actions/tasks";
import type { Database } from "@/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

export type CreateTaskInput = {
  title: string;
  description?: string;
  category_id: string;
  frequency: "daily" | "weekly" | "custom";
  estimated_minutes?: number;
  subtasks?: string[];
};

/**
 * Create a new task
 */
export async function apiCreateTask(
  input: CreateTaskInput
): Promise<Result<Task>> {
  return safeServerAction(() => createTask(input));
}

/**
 * Complete a task and update streak
 */
export async function apiCompleteTask(taskId: string): Promise<Result<void>> {
  return safeServerAction(() => completeTask(taskId));
}

/**
 * Delete a task
 */
export async function apiDeleteTask(taskId: string): Promise<Result<void>> {
  return safeServerAction(() => deleteTask(taskId));
}

/**
 * Toggle task active/paused state
 */
export async function apiToggleTaskActive(
  taskId: string,
  isActive: boolean
): Promise<Result<void>> {
  return safeServerAction(() => toggleTaskActive(taskId, isActive));
}

/**
 * Batch toggle multiple tasks
 */
export async function apiBatchToggleTasks(
  taskIds: string[],
  isActive: boolean
): Promise<Result<void>[]> {
  const actions = taskIds.map((id) =>
    safeServerAction(() => toggleTaskActive(id, isActive))
  );
  return Promise.all(actions);
}

/**
 * Batch delete multiple tasks
 */
export async function apiBatchDeleteTasks(
  taskIds: string[]
): Promise<Result<void>[]> {
  const actions = taskIds.map((id) => safeServerAction(() => deleteTask(id)));
  return Promise.all(actions);
}

/**
 * Use a break credit to preserve streak
 */
export async function apiUseBreakCredit(
  taskId: string
): Promise<Result<{ success: boolean; remainingBreaks: number }>> {
  return safeServerAction(() => useBreakCredit(taskId));
}
