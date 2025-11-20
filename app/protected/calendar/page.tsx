import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarView } from "@/components/calendar/calendar-view";
import {
  getCalendarData,
  generateTaskInstancesForRange,
  updateTaskInstancesWithPreferredTime,
} from "@/app/actions/calendar";
import { addDays } from "date-fns";

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Generate task instances for the next 90 days if needed
  await generateTaskInstancesForRange(user.id, 90);

  // Update existing instances with preferred_time from tasks
  await updateTaskInstancesWithPreferredTime(user.id);

  // Get initial calendar data for current month
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = addDays(startDate, 42); // 6 weeks to cover full month view

  const calendarData = await getCalendarData(user.id, startDate, endDate);

  // Fetch categories for the task modal
  const { data: categories } = await supabase
    .from("task_categories")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <CalendarView
        userId={user.id}
        initialData={calendarData}
        initialDate={today}
        categories={categories || []}
      />
    </div>
  );
}
