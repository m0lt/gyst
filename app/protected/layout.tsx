import { NotificationToast } from "@/components/notifications/notification-toast";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
import { AuthButton } from "@/components/auth-button";
import { ThemeSelectorEnhanced } from "@/components/theme-selector-enhanced";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLayoutClient
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
