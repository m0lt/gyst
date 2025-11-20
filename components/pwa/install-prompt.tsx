"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Download, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if not dismissed recently (wait 7 days)
    if (!standalone && daysSinceDismissed > 7) {
      if (iOS) {
        // For iOS, show custom instructions after a delay
        setTimeout(() => setShowPrompt(true), 3000);
      } else {
        // For Android/Desktop, listen for beforeinstallprompt event
        const handler = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setShowPrompt(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="card-art-nouveau shadow-lg">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("pwa.installTitle", { defaultValue: "Install Gyst" })}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("pwa.installSubtitle", { defaultValue: "Get the native app experience" })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIOS ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{t("pwa.iosInstructions", { defaultValue: "To install this app on your iOS device:" })}</p>
              <ol className="ml-4 space-y-2 list-decimal">
                <li>{t("pwa.iosStep1", { defaultValue: "Tap the Share button in Safari" })}</li>
                <li>{t("pwa.iosStep2", { defaultValue: "Scroll down and tap 'Add to Home Screen'" })}</li>
                <li>{t("pwa.iosStep3", { defaultValue: "Tap 'Add' to install" })}</li>
              </ol>
              <Button onClick={handleDismiss} variant="outline" className="w-full">
                {t("pwa.gotIt", { defaultValue: "Got it!" })}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("pwa.installDescription", {
                  defaultValue: "Install Gyst for faster access, offline support, and a native app experience."
                })}
              </p>
              <div className="flex gap-2">
                <Button onClick={handleInstall} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  {t("pwa.install", { defaultValue: "Install" })}
                </Button>
                <Button onClick={handleDismiss} variant="outline">
                  {t("pwa.later", { defaultValue: "Later" })}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
