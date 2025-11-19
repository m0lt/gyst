"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OnboardingAnswers } from "@/components/onboarding/onboarding-wizard";

/**
 * Save onboarding answers to user profile
 */
export async function completeOnboarding(
  userId: string,
  answers: OnboardingAnswers
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    console.log("[Onboarding] Starting completion for user:", userId);
    console.log("[Onboarding] Answers:", answers);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        lives_alone: answers.lives_alone ?? null,
        has_pets: answers.has_pets ?? null,
        has_plants: answers.has_plants ?? null,
        plays_instruments: answers.plays_instruments ?? null,
        preferred_task_time: answers.preferred_task_time ?? null,
        onboarding_completed: true,
      })
      .eq("id", userId)
      .select();

    console.log("[Onboarding] Update result:", { data, error });

    if (error) {
      console.error("[Onboarding] Error saving onboarding:", error);
      return {
        success: false,
        error: "Failed to save your preferences",
      };
    }

    if (!data || data.length === 0) {
      console.error("[Onboarding] No profile found for user:", userId);
      return {
        success: false,
        error: "Profile not found",
      };
    }

    console.log("[Onboarding] Successfully updated profile");

    revalidatePath("/protected");
    revalidatePath("/protected/onboarding");

    // Redirect after successful save
    redirect("/protected");
  } catch (error: any) {
    // If error is from redirect, let it propagate
    // Next.js redirect throws a special error with digest property
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error completing onboarding:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatus(
  userId: string
): Promise<{ completed: boolean; profile?: any }> {
  const supabase = await createClient();

  try {
    console.log("[Onboarding Check] Checking status for user:", userId);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("[Onboarding Check] Result:", { profile, error });

    if (error || !profile) {
      console.log("[Onboarding Check] No profile found or error");
      return { completed: false };
    }

    const completed = profile.onboarding_completed ?? false;
    console.log("[Onboarding Check] Onboarding completed:", completed);

    return {
      completed,
      profile,
    };
  } catch (error) {
    console.error("[Onboarding Check] Error checking onboarding status:", error);
    return { completed: false };
  }
}
