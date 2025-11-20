"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings, Loader2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Preferences {
  lives_alone: boolean;
  has_pets: boolean;
  has_plants: boolean;
  plays_instruments: boolean;
  preferred_task_time: "morning" | "afternoon" | "evening";
}

interface Props {
  userId: string;
  preferences: Preferences;
  onUpdatePreferences: (data: Partial<Preferences>) => Promise<void>;
}

export function PreferencesSettings({ userId, preferences, onUpdatePreferences }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [livesAlone, setLivesAlone] = useState(preferences.lives_alone);
  const [hasPets, setHasPets] = useState(preferences.has_pets);
  const [hasPlants, setHasPlants] = useState(preferences.has_plants);
  const [playsInstruments, setPlaysInstruments] = useState(preferences.plays_instruments);
  const [preferredTaskTime, setPreferredTaskTime] = useState<"morning" | "afternoon" | "evening">(
    preferences.preferred_task_time
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaved(false);
      await onUpdatePreferences({
        lives_alone: livesAlone,
        has_pets: hasPets,
        has_plants: hasPlants,
        plays_instruments: playsInstruments,
        preferred_task_time: preferredTaskTime,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-mucha-mauve" />
        <h2 className="text-xl font-semibold">{t("preferences.title")}</h2>
      </div>

      <div className="space-y-6">
        {/* Living Situation */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="lives-alone">{t("preferences.livesAlone")}</Label>
          </div>
          <Switch
            id="lives-alone"
            checked={livesAlone}
            onCheckedChange={setLivesAlone}
          />
        </div>

        {/* Pets */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="has-pets">{t("preferences.hasPets")}</Label>
          </div>
          <Switch
            id="has-pets"
            checked={hasPets}
            onCheckedChange={setHasPets}
          />
        </div>

        {/* Plants */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="has-plants">{t("preferences.hasPlants")}</Label>
          </div>
          <Switch
            id="has-plants"
            checked={hasPlants}
            onCheckedChange={setHasPlants}
          />
        </div>

        {/* Instruments */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="plays-instruments">{t("preferences.playsInstruments")}</Label>
          </div>
          <Switch
            id="plays-instruments"
            checked={playsInstruments}
            onCheckedChange={setPlaysInstruments}
          />
        </div>

        {/* Preferred Task Time */}
        <div className="space-y-3">
          <Label>{t("preferences.preferredTaskTime")}</Label>
          <RadioGroup value={preferredTaskTime} onValueChange={(value) => setPreferredTaskTime(value as "morning" | "afternoon" | "evening")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning" className="font-normal cursor-pointer">
                <div>
                  <div className="font-medium">{t("preferences.morning")}</div>
                  <div className="text-sm text-muted-foreground">{t("preferences.morningDesc")}</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="afternoon" />
              <Label htmlFor="afternoon" className="font-normal cursor-pointer">
                <div>
                  <div className="font-medium">{t("preferences.afternoon")}</div>
                  <div className="text-sm text-muted-foreground">{t("preferences.afternoonDesc")}</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="evening" />
              <Label htmlFor="evening" className="font-normal cursor-pointer">
                <div>
                  <div className="font-medium">{t("preferences.evening")}</div>
                  <div className="text-sm text-muted-foreground">{t("preferences.eveningDesc")}</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("settings.saving")}
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              {t("settings.saved")}
            </>
          ) : (
            t("settings.saveChanges")
          )}
        </Button>
      </div>
    </Card>
  );
}
