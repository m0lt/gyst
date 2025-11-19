"use client";

import { useTranslation } from "react-i18next";

export function SettingsHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{t("settings.title")}</h1>
      <p className="text-muted-foreground">{t("settings.subtitle")}</p>
    </div>
  );
}
