import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "@/components/tasks/task-list";
import { TasksHeader } from "@/components/tasks/tasks-header";
import { TaskFormModal } from "@/components/tasks/task-form-modal";

export default async function TasksPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, task_categories(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from("task_categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-8">
      {/* Header with New Task Button */}
      <div className="flex items-center justify-between">
        <TasksHeader />
        <TaskFormModal categories={categories || []} userId={user.id} />
      </div>

      {/* Task List */}
      <TaskList tasks={tasks || []} categories={categories || []} />
    </div>
  );
}
