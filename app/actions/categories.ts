"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CreateCategoryInput = {
  name: string;
  color: string;
  icon?: string;
  user_id?: string; // Optional for custom categories
  is_predefined?: boolean;
};

export async function createCategory(input: CreateCategoryInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("task_categories")
    .insert({
      name: input.name,
      color: input.color,
      icon: input.icon || null,
      user_id: input.user_id || null,
      is_predefined: input.is_predefined || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  return data;
}

export async function updateCategory(
  categoryId: string,
  input: Partial<CreateCategoryInput>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("task_categories")
    .update({
      name: input.name,
      color: input.color,
      icon: input.icon,
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
  return data;
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();

  // Check if category has tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id")
    .eq("category_id", categoryId)
    .limit(1);

  if (tasksError) {
    console.error("Error checking category tasks:", tasksError);
    throw new Error("Failed to check category tasks");
  }

  if (tasks && tasks.length > 0) {
    throw new Error("Cannot delete category with existing tasks");
  }

  const { error } = await supabase
    .from("task_categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected");
}

export async function getCategories(userId?: string) {
  const supabase = await createClient();

  // Get predefined categories and user's custom categories
  const query = supabase
    .from("task_categories")
    .select("*")
    .order("is_predefined", { ascending: false })
    .order("name");

  if (userId) {
    query.or(`is_predefined.eq.true,user_id.eq.${userId}`);
  } else {
    query.eq("is_predefined", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data;
}
