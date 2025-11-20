"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  title: string;
  description: string | null;
  current_streak: number | null;
  task_categories: {
    name: string;
    color: string;
  } | null;
}

interface Props {
  tasks: Task[];
}

export const RecentTasksCard = memo(function RecentTasksCard({ tasks }: Props) {
  const { t } = useTranslation();

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.recentTasks")}</CardTitle>
            <CardDescription>{t("dashboard.recentTasksDesc")}</CardDescription>
          </div>
          <Link href="/protected/tasks">
            <Button variant="ghost" size="sm">{t("dashboard.viewAll")}</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: task.task_categories?.color || 'var(--color-category-household)'
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 pl-6 sm:pl-0">
                {task.current_streak && task.current_streak > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {task.current_streak}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {task.task_categories?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
