"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, RefreshCw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface DigestData {
  userName: string;
  startDate: string;
  endDate: string;
  completedTasksCount: number;
  totalTasksCount: number;
  completionRate: number;
  longestStreak: number;
  topCategories: Array<{
    name: string;
    completedCount: number;
  }>;
  upcomingTasks: Array<{
    title: string;
    dueDate: string;
  }>;
}

interface Props {
  userId: string;
  onGeneratePreview?: () => Promise<DigestData>;
}

export function DigestPreview({ userId, onGeneratePreview }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<DigestData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneratePreview = async () => {
    if (!onGeneratePreview) return;

    try {
      setLoading(true);
      const data = await onGeneratePreview();
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error("Failed to generate preview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-mucha-mauve" />
            <h3 className="text-lg font-semibold">{t("settings.notifications.digest.title")}</h3>
          </div>
          <Button
            onClick={handleGeneratePreview}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("settings.notifications.generating")}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {t("settings.notifications.digest.button")}
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("settings.notifications.digest.description")}
        </p>
      </Card>

      {showPreview && previewData && (
        <Card className="p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-mucha-mauve to-mucha-mauve/80 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">📊 {t("settings.notifications.digest.yourWeeklyProgress")}</h2>
            <p className="text-mucha-cream/90">
              {previewData.startDate} - {previewData.endDate}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Summary Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("settings.notifications.digest.weekSummary")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-mauve">
                    {previewData.completedTasksCount}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("settings.notifications.digest.completed")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-sage">
                    {previewData.completionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">{t("settings.notifications.digest.rate")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-gold">
                    {previewData.longestStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("settings.notifications.digest.longestStreak")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-terracotta">
                    {previewData.totalTasksCount}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("settings.notifications.digest.totalTasks")}</div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            {previewData.topCategories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("settings.notifications.digest.topCategories")}</h3>
                <div className="space-y-2">
                  {previewData.topCategories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-mucha-cream/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-mucha-mauve/20 flex items-center justify-center text-sm font-bold text-mucha-mauve">
                          {index + 1}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">
                        {category.completedCount} {t("settings.notifications.digest.completedBadge")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            {previewData.upcomingTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("settings.notifications.digest.comingUp")}</h3>
                <div className="space-y-2">
                  {previewData.upcomingTasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <span className="text-sm">{task.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {task.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivation */}
            <div className="bg-gradient-to-r from-mucha-sage/10 to-mucha-gold/10 p-6 rounded-lg text-center">
              <p className="text-lg font-medium text-mucha-mauve">
                {t("settings.notifications.digest.keepUpGreatWork")}
              </p>
            </div>
          </div>

          <div className="bg-mucha-cream/30 p-6 text-center text-sm text-muted-foreground">
            <p>{t("settings.notifications.digest.previewInfo")}</p>
            <p className="mt-1">
              {t("settings.notifications.digest.emailSchedule")}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
