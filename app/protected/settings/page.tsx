import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { DataManagement } from "@/components/settings/data-management";
import { DangerZone } from "@/components/settings/danger-zone";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { Separator } from "@/components/ui/separator";
import {
  updateProfile,
  uploadAvatar,
  exportUserData,
  deleteAccount
} from "@/app/actions/settings";
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
import { CategoryManager } from "@/components/categories/category-manager";
import { SettingsNotificationsClient, SettingsCategoriesClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get notification preferences
  const preferences = await getNotificationPreferences(user.id);

  // Get categories
  const { data: categories } = await supabase
    .from("task_categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .order("is_predefined", { ascending: false })
    .order("name");

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <SettingsHeader />

      <SettingsTabs
        profileContent={
          <>
            {/* Profile Settings */}
            <ProfileSettings
              userId={user.id}
              profile={profile}
              onUpdateProfile={async (data) => {
                "use server";
                await updateProfile(user.id, data);
              }}
              onUploadAvatar={async (file) => {
                "use server";
                return await uploadAvatar(user.id, file);
              }}
            />

            <Separator />

            {/* Data Management */}
            <DataManagement
              userId={user.id}
              onExport={async () => {
                "use server";
                return await exportUserData(user.id);
              }}
            />

            <Separator />

            {/* Danger Zone */}
            <DangerZone
              userId={user.id}
              userEmail={user.email || ""}
              onDeleteAccount={async () => {
                "use server";
                await deleteAccount(user.id);
              }}
            />
          </>
        }
        notificationsContent={
          <>
            {/* Push Notifications Permission */}
            <SettingsNotificationsClient
              pushContent={
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
              }
            />

            <Separator />

            {/* Notification Preferences */}
            <NotificationPreferencesForm
              userId={user.id}
              initialPreferences={preferences || undefined}
              onSave={async (prefs) => {
                "use server";
                await updateNotificationPreferences(prefs);
              }}
            />

            <Separator />

            {/* Weekly Digest Preview */}
            <DigestPreview
              userId={user.id}
              onGeneratePreview={async () => {
                "use server";
                return await generateDigestPreview(user.id);
              }}
            />
          </>
        }
        categoriesContent={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Categories */}
            <div>
              <CategoryManager categories={categories || []} userId={user.id} />
            </div>

            {/* Predefined Categories */}
            <div>
              <SettingsCategoriesClient categories={categories || []} />
            </div>
          </div>
        }
      />
    </div>
  );
}
