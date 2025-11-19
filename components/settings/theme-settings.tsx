"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { ThemeSelectorEnhanced } from "@/components/theme-selector-enhanced";
import { useTranslation } from "react-i18next";

export function ThemeSettings() {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-mucha-mauve" />
        <h2 className="text-xl font-semibold">{t("settings.theme.title")}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label>{t("themes.palette")}</Label>
          <p className="text-sm text-muted-foreground mb-4">
            {t("settings.theme.description")}
          </p>
          <ThemeSelectorEnhanced />
        </div>
      </div>
    </Card>
  );
}
