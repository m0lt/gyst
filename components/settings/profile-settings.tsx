"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Upload, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { AvatarEditor } from "./avatar-editor";
import { TimezoneSelector } from "./timezone-selector";
import { useTranslation } from "react-i18next";

interface Profile {
  id: string;
  display_name: string | null;
  timezone: string | null;
  avatar_url: string | null;
}

interface Props {
  userId: string;
  profile: Profile | null;
  onUpdateProfile: (data: { display_name?: string; timezone?: string }) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<{ url: string }>;
}

export function ProfileSettings({ userId, profile, onUpdateProfile, onUploadAvatar }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [timezone, setTimezone] = useState(profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaved(false);
      await onUpdateProfile({ display_name: displayName, timezone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB before cropping)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("File must be an image");
      return;
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
    setShowAvatarEditor(true);
  };

  const handleAvatarSave = async (croppedImage: Blob) => {
    try {
      setUploadingAvatar(true);

      // Convert Blob to File
      const file = new File([croppedImage], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const { url } = await onUploadAvatar(file);
      setAvatarUrl(url);

      // Cleanup
      URL.revokeObjectURL(selectedImageUrl);
      setSelectedImageUrl("");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-mucha-mauve" />
          <h2 className="text-xl font-semibold">{t("settings.profile.title")}</h2>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <Label htmlFor="avatar">{t("settings.profile.profilePicture")}</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-mucha-cream border-2 border-mucha-mauve/20">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-mucha-mauve">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={uploadingAvatar}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("avatar")?.click()}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("settings.profile.uploading")}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {t("settings.profile.uploadPhoto")}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("settings.profile.maxSize")}
                </p>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="display-name">{t("settings.profile.displayName")}</Label>
            <Input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("settings.profile.displayNamePlaceholder")}
              className="mt-2"
            />
          </div>

          {/* Timezone */}
          <TimezoneSelector
            value={timezone}
            onChange={setTimezone}
            disabled={loading}
          />

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("settings.profile.saving")}
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("settings.profile.saved")}
              </>
            ) : (
              t("settings.profile.saveProfile")
            )}
          </Button>
        </div>
      </Card>

      {/* Avatar Editor Dialog */}
      {showAvatarEditor && selectedImageUrl && (
        <AvatarEditor
          imageUrl={selectedImageUrl}
          isOpen={showAvatarEditor}
          onClose={() => {
            setShowAvatarEditor(false);
            URL.revokeObjectURL(selectedImageUrl);
            setSelectedImageUrl("");
          }}
          onSave={handleAvatarSave}
        />
      )}
    </>
  );
}
