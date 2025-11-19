"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Flame, Trash2, Play, Pause, ListTodo } from "lucide-react";
import { completeTask, deleteTask, toggleTaskActive } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/store/task-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { TaskSearch } from "./task-search";
import { TaskFilters } from "./task-filters";
import { TaskBulkActions } from "./task-bulk-actions";
import { EmptyState } from "@/components/empty-states/empty-state";
import { useTranslation } from "react-i18next";

type Task = {
  id: string;
  title: string;
  description: string | null;
  frequency: "daily" | "weekly" | "custom";
  category_id: string;
  current_streak: number | null;
  longest_streak: number | null;
  last_completed_at: string | null;
  is_active: boolean;
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
  const { filter, selectedTaskIds, toggleTaskSelection, clearFilter } = useTaskStore();
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

  const handleComplete = async (taskId: string) => {
    setIsLoading(taskId);
    try {
      await completeTask(taskId);
      success(t("tasks.taskCompleted"), t("tasks.taskCompletedDesc"));
      router.refresh();
    } catch (err) {
      console.error("Failed to complete task:", err);
      error(t("tasks.failedToComplete"), t("tasks.somethingWentWrong"));
    } finally {
      setIsLoading(null);
    }
  };

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

      {/* Bulk Actions */}
      <TaskBulkActions />

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
              {filteredTasks.map((task) => {
                const isCompletedToday = task.last_completed_at &&
                  new Date(task.last_completed_at).toDateString() === new Date().toDateString();
                const isSelected = selectedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        task.is_active
                          ? "border-border/50"
                          : "border-border/30 opacity-60"
                      }
                      ${isCompletedToday ? "bg-accent/10 border-accent" : ""}
                      ${isSelected ? "border-primary bg-primary/5" : ""}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                        className="mt-1"
                      />

                      {/* Task Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              background: task.task_categories?.color || "#ccc",
                            }}
                          />
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
                          <p className="text-sm text-muted-foreground pl-6">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 pl-6 text-xs text-muted-foreground">
                          <span>{t(`tasks.${task.frequency}`)}</span>
                          <span>•</span>
                          <span>{task.task_categories?.name}</span>
                          {task.current_streak && task.current_streak > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-accent-foreground">
                                <Flame className="h-3 w-3" />
                                {task.current_streak} {t("tasks.dayStreak")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {task.is_active && (
                          <Button
                            size="sm"
                            variant={isCompletedToday ? "secondary" : "default"}
                            onClick={() => handleComplete(task.id)}
                            disabled={isLoading === task.id || isCompletedToday}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            {isCompletedToday ? t("tasks.done") : t("tasks.complete")}
                          </Button>
                        )}

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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
