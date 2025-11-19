"use client";

import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/lib/store/task-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useTranslation } from "react-i18next";
import { Trash2, Play, Pause, X } from "lucide-react";
import { apiBatchDeleteTasks, apiBatchToggleTasks } from "@/lib/api/tasks";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TaskBulkActions() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedTaskIds, clearSelection } = useTaskStore();
  const { success, error: showError } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  if (selectedTaskIds.length === 0) {
    return null;
  }

  const handlePause = async () => {
    setIsLoading(true);
    try {
      const results = await apiBatchToggleTasks(selectedTaskIds, false);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        success(
          t("tasks.bulkPauseSuccess", "Tasks paused"),
          t(
            "tasks.bulkPauseSuccessMsg",
            `${selectedTaskIds.length} tasks paused successfully`
          )
        );
        clearSelection();
        router.refresh();
      } else {
        showError(
          t("tasks.bulkPauseError", "Some tasks failed to pause"),
          t(
            "tasks.bulkPauseErrorMsg",
            `${failed.length} of ${selectedTaskIds.length} tasks failed`
          )
        );
      }
    } catch (err) {
      showError(
        t("tasks.bulkPauseError", "Failed to pause tasks"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      const results = await apiBatchToggleTasks(selectedTaskIds, true);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        success(
          t("tasks.bulkActivateSuccess", "Tasks activated"),
          t(
            "tasks.bulkActivateSuccessMsg",
            `${selectedTaskIds.length} tasks activated successfully`
          )
        );
        clearSelection();
        router.refresh();
      } else {
        showError(
          t("tasks.bulkActivateError", "Some tasks failed to activate"),
          t(
            "tasks.bulkActivateErrorMsg",
            `${failed.length} of ${selectedTaskIds.length} tasks failed`
          )
        );
      }
    } catch (err) {
      showError(
        t("tasks.bulkActivateError", "Failed to activate tasks"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        t(
          "tasks.bulkDeleteConfirm",
          `Are you sure you want to delete ${selectedTaskIds.length} tasks?`
        )
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const results = await apiBatchDeleteTasks(selectedTaskIds);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        success(
          t("tasks.bulkDeleteSuccess", "Tasks deleted"),
          t(
            "tasks.bulkDeleteSuccessMsg",
            `${selectedTaskIds.length} tasks deleted successfully`
          )
        );
        clearSelection();
        router.refresh();
      } else {
        showError(
          t("tasks.bulkDeleteError", "Some tasks failed to delete"),
          t(
            "tasks.bulkDeleteErrorMsg",
            `${failed.length} of ${selectedTaskIds.length} tasks failed`
          )
        );
      }
    } catch (err) {
      showError(
        t("tasks.bulkDeleteError", "Failed to delete tasks"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5">
      <span className="text-sm font-medium">
        {t("tasks.selected", "{{count}} selected", {
          count: selectedTaskIds.length,
        })}
      </span>

      <div className="flex-1" />

      <Button
        variant="outline"
        size="sm"
        onClick={handleActivate}
        disabled={isLoading}
        className="gap-2"
      >
        <Play className="h-4 w-4" />
        {t("common.activate", "Activate")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePause}
        disabled={isLoading}
        className="gap-2"
      >
        <Pause className="h-4 w-4" />
        {t("common.pause", "Pause")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
        className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="h-4 w-4" />
        {t("common.delete", "Delete")}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={clearSelection}
        disabled={isLoading}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        {t("common.cancel", "Cancel")}
      </Button>
    </div>
  );
}
