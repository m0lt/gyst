import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "@/components/tasks/task-list";
import { TasksHeader } from "@/components/tasks/tasks-header";
import { CreateTaskCard } from "@/components/tasks/create-task-card";

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
      {/* Header */}
      <TasksHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Creation Form */}
        <div className="lg:col-span-1">
          <CreateTaskCard categories={categories || []} userId={user.id} />
        </div>

        {/* Task List */}
        <div className="lg:col-span-2">
          <TaskList tasks={tasks || []} categories={categories || []} />
        </div>
      </div>
    </div>
  );
}
