"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  generateTaskSuggestions,
  OnboardingAnswers,
  AIResponse,
} from "@/lib/ai/suggestions";

const CACHE_TTL_HOURS = 24;
const MAX_REQUESTS_PER_DAY = 10;

/**
 * Generate AI task suggestions for a user
 * Includes caching and rate limiting
 */
export async function getAITaskSuggestions(
  userId: string,
  forceRefresh: boolean = false
): Promise<
  | { success: true; data: AIResponse; cached: boolean }
  | { success: false; error: string }
> {
  const supabase = await createClient();

  try {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const { data: cachedSuggestion } = await supabase
        .from("ai_suggestions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_applied", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (cachedSuggestion) {
        const cacheAge =
          Date.now() - new Date(cachedSuggestion.created_at).getTime();
        const cacheAgeHours = cacheAge / (1000 * 60 * 60);

        // Return cached if still fresh
        if (cacheAgeHours < CACHE_TTL_HOURS) {
          return {
            success: true,
            data: cachedSuggestion.suggested_tasks as AIResponse,
            cached: true,
          };
        }
      }
    }

    // Check rate limiting
    const { data: recentRequests, error: requestCountError } = await supabase
      .from("ai_suggestions")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      );

    if (requestCountError) {
      console.error("Error checking rate limit:", requestCountError);
      return {
        success: false,
        error: "Failed to check rate limit",
      };
    }

    const requestCount = recentRequests?.length || 0;
    if (requestCount >= MAX_REQUESTS_PER_DAY) {
      return {
        success: false,
        error: `Daily limit of ${MAX_REQUESTS_PER_DAY} AI requests reached. Try again tomorrow!`,
      };
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profile) {
      return {
        success: false,
        error: "User profile not found",
      };
    }

    // Build user context from profile
    const userContext: OnboardingAnswers = {
      lives_alone: profile.lives_alone ?? undefined,
      has_pets: profile.has_pets ?? undefined,
      has_plants: profile.has_plants ?? undefined,
      plays_instruments: profile.plays_instruments ?? undefined,
      preferred_task_time: profile.preferred_task_time ?? undefined,
    };

    // Get existing categories
    const { data: categories } = await supabase
      .from("task_categories")
      .select("name")
      .or(`user_id.eq.${userId},is_predefined.eq.true`);

    const categoryNames = categories?.map((c) => c.name) || [];

    // Generate AI suggestions
    const aiResponse = await generateTaskSuggestions(
      userContext,
      categoryNames,
      5
    );

    // Store in database with expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);

    const { error: insertError } = await supabase
      .from("ai_suggestions")
      .insert({
        user_id: userId,
        suggested_tasks: aiResponse as any,
        prompt_context: userContext as any,
        model: "gpt-4o-mini",
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error caching AI suggestion:", insertError);
      // Don't fail the request, just log the error
    }

    return {
      success: true,
      data: aiResponse,
      cached: false,
    };
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate suggestions",
    };
  }
}

/**
 * Apply selected AI suggestions as tasks
 */
export async function applyAISuggestions(
  userId: string,
  suggestionId: string,
  selectedIndices: number[]
): Promise<{ success: boolean; error?: string; createdTasks?: number }> {
  const supabase = await createClient();

  try {
    // Get the suggestion
    const { data: suggestion, error: fetchError } = await supabase
      .from("ai_suggestions")
      .select("*")
      .eq("id", suggestionId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !suggestion) {
      return {
        success: false,
        error: "Suggestion not found",
      };
    }

    const aiResponse = suggestion.suggested_tasks as AIResponse;
    const selectedTasks = selectedIndices
      .map((i) => aiResponse.suggestions[i])
      .filter(Boolean);

    if (selectedTasks.length === 0) {
      return {
        success: false,
        error: "No tasks selected",
      };
    }

    // Get or create categories
    const categoryMap = new Map<string, string>();

    for (const task of selectedTasks) {
      if (!categoryMap.has(task.category)) {
        // Try to find existing category
        const { data: existingCategory } = await supabase
          .from("task_categories")
          .select("id")
          .eq("name", task.category)
          .or(`user_id.eq.${userId},is_predefined.eq.true`)
          .single();

        if (existingCategory) {
          categoryMap.set(task.category, existingCategory.id);
        } else {
          // Create new category
          const { data: newCategory, error: categoryError } = await supabase
            .from("task_categories")
            .insert({
              name: task.category,
              slug: task.category.toLowerCase().replace(/\s+/g, "-"),
              user_id: userId,
            })
            .select("id")
            .single();

          if (categoryError) {
            console.error("Error creating category:", categoryError);
            continue;
          }

          if (newCategory) {
            categoryMap.set(task.category, newCategory.id);
          }
        }
      }
    }

    // Create tasks
    const tasksToCreate = selectedTasks.map((task) => ({
      user_id: userId,
      title: task.title,
      description: task.description,
      category_id: categoryMap.get(task.category) || null,
      frequency: task.frequency,
      custom_frequency_days: task.custom_frequency_days || null,
      estimated_minutes: task.estimated_minutes || null,
      start_date: new Date().toISOString().split("T")[0],
      is_active: true,
    }));

    const { data: createdTasks, error: tasksError } = await supabase
      .from("tasks")
      .insert(tasksToCreate)
      .select();

    if (tasksError) {
      console.error("Error creating tasks:", tasksError);
      return {
        success: false,
        error: "Failed to create tasks",
      };
    }

    // Mark suggestion as applied
    await supabase
      .from("ai_suggestions")
      .update({
        is_applied: true,
        applied_at: new Date().toISOString(),
      })
      .eq("id", suggestionId);

    revalidatePath("/protected/tasks");
    revalidatePath("/protected");

    return {
      success: true,
      createdTasks: createdTasks?.length || 0,
    };
  } catch (error) {
    console.error("Error applying AI suggestions:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to apply suggestions",
    };
  }
}

/**
 * Get AI usage stats for a user
 */
export async function getAIUsageStats(userId: string): Promise<{
  requestsToday: number;
  requestsThisMonth: number;
  remainingToday: number;
  tokensUsedTotal: number;
  estimatedCost: number;
}> {
  const supabase = await createClient();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get today's requests
  const { data: todayRequests } = await supabase
    .from("ai_suggestions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString());

  // Get this month's requests
  const { data: monthRequests } = await supabase
    .from("ai_suggestions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const requestsToday = todayRequests?.length || 0;
  const requestsThisMonth = monthRequests?.length || 0;

  // Calculate token usage (rough estimate if not stored)
  // Assume ~1500 tokens per request on average
  const tokensUsedTotal = requestsThisMonth * 1500;
  const estimatedCost = (tokensUsedTotal / 1_000_000) * 0.375; // $0.375 per 1M tokens avg

  return {
    requestsToday,
    requestsThisMonth,
    remainingToday: Math.max(0, MAX_REQUESTS_PER_DAY - requestsToday),
    tokensUsedTotal,
    estimatedCost,
  };
}
