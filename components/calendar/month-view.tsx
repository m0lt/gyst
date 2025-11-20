"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalendarData } from "@/app/actions/calendar";
import { useTranslation } from "react-i18next";

interface MonthViewProps {
  currentDate: Date;
  data: CalendarData;
  userId: string;
}

export function MonthView({ currentDate, data }: MonthViewProps) {
  const { t } = useTranslation();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = [
    t("calendar.weekdays.monday"),
    t("calendar.weekdays.tuesday"),
    t("calendar.weekdays.wednesday"),
    t("calendar.weekdays.thursday"),
    t("calendar.weekdays.friday"),
    t("calendar.weekdays.saturday"),
    t("calendar.weekdays.sunday"),
  ];

  const getItemsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");

    const tasks = data.taskInstances.filter(
      (instance) => instance.due_date === dayStr
    );

    const events = data.externalEvents.filter((event) => {
      const eventStart = new Date(event.start_time);
      const eventDay = format(eventStart, "yyyy-MM-dd");
      return eventDay === dayStr;
    });

    return { tasks, events };
  };

  return (
    <Card className="p-4">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const { tasks, events } = getItemsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] p-2 border rounded-lg transition-colors",
                isCurrentMonth
                  ? "bg-background hover:bg-accent/50"
                  : "bg-muted/30 text-muted-foreground",
                isDayToday && "border-mucha-mauve border-2"
              )}
            >
              {/* Day Number */}
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  isDayToday && "text-mucha-mauve font-bold"
                )}
              >
                {format(day, "d")}
              </div>

              {/* Task Instances */}
              <div className="space-y-1">
                {tasks.slice(0, 3).map((task) => {
                  const isCompleted = task.status === "completed" || !!task.completed_at;
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "text-xs p-1 rounded truncate cursor-pointer",
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 line-through"
                          : "bg-mucha-mauve/20 text-mucha-mauve hover:bg-mucha-mauve/30"
                      )}
                      title={task.task?.title || "Untitled"}
                    >
                      {task.scheduled_time && (
                        <span className="font-medium mr-1">
                          {task.scheduled_time}
                        </span>
                      )}
                      {task.task?.title || "Untitled"}
                    </div>
                  );
                })}

                {/* External Events */}
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate cursor-pointer bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    title={event.title}
                  >
                    {!event.all_day && (
                      <span className="font-medium mr-1">
                        {format(new Date(event.start_time), "HH:mm")}
                      </span>
                    )}
                    {event.title}
                  </div>
                ))}

                {/* More indicator */}
                {tasks.length + events.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    +{tasks.length + events.length - 5} {t("calendar.more")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
