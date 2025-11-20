"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createTask, updateTask, createSubtask, updateSubtask, deleteSubtask } from "@/app/actions/tasks";
import { generateTaskImage, deleteTaskImage } from "@/app/actions/ai-images";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useTranslation } from "react-i18next";
import type { TaskPriority, RecurrencePattern } from "@/lib/types/task-scheduling";
import { REMINDER_OPTIONS, DAYS_OF_WEEK } from "@/lib/types/task-scheduling";
import { X, Sparkles, Loader2, Trash2, Expand, Plus, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type Category = {
  id: string;
  name: string;
  color: string;
};

type Subtask = {
  id: string;
  title: string;
  is_required: boolean;
  sort_order: number;
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
  subtasks?: Subtask[];
};

type TaskFormProps = {
  categories: Category[];
  existingTask?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function TaskForm({ categories, existingTask, onSuccess, onCancel }: TaskFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useNotificationStore();

  // Current task state (for newly created tasks)
  const [currentTask, setCurrentTask] = useState<Task | undefined>(existingTask);

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
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // Subtask state
  const [subtasks, setSubtasks] = useState<Subtask[]>(existingTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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

  // Subtask management handlers
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    if (currentTask) {
      // Task exists - create subtask in database
      try {
        const newSubtask = await createSubtask({
          taskId: currentTask.id,
          title: newSubtaskTitle.trim(),
          isRequired: false,
          sortOrder: subtasks.length,
        });
        setSubtasks([...subtasks, newSubtask]);
        setNewSubtaskTitle("");
        success(t("tasks.subtask.added"), t("tasks.subtask.addedDesc"));
      } catch (err: any) {
        error(t("tasks.subtask.failedToAdd"), err?.message || t("tasks.somethingWentWrong"));
      }
    } else {
      // Task doesn't exist yet - add to local state
      const tempSubtask: Subtask = {
        id: `temp-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        is_required: false,
        sort_order: subtasks.length,
      };
      setSubtasks([...subtasks, tempSubtask]);
      setNewSubtaskTitle("");
    }
  };

  const handleDeleteSubtask = async (subtaskId: string, index: number) => {
    if (currentTask && !subtaskId.startsWith("temp-")) {
      // Task exists and subtask is persisted - delete from database
      try {
        await deleteSubtask(subtaskId, currentTask.id);
        setSubtasks(subtasks.filter((_, i) => i !== index));
        success(t("tasks.subtask.deleted"), t("tasks.subtask.deletedDesc"));
      } catch (err: any) {
        error(t("tasks.subtask.failedToDelete"), err?.message || t("tasks.somethingWentWrong"));
      }
    } else {
      // Remove from local state only
      setSubtasks(subtasks.filter((_, i) => i !== index));
    }
  };

  const handleToggleSubtaskRequired = async (subtaskId: string, index: number, isRequired: boolean) => {
    if (currentTask && !subtaskId.startsWith("temp-")) {
      // Task exists and subtask is persisted - update in database
      try {
        await updateSubtask({
          id: subtaskId,
          isRequired,
        });
        const updated = [...subtasks];
        updated[index].is_required = isRequired;
        setSubtasks(updated);
      } catch (err: any) {
        error(t("tasks.subtask.failedToUpdate"), err?.message || t("tasks.somethingWentWrong"));
      }
    } else {
      // Update local state only
      const updated = [...subtasks];
      updated[index].is_required = isRequired;
      setSubtasks(updated);
    }
  };

  // Handle AI image generation
  const handleGenerateImage = async () => {
    if (!title.trim()) {
      error(t("tasks.ai.titleRequired"), t("tasks.ai.titleRequiredDesc"));
      return;
    }

    // For new tasks, we need to save first
    if (!currentTask) {
      error(t("tasks.ai.saveFirst"), t("tasks.ai.saveFirstDesc"));
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const result = await generateTaskImage(currentTask.id, title, description);
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
    if (!currentTask) return;

    try {
      await deleteTaskImage(currentTask.id);
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
        priority,
        scheduled_duration: scheduledDuration ? parseInt(scheduledDuration, 10) : null,
        tags,
        reminder_minutes_before: reminderMinutes ? parseInt(reminderMinutes, 10) : null,
        preferred_time: preferredTime || null,
        recurrence_pattern: finalRecurrencePattern,
      };

      if (currentTask) {
        await updateTask({ ...taskData, id: currentTask.id });
        success(t("tasks.taskUpdated"), t("tasks.taskUpdatedDesc", { title }));
        onSuccess?.();
      } else {
        const createdTask = await createTask(taskData);
        setCurrentTask(createdTask as Task);

        // Create subtasks if any were added before task was saved
        if (subtasks.length > 0) {
          for (const subtask of subtasks) {
            if (subtask.id.startsWith("temp-")) {
              try {
                const createdSubtask = await createSubtask({
                  taskId: createdTask.id,
                  title: subtask.title,
                  isRequired: subtask.is_required,
                  sortOrder: subtask.sort_order,
                });
                // Replace temp ID with real ID
                setSubtasks((prev) =>
                  prev.map((st) =>
                    st.id === subtask.id ? createdSubtask : st
                  )
                );
              } catch (err) {
                console.error("Failed to create subtask:", err);
              }
            }
          }
        }

        success(
          t("tasks.taskCreated"),
          t("tasks.ai.taskCreatedCanGenerateImage", { title })
        );
        // Don't call onSuccess yet - let user generate image first
      }
    } catch (err: any) {
      console.error("Failed to save task:", err);
      error(
        currentTask ? t("tasks.failedToUpdate") : t("tasks.failedToCreate"),
        err?.message || t("tasks.somethingWentWrong")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Image Preview Dialog */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {aiImageUrl && (
            <img
              src={aiImageUrl}
              alt={title}
              className="w-full aspect-square object-cover rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t("tasks.modal.step", { current: currentStep, total: totalSteps })}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Separator />

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
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
              <div
                className="relative rounded-lg overflow-hidden border-2 border-primary/20 w-48 mx-auto cursor-pointer group"
                onClick={() => setIsImagePreviewOpen(true)}
              >
                <img
                  src={aiImageUrl}
                  alt={title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || isLoading || !currentTask}
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
                  disabled={isGeneratingImage || isLoading || !currentTask}
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
                  {currentTask
                    ? t("tasks.ai.noImage")
                    : t("tasks.ai.saveFirstToGenerate")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || isLoading || !title.trim() || !currentTask}
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
      )}

      {/* Step 2: Schedule */}
      {currentStep === 2 && (
      <div className="space-y-6">
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
      </div>
      )}

      {/* Step 3: Details */}
      {currentStep === 3 && (
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
      )}

      {/* Step 4: Subtasks */}
      {currentStep === 4 && (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("tasks.subtask.subtasks")}
        </h3>

        {/* Add new subtask */}
        <div className="space-y-2">
          <Label htmlFor="new-subtask">{t("tasks.subtask.addSubtask")}</Label>
          <div className="flex gap-2">
            <Input
              id="new-subtask"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder={t("tasks.subtask.placeholder")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddSubtask}
              disabled={isLoading || !newSubtaskTitle.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {!currentTask && subtasks.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {t("tasks.subtask.saveTaskFirst")}
            </p>
          )}
        </div>

        {/* Subtask list */}
        {subtasks.length > 0 && (
          <div className="space-y-2">
            <Label>{t("tasks.subtask.subtaskList")}</Label>
            <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-accent/5">
              {subtasks.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-accent/10 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="flex-1 text-sm">{subtask.title}</span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`required-${subtask.id}`}
                      checked={subtask.is_required}
                      onCheckedChange={(checked) =>
                        handleToggleSubtaskRequired(subtask.id, index, !!checked)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={`required-${subtask.id}`}
                      className="text-xs text-muted-foreground cursor-pointer"
                    >
                      {t("tasks.subtask.required")}
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubtask(subtask.id, index)}
                      disabled={isLoading}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("tasks.subtask.requiredInfo")}
            </p>
          </div>
        )}
      </div>
      )}

      <Separator />

      {/* Form Actions */}
      <div className="flex gap-3">
        {/* Back / Cancel Button */}
        {currentStep === 1 ? (
          onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
          )
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={isLoading}
            className="flex-1"
          >
            {t("common.back")}
          </Button>
        )}

        {/* Next / Submit Button */}
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={isLoading}
            className="flex-1"
          >
            {t("common.next")}
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading
              ? currentTask
                ? t("tasks.updating")
                : t("tasks.creating")
              : currentTask
              ? t("common.update")
              : t("tasks.createTask")}
          </Button>
        )}
      </div>
    </form>
    </>
  );
}
