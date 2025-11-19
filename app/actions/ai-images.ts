"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

// Initialize OpenAI client
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

/**
 * Create a Mucha Art Nouveau style prompt from task details
 */
function createMuchaPrompt(title: string, description: string | null): string {
  // Simplified task context - use only title to avoid safety issues
  const taskContext = title;

  return `Art Nouveau poster in the style of Alphonse Mucha, elegant decorative design representing the theme of "${taskContext}", flowing organic lines, ornamental floral borders, soft pastel colors with gold details, vintage 1890s aesthetic, beautiful composition`;
}

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate AI image for a task using DALL-E
 */
export async function generateTaskImage(taskId: string, title: string, description: string | null) {
  const supabase = await createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Verify task belongs to user
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, user_id")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      throw new Error("Task not found");
    }

    if (task.user_id !== user.id) {
      throw new Error("Unauthorized: Task does not belong to user");
    }

    // Create Mucha-style prompt
    const prompt = createMuchaPrompt(title, description);
    console.log("Generating image with prompt:", prompt);

    // Generate image with DALL-E
    const openai = getOpenAIClient();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E");
    }

    console.log("Image generated, downloading from:", imageUrl);

    // Download image
    const imageBuffer = await downloadImage(imageUrl);

    // Upload to Supabase Storage
    const fileName = `${user.id}/${taskId}/${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("task-images")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      throw new Error("Failed to upload image to storage");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("task-images")
      .getPublicUrl(uploadData.path);

    console.log("Image uploaded to:", publicUrl);

    // Update task with image URL
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        ai_image_url: publicUrl,
        ai_image_prompt: prompt,
        ai_image_generated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (updateError) {
      console.error("Error updating task:", updateError);
      throw new Error("Failed to update task with image URL");
    }

    revalidatePath("/protected/tasks");
    revalidatePath("/protected");

    return {
      success: true,
      imageUrl: publicUrl,
      prompt,
    };
  } catch (error: any) {
    console.error("Error generating task image:", error);
    throw new Error(error.message || "Failed to generate task image");
  }
}

/**
 * Delete AI image for a task
 */
export async function deleteTaskImage(taskId: string) {
  const supabase = await createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get task with image info
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, user_id, ai_image_url")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      throw new Error("Task not found");
    }

    if (task.user_id !== user.id) {
      throw new Error("Unauthorized: Task does not belong to user");
    }

    if (!task.ai_image_url) {
      return { success: true, message: "No image to delete" };
    }

    // Extract path from public URL
    const urlParts = task.ai_image_url.split("/task-images/");
    if (urlParts.length === 2) {
      const filePath = urlParts[1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from("task-images")
        .remove([filePath]);

      if (deleteError) {
        console.error("Error deleting from storage:", deleteError);
        // Continue anyway to clear the DB field
      }
    }

    // Clear image fields in task
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        ai_image_url: null,
        ai_image_prompt: null,
        ai_image_generated_at: null,
      })
      .eq("id", taskId);

    if (updateError) {
      throw new Error("Failed to update task");
    }

    revalidatePath("/protected/tasks");
    revalidatePath("/protected");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task image:", error);
    throw new Error(error.message || "Failed to delete task image");
  }
}
