"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Languages, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

interface Props {
  userId: string;
  currentLanguage: string;
  onUpdateLanguage: (language: string) => Promise<void>;
}

export function LanguageSettings({ userId, currentLanguage, onUpdateLanguage }: Props) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(currentLanguage);
  const { i18n, t } = useTranslation();

  // Sync with i18n on mount only
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || currentLanguage;
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage).catch(console.error);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (languageCode: string) => {
    if (languageCode === selected || loading) return;

    try {
      setLoading(true);

      // Update database
      await onUpdateLanguage(languageCode);

      // Update local state
      setSelected(languageCode);

      // Update i18n
      await i18n.changeLanguage(languageCode);

      // Save to localStorage
      localStorage.setItem("language", languageCode);

      // Reload to apply language changes throughout the app
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Failed to update language:", error);
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Languages className="w-5 h-5 text-mucha-mauve" />
        <h2 className="text-xl font-semibold">{t("settings.language.title")}</h2>
      </div>

      <div className="space-y-3">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleSelect(language.code)}
            disabled={loading}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
              selected === language.code
                ? "border-mucha-mauve bg-mucha-mauve/5"
                : "border-border hover:border-mucha-mauve/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-muted-foreground">{language.code.toUpperCase()}</div>
                </div>
              </div>
              {loading && selected === language.code ? (
                <Loader2 className="w-5 h-5 text-mucha-mauve animate-spin" />
              ) : selected === language.code ? (
                <Check className="w-5 h-5 text-mucha-mauve" />
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-mucha-mauve mt-4 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("settings.language.changingLanguage")}
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        {t("settings.language.moreLanguages")}
      </p>
    </Card>
  );
}
