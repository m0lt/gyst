"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, RefreshCw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            <h3 className="text-lg font-semibold">Weekly Digest Preview</h3>
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
                Generating...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview Digest
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          See what your weekly digest email will look like. This preview shows data from the past 7 days.
        </p>
      </Card>

      {showPreview && previewData && (
        <Card className="p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-mucha-mauve to-mucha-mauve/80 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">📊 Your Weekly Progress</h2>
            <p className="text-mucha-cream/90">
              {previewData.startDate} - {previewData.endDate}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Summary Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Week Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-mauve">
                    {previewData.completedTasksCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-sage">
                    {previewData.completionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-gold">
                    {previewData.longestStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mucha-terracotta">
                    {previewData.totalTasksCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            {previewData.topCategories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
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
                        {category.completedCount} completed
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            {previewData.upcomingTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Coming Up</h3>
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
                Keep up the great work! 🎉
              </p>
            </div>
          </div>

          <div className="bg-mucha-cream/30 p-6 text-center text-sm text-muted-foreground">
            <p>This is a preview of your weekly digest email.</p>
            <p className="mt-1">
              Actual emails will be sent every Sunday at 6 PM.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
