"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface SettingsNotificationsClientProps {
  pushContent: React.ReactNode;
}

export function SettingsNotificationsClient({ pushContent }: SettingsNotificationsClientProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-2">{t("settings.notifications.browserPushTitle")}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t("settings.notifications.browserPushDesc")}
      </p>
      {pushContent}
    </Card>
  );
}

interface SettingsCategoriesClientProps {
  categories: any[];
}

export function SettingsCategoriesClient({ categories }: SettingsCategoriesClientProps) {
  const { t } = useTranslation();

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle>{t("settings.categories.predefinedTitle")}</CardTitle>
        <CardDescription>
          {t("settings.categories.predefinedDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories
            ?.filter((c) => c.is_predefined)
            .map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-border/50"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
