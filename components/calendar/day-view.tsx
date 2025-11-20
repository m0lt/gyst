"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CalendarData, TaskInstance, PausedTask } from "@/app/actions/calendar";
import { useTranslation } from "react-i18next";
import { TaskInstanceDetailModal } from "@/components/tasks/task-instance-detail-modal";
import { toggleTaskActive } from "@/app/actions/tasks";
import { Play, Pause, Clock } from "lucide-react";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useRouter } from "next/navigation";

interface DayViewProps {
  currentDate: Date;
  data: CalendarData;
  userId: string;
  categories?: Array<{ id: string; name: string; color: string }>;
  onTaskUpdated?: () => void;
}

export function DayView({ currentDate, data, categories = [], onTaskUpdated }: DayViewProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;
  const router = useRouter();
  const { success, error } = useNotificationStore();
  const [selectedTask, setSelectedTask] = useState<TaskInstance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const handleTaskClick = (task: TaskInstance) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemsForHour = (hour: number) => {
    const dayStr = format(currentDate, "yyyy-MM-dd");

    const tasks = data.taskInstances.filter((instance) => {
      if (instance.due_date !== dayStr) return false;
      if (!instance.scheduled_time) return false;

      const [taskHour] = instance.scheduled_time.split(":").map(Number);
      return taskHour === hour;
    });

    const events = data.externalEvents.filter((event) => {
      const eventStart = new Date(event.start_time);
      const eventDay = format(eventStart, "yyyy-MM-dd");
      const eventHour = eventStart.getHours();

      return eventDay === dayStr && eventHour === hour;
    });

    return { tasks, events };
  };

  const getUnscheduledTasks = () => {
    const dayStr = format(currentDate, "yyyy-MM-dd");

    return data.taskInstances.filter(
      (instance) =>
        instance.due_date === dayStr && !instance.scheduled_time
    );
  };

  const unscheduledTasks = getUnscheduledTasks();
  const pausedTasks = data.pausedTasks || [];

  const handleResumeTask = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      await toggleTaskActive(taskId, true);
      success(
        t("tasks.taskActivated"),
        t("tasks.taskActivatedDesc")
      );
      if (onTaskUpdated) {
        onTaskUpdated();
      }
      router.refresh();
    } catch (err) {
      error(
        t("tasks.error"),
        err instanceof Error ? err.message : t("tasks.errorDesc")
      );
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Paused Tasks Section */}
      {pausedTasks.length > 0 && (
        <Card className="p-4 opacity-70">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
            <Pause className="h-4 w-4" />
            {t("calendar.paused")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {pausedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{task.title}</div>
                    {task.task_categories && (
                      <Badge
                        variant="outline"
                        className="mt-1"
                        style={{
                          borderColor: task.task_categories.color,
                          color: task.task_categories.color,
                        }}
                      >
                        {task.task_categories.icon && (
                          <span className="mr-1">{task.task_categories.icon}</span>
                        )}
                        {task.task_categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
                {task.description && (
                  <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  {task.preferred_time && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.preferred_time}
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResumeTask(task.id)}
                    disabled={loadingTaskId === task.id}
                    className="ml-auto"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {t("calendar.resumeTask")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hourly Timeline */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {format(currentDate, "EEEE, MMMM dd, yyyy", { locale })}
        </h3>

        <div className="space-y-0">
          {/* Unscheduled Tasks Row - Anytime Today */}
          {unscheduledTasks.length > 0 && (
            <div className="flex gap-4 border-t min-h-[80px] bg-accent/10">
              {/* Label */}
              <div className="w-20 shrink-0 pt-2 text-sm font-medium text-muted-foreground">
                <div className="flex flex-col items-start">
                  <Clock className="h-4 w-4 mb-1" />
                  <span className="text-xs leading-tight">
                    {t("calendar.anytimeToday")}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 py-2 flex gap-2 flex-wrap items-start">
                {unscheduledTasks.map((task) => {
                  const isCompleted = task.status === "completed" || !!task.completed_at;
                  const duration = task.task?.scheduled_duration || task.task?.estimated_minutes || 30;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all border-2 shadow-md min-w-[200px] max-w-[300px]",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/40"
                          : "bg-mucha-mauve/30 text-mucha-mauve hover:bg-mucha-mauve/40 border-mucha-mauve/50 hover:border-mucha-mauve"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "font-medium truncate",
                              isCompleted && "line-through"
                            )}
                          >
                            {task.task?.title || "Untitled"}
                          </div>
                          {task.task?.description && (
                            <div className="text-sm mt-1 opacity-75 line-clamp-2">
                              {task.task.description}
                            </div>
                          )}
                          {task.task?.category && (
                            <div className="flex items-center gap-1 mt-2 text-xs">
                              {task.task.category.icon && (
                                <span>{task.task.category.icon}</span>
                              )}
                              <span>{task.task.category.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-mono ml-2 shrink-0">
                          {duration}min
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hourly Rows */}
          {hours.map((hour) => {
            const { tasks, events } = getItemsForHour(hour);
            const hasItems = tasks.length > 0 || events.length > 0;

            return (
              <div
                key={hour}
                className={cn(
                  "flex gap-4 border-t min-h-[60px] transition-colors",
                  hasItems ? "bg-accent/20" : "hover:bg-accent/10"
                )}
              >
                {/* Hour Label */}
                <div className="w-20 shrink-0 pt-2 text-sm font-medium text-muted-foreground">
                  {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
                </div>

                {/* Content Area */}
                <div className="flex-1 py-2 relative min-h-[60px]">
                  {/* Tasks */}
                  {tasks.map((task) => {
                    const isCompleted = task.status === "completed" || !!task.completed_at;
                    const duration = task.task?.scheduled_duration || task.task?.estimated_minutes || 30;
                    const durationMinutes = duration;
                    const heightPerMinute = 2; // 2px per minute for better visibility
                    const blockHeight = Math.max(durationMinutes * heightPerMinute, 50); // Minimum 50px

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={cn(
                          "absolute left-0 right-0 p-3 rounded-lg cursor-pointer transition-all overflow-hidden border-2 shadow-md",
                          "hover:shadow-lg hover:scale-[1.01] hover:z-10 active:scale-[0.99]",
                          isCompleted
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/40 hover:border-green-400"
                            : "bg-mucha-mauve/30 text-mucha-mauve hover:bg-mucha-mauve/40 border-mucha-mauve/50 hover:border-mucha-mauve"
                        )}
                        style={{
                          height: `${blockHeight}px`,
                          top: 0,
                        }}
                      >
                        <div className="flex items-start justify-between h-full">
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-medium truncate",
                                isCompleted && "line-through"
                              )}
                            >
                              {task.task?.title || "Untitled"}
                            </div>
                            {blockHeight > 50 && task.task?.description && (
                              <div className="text-sm mt-1 opacity-75 line-clamp-2">
                                {task.task.description}
                              </div>
                            )}
                            {blockHeight > 80 && task.task?.category && (
                              <div className="flex items-center gap-1 mt-2 text-xs">
                                {task.task.category.icon && (
                                  <span>{task.task.category.icon}</span>
                                )}
                                <span>{task.task.category.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-mono ml-2 shrink-0">
                            {durationMinutes}min
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* External Events */}
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg cursor-pointer bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          {event.description && (
                            <div className="text-sm mt-1 opacity-75">
                              {event.description}
                            </div>
                          )}
                          {event.location && (
                            <div className="text-xs mt-2 opacity-75">
                              📍 {event.location}
                            </div>
                          )}
                        </div>
                        {!event.all_day && (
                          <div className="text-sm font-mono">
                            {format(new Date(event.start_time), "HH:mm")} -{" "}
                            {format(new Date(event.end_time), "HH:mm")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Task Instance Detail Modal */}
      {selectedTask && (
        <TaskInstanceDetailModal
          instance={selectedTask}
          categories={categories}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={onTaskUpdated}
        />
      )}
    </div>
  );
}
