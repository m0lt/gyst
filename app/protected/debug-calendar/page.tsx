import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { debugCalendarData } from "@/app/actions/debug-calendar";

export default async function DebugCalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const data = await debugCalendarData(user.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Calendar Debug Info</h1>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <p>Total: {data.tasks.length}</p>
          <p>With recurrence: {data.tasks.filter(t => t.recurrence_pattern).length}</p>
          {data.tasksError && (
            <pre className="bg-red-100 p-2 mt-2 text-xs overflow-auto">
              {JSON.stringify(data.tasksError, null, 2)}
            </pre>
          )}
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 mt-2 text-xs overflow-auto max-h-64">
            {JSON.stringify(data.tasks, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Task Instances</h2>
          <p>Total: {data.instances.length}</p>
          {data.instancesError && (
            <pre className="bg-red-100 p-2 mt-2 text-xs overflow-auto">
              {JSON.stringify(data.instancesError, null, 2)}
            </pre>
          )}
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 mt-2 text-xs overflow-auto max-h-64">
            {JSON.stringify(data.instances, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
