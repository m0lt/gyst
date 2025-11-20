"use server";

import { createClient } from "@/lib/supabase/server";

export async function debugCalendarData(userId: string) {
  const supabase = await createClient();

  // Check tasks with recurrence
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  console.log("=== TASKS ===");
  console.log("Error:", tasksError);
  console.log("Count:", tasks?.length || 0);
  console.log("Tasks with recurrence:", tasks?.filter(t => t.recurrence_pattern) || []);

  // Check task instances
  const { data: instances, error: instancesError } = await supabase
    .from("task_instances")
    .select("*")
    .eq("user_id", userId);

  console.log("\n=== TASK INSTANCES ===");
  console.log("Error:", instancesError);
  console.log("Count:", instances?.length || 0);
  console.log("Instances:", instances || []);

  return {
    tasks: tasks || [],
    instances: instances || [],
    tasksError,
    instancesError
  };
}
