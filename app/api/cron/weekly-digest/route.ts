import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWeeklyDigestEmail } from "@/app/actions/notifications";

// Create admin client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users who have weekly digest enabled
    const { data: preferences, error: prefsError } = await supabase
      .from("notification_preferences")
      .select("user_id, weekly_digest_enabled")
      .eq("weekly_digest_enabled", true)
      .is("category_id", null); // Only global preferences

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 }
      );
    }

    const results = {
      total: preferences?.length || 0,
      sent: 0,
      failed: 0,
      errors: [] as Array<{ userId: string; error: string }>,
    };

    // Send digest to each user
    for (const pref of preferences || []) {
      try {
        await sendWeeklyDigestEmail(pref.user_id);
        results.sent++;
      } catch (error) {
        console.error(`Failed to send digest to ${pref.user_id}:`, error);
        results.failed++;
        results.errors.push({
          userId: pref.user_id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log("Weekly digest cron completed:", results);

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weekly digest cron error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
