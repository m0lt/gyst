"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n/config";

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n on client side
    if (!isInitialized) {
      // Load saved language from localStorage
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
