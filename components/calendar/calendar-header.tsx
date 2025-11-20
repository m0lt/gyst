"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, addWeeks, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import type { CalendarViewType } from "./calendar-view";

interface CalendarHeaderProps {
  view: CalendarViewType;
  currentDate: Date;
  onViewChange: (view: CalendarViewType) => void;
  onDateChange: (date: Date) => void;
}

export function CalendarHeader({
  view,
  currentDate,
  onViewChange,
  onDateChange,
}: CalendarHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;

  const handlePrevious = () => {
    switch (view) {
      case "month":
        onDateChange(addMonths(currentDate, -1));
        break;
      case "week":
        onDateChange(addWeeks(currentDate, -1));
        break;
      case "day":
        onDateChange(addDays(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
      case "week":
        onDateChange(addWeeks(currentDate, 1));
        break;
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatTitle = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy", { locale });
      case "week":
        return format(currentDate, "MMM dd, yyyy", { locale });
      case "day":
        return format(currentDate, "EEEE, MMMM dd, yyyy", { locale });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-mucha-mauve" />
          <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* View Switcher */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("month")}
            className="h-8"
          >
            {t("calendar.views.month")}
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
            className="h-8"
          >
            {t("calendar.views.week")}
          </Button>
          <Button
            variant={view === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("day")}
            className="h-8"
          >
            {t("calendar.views.day")}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleToday}>
            {t("calendar.today")}
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Date Display */}
      <div className="text-lg font-semibold hidden lg:block">
        {formatTitle()}
      </div>
    </div>
  );
}
