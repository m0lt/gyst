"use client";

import { useState, useOptimistic } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Calendar, SkipForward, CheckSquare, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { CompleteTaskModal } from "./complete-task-modal";
import { RescheduleTaskModal } from "./reschedule-task-modal";
import { TaskInstanceDetailModal } from "@/components/tasks/task-instance-detail-modal";
import { skipTaskInstance, updateSubtasksCompleted, reactivateTaskInstance } from "@/app/actions/task-instances";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useTranslation } from "react-i18next";
import { ArtNouveauPlaceholder } from "@/components/ornaments/art-nouveau-placeholder";
import { Progress } from "@/components/ui/progress";

type TaskInstance = {
  id: string;
  task_id: string;
  due_date: string;
  scheduled_time: string | null;
  status: "pending" | "completed" | "skipped" | "rescheduled";
  completed_at: string | null;
  mood: "happy" | "neutral" | "sad" | null;
  photo_url: string | null;
  subtasks_completed: Record<string, boolean> | null;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    priority: "low" | "medium" | "high";
    scheduled_duration: number | null;
    ai_image_url: string | null;
    task_categories: {
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

type TodoListProps = {
  instances: TaskInstance[];
  userId: string;
};

export function TodoList({ instances, userId }: TodoListProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { success, error } = useNotificationStore();
  const [completingInstanceId, setCompletingInstanceId] = useState<string | null>(null);
  const [reschedulingInstanceId, setReschedulingInstanceId] = useState<string | null>(null);
  const [expandedInstances, setExpandedInstances] = useState<Set<string>>(new Set());
  const [selectedInstance, setSelectedInstance] = useState<TaskInstance | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Optimistic state for instances
  const [optimisticInstances, setOptimisticInstances] = useOptimistic(
    instances,
    (state, { instanceId, subtaskId }: { instanceId: string; subtaskId: string }) => {
      return state.map(instance => {
        if (instance.id === instanceId) {
          const currentCompleted = instance.subtasks_completed || {};
          return {
            ...instance,
            subtasks_completed: {
              ...currentCompleted,
              [subtaskId]: !currentCompleted[subtaskId]
            }
          };
        }
        return instance;
      });
    }
  );

  const pendingInstances = optimisticInstances.filter((i) => i.status === "pending");
  const completedInstances = optimisticInstances.filter((i) => i.status === "completed");

  const handleToggleSubtask = async (instance: TaskInstance, subtaskId: string) => {
    const currentCompleted = instance.subtasks_completed || {};
    const newCompleted = {
      ...currentCompleted,
      [subtaskId]: !currentCompleted[subtaskId]
    };

    // Optimistically update the UI
    setOptimisticInstances({ instanceId: instance.id, subtaskId });

    try {
      // Update in background without blocking UI
      await updateSubtasksCompleted(instance.id, newCompleted);
    } catch (err: any) {
      console.error("Failed to update subtask:", err);
      error("Failed to update", err.message || "Something went wrong");
      // Revert will happen automatically when instances prop updates
      router.refresh();
    }
  };

  const toggleSubtasks = (instanceId: string) => {
    setExpandedInstances(prev => {
      const next = new Set(prev);
      if (next.has(instanceId)) {
        next.delete(instanceId);
      } else {
        next.add(instanceId);
      }
      return next;
    });
  };

  const calculateSubtaskProgress = (instance: TaskInstance) => {
    const subtasks = instance.tasks.task_subtasks;
    if (!subtasks || subtasks.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = subtasks.length;
    const completedSubtasks = instance.subtasks_completed || {};
    const completed = Object.values(completedSubtasks).filter(Boolean).length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const handleSkip = async (instanceId: string, title: string) => {
    if (!confirm(`Skip "${title}"?`)) return;

    try {
      await skipTaskInstance(instanceId);
      success("Task skipped", "You can always reschedule it for another day");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to skip task:", err);
      error("Failed to skip", err.message || "Something went wrong");
    }
  };

  const handleReactivate = async (instanceId: string, title: string) => {
    if (!confirm(t("todo.reactivateConfirm", { title }))) return;

    try {
      await reactivateTaskInstance(instanceId);
      success(t("todo.taskReactivated"), t("todo.taskReactivatedDesc"));
      router.refresh();
    } catch (err: any) {
      console.error("Failed to reactivate task:", err);
      error(t("todo.failedToReactivate"), err.message || t("tasks.somethingWentWrong"));
    }
  };

  if (instances.length === 0) {
    return (
      <Card className="card-art-nouveau">
        <CardContent className="pt-6 text-center py-12">
          <Clock className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tasks for today</h3>
          <p className="text-sm text-muted-foreground">
            Enjoy your free time or create some recurring tasks!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingInstances.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("todo.toDo")} ({pendingInstances.length})
          </h2>
          <div className="space-y-3">
            {pendingInstances.map((instance) => (
              <Card
                key={instance.id}
                className="card-art-nouveau cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedInstance(instance);
                  setShowDetailModal(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Task Image */}
                    <div className="flex-shrink-0">
                      {instance.tasks.ai_image_url ? (
                        <img
                          src={instance.tasks.ai_image_url}
                          alt={instance.tasks.title}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <ArtNouveauPlaceholder className="w-20 h-20 rounded-lg" />
                      )}
                    </div>

                    {/* Task Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {instance.tasks.task_categories && (
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  background: instance.tasks.task_categories.color,
                                }}
                              />
                            )}
                            <h3 className="font-display font-semibold text-lg">
                              {instance.tasks.title}
                            </h3>
                          </div>
                          {instance.tasks.description && (
                            <p className="text-sm text-muted-foreground">
                              {instance.tasks.description}
                            </p>
                          )}
                        </div>

                        {/* Priority Badge */}
                        <Badge
                          variant={
                            instance.tasks.priority === "high"
                              ? "destructive"
                              : instance.tasks.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {instance.tasks.priority}
                        </Badge>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {instance.scheduled_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {instance.scheduled_time.slice(0, 5)}
                          </span>
                        )}
                        {instance.tasks.scheduled_duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {instance.tasks.scheduled_duration} min
                          </span>
                        )}
                        {instance.tasks.task_categories && (
                          <span>{instance.tasks.task_categories.name}</span>
                        )}
                      </div>

                      {/* Subtasks Section */}
                      {instance.tasks.task_subtasks && instance.tasks.task_subtasks.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {/* Subtask Summary Bar */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubtasks(instance.id);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {instance.tasks.task_subtasks.length} {t("tasks.subtasksCount", { count: instance.tasks.task_subtasks.length })}
                              </span>
                              {(() => {
                                const progress = calculateSubtaskProgress(instance);
                                if (progress.total > 0) {
                                  return (
                                    <span className="text-xs text-muted-foreground">
                                      ({progress.completed}/{progress.total} {t("todo.subtasksCompleted")})
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                            {expandedInstances.has(instance.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          {/* Progress Bar */}
                          {(() => {
                            const progress = calculateSubtaskProgress(instance);
                            return (
                              <div className="space-y-1">
                                <Progress value={progress.percentage} className="h-2" />
                                <p className="text-xs text-muted-foreground text-right">
                                  {progress.percentage}% {t("tasks.subtask.completionRate")}
                                </p>
                              </div>
                            );
                          })()}

                          {/* Expanded Subtask List */}
                          {expandedInstances.has(instance.id) && (
                            <div className="space-y-2 pl-6 pt-2">
                              {instance.tasks.task_subtasks
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((subtask) => {
                                  const isCompleted = instance.subtasks_completed?.[subtask.id] ?? false;

                                  return (
                                    <button
                                      key={subtask.id}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleSubtask(instance, subtask.id);
                                      }}
                                      className="w-full flex items-start gap-2 p-1 rounded hover:bg-muted/30 transition-colors"
                                    >
                                      <div className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                        isCompleted
                                          ? "bg-primary border-primary"
                                          : "border-muted-foreground/30"
                                      }`}>
                                        {isCompleted && (
                                          <Check className="h-3 w-3 text-primary-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1 text-left">
                                        <p className={`text-sm ${
                                          isCompleted
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
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          onClick={() => setCompletingInstanceId(instance.id)}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {t("todo.complete")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReschedulingInstanceId(instance.id)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("todo.reschedule")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSkip(instance.id, instance.tasks.title)}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedInstances.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
            {t("todo.completed")} ({completedInstances.length})
          </h2>
          <div className="space-y-3">
            {completedInstances.map((instance) => (
              <Card key={instance.id} className="card-art-nouveau opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold line-through">
                        {instance.tasks.title}
                      </h3>
                      {instance.mood && (
                        <p className="text-sm text-muted-foreground">
                          {t("todo.mood")}: {instance.mood === "happy" ? "😊" : instance.mood === "neutral" ? "😐" : "😞"}
                        </p>
                      )}
                    </div>
                    {instance.photo_url && (
                      <img
                        src={instance.photo_url}
                        alt="Completion proof"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReactivate(instance.id, instance.tasks.title)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {t("todo.reactivate")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {completingInstanceId && (
        <CompleteTaskModal
          instance={instances.find((i) => i.id === completingInstanceId)!}
          onClose={() => setCompletingInstanceId(null)}
          onSuccess={() => {
            setCompletingInstanceId(null);
            router.refresh();
          }}
        />
      )}

      {reschedulingInstanceId && (
        <RescheduleTaskModal
          instance={instances.find((i) => i.id === reschedulingInstanceId)!}
          onClose={() => setReschedulingInstanceId(null)}
          onSuccess={() => {
            setReschedulingInstanceId(null);
            router.refresh();
          }}
        />
      )}

      {selectedInstance && (
        <TaskInstanceDetailModal
          instance={selectedInstance}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
