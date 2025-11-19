/**
 * AI Task Suggestion Service
 * Uses OpenAI to generate personalized task suggestions based on user context
 */

import OpenAI from "openai";

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface OnboardingAnswers {
  lives_alone?: boolean;
  has_pets?: boolean;
  has_plants?: boolean;
  plays_instruments?: boolean;
  preferred_task_time?: string; // "morning" | "afternoon" | "evening"
  [key: string]: string | boolean | undefined;
}

export interface TaskSuggestion {
  title: string;
  description: string;
  category: string;
  frequency: "daily" | "weekly" | "custom";
  custom_frequency_days?: number;
  estimated_minutes?: number;
  reasoning?: string; // Why this task was suggested
}

export interface AIResponse {
  suggestions: TaskSuggestion[];
  personalized_message?: string;
  tokens_used?: number;
}

/**
 * Generate task suggestions using OpenAI
 */
export async function generateTaskSuggestions(
  userContext: OnboardingAnswers,
  existingCategories: string[] = [],
  maxSuggestions: number = 5
): Promise<AIResponse> {
  try {
    const client = getOpenAIClient();

    const prompt = buildPrompt(userContext, existingCategories, maxSuggestions);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const parsedResponse = JSON.parse(responseContent) as AIResponse;

    return {
      ...parsedResponse,
      tokens_used: completion.usage?.total_tokens,
    };
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    // Fallback to template-based suggestions
    return getFallbackSuggestions(userContext, maxSuggestions);
  }
}

/**
 * System prompt for the AI assistant
 */
const SYSTEM_PROMPT = `You are Gyst, a helpful AI assistant specialized in creating personalized task management routines.

Your role is to suggest practical, achievable daily and weekly tasks based on the user's lifestyle and preferences. Focus on:
- Tasks that improve quality of life
- Sustainable habits that can be maintained long-term
- Balance between self-care, productivity, and enjoyment
- Realistic time estimates
- Category variety (health, home, social, creative, etc.)

Return your response as a JSON object with this structure:
{
  "suggestions": [
    {
      "title": "Task title (max 60 chars)",
      "description": "Detailed description explaining the task and its benefits",
      "category": "Category name (e.g., Health, Home, Social, Creative, Finance, Learning)",
      "frequency": "daily" or "weekly",
      "estimated_minutes": 15,
      "reasoning": "Brief explanation of why this task suits the user"
    }
  ],
  "personalized_message": "A warm, encouraging message about their routine (2-3 sentences)"
}

Guidelines:
- Be specific and actionable (not vague like "exercise more")
- Consider time constraints - most tasks should be 10-30 minutes
- Adapt to their living situation (alone vs with others, pets, plants, etc.)
- Match tasks to their preferred time of day
- Use encouraging, supportive language
- Avoid overwhelming them - quality over quantity`;

/**
 * Build the user-specific prompt
 */
function buildPrompt(
  userContext: OnboardingAnswers,
  existingCategories: string[],
  maxSuggestions: number
): string {
  const contextParts: string[] = [];

  // Living situation
  if (userContext.lives_alone !== undefined) {
    contextParts.push(
      `Lives: ${userContext.lives_alone ? "alone" : "with others"}`
    );
  }

  // Responsibilities
  const responsibilities: string[] = [];
  if (userContext.has_pets) responsibilities.push("pets");
  if (userContext.has_plants) responsibilities.push("plants");
  if (responsibilities.length > 0) {
    contextParts.push(`Has: ${responsibilities.join(", ")}`);
  }

  // Hobbies/Interests
  if (userContext.plays_instruments) {
    contextParts.push("Plays instruments");
  }

  // Preferred time
  if (userContext.preferred_task_time) {
    contextParts.push(`Prefers tasks in the ${userContext.preferred_task_time}`);
  }

  const userContextStr = contextParts.join(" | ");

  const categoriesStr =
    existingCategories.length > 0
      ? `\n\nExisting categories to use: ${existingCategories.join(", ")}`
      : "";

  return `Generate ${maxSuggestions} personalized task suggestions for this user:

${userContextStr}${categoriesStr}

Focus on tasks that:
1. Fit their lifestyle and living situation
2. Can be completed in their preferred time of day
3. Account for their responsibilities (pets, plants, etc.)
4. Include variety across categories
5. Are specific and actionable

Return exactly ${maxSuggestions} task suggestions in JSON format.`;
}

/**
 * Fallback suggestions when AI is unavailable
 */
function getFallbackSuggestions(
  userContext: OnboardingAnswers,
  maxSuggestions: number
): AIResponse {
  const allSuggestions: TaskSuggestion[] = [
    // Health & Wellness
    {
      title: "Morning Hydration",
      description: "Start your day with a full glass of water to kickstart your metabolism and improve energy levels.",
      category: "Health",
      frequency: "daily",
      estimated_minutes: 2,
      reasoning: "Simple daily habit that sets a positive tone",
    },
    {
      title: "10-Minute Stretching",
      description: "Gentle stretching routine to improve flexibility, reduce muscle tension, and boost circulation.",
      category: "Health",
      frequency: "daily",
      estimated_minutes: 10,
      reasoning: "Low-commitment wellness activity",
    },
    {
      title: "Evening Walk",
      description: "Take a relaxing 15-minute walk to clear your mind, get fresh air, and improve sleep quality.",
      category: "Health",
      frequency: "daily",
      estimated_minutes: 15,
      reasoning: "Gentle outdoor activity",
    },

    // Home & Organization
    {
      title: "5-Minute Tidy",
      description: "Quick declutter session - put away 5 items, wipe one surface, or organize one drawer.",
      category: "Home",
      frequency: "daily",
      estimated_minutes: 5,
      reasoning: "Maintains clean living space",
    },
    {
      title: "Weekly Meal Planning",
      description: "Plan your meals for the upcoming week to save time, reduce stress, and eat healthier.",
      category: "Home",
      frequency: "weekly",
      estimated_minutes: 20,
      reasoning: "Saves time and improves nutrition",
    },

    // Learning & Growth
    {
      title: "Read for 15 Minutes",
      description: "Spend 15 minutes reading a book, article, or learning resource on a topic you're interested in.",
      category: "Learning",
      frequency: "daily",
      estimated_minutes: 15,
      reasoning: "Continuous personal development",
    },
    {
      title: "Learn Something New",
      description: "Dedicate time to learning a new skill, watching an educational video, or practicing a hobby.",
      category: "Learning",
      frequency: "weekly",
      estimated_minutes: 30,
      reasoning: "Keeps mind engaged and growing",
    },

    // Social & Connection
    {
      title: "Connect with Someone",
      description: "Reach out to a friend or family member - text, call, or meet up for quality connection.",
      category: "Social",
      frequency: "weekly",
      estimated_minutes: 20,
      reasoning: "Maintains important relationships",
    },

    // Creative & Hobbies
    {
      title: "Creative Expression",
      description: "Spend time on a creative activity - drawing, writing, music, crafts, or any form of self-expression.",
      category: "Creative",
      frequency: "weekly",
      estimated_minutes: 30,
      reasoning: "Nurtures creativity and joy",
    },

    // Finance & Admin
    {
      title: "Review Expenses",
      description: "Check your spending for the week, review any bills, and ensure your budget is on track.",
      category: "Finance",
      frequency: "weekly",
      estimated_minutes: 15,
      reasoning: "Maintains financial awareness",
    },
  ];

  // Filter based on user context
  let filteredSuggestions = [...allSuggestions];

  // Add pet-specific tasks
  if (userContext.has_pets) {
    filteredSuggestions.unshift({
      title: "Quality Pet Time",
      description: "Dedicate focused playtime or bonding time with your pet - training, playing, or grooming.",
      category: "Home",
      frequency: "daily",
      estimated_minutes: 15,
      reasoning: "You have pets that need attention",
    });
  }

  // Add plant-specific tasks
  if (userContext.has_plants) {
    filteredSuggestions.push({
      title: "Plant Care Check",
      description: "Check soil moisture, rotate plants for even light, remove dead leaves, and water as needed.",
      category: "Home",
      frequency: "weekly",
      estimated_minutes: 10,
      reasoning: "You have plants that need care",
    });
  }

  // Add instrument practice
  if (userContext.plays_instruments) {
    filteredSuggestions.unshift({
      title: "Instrument Practice",
      description: "Practice your instrument - scales, songs, or improvisation. Consistent practice builds skill.",
      category: "Creative",
      frequency: "daily",
      estimated_minutes: 20,
      reasoning: "You play instruments and can practice daily",
    });
  }

  // Select top suggestions
  const selectedSuggestions = filteredSuggestions.slice(0, maxSuggestions);

  return {
    suggestions: selectedSuggestions,
    personalized_message:
      "Here are some personalized task suggestions to help you build a sustainable daily routine. Start with a few that resonate with you, and you can always add more later!",
  };
}

/**
 * Calculate cost estimate for AI request
 */
export function estimateAICost(tokens: number): number {
  // GPT-4o-mini pricing (as of 2024)
  // Input: $0.150 / 1M tokens
  // Output: $0.600 / 1M tokens
  // Rough estimate: assume 50/50 split
  const avgPricePerMillion = 0.375;
  return (tokens / 1_000_000) * avgPricePerMillion;
}
