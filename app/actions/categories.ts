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

  // Generate slug from name: lowercase, replace spaces with hyphens, remove special chars
  const slug = input.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const { data, error } = await supabase
    .from("task_categories")
    .insert({
      name: input.name,
      slug: slug,
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

  // Generate slug from name if name is being updated
  const updateData: any = {
    name: input.name,
    color: input.color,
    icon: input.icon,
  };

  if (input.name) {
    updateData.slug = input.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const { data, error } = await supabase
    .from("task_categories")
    .update(updateData)
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
    .order("sort_order", { ascending: true, nullsFirst: false })
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

export async function updateCategoriesOrder(
  updates: Array<{ id: string; sort_order: number }>
) {
  const supabase = await createClient();

  // Update each category's sort_order
  const promises = updates.map(({ id, sort_order }) =>
    supabase
      .from("task_categories")
      .update({ sort_order })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  // Check for errors
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error updating categories order:", errors);
    throw new Error("Failed to update categories order");
  }

  revalidatePath("/protected/tasks");
  revalidatePath("/protected/settings");
  revalidatePath("/protected");
}
