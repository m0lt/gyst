import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  savePushSubscription,
  removePushSubscription,
  generateDigestPreview,
} from "@/app/actions/notifications";
import { NotificationPreferencesForm } from "@/components/notifications/notification-preferences";
import { PushPermissionButton } from "@/components/notifications/push-permission";
import { DigestPreview } from "@/components/notifications/digest-preview";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function NotificationSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get current notification preferences
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications about your tasks
        </p>
      </div>

      {/* Push Notifications Permission */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Browser Push Notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Enable push notifications to receive instant alerts in your browser
        </p>
        <PushPermissionButton
          userId={user.id}
          onSubscribe={async (subscription) => {
            "use server";
            await savePushSubscription(user.id, subscription);
          }}
          onUnsubscribe={async () => {
            "use server";
            await removePushSubscription(user.id);
          }}
        />
      </Card>

      <Separator className="my-6" />

      {/* Notification Preferences */}
      <NotificationPreferencesForm
        userId={user.id}
        initialPreferences={preferences || undefined}
        onSave={async (prefs) => {
          "use server";
          await updateNotificationPreferences(prefs);
        }}
      />

      <Separator className="my-6" />

      {/* Weekly Digest Preview */}
      <DigestPreview
        userId={user.id}
        onGeneratePreview={async () => {
          "use server";
          return await generateDigestPreview(user.id);
        }}
      />
    </div>
  );
}
