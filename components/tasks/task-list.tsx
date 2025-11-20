"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trash2, Play, Pause, ListTodo, Clock, Timer, Tag, Pencil } from "lucide-react";
import { deleteTask, toggleTaskActive } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/store/task-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { TaskSearch } from "./task-search";
import { TaskFilters } from "./task-filters";
import { TaskFormModal } from "./task-form-modal";
import { EmptyState } from "@/components/empty-states/empty-state";
import { ArtNouveauPlaceholder } from "@/components/ornaments/art-nouveau-placeholder";
import { useTranslation } from "react-i18next";

type Task = {
  id: string;
  title: string;
  description: string | null;
  frequency: "daily" | "weekly" | "custom";
  category_id: string;
  user_id: string;
  current_streak: number | null;
  longest_streak: number | null;
  last_completed_at: string | null;
  is_active: boolean;
  priority: "low" | "medium" | "high";
  scheduled_duration: number | null;
  tags: string[];
  reminder_minutes_before: number | null;
  preferred_time: string | null;
  recurrence_pattern: any;
  ai_image_url: string | null;
  ai_image_prompt: string | null;
  task_categories: {
    id: string;
    name: string;
    color: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

type TaskListProps = {
  tasks: Task[];
  categories: Category[];
};

export function TaskList({ tasks: initialTasks, categories }: TaskListProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { filter, clearFilter } = useTaskStore();
  const { success, error } = useNotificationStore();

  // Apply filters
  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Category filter
      if (filter.categoryId && task.category_id !== filter.categoryId) {
        return false;
      }

      // Frequency filter
      if (filter.frequency && task.frequency !== filter.frequency) {
        return false;
      }

      // Active status filter
      if (filter.isActive !== undefined && task.is_active !== filter.isActive) {
        return false;
      }

      // Search query filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query);
        const matchesCategory = task.task_categories?.name.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDescription && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [initialTasks, filter]);

  const handleDelete = async (taskId: string) => {
    if (!confirm(t("tasks.deleteConfirm"))) return;

    setIsLoading(taskId);
    try {
      await deleteTask(taskId);
      success(t("tasks.taskDeleted"), t("tasks.taskDeletedDesc"));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete task:", err);
      error(t("tasks.failedToDelete"), t("tasks.somethingWentWrong"));
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleActive = async (taskId: string, isActive: boolean) => {
    setIsLoading(taskId);
    try {
      await toggleTaskActive(taskId, !isActive);
      success(
        isActive ? t("tasks.taskPaused") : t("tasks.taskActivated"),
        isActive ? t("tasks.taskPausedDesc") : t("tasks.taskActivatedDesc")
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle task:", err);
      error(t("tasks.failedToUpdate"), t("tasks.somethingWentWrong"));
    } finally {
      setIsLoading(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="card-art-nouveau">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <TaskSearch />
            </div>
            <TaskFilters categories={categories} />
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="card-art-nouveau">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("tasks.title")}</CardTitle>
              <CardDescription>
                {t("tasks.tasksFound", { count: filteredTasks.length })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            initialTasks.length === 0 ? (
              <EmptyState
                icon={ListTodo}
                title={t("tasks.noTasks")}
                description={t("tasks.noTasksDesc")}
              />
            ) : (
              <EmptyState
                icon={ListTodo}
                title={t("tasks.noTasksFound")}
                description={t("tasks.noTasksFoundDesc")}
                action={{
                  label: t("tasks.clearFilters"),
                  onClick: clearFilter,
                }}
              />
            )
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        task.is_active
                          ? "border-border/50"
                          : "border-border/30 opacity-60"
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* AI Image or Placeholder */}
                      <div className="flex-shrink-0">
                        {task.ai_image_url ? (
                          <img
                            src={task.ai_image_url}
                            alt={task.title}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <ArtNouveauPlaceholder className="w-16 h-16 rounded-lg" />
                        )}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-semibold text-lg">
                            {task.title}
                          </h3>
                          {!task.is_active && (
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {t("tasks.paused")}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Category Badge */}
                          {task.task_categories && (
                            <Badge
                              variant="outline"
                              className="text-xs border-2"
                              style={{
                                borderColor: task.task_categories.color,
                                color: task.task_categories.color,
                              }}
                            >
                              {task.task_categories.name}
                            </Badge>
                          )}

                          {/* Priority Badge */}
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {t(`tasks.priority.${task.priority}`)}
                          </Badge>

                          {/* Frequency */}
                          <span className="text-xs text-muted-foreground">
                            {t(`tasks.${task.frequency}`)}
                          </span>

                          {/* Time */}
                          {task.preferred_time && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {task.preferred_time}
                            </span>
                          )}

                          {/* Duration */}
                          {task.scheduled_duration && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              {t("tasks.scheduling.durationMinutes", { count: task.scheduled_duration })}
                            </span>
                          )}

                          {/* Streak */}
                          {task.current_streak && task.current_streak > 0 && (
                            <span className="flex items-center gap-1 text-xs text-accent-foreground">
                              <Flame className="h-3 w-3" />
                              {task.current_streak} {t("tasks.dayStreak")}
                            </span>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-muted-foreground" />
                              <div className="flex gap-1">
                                {task.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{task.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(task)}
                          disabled={isLoading === task.id}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(task.id, task.is_active)}
                          disabled={isLoading === task.id}
                        >
                          {task.is_active ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(task.id)}
                          disabled={isLoading === task.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Task Modal */}
      <TaskFormModal
        categories={categories}
        existingTask={editingTask || undefined}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditingTask(null);
        }}
      />
    </div>
  );
}
