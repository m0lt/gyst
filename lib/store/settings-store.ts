import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type MuchaPalette = "classic" | "emerald" | "ruby";
export type Language = "en" | "de";
export type NotificationLevel = "none" | "low" | "medium" | "high";

interface SettingsState {
  // Theme settings
  muchaPalette: MuchaPalette;
  setMuchaPalette: (palette: MuchaPalette) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Notification preferences
  notificationLevel: NotificationLevel;
  setNotificationLevel: (level: NotificationLevel) => void;

  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (enabled: boolean) => void;

  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;

  // Task preferences
  defaultTaskDuration: number; // in minutes
  setDefaultTaskDuration: (minutes: number) => void;

  showCompletedTasks: boolean;
  setShowCompletedTasks: (show: boolean) => void;

  // Dashboard preferences
  dashboardDensity: "compact" | "comfortable" | "spacious";
  setDashboardDensity: (density: "compact" | "comfortable" | "spacious") => void;

  showStreakAnimations: boolean;
  setShowStreakAnimations: (show: boolean) => void;

  // Accessibility
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;

  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;

  fontSize: "sm" | "md" | "lg" | "xl";
  setFontSize: (size: "sm" | "md" | "lg" | "xl") => void;

  // PWA  install prompt
  hasSeenInstallPrompt: boolean;
  dismissInstallPrompt: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Theme defaults
      muchaPalette: "classic",
      setMuchaPalette: (palette) => set({ muchaPalette: palette }),

      // Language default (from env or browser)
      language:
        (typeof window !== "undefined" &&
          (localStorage.getItem("language") as Language)) ||
        "en",
      setLanguage: (language) => {
        set({ language });
        if (typeof window !== "undefined") {
          localStorage.setItem("language", language);
        }
      },

      // Notification defaults
      notificationLevel: "medium",
      setNotificationLevel: (level) => set({ notificationLevel: level }),

      emailNotificationsEnabled: true,
      setEmailNotificationsEnabled: (enabled) =>
        set({ emailNotificationsEnabled: enabled }),

      pushNotificationsEnabled: false,
      setPushNotificationsEnabled: (enabled) =>
        set({ pushNotificationsEnabled: enabled }),

      // Task defaults
      defaultTaskDuration: 30,
      setDefaultTaskDuration: (minutes) =>
        set({ defaultTaskDuration: minutes }),

      showCompletedTasks: false,
      setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),

      // Dashboard defaults
      dashboardDensity: "comfortable",
      setDashboardDensity: (density) => set({ dashboardDensity: density }),

      showStreakAnimations: true,
      setShowStreakAnimations: (show) => set({ showStreakAnimations: show }),

      // Accessibility defaults
      reduceMotion: false,
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),

      highContrast: false,
      setHighContrast: (enabled) => set({ highContrast: enabled }),

      fontSize: "md",
      setFontSize: (size) => set({ fontSize: size }),

      // PWA defaults
      hasSeenInstallPrompt: false,
      dismissInstallPrompt: () => set({ hasSeenInstallPrompt: true }),

      // Onboarding
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
