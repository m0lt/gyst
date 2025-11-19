import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { LanguageSettings } from "@/components/settings/language-settings";
import { DataManagement } from "@/components/settings/data-management";
import { DangerZone } from "@/components/settings/danger-zone";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Separator } from "@/components/ui/separator";
import {
  updateProfile,
  uploadAvatar,
  exportUserData,
  deleteAccount
} from "@/app/actions/settings";

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

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <SettingsHeader />
      <SettingsNav />

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

      {/* Theme Settings */}
      <ThemeSettings />

      <Separator />

      {/* Language Settings */}
      <LanguageSettings
        userId={user.id}
        currentLanguage={profile?.language || "en"}
        onUpdateLanguage={async (language) => {
          "use server";
          await updateProfile(user.id, { language });
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
    </div>
  );
}
