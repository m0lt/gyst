"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { completeTaskInstance, type TaskMood } from "@/app/actions/task-instances";
import { useNotificationStore } from "@/lib/store/notification-store";
import { Smile, Meh, Frown, Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type TaskInstance = {
  id: string;
  subtasks_completed: Record<string, boolean> | null;
  tasks: {
    title: string;
    description: string | null;
    scheduled_duration: number | null;
    task_subtasks?: Array<{
      id: string;
      title: string;
      is_required: boolean;
      sort_order: number;
    }>;
  };
};

type CompleteTaskModalProps = {
  instance: TaskInstance;
  onClose: () => void;
  onSuccess: () => void;
};

export function CompleteTaskModal({ instance, onClose, onSuccess }: CompleteTaskModalProps) {
  const { t } = useTranslation();
  const { success, error } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  console.log('CompleteTaskModal - instance:', instance);
  console.log('CompleteTaskModal - task_subtasks:', instance.tasks.task_subtasks);

  const [mood, setMood] = useState<TaskMood | null>(null);
  const [actualMinutes, setActualMinutes] = useState<string>(
    instance.tasks.scheduled_duration?.toString() || ""
  );
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Initialize subtasks_completed from instance or create empty object
  const [subtasksCompleted, setSubtasksCompleted] = useState<Record<string, boolean>>(
    instance.subtasks_completed || {}
  );
  const [clickCount, setClickCount] = useState(0);

  const calculateProgress = () => {
    const subtasks = instance.tasks.task_subtasks;
    if (!subtasks || subtasks.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const total = subtasks.length;
    const completed = Object.values(subtasksCompleted).filter(Boolean).length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const toggleSubtask = (subtaskId: string) => {
    setClickCount(prev => prev + 1);
    console.log('🔘 Toggling subtask:', subtaskId, 'Current state:', subtasksCompleted);
    setSubtasksCompleted(prev => {
      const currentValue = prev[subtaskId];
      const newValue = !currentValue;
      const newState = {
        ...prev,
        [subtaskId]: newValue
      };
      console.log('✅ New state:', newState, `(${currentValue} → ${newValue})`);
      return newState;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await completeTaskInstance({
        instanceId: instance.id,
        mood: mood || undefined,
        actualMinutes: actualMinutes ? parseInt(actualMinutes, 10) : undefined,
        photoFile: photoFile || undefined,
        notes: notes || undefined,
        subtasksCompleted: Object.keys(subtasksCompleted).length > 0 ? subtasksCompleted : undefined,
      });

      // Trigger confetti celebration!
      triggerConfetti();

      success("Task completed!", `Great job on "${instance.tasks.title}"!`);

      // Delay closing the modal slightly so the confetti can be seen
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error("Failed to complete task:", err);
      error("Failed to complete", err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle>{t("todo.completeTask")}</DialogTitle>
        <DialogDescription>
          {instance.tasks.title}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-3">
            <Label>{t("todo.howDidYouFeel")}</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMood("happy")}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${mood === "happy" ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"}
                `}
              >
                <Smile className="mx-auto h-8 w-8 mb-2" />
                <div className="text-xs">{t("todo.happy")}</div>
              </button>
              <button
                type="button"
                onClick={() => setMood("neutral")}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${mood === "neutral" ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"}
                `}
              >
                <Meh className="mx-auto h-8 w-8 mb-2" />
                <div className="text-xs">{t("todo.neutral")}</div>
              </button>
              <button
                type="button"
                onClick={() => setMood("sad")}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${mood === "sad" ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"}
                `}
              >
                <Frown className="mx-auto h-8 w-8 mb-2" />
                <div className="text-xs">{t("todo.difficult")}</div>
              </button>
            </div>
          </div>

          {/* Subtasks */}
          {instance.tasks.task_subtasks && instance.tasks.task_subtasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t("tasks.subtask.subtasks")}</Label>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {clickCount > 0 && (
                    <span>{clickCount} clicks</span>
                  )}
                  <span>
                    {Object.values(subtasksCompleted).filter(Boolean).length}/{instance.tasks.task_subtasks?.length || 0} checked
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {(() => {
                const progress = calculateProgress();
                return (
                  <div className="space-y-1">
                    <Progress value={progress.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {progress.percentage}% {t("tasks.subtask.completionRate")}
                    </p>
                  </div>
                );
              })()}

              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {instance.tasks.task_subtasks
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((subtask) => (
                    <button
                      key={subtask.id}
                      type="button"
                      onClick={() => toggleSubtask(subtask.id)}
                      disabled={isLoading}
                      className="w-full flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        subtasksCompleted[subtask.id]
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}>
                        {subtasksCompleted[subtask.id] && (
                          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          subtasksCompleted[subtask.id]
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}>
                          {subtask.title}
                        </p>
                        {subtask.is_required && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {t("tasks.subtask.required")}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Time Taken */}
          <div className="space-y-2">
            <Label htmlFor="actualMinutes">{t("todo.howLongDidItTake")}</Label>
            <Input
              id="actualMinutes"
              type="number"
              min="1"
              value={actualMinutes}
              onChange={(e) => setActualMinutes(e.target.value)}
              placeholder={t("todo.enterMinutes")}
              disabled={isLoading}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>{t("todo.proofPhoto")}</Label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <Label htmlFor="photo" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  {t("todo.clickToUpload")}
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("todo.notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("todo.anyThoughts")}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("todo.completing")}
                </>
              ) : (
                t("todo.completeTask")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
