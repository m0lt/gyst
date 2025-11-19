"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Props {
  userId: string;
  userEmail: string;
  onDeleteAccount: () => Promise<void>;
}

export function DangerZone({ userId, userEmail, onDeleteAccount }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      alert(t("settings.dangerZone.typeDeleteError"));
      return;
    }

    try {
      setDeleting(true);
      await onDeleteAccount();
      // Redirect will happen automatically after account deletion
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert(t("settings.dangerZone.deleteFailed"));
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="p-6 border-red-200 bg-red-50/50">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold text-red-600">{t("settings.dangerZone.title")}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-red-900 mb-2">{t("settings.dangerZone.deleteAccount")}</h3>
            <p className="text-sm text-red-800 mb-4">
              {t("settings.dangerZone.deleteWarning")}
            </p>
            <Button
              onClick={() => setShowDialog(true)}
              variant="destructive"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t("settings.dangerZone.deleteButton")}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {t("settings.dangerZone.deleteConfirmTitle")}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                {t("settings.dangerZone.deleteConfirmMessage")}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>{t("settings.dangerZone.allTasks")}</li>
                <li>{t("settings.dangerZone.allStreaks")}</li>
                <li>{t("settings.dangerZone.allCategories")}</li>
                <li>{t("settings.dangerZone.allPreferences")}</li>
              </ul>
              <p className="text-red-600 font-medium mt-4">
                {t("settings.dangerZone.cannotBeUndone")}
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="confirm-delete">
              {t("settings.dangerZone.confirmDelete")}
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t("settings.dangerZone.confirmPlaceholder")}
              className="mt-2"
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setConfirmText("");
              }}
              disabled={deleting}
            >
              {t("settings.dangerZone.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.delete")}...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t("settings.dangerZone.confirmDeleteButton")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
