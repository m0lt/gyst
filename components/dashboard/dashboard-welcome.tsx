"use client";

import { useTranslation } from "react-i18next";

interface Props {
  userName: string | null;
}

export function DashboardWelcome({ userName }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h1 className="heading-2">
        {t("dashboard.welcomeBack")}, {userName || "Friend"}!
      </h1>
      <p className="text-lead">
        {t("dashboard.subtitle")}
      </p>
    </div>
  );
}
