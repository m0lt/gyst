"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Tags } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SettingsTabsProps {
  profileContent: React.ReactNode;
  notificationsContent: React.ReactNode;
  categoriesContent: React.ReactNode;
}

export function SettingsTabs({
  profileContent,
  notificationsContent,
  categoriesContent,
}: SettingsTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{t("settings.nav.profile")}</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">{t("settings.nav.notifications")}</span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
          <span className="hidden sm:inline">{t("settings.nav.categories")}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        {profileContent}
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        {notificationsContent}
      </TabsContent>

      <TabsContent value="categories" className="space-y-6">
        {categoriesContent}
      </TabsContent>
    </Tabs>
  );
}
