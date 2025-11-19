import { NotificationToast } from "@/components/notifications/notification-toast";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
import { AuthButton } from "@/components/auth-button";
import { ThemeSelectorEnhanced } from "@/components/theme-selector-enhanced";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .single();

  const userData = {
    id: user.id,
    email: user.email || "",
    avatar_url: profile?.avatar_url,
    full_name: profile?.full_name,
  };

  return (
    <>
      <DashboardLayoutClient
        user={userData}
        headerActions={
          <>
            <LanguageSwitcher />
            <ThemeSelectorEnhanced />
            <AuthButton />
          </>
        }
      >
        {children}
      </DashboardLayoutClient>

      {/* Toast Notifications */}
      <NotificationToast />
    </>
  );
}
