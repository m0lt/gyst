import { safeServerAction, type Result } from "./client";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  updateCategoriesOrder,
} from "@/app/actions/categories";
import type { Database } from "@/database.types";

type Category = Database["public"]["Tables"]["task_categories"]["Row"];

export type CreateCategoryInput = {
  name: string;
  color: string;
  icon?: string;
  user_id?: string;
  is_predefined?: boolean;
};

/**
 * Create a new category
 */
export async function apiCreateCategory(
  input: CreateCategoryInput
): Promise<Result<Category>> {
  return safeServerAction(() => createCategory(input));
}

/**
 * Update an existing category
 */
export async function apiUpdateCategory(
  categoryId: string,
  input: Partial<CreateCategoryInput>
): Promise<Result<Category>> {
  return safeServerAction(() => updateCategory(categoryId, input));
}

/**
 * Delete a category
 */
export async function apiDeleteCategory(
  categoryId: string
): Promise<Result<void>> {
  return safeServerAction(() => deleteCategory(categoryId));
}

/**
 * Get all categories (predefined + user custom)
 */
export async function apiGetCategories(
  userId?: string
): Promise<Result<Category[]>> {
  return safeServerAction(() => getCategories(userId));
}

/**
 * Update categories sort order
 */
export async function apiUpdateCategoriesOrder(
  updates: Array<{ id: string; sort_order: number }>
): Promise<Result<void>> {
  return safeServerAction(() => updateCategoriesOrder(updates));
}
