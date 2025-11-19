"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface CompletionData {
  date: string; // YYYY-MM-DD format
  count?: number; // Optional: number of completions on that day
}

interface StreakCalendarHeatmapProps {
  completions: CompletionData[];
  months?: number; // Number of months to show (default: 6)
  title?: string;
  description?: string;
}

export function StreakCalendarHeatmap({
  completions,
  months = 6,
  title = "Activity Calendar",
  description,
}: StreakCalendarHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - months);

    // Create a map of dates to completion counts
    const completionMap = new Map<string, number>();
    completions.forEach((c) => {
      const date = new Date(c.date);
      const key = formatDate(date);
      completionMap.set(key, (completionMap.get(key) || 0) + (c.count || 1));
    });

    // Generate weeks array
    const weeks: Array<Array<{ date: Date; count: number }>> = [];
    let currentWeek: Array<{ date: Date; count: number }> = [];

    // Start from the first day of the start month
    const current = new Date(startDate);
    current.setDate(1);

    // Fill in empty days at the start
    const startDayOfWeek = current.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: new Date(0), count: -1 }); // Placeholder
    }

    while (current <= endDate) {
      const key = formatDate(current);
      const count = completionMap.get(key) || 0;

      currentWeek.push({
        date: new Date(current),
        count,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    // Add remaining days to last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), count: -1 }); // Placeholder
      }
      weeks.push(currentWeek);
    }

    // Generate month labels
    const monthLabels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const firstValidDay = week.find((d) => d.count !== -1);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            label: firstValidDay.date.toLocaleDateString("en-US", {
              month: "short",
            }),
            weekIndex: index,
          });
          lastMonth = month;
        }
      }
    });

    return { weeks, monthLabels };
  }, [completions, months]);

  const getIntensityClass = (count: number): string => {
    if (count === -1) return "bg-transparent"; // Placeholder
    if (count === 0) return "bg-border/30";
    if (count === 1) return "bg-green-300 dark:bg-green-700";
    if (count === 2) return "bg-green-400 dark:bg-green-600";
    if (count >= 3) return "bg-green-500 dark:bg-green-500";
    return "bg-border/30";
  };

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month Labels */}
            <div className="flex mb-2">
              {monthLabels.map((month, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground"
                  style={{
                    marginLeft: index === 0 ? 0 : `${(month.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 12}px`,
                  }}
                >
                  {month.label}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex gap-1">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 mr-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <div
                    key={day}
                    className="h-[10px] flex items-center text-[10px] text-muted-foreground"
                    style={{ opacity: i % 2 === 0 ? 1 : 0 }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const isPlaceholder = day.count === -1;
                    const isToday =
                      !isPlaceholder &&
                      formatDate(day.date) === formatDate(new Date());

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-[10px] h-[10px] rounded-sm transition-all
                          ${getIntensityClass(day.count)}
                          ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                          ${!isPlaceholder && "cursor-pointer hover:ring-2 hover:ring-primary/50"}
                        `}
                        title={
                          !isPlaceholder
                            ? `${day.date.toLocaleDateString()}: ${day.count} completion${day.count !== 1 ? "s" : ""}`
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-[10px] h-[10px] rounded-sm bg-border/30" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-300 dark:bg-green-700" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-400 dark:bg-green-600" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-500 dark:bg-green-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
