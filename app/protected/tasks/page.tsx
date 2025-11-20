import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "@/components/tasks/task-list";
import { TasksHeader } from "@/components/tasks/tasks-header";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { PausedTasksCard } from "@/components/tasks/paused-tasks-card";
import { getPausedTasks } from "@/app/actions/tasks";

export default async function TasksPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch active tasks with subtasks and latest completion
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      task_categories(*),
      task_subtasks(*),
      task_completions(
        id,
        subtasks_completed,
        completed_at
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .order("completed_at", {
      referencedTable: "task_completions",
      ascending: false
    });

  // Fetch paused tasks
  const pausedTasks = await getPausedTasks();

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
        <TaskFormModal categories={categories || []} />
      </div>

      {/* Active Task List */}
      <TaskList tasks={tasks || []} categories={categories || []} />

      {/* Paused Tasks Section */}
      <PausedTasksCard tasks={pausedTasks} />
    </div>
  );
}
