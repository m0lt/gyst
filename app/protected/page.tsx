import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentTasksCard } from "@/components/dashboard/recent-tasks-card";
import { NoTasksCard } from "@/components/dashboard/no-tasks-card";
import { AISuggestCard } from "@/components/ai/ai-suggest-card";
import { AIUsageStats } from "@/components/ai/ai-usage-stats";
import { checkOnboardingStatus } from "@/app/actions/onboarding";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Check if user needs onboarding
  const { completed } = await checkOnboardingStatus(user.id);
  if (!completed) {
    redirect("/protected/onboarding");
  }

  // Fetch user's tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, task_categories(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const completedToday = tasks?.filter(task => {
    const today = new Date().toDateString();
    return task.last_completed_at && new Date(task.last_completed_at).toDateString() === today;
  }).length || 0;

  const activeTasks = tasks?.filter(task => task.is_active).length || 0;
  const longestStreak = Math.max(...(tasks?.map(t => t.longest_streak || 0) || [0]));

  // Calculate completion rate (completed today / active tasks)
  const completionRate = activeTasks > 0 ? (completedToday / activeTasks) * 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <DashboardWelcome userName={user.user_metadata?.full_name} />

      {/* Stats Grid */}
      <DashboardStats
        totalTasks={totalTasks}
        completedToday={completedToday}
        longestStreak={longestStreak}
        completionRate={completionRate}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content (Left - 2 columns) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <QuickActionsCard />

          {/* Recent Tasks Preview */}
          {tasks && tasks.length > 0 ? (
            <RecentTasksCard tasks={tasks} />
          ) : (
            <NoTasksCard />
          )}
        </div>

        {/* Sidebar (Right - 1 column) */}
        <div className="space-y-4 sm:space-y-6">
          {/* AI Suggestions */}
          <AISuggestCard userId={user.id} />

          {/* AI Usage Stats */}
          <AIUsageStats userId={user.id} />
        </div>
      </div>
    </div>
  );
}
