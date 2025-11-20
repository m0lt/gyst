"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  userName: string | null;
}

export const DashboardWelcome = memo(function DashboardWelcome({ userName }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold" suppressHydrationWarning>
        {t("dashboard.welcomeBack")}, {userName || "Friend"}!
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground" suppressHydrationWarning>
        {t("dashboard.subtitle")}
      </p>
    </div>
  );
});
