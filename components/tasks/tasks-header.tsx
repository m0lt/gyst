"use client";

import { useTranslation } from "react-i18next";

export function TasksHeader() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h1 className="heading-2">{t("tasks.title")}</h1>
      <p className="text-lead">
        {t("tasks.subtitle")}
      </p>
    </div>
  );
}
