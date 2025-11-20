"use client";

import { useTranslation } from "react-i18next";

export function TodoHeader() {
  const { t, i18n } = useTranslation();

  const today = new Date();
  const formattedDate = today.toLocaleDateString(i18n.language === "de" ? "de-DE" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-display font-bold mb-2">{t("todo.title")}</h1>
      <p className="text-muted-foreground">{formattedDate}</p>
    </div>
  );
}
