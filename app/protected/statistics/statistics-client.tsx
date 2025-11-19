"use client";

import { useEffect, useState } from "react";
import { subDays } from "date-fns";
import { BarChart3, Loader2 } from "lucide-react";
import {
  getStatisticsSummary,
  getCompletionRateData,
  getCategoryBreakdown,
  getStreakHistory,
  getTimeSpentData,
  getPersonalRecords,
  type DateRange,
  type StatisticsSummary,
  type CompletionRateData,
  type CategoryBreakdown,
  type StreakHistoryPoint,
  type TimeSpentData,
  type PersonalRecord,
} from "@/app/actions/statistics";
import { StatisticsSummaryCards } from "@/components/statistics/statistics-summary";
import { DateRangeSelector, type DateRangePreset } from "@/components/statistics/date-range-selector";
import { CompletionRateChart } from "@/components/statistics/completion-rate-chart";
import { CategoryBreakdownChart } from "@/components/statistics/category-breakdown-chart";
import { StreakHistoryChart } from "@/components/statistics/streak-history-chart";
import { TimeSpentChart } from "@/components/statistics/time-spent-chart";
import { PersonalRecords } from "@/components/statistics/personal-records";
import { ExportStatistics } from "@/components/statistics/export-statistics";
import { useTranslation } from "react-i18next";

interface StatisticsClientProps {
  userId: string;
}

export function StatisticsClient({ userId }: StatisticsClientProps) {
  const { t } = useTranslation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [preset, setPreset] = useState<DateRangePreset>("7days");

  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [completionRateData, setCompletionRateData] = useState<CompletionRateData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [streakHistory, setStreakHistory] = useState<StreakHistoryPoint[]>([]);
  const [timeSpentData, setTimeSpentData] = useState<TimeSpentData[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);

  // Initial load: Summary and Personal Records (time-independent)
  useEffect(() => {
    loadInitialData();
  }, [userId]);

  // Load charts data when date range changes
  useEffect(() => {
    if (!isInitialLoading) {
      loadChartsData();
    }
  }, [dateRange]);

  const loadInitialData = async () => {
    setIsInitialLoading(true);
    try {
      const [summaryData, recordsData, completionData, categoryData, streakData, timeData] =
        await Promise.all([
          getStatisticsSummary(userId),
          getPersonalRecords(userId),
          getCompletionRateData(userId, dateRange),
          getCategoryBreakdown(userId, dateRange),
          getStreakHistory(userId, dateRange),
          getTimeSpentData(userId, dateRange),
        ]);

      setSummary(summaryData);
      setPersonalRecords(recordsData);
      setCompletionRateData(completionData);
      setCategoryBreakdown(categoryData);
      setStreakHistory(streakData);
      setTimeSpentData(timeData);
    } catch (error) {
      console.error("Error loading initial statistics:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadChartsData = async () => {
    setIsChartsLoading(true);
    try {
      const [completionData, categoryData, streakData, timeData] = await Promise.all([
        getCompletionRateData(userId, dateRange),
        getCategoryBreakdown(userId, dateRange),
        getStreakHistory(userId, dateRange),
        getTimeSpentData(userId, dateRange),
      ]);

      setCompletionRateData(completionData);
      setCategoryBreakdown(categoryData);
      setStreakHistory(streakData);
      setTimeSpentData(timeData);
    } catch (error) {
      console.error("Error loading charts data:", error);
    } finally {
      setIsChartsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">{t("statistics.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("statistics.title")}</h1>
          <p className="text-muted-foreground">
            {t("statistics.subtitle")}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && <StatisticsSummaryCards summary={summary} />}

      {/* Date Range Selector */}
      <DateRangeSelector
        selectedRange={dateRange}
        onRangeChange={setDateRange}
        preset={preset}
        onPresetChange={setPreset}
      />

      {/* Loading indicator for charts */}
      {isChartsLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">{t("statistics.updatingCharts")}</span>
        </div>
      )}

      {/* Charts Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity ${isChartsLoading ? "opacity-50" : "opacity-100"}`}>
        <CompletionRateChart data={completionRateData} />
        <CategoryBreakdownChart data={categoryBreakdown} />
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity ${isChartsLoading ? "opacity-50" : "opacity-100"}`}>
        <StreakHistoryChart data={streakHistory} />
        <TimeSpentChart data={timeSpentData} />
      </div>

      {/* Personal Records */}
      <PersonalRecords records={personalRecords} />

      {/* Export */}
      <ExportStatistics userId={userId} dateRange={dateRange} />
    </div>
  );
}
