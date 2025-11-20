"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ProfileData {
  display_name?: string;
  timezone?: string;
  language?: string;
  avatar_url?: string;
}

export interface PreferencesData {
  lives_alone?: boolean;
  has_pets?: boolean;
  has_plants?: boolean;
  plays_instruments?: boolean;
  preferred_task_time?: "morning" | "afternoon" | "evening";
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: ProfileData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath("/protected/settings");
  return { success: true };
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient();

  // Upload to Supabase Storage
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw new Error("Failed to upload avatar");
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  await updateProfile(userId, { avatar_url: publicUrl });

  return { url: publicUrl };
}

/**
 * Export all user data as JSON
 */
export async function exportUserData(userId: string) {
  const supabase = await createClient();

  // Get all user data
  const [
    { data: profile },
    { data: tasks },
    { data: categories },
    { data: completions },
    { data: streaks },
    { data: preferences },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("tasks").select("*").eq("user_id", userId),
    supabase.from("task_categories").select("*").eq("user_id", userId),
    supabase.from("task_completions").select("*").eq("user_id", userId),
    supabase.from("streaks").select("*").eq("user_id", userId),
    supabase.from("notification_preferences").select("*").eq("user_id", userId),
  ]);

  const exportData = {
    exportDate: new Date().toISOString(),
    userId,
    profile,
    tasks,
    categories,
    completions,
    streaks,
    preferences,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Update user preferences
 */
export async function updatePreferences(userId: string, data: PreferencesData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating preferences:", error);
    throw new Error("Failed to update preferences");
  }

  revalidatePath("/protected/settings");
  return { success: true };
}

/**
 * Delete user account and all associated data
 */
export async function deleteAccount(userId: string) {
  const supabase = await createClient();

  // Delete user data (CASCADE will handle related records)
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }

  // Sign out and redirect
  await supabase.auth.signOut();
  return { success: true };
}
