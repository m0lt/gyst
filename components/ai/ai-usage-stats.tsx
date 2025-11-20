"use client";

import { useEffect, useState, memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Zap,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { getAIUsageStats } from "@/app/actions/ai-suggestions";
import { useTranslation } from "react-i18next";

interface AIUsageStatsProps {
  userId: string;
}

export const AIUsageStats = memo(function AIUsageStats({ userId }: AIUsageStatsProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{
    requestsToday: number;
    requestsThisMonth: number;
    remainingToday: number;
    tokensUsedTotal: number;
    estimatedCost: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await getAIUsageStats(userId);
      setStats(data);
    } catch (error) {
      console.error("Error loading AI usage stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (isLoading || !stats) {
    return (
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t("ai.usage")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-accent rounded w-3/4"></div>
            <div className="h-4 bg-accent rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simple calculation - no need for memoization
  const usagePercentage = ((10 - stats.remainingToday) / 10) * 100;

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t("ai.usage")}
        </CardTitle>
        <CardDescription>{t("ai.usageDesc")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Daily Requests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>{t("ai.requestsToday")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={stats.remainingToday > 3 ? "default" : "destructive"}
                className="text-xs"
              >
                {stats.remainingToday} {t("ai.remaining")}
              </Badge>
              <span className="text-sm font-medium">
                {stats.requestsToday} / 10
              </span>
            </div>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Monthly Requests */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("ai.requestsThisMonth")}</span>
          </div>
          <span className="text-sm font-semibold">
            {stats.requestsThisMonth} requests
          </span>
        </div>

        {/* Token Usage */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("ai.tokensUsed")}</span>
          </div>
          <span className="text-sm font-semibold">
            {stats.tokensUsedTotal.toLocaleString()}
          </span>
        </div>

        {/* Estimated Cost */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              {t("ai.estimatedCost")}
            </span>
          </div>
          <span className="text-sm font-semibold text-green-900 dark:text-green-100">
            ${stats.estimatedCost.toFixed(4)}
          </span>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          {t("ai.dailyLimitInfo")}
        </p>
      </CardContent>
    </Card>
  );
});
