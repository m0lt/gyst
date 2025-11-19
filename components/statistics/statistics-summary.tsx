"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Target,
  Clock,
  Flame,
  FolderOpen,
  Zap,
} from "lucide-react";
import type { StatisticsSummary } from "@/app/actions/statistics";
import { useTranslation } from "react-i18next";

interface StatisticsSummaryProps {
  summary: StatisticsSummary;
}

export function StatisticsSummaryCards({ summary }: StatisticsSummaryProps) {
  const { t } = useTranslation();

  const stats = [
    {
      icon: CheckCircle,
      label: t("statistics.totalTasks"),
      value: summary.totalTasks,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Target,
      label: t("statistics.completed"),
      value: summary.completedTasks,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Zap,
      label: t("statistics.completionRate"),
      value: `${Math.round(summary.completionRate)}%`,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: Clock,
      label: t("statistics.timeInvested"),
      value: `${Math.floor(summary.totalTimeSpent / 60)}h ${summary.totalTimeSpent % 60}m`,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Flame,
      label: t("statistics.currentStreak"),
      value: `${summary.currentStreak} ${t("statistics.days")}`,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: Flame,
      label: t("statistics.longestStreak"),
      value: `${summary.longestStreak} ${t("statistics.days")}`,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: FolderOpen,
      label: t("statistics.categories"),
      value: summary.totalCategories,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: Zap,
      label: t("statistics.activeToday"),
      value: summary.activeTasksToday,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="card-art-nouveau overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1 truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
