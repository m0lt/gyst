"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Volume2,
  Save,
  Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  category_id: string | null;
  email_enabled: boolean;
  push_enabled: boolean;
  weekly_digest_enabled: boolean;
  max_per_day: number;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  tone_progression: string[];
  current_tone_index: number;
}

interface Props {
  userId: string;
  initialPreferences?: NotificationPreferences;
  onSave?: (preferences: NotificationPreferences) => Promise<void>;
}

export function NotificationPreferencesForm({ userId, initialPreferences, onSave }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const TONE_OPTIONS = [
    { value: "encouraging", label: t("settings.notifications.tone.encouraging"), description: t("settings.notifications.tone.encouragingDesc") },
    { value: "neutral", label: t("settings.notifications.tone.neutral"), description: t("settings.notifications.tone.neutralDesc") },
    { value: "pushy", label: t("settings.notifications.tone.pushy"), description: t("settings.notifications.tone.pushyDesc") },
  ];

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    user_id: userId,
    category_id: null,
    email_enabled: true,
    push_enabled: false,
    weekly_digest_enabled: true,
    max_per_day: 5,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
    tone_progression: ["encouraging", "neutral", "pushy"],
    current_tone_index: 0,
    ...initialPreferences,
  });

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setLoading(true);
      setSaved(false);
      await onSave(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToneToggle = (tone: string) => {
    const newProgression = preferences.tone_progression.includes(tone)
      ? preferences.tone_progression.filter(t => t !== tone)
      : [...preferences.tone_progression, tone];

    setPreferences({
      ...preferences,
      tone_progression: newProgression,
    });
  };

  return (
    <div className="space-y-6">
      {/* Channel Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-mucha-mauve" />
          <h3 className="text-lg font-semibold">{t("settings.notifications.channels.title")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-mucha-mauve" />
              <div>
                <Label htmlFor="email-enabled">{t("settings.notifications.channels.emailTitle")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.channels.emailDesc")}
                </p>
              </div>
            </div>
            <Switch
              id="email-enabled"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, email_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-mucha-mauve" />
              <div>
                <Label htmlFor="push-enabled">{t("settings.notifications.channels.pushTitle")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.channels.pushDesc")}
                </p>
              </div>
            </div>
            <Switch
              id="push-enabled"
              checked={preferences.push_enabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, push_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-mucha-sage" />
              <div>
                <Label htmlFor="digest-enabled">{t("settings.notifications.channels.digestTitle")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.channels.digestDesc")}
                </p>
              </div>
            </div>
            <Switch
              id="digest-enabled"
              checked={preferences.weekly_digest_enabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, weekly_digest_enabled: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Timing Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-mucha-mauve" />
          <h3 className="text-lg font-semibold">{t("settings.notifications.timing.title")}</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="max-per-day">{t("settings.notifications.timing.maxPerDay")}</Label>
            <Input
              id="max-per-day"
              type="number"
              min="1"
              max="20"
              value={preferences.max_per_day}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  max_per_day: parseInt(e.target.value) || 5,
                })
              }
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("settings.notifications.timing.maxPerDayDesc")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-start">{t("settings.notifications.timing.quietStart")}</Label>
              <Input
                id="quiet-start"
                type="time"
                value={preferences.quiet_hours_start || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    quiet_hours_start: e.target.value,
                  })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="quiet-end">{t("settings.notifications.timing.quietEnd")}</Label>
              <Input
                id="quiet-end"
                type="time"
                value={preferences.quiet_hours_end || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    quiet_hours_end: e.target.value,
                  })
                }
                className="mt-2"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("settings.notifications.timing.quietHoursDesc")}
          </p>
        </div>
      </Card>

      {/* Tone Progression */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-mucha-mauve" />
          <h3 className="text-lg font-semibold">{t("settings.notifications.tone.title")}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t("settings.notifications.tone.description")}
        </p>

        <div className="space-y-3">
          {TONE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
              <Switch
                checked={preferences.tone_progression.includes(option.value)}
                onCheckedChange={() => handleToneToggle(option.value)}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-mucha-mauve mt-4">
          {t("settings.notifications.tone.currentProgression")}{" "}
          {preferences.tone_progression.map(toneValue =>
            TONE_OPTIONS.find(opt => opt.value === toneValue)?.label
          ).join(" → ") || t("settings.notifications.tone.noneSelected")}
        </p>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading || !onSave}
          className="min-w-[140px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("settings.notifications.saving")}
            </>
          ) : saved ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t("settings.notifications.saved")}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t("settings.notifications.saveChanges")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
