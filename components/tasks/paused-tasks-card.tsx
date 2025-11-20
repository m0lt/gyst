"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Tag } from "lucide-react";
import { toggleTaskActive } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotificationStore } from "@/lib/store/notification-store";

interface Task {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  priority: string;
  preferred_time: string | null;
  scheduled_duration: number | null;
  tags: string[] | null;
  task_categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
}

interface PausedTasksCardProps {
  tasks: Task[];
}

export function PausedTasksCard({ tasks }: PausedTasksCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { success, error } = useNotificationStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleResume = async (taskId: string) => {
    setLoadingId(taskId);
    try {
      await toggleTaskActive(taskId, true);
      success(
        t("tasks.taskActivated"),
        t("tasks.taskActivatedDesc")
      );
      router.refresh();
    } catch (err) {
      error(
        t("tasks.error"),
        err instanceof Error ? err.message : t("tasks.errorDesc")
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {t("tasks.paused.title")}
          </CardTitle>
          <CardDescription>
            {t("tasks.paused.empty")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="opacity-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          {t("tasks.paused.title")}
        </CardTitle>
        <CardDescription>
          {t("tasks.paused.count", { count: tasks.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{task.title}</h4>
                  {task.task_categories && (
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: task.task_categories.color,
                        color: task.task_categories.color,
                      }}
                    >
                      {task.task_categories.icon && (
                        <span className="mr-1">{task.task_categories.icon}</span>
                      )}
                      {task.task_categories.name}
                    </Badge>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {task.preferred_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.preferred_time}
                    </div>
                  )}
                  {task.scheduled_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.scheduled_duration}min
                    </div>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {task.tags.join(", ")}
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResume(task.id)}
                disabled={loadingId === task.id}
                className="shrink-0"
              >
                <Play className="h-4 w-4 mr-1" />
                {t("tasks.paused.resume")}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
