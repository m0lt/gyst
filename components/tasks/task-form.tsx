"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createTask, updateTask } from "@/app/actions/tasks";
import { generateTaskImage, deleteTaskImage } from "@/app/actions/ai-images";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useTranslation } from "react-i18next";
import type { TaskPriority, RecurrencePattern } from "@/lib/types/task-scheduling";
import { REMINDER_OPTIONS, DAYS_OF_WEEK } from "@/lib/types/task-scheduling";
import { X, Sparkles, Loader2, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  color: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  frequency: "daily" | "weekly" | "custom";
  priority: TaskPriority;
  scheduled_duration: number | null;
  tags: string[];
  reminder_minutes_before: number | null;
  preferred_time: string | null;
  recurrence_pattern: RecurrencePattern | null;
  ai_image_url: string | null;
  ai_image_prompt: string | null;
};

type TaskFormProps = {
  categories: Category[];
  userId: string;
  existingTask?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function TaskForm({ categories, userId, existingTask, onSuccess, onCancel }: TaskFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useNotificationStore();

  // Form state
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(existingTask?.description || "");
  const [selectedCategory, setSelectedCategory] = useState(existingTask?.category_id || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">(existingTask?.frequency || "daily");
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority || "medium");
  const [preferredTime, setPreferredTime] = useState(existingTask?.preferred_time || "");
  const [scheduledDuration, setScheduledDuration] = useState<string>(
    existingTask?.scheduled_duration?.toString() || ""
  );
  const [tags, setTags] = useState<string[]>(existingTask?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState<string>(
    existingTask?.reminder_minutes_before?.toString() || ""
  );
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>(
    existingTask?.recurrence_pattern || {}
  );

  // AI Image state
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(existingTask?.ai_image_url || null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Set default category if none selected
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Handle tag addition
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle recurrence pattern changes
  const handleDaysOfWeekChange = (day: number) => {
    const currentDays = recurrencePattern.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();
    setRecurrencePattern({ ...recurrencePattern, daysOfWeek: newDays });
  };

  const handleWeekdaysOnlyChange = (checked: boolean) => {
    setRecurrencePattern({ ...recurrencePattern, weekdaysOnly: checked });
  };

  // Handle AI image generation
  const handleGenerateImage = async () => {
    if (!title.trim()) {
      error(t("tasks.ai.titleRequired"), t("tasks.ai.titleRequiredDesc"));
      return;
    }

    // For new tasks, we need to save first
    if (!existingTask) {
      error(t("tasks.ai.saveFirst"), t("tasks.ai.saveFirstDesc"));
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const result = await generateTaskImage(existingTask.id, title, description);
      setAiImageUrl(result.imageUrl);
      success(t("tasks.ai.imageGenerated"), t("tasks.ai.imageGeneratedDesc"));
    } catch (err: any) {
      console.error("Failed to generate image:", err);
      setImageError(err.message || t("tasks.ai.generationFailed"));
      error(t("tasks.ai.generationFailed"), err.message || t("tasks.somethingWentWrong"));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle AI image deletion
  const handleDeleteImage = async () => {
    if (!existingTask) return;

    try {
      await deleteTaskImage(existingTask.id);
      setAiImageUrl(null);
      success(t("tasks.ai.imageDeleted"), t("tasks.ai.imageDeletedDesc"));
    } catch (err: any) {
      console.error("Failed to delete image:", err);
      error(t("tasks.ai.deletionFailed"), err.message || t("tasks.somethingWentWrong"));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare recurrence pattern based on frequency
      let finalRecurrencePattern: RecurrencePattern | null = null;
      if (frequency === "weekly" && recurrencePattern.daysOfWeek && recurrencePattern.daysOfWeek.length > 0) {
        finalRecurrencePattern = { daysOfWeek: recurrencePattern.daysOfWeek };
      } else if (frequency === "daily" && recurrencePattern.weekdaysOnly) {
        finalRecurrencePattern = { weekdaysOnly: true };
      } else if (frequency === "custom" && recurrencePattern.interval && recurrencePattern.unit) {
        finalRecurrencePattern = {
          interval: recurrencePattern.interval,
          unit: recurrencePattern.unit,
        };
      }

      const taskData = {
        title,
        description,
        category_id: selectedCategory,
        frequency,
        user_id: userId,
        priority,
        scheduled_duration: scheduledDuration ? parseInt(scheduledDuration, 10) : null,
        tags,
        reminder_minutes_before: reminderMinutes ? parseInt(reminderMinutes, 10) : null,
        preferred_time: preferredTime || null,
        recurrence_pattern: finalRecurrencePattern,
      };

      if (existingTask) {
        await updateTask({ ...taskData, id: existingTask.id });
        success(t("tasks.taskUpdated"), t("tasks.taskUpdatedDesc", { title }));
      } else {
        await createTask(taskData);
        success(t("tasks.taskCreated"), t("tasks.taskCreatedDesc", { title }));
      }

      onSuccess?.();
    } catch (err: any) {
      console.error("Failed to save task:", err);
      error(
        existingTask ? t("tasks.failedToUpdate") : t("tasks.failedToCreate"),
        err?.message || t("tasks.somethingWentWrong")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("tasks.modal.basicInfo")}
        </h3>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">{t("tasks.taskTitle")}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("tasks.taskTitlePlaceholder")}
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t("tasks.descriptionOptional")}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("tasks.addDetails")}
            disabled={isLoading}
          />
        </div>

        {/* AI Image Generation */}
        <div className="space-y-3">
          <Label>{t("tasks.ai.artImage")}</Label>

          {aiImageUrl ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                <img
                  src={aiImageUrl}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || isLoading || !existingTask}
                  className="flex-1"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("tasks.ai.regenerating")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t("tasks.ai.regenerate")}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  disabled={isGeneratingImage || isLoading || !existingTask}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="rounded-lg border-2 border-dashed border-border/50 p-8 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  {existingTask
                    ? t("tasks.ai.noImage")
                    : t("tasks.ai.saveFirstToGenerate")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || isLoading || !title.trim() || !existingTask}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("tasks.ai.generating")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t("tasks.ai.generate")}
                    </>
                  )}
                </Button>
              </div>
              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t("tasks.category")}</Label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-11 rounded-lg border-2 border-border/50 bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      {/* Häufigkeit & Zeitplan */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("tasks.scheduling.frequencyAndSchedule")}
        </h3>

        {/* Frequency */}
        <div className="space-y-2">
          <Label htmlFor="frequency">{t("tasks.frequency")}</Label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "custom")}
            className="w-full h-11 rounded-lg border-2 border-border/50 bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          >
            <option value="daily">{t("tasks.recurrence.daily")}</option>
            <option value="weekly">{t("tasks.recurrence.weekly")}</option>
            <option value="custom">{t("tasks.recurrence.custom")}</option>
          </select>
        </div>

        {/* Weekdays Selection - Always visible */}
        <div className="space-y-2">
          <Label>{frequency === "weekly" ? t("tasks.recurrence.selectDays") : t("tasks.scheduling.weekdaysOptional")}</Label>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDaysOfWeekChange(day.value)}
                disabled={isLoading || (frequency === "daily" && !recurrencePattern.weekdaysOnly)}
                className={`
                  p-2 rounded-lg border-2 transition-all text-xs font-medium
                  ${
                    recurrencePattern.daysOfWeek?.includes(day.value)
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/50"
                  }
                  ${(frequency === "daily" && !recurrencePattern.weekdaysOnly) ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {t(`tasks.daysOfWeek.${day.short.toLowerCase()}` as any) || day.short}
              </button>
            ))}
          </div>
        </div>

        {/* Daily - Weekdays Only Option */}
        {frequency === "daily" && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recurrencePattern.weekdaysOnly || false}
                onChange={(e) => handleWeekdaysOnlyChange(e.target.checked)}
                className="w-4 h-4 rounded border-border/50"
                disabled={isLoading}
              />
              <span className="text-sm">{t("tasks.recurrence.weekdaysOnly")}</span>
            </label>
          </div>
        )}

        {/* Custom Interval */}
        {frequency === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interval">{t("tasks.recurrence.interval")}</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                value={recurrencePattern.interval || ""}
                onChange={(e) =>
                  setRecurrencePattern({
                    ...recurrencePattern,
                    interval: parseInt(e.target.value, 10) || undefined,
                  })
                }
                placeholder="z.B. 3"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">{t("common.unit")}</Label>
              <select
                id="unit"
                value={recurrencePattern.unit || "days"}
                onChange={(e) =>
                  setRecurrencePattern({
                    ...recurrencePattern,
                    unit: e.target.value as "days" | "weeks" | "months",
                  })
                }
                className="w-full h-11 rounded-lg border-2 border-border/50 bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isLoading}
              >
                <option value="days">{t("tasks.recurrence.days")}</option>
                <option value="weeks">{t("tasks.recurrence.weeks")}</option>
                <option value="months">{t("common.months")}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Zeit & Dauer */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("tasks.scheduling.timeAndDuration")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="preferred_time">{t("tasks.scheduling.time")}</Label>
            <Input
              id="preferred_time"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Scheduled Duration */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_duration">
              {t("tasks.scheduling.duration")} ({t("tasks.scheduling.durationMinutes", { count: scheduledDuration || 0 })})
            </Label>
            <Input
              id="scheduled_duration"
              type="number"
              min="1"
              value={scheduledDuration}
              onChange={(e) => setScheduledDuration(e.target.value)}
              placeholder={t("tasks.scheduling.durationPlaceholder")}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Weitere Optionen */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("tasks.modal.additionalOptions")}
        </h3>

        {/* Priority */}
        <div className="space-y-2">
          <Label>{t("tasks.scheduling.priority")}</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                disabled={isLoading}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${
                    priority === p
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border/50 hover:border-primary/50"
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{t(`tasks.priority.${p}`)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t(`tasks.priority.${p}Desc`)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">{t("tasks.scheduling.tags")}</Label>
          <div className="space-y-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={t("tasks.scheduling.tagsPlaceholder")}
              disabled={isLoading}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reminder */}
        <div className="space-y-2">
          <Label htmlFor="reminder">{t("tasks.scheduling.reminder")}</Label>
          <select
            id="reminder"
            value={reminderMinutes}
            onChange={(e) => setReminderMinutes(e.target.value)}
            className="w-full h-11 rounded-lg border-2 border-border/50 bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          >
            <option value="">{t("tasks.scheduling.reminderNone")}</option>
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`tasks.reminder.${option.value}min` as any) || option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      {/* Form Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
            ? existingTask
              ? t("tasks.updating")
              : t("tasks.creating")
            : existingTask
            ? t("common.update")
            : t("tasks.createTask")}
        </Button>
      </div>
    </form>
  );
}
