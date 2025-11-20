import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TodoList } from "@/components/todo/todo-list";
import { TodoHeader } from "@/components/todo/todo-header";
import { generateInstancesForActiveTasks } from "@/app/actions/task-instances";

export default async function TodoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Generate instances for the next 7 days if needed
  // This could also be done via a cron job
  await generateInstancesForActiveTasks(7);

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Get task instances for today - only from active (non-paused) tasks
  const { data: instances } = await supabase
    .from("task_instances")
    .select(`
      *,
      tasks!inner (
        id,
        title,
        description,
        category_id,
        priority,
        scheduled_duration,
        ai_image_url,
        is_active,
        task_categories (
          id,
          name,
          color,
          icon
        ),
        task_subtasks (
          id,
          title,
          is_required,
          sort_order
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("tasks.is_active", true)
    .eq("due_date", today)
    .order("scheduled_time", { ascending: true });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <TodoHeader />
      <TodoList instances={instances || []} userId={user.id} />
    </div>
  );
}
