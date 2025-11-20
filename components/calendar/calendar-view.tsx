"use client";

import { useState, useEffect } from "react";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import type { CalendarData } from "@/app/actions/calendar";
import { getCalendarData } from "@/app/actions/calendar";
import { addDays, startOfMonth, startOfWeek, startOfDay } from "date-fns";

export type CalendarViewType = "month" | "week" | "day";

interface CalendarViewProps {
  userId: string;
  initialData: CalendarData;
  initialDate: Date;
  categories?: Array<{ id: string; name: string; color: string }>;
}

export function CalendarView({ userId, initialData, initialDate, categories = [] }: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewType>("month");
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [data, setData] = useState<CalendarData>(initialData);
  const [loading, setLoading] = useState(false);

  // Fetch data when view or date changes
  const fetchData = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      switch (view) {
        case "month":
          startDate = startOfMonth(currentDate);
          endDate = addDays(startDate, 42); // 6 weeks
          break;
        case "week":
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
          endDate = addDays(startDate, 7);
          break;
        case "day":
          startDate = startOfDay(currentDate);
          endDate = addDays(startDate, 1);
          break;
      }

      const newData = await getCalendarData(userId, startDate, endDate);
      setData(newData);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, view, currentDate]);

  // Callback to refresh data after task updates
  const handleTaskUpdated = () => {
    fetchData();
  };

  return (
    <div className="space-y-4">
      <CalendarHeader
        view={view}
        currentDate={currentDate}
        onViewChange={setView}
        onDateChange={setCurrentDate}
      />

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mucha-mauve" />
        </div>
      )}

      {!loading && (
        <>
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              data={data}
              userId={userId}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              data={data}
              userId={userId}
              categories={categories}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              data={data}
              userId={userId}
              categories={categories}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </>
      )}
    </div>
  );
}
