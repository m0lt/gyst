"use client";

import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths, format } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export type DateRangePreset = "7days" | "30days" | "thisWeek" | "thisMonth" | "lastMonth" | "all";

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  preset?: DateRangePreset;
  onPresetChange?: (preset: DateRangePreset) => void;
}

export function DateRangeSelector({
  selectedRange,
  onRangeChange,
  preset = "7days",
  onPresetChange,
}: DateRangeSelectorProps) {
  const presets: { value: DateRangePreset; label: string; getRange: () => DateRange }[] = [
    {
      value: "7days",
      label: "Last 7 Days",
      getRange: () => ({
        from: subDays(new Date(), 6),
        to: new Date(),
      }),
    },
    {
      value: "30days",
      label: "Last 30 Days",
      getRange: () => ({
        from: subDays(new Date(), 29),
        to: new Date(),
      }),
    },
    {
      value: "thisWeek",
      label: "This Week",
      getRange: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      }),
    },
    {
      value: "thisMonth",
      label: "This Month",
      getRange: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      value: "lastMonth",
      label: "Last Month",
      getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
    {
      value: "all",
      label: "All Time",
      getRange: () => ({
        from: new Date(2020, 0, 1), // Far past date
        to: new Date(),
      }),
    },
  ];

  const handlePresetClick = (presetValue: DateRangePreset) => {
    const presetConfig = presets.find((p) => p.value === presetValue);
    if (presetConfig) {
      onRangeChange(presetConfig.getRange());
      onPresetChange?.(presetValue);
    }
  };

  const handlePrevious = () => {
    const daysDiff = Math.ceil((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24));
    onRangeChange({
      from: subDays(selectedRange.from, daysDiff),
      to: subDays(selectedRange.to, daysDiff),
    });
  };

  const handleNext = () => {
    const daysDiff = Math.ceil((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const newTo = new Date(selectedRange.to.getTime() + daysDiff * 24 * 60 * 60 * 1000);

    // Don't go beyond today
    if (newTo > new Date()) {
      onRangeChange({
        from: selectedRange.from,
        to: new Date(),
      });
    } else {
      onRangeChange({
        from: new Date(selectedRange.from.getTime() + daysDiff * 24 * 60 * 60 * 1000),
        to: newTo,
      });
    }
  };

  const isNextDisabled = selectedRange.to >= new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Period:</span>
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <Button
              key={p.value}
              variant={preset === p.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(p.value)}
              className="text-xs"
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 text-center">
          <span className="text-sm font-medium">
            {format(selectedRange.from, "MMM dd, yyyy")} - {format(selectedRange.to, "MMM dd, yyyy")}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
