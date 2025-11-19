import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNotifications, deleteNotification } from "@/app/actions/notifications";
import { NotificationCenter } from "@/components/notifications/notification-center";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get all notifications for the user
  const notifications = await getNotifications(user.id);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage your email and push notifications
        </p>
      </div>

      <NotificationCenter
        userId={user.id}
        notifications={notifications || []}
        onDelete={async (id) => {
          "use server";
          await deleteNotification(id);
        }}
      />
    </div>
  );
}
