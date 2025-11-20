"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Calendar,
  Clock,
  CheckSquare,
  Image as ImageIcon,
  AlertCircle,
  Edit,
  Play,
  SkipForward,
  Smile,
  Meh,
  Frown,
  Camera,
} from "lucide-react";
import { CompleteTaskModal } from "@/components/todo/complete-task-modal";
import { RescheduleTaskModal } from "@/components/todo/reschedule-task-modal";
import { TaskFormModal } from "./task-form-modal";
import { skipTaskInstance } from "@/app/actions/task-instances";
import { cn } from "@/lib/utils";

type TaskInstance = {
  id: string;
  task_id: string;
  due_date: string;
  scheduled_time?: string | null;
  status: "pending" | "completed" | "skipped" | "rescheduled";
  completed_at?: string | null;
  mood?: "happy" | "neutral" | "sad" | null;
  photo_url?: string | null;
  notes?: string | null;
  actual_minutes?: number | null;
  subtasks_completed?: Record<string, boolean> | null;
  tasks?: {
    id: string;
    title: string;
    description?: string | null;
    priority: "low" | "medium" | "high";
    estimated_minutes?: number | null;
    scheduled_duration?: number | null;
    ai_image_url?: string | null;
    ai_image_prompt?: string | null;
    category_id?: string | null;
    task_categories?: {
      id: string;
      name: string;
      color: string;
      icon: string;
    } | null;
    task_subtasks?: Array<{
      id: string;
      title: string;
      is_required: boolean;
      sort_order: number;
    }>;
  };
};

type Category = {
  id: string;
  name: string;
  color: string;
};

interface TaskInstanceDetailModalProps {
  instance: TaskInstance;
  categories?: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TaskInstanceDetailModal({
  instance,
  categories = [],
  open,
  onOpenChange,
  onSuccess,
}: TaskInstanceDetailModalProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;
  const router = useRouter();
  const { success, error } = useNotificationStore();

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const task = instance.tasks;
  if (!task) {
    return null;
  }

  const isCompleted = instance.status === "completed" || !!instance.completed_at;
  const isSkipped = instance.status === "skipped";
  const isPending = instance.status === "pending";

  const categoryColor = task.task_categories?.color || "#6366f1";
  const priorityColors = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  const moodIcons = {
    happy: <Smile className="h-5 w-5 text-green-600" />,
    neutral: <Meh className="h-5 w-5 text-gray-600" />,
    sad: <Frown className="h-5 w-5 text-red-600" />,
  };

  const handleSkip = async () => {
    const confirmed = window.confirm(t("taskInstance.skipConfirm"));
    if (!confirmed) return;

    setIsSkipping(true);
    try {
      await skipTaskInstance(instance.id);
      success(t("taskInstance.skipped"), t("taskInstance.skippedDesc"));
      onOpenChange(false);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      error(
        t("tasks.error"),
        err instanceof Error ? err.message : t("tasks.errorDesc")
      );
    } finally {
      setIsSkipping(false);
    }
  };

  const handleCompleteSuccess = () => {
    setShowCompleteModal(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const calculateSubtasksProgress = () => {
    const subtasks = task.task_subtasks;
    if (!subtasks || subtasks.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const total = subtasks.length;
    const completed = instance.subtasks_completed
      ? Object.values(instance.subtasks_completed).filter(Boolean).length
      : 0;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const subtasksProgress = calculateSubtasksProgress();

  return (
    <>
      <Dialog open={open && !showCompleteModal && !showRescheduleModal && !showEditModal} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div
                className="h-1 w-16 rounded-full mt-2"
                style={{ backgroundColor: categoryColor }}
              />
              <div className="flex-1">
                <DialogTitle className="text-2xl">{task.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  {task.task_categories && (
                    <Badge variant="outline" className="gap-1">
                      <span className="text-xs">{task.task_categories.icon}</span>
                      {task.task_categories.name}
                    </Badge>
                  )}
                  <Badge className={priorityColors[task.priority]}>
                    {t(`tasks.priority.${task.priority}`)}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {t("taskInstance.completed")}
                    </Badge>
                  )}
                  {isSkipped && (
                    <Badge variant="outline" className="text-muted-foreground">
                      {t("taskInstance.skipped")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* AI Image */}
            {task.ai_image_url && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4" />
                  {t("taskInstance.taskImage")}
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={task.ai_image_url}
                    alt={task.title}
                    className="w-full h-64 object-cover"
                  />
                  {task.ai_image_prompt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                      {task.ai_image_prompt}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedule Information */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                {t("taskInstance.scheduleInfo")}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">{t("taskInstance.scheduledFor")}</div>
                  <div className="font-medium">
                    {format(new Date(instance.due_date), "PPP", { locale })}
                  </div>
                </div>
                {instance.scheduled_time && (
                  <div>
                    <div className="text-muted-foreground">{t("taskInstance.time")}</div>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {instance.scheduled_time}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground">{t("taskInstance.estimatedTime")}</div>
                  <div className="font-medium">
                    {task.scheduled_duration || task.estimated_minutes || "-"} min
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  {t("taskInstance.description")}
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtasks */}
            {task.task_subtasks && task.task_subtasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckSquare className="h-4 w-4" />
                    {t("taskInstance.subtasks")}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {subtasksProgress.completed}/{subtasksProgress.total}
                  </span>
                </div>
                <Progress value={subtasksProgress.percentage} className="h-2" />
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                  {task.task_subtasks
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((subtask) => {
                      const isChecked = instance.subtasks_completed?.[subtask.id] || false;
                      return (
                        <div
                          key={subtask.id}
                          className="flex items-start gap-3 p-2 rounded"
                        >
                          <div className={cn(
                            "mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                            isChecked
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30"
                          )}>
                            {isChecked && (
                              <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm",
                              isChecked && "text-muted-foreground line-through"
                            )}>
                              {subtask.title}
                            </p>
                            {subtask.is_required && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {t("tasks.subtask.required")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Completion Information */}
            {isCompleted && (
              <div className="space-y-3 p-4 rounded-lg border bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
                  <CheckSquare className="h-4 w-4" />
                  {t("taskInstance.completionInfo")}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t("taskInstance.completedAt")}</div>
                    <div className="font-medium">
                      {instance.completed_at && format(new Date(instance.completed_at), "PPp", { locale })}
                    </div>
                  </div>
                  {instance.actual_minutes && (
                    <div>
                      <div className="text-muted-foreground">{t("taskInstance.actualTime")}</div>
                      <div className="font-medium">{instance.actual_minutes} min</div>
                    </div>
                  )}
                  {instance.mood && (
                    <div>
                      <div className="text-muted-foreground">{t("taskInstance.mood")}</div>
                      <div className="flex items-center gap-2 font-medium">
                        {moodIcons[instance.mood]}
                        {t(`todo.${instance.mood}`)}
                      </div>
                    </div>
                  )}
                </div>
                {instance.photo_url && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Camera className="h-4 w-4" />
                      {t("taskInstance.proofPhoto")}
                    </div>
                    <img
                      src={instance.photo_url}
                      alt="Completion proof"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                {instance.notes && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">{t("taskInstance.notes")}</div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {instance.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Footer with Actions */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex gap-2">
              {isPending && (
                <>
                  <Button
                    onClick={() => setShowCompleteModal(true)}
                    className="flex-1 gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {t("taskInstance.complete")}
                  </Button>
                  <Button
                    onClick={() => setShowRescheduleModal(true)}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {t("taskInstance.reschedule")}
                  </Button>
                </>
              )}
              {(isPending || isSkipped) && (
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  disabled={isSkipping}
                  className="gap-2"
                >
                  <SkipForward className="h-4 w-4" />
                  {t("taskInstance.skip")}
                </Button>
              )}
            </div>
            <Button
              onClick={() => setShowEditModal(true)}
              variant="ghost"
              className="w-full gap-2"
            >
              <Edit className="h-4 w-4" />
              {t("taskInstance.editTemplate")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Modals */}
      {showCompleteModal && (
        <CompleteTaskModal
          instance={instance as any}
          onClose={() => setShowCompleteModal(false)}
          onSuccess={handleCompleteSuccess}
        />
      )}

      {showRescheduleModal && (
        <RescheduleTaskModal
          instance={instance as any}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}

      {showEditModal && task && (
        <TaskFormModal
          categories={categories}
          existingTask={{
            id: task.id,
            title: task.title,
            description: task.description || null,
            category_id: task.category_id || "",
            frequency: "daily",
            priority: task.priority,
            scheduled_duration: task.scheduled_duration || null,
            tags: [],
            reminder_minutes_before: null,
            preferred_time: instance.scheduled_time || null,
            recurrence_pattern: null,
            ai_image_url: task.ai_image_url || null,
            ai_image_prompt: task.ai_image_prompt || null,
          }}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onTaskUpdated={handleEditSuccess}
        />
      )}
    </>
  );
}
