"use client";

import { useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
} from "date-fns";
import { de } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarData, TaskInstance, PausedTask } from "@/app/actions/calendar";
import { useTranslation } from "react-i18next";
import { TaskInstanceDetailModal } from "@/components/tasks/task-instance-detail-modal";
import { toggleTaskActive } from "@/app/actions/tasks";
import { Play, Pause, Clock } from "lucide-react";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useRouter } from "next/navigation";

interface WeekViewProps {
  currentDate: Date;
  data: CalendarData;
  userId: string;
  categories?: Array<{ id: string; name: string; color: string }>;
  onTaskUpdated?: () => void;
}

export function WeekView({ currentDate, data, categories = [], onTaskUpdated }: WeekViewProps) {
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

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemsForDayAndHour = (day: Date, hour: number) => {
    const dayStr = format(day, "yyyy-MM-dd");

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

  const getUnscheduledTasksForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");

    return data.taskInstances.filter(
      (instance) =>
        instance.due_date === dayStr && !instance.scheduled_time
    );
  };

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
        <Card className="p-3 opacity-70">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Pause className="h-4 w-4" />
              {t("calendar.paused")} ({pausedTasks.length})
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {pausedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-xs">{task.title}</div>
                  {task.preferred_time && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.preferred_time}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleResumeTask(task.id)}
                  disabled={loadingTaskId === task.id}
                  className="h-6 px-2"
                >
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 overflow-auto">
      <div className="flex gap-2">
        {/* Time Labels */}
        <div className="flex flex-col w-16 shrink-0">
          <div className="h-20" /> {/* Header spacer */}
          {/* Unscheduled Row Label */}
          <div className="min-h-[60px] text-xs text-muted-foreground text-right pr-2 border-t flex items-center justify-end">
            <div className="flex flex-col items-end">
              <Clock className="h-3 w-3 mb-1" />
              <span className="leading-tight text-[10px]">
                {t("calendar.anytimeToday")}
              </span>
            </div>
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 text-xs text-muted-foreground text-right pr-2 border-t"
            >
              {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-7">
            {/* Day Headers */}
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "text-center h-20 flex flex-col items-center justify-center border-b-2",
                  isToday(day)
                    ? "border-mucha-mauve"
                    : "border-border"
                )}
              >
                <div
                  className={cn(
                    "text-xs font-medium text-muted-foreground",
                    isToday(day) && "text-mucha-mauve"
                  )}
                >
                  {format(day, "EEE", { locale })}
                </div>
                <div
                  className={cn(
                    "text-2xl font-semibold",
                    isToday(day)
                      ? "bg-mucha-mauve text-white rounded-full w-10 h-10 flex items-center justify-center"
                      : ""
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}

            {/* Unscheduled Tasks Row */}
            {weekDays.map((day) => {
              const unscheduledTasks = getUnscheduledTasksForDay(day);
              return (
                <div
                  key={`unscheduled-${day.toISOString()}`}
                  className={cn(
                    "min-h-[60px] border-t border-l p-1 bg-accent/10 overflow-hidden",
                    isToday(day) && "bg-mucha-mauve/10"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    {unscheduledTasks.map((task) => {
                      const isCompleted = task.status === "completed" || !!task.completed_at;
                      return (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={cn(
                            "px-1.5 py-1 rounded text-xs cursor-pointer transition-all border shadow-sm truncate",
                            "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                            isCompleted
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 line-through"
                              : "bg-mucha-mauve/30 text-mucha-mauve hover:bg-mucha-mauve/50 border-mucha-mauve/50 font-medium"
                          )}
                          title={task.task?.title || "Untitled"}
                        >
                          <div className="truncate text-[10px] leading-tight">
                            {task.task?.title || "Untitled"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Time Slots */}
            {hours.map((hour) =>
              weekDays.map((day) => {
                const { tasks, events } = getItemsForDayAndHour(day, hour);

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={cn(
                      "h-16 border-t border-l p-1 transition-colors hover:bg-accent/30 relative overflow-hidden",
                      isToday(day) && "bg-mucha-mauve/5"
                    )}
                  >
                    {/* Tasks */}
                    {tasks.map((task, index) => {
                      const isCompleted = task.status === "completed" || !!task.completed_at;
                      const duration = task.task?.scheduled_duration || task.task?.estimated_minutes || 30;
                      const durationMinutes = duration;
                      const heightPerMinute = 1; // 1px per minute for week view (64px hour / 60 min ≈ 1px/min)
                      const blockHeight = Math.max(durationMinutes * heightPerMinute, 28); // Minimum 28px for better visibility

                      // Calculate vertical position based on minutes within the hour
                      const [taskHour, taskMinute] = task.scheduled_time
                        ? task.scheduled_time.split(":").map(Number)
                        : [0, 0];
                      const minuteOffset = taskMinute * heightPerMinute; // Position based on minutes

                      // Calculate width and position for side-by-side display
                      const taskCount = tasks.length;
                      const taskWidth = taskCount > 1 ? `${100 / taskCount}%` : '100%';
                      const leftOffset = taskCount > 1 ? `${(index * 100) / taskCount}%` : '0';

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={cn(
                            "absolute px-1.5 py-1 rounded text-xs cursor-pointer transition-all border shadow-sm",
                            "hover:shadow-md hover:scale-[1.02] hover:z-10 active:scale-[0.98]",
                            isCompleted
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 line-through hover:bg-green-200 dark:hover:bg-green-900/40"
                              : "bg-mucha-mauve/30 text-mucha-mauve hover:bg-mucha-mauve/50 border-mucha-mauve/50 hover:border-mucha-mauve font-medium"
                          )}
                          style={{
                            height: `${blockHeight}px`,
                            top: `${minuteOffset}px`,
                            left: leftOffset,
                            width: taskWidth,
                          }}
                          title={`${task.task?.title || "Untitled"} (${task.scheduled_time || ''} - ${durationMinutes}min)`}
                        >
                          <div className="truncate text-[10px] sm:text-xs leading-tight">
                            {task.task?.title || "Untitled"}
                          </div>
                          {blockHeight > 36 && (
                            <div className="text-[9px] text-current/70 mt-0.5">
                              {durationMinutes}min
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* External Events */}
                    {events.map((event, index) => {
                      const start = new Date(event.start_time);
                      const end = new Date(event.end_time);
                      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
                      const heightPerMinute = 1;
                      const blockHeight = Math.max(durationMinutes * heightPerMinute, 28);

                      // Calculate vertical position based on minutes within the hour
                      const eventMinute = start.getMinutes();
                      const minuteOffset = eventMinute * heightPerMinute;

                      // Calculate total items (tasks + events) for side-by-side layout
                      const taskCount = tasks.length;
                      const totalItems = taskCount + events.length;
                      const itemWidth = totalItems > 1 ? `${100 / totalItems}%` : '100%';
                      const leftOffset = totalItems > 1 ? `${((taskCount + index) * 100) / totalItems}%` : '0';

                      return (
                        <div
                          key={event.id}
                          className="absolute px-1.5 py-1 rounded text-xs cursor-pointer transition-all border bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium"
                          style={{
                            height: `${blockHeight}px`,
                            top: `${minuteOffset}px`,
                            left: leftOffset,
                            width: itemWidth,
                          }}
                          title={`${event.title} (${format(start, "HH:mm")} - ${durationMinutes}min)`}
                        >
                          <div className="truncate text-[10px] sm:text-xs leading-tight">
                            {event.title}
                          </div>
                          {blockHeight > 36 && (
                            <div className="text-[9px] text-current/70 mt-0.5">
                              {durationMinutes}min
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

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
    </Card>
    </div>
  );
}
