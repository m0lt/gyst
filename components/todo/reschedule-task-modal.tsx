"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { rescheduleTaskInstance } from "@/app/actions/task-instances";
import { useNotificationStore } from "@/lib/store/notification-store";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type TaskInstance = {
  id: string;
  due_date: string;
  tasks: {
    title: string;
  };
};

type RescheduleTaskModalProps = {
  instance: TaskInstance;
  onClose: () => void;
  onSuccess: () => void;
};

export function RescheduleTaskModal({ instance, onClose, onSuccess }: RescheduleTaskModalProps) {
  const { t } = useTranslation();
  const { success, error } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  const [newDueDate, setNewDueDate] = useState("");
  const [applyToFuture, setApplyToFuture] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDueDate) {
      error("Date required", "Please select a new date");
      return;
    }

    setIsLoading(true);

    try {
      await rescheduleTaskInstance({
        instanceId: instance.id,
        newDueDate,
        reason: reason || undefined,
        applyToFuture,
      });

      success(
        "Task rescheduled",
        applyToFuture
          ? "This and all future instances have been rescheduled"
          : "Task moved to the new date"
      );
      onSuccess();
    } catch (err: any) {
      console.error("Failed to reschedule task:", err);
      error("Failed to reschedule", err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle>Reschedule Task</DialogTitle>
        <DialogDescription>
          {instance.tasks.title}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Date */}
          <div className="space-y-2">
            <Label>Current Date</Label>
            <div className="text-sm text-muted-foreground">
              {new Date(instance.due_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* New Date */}
          <div className="space-y-2">
            <Label htmlFor="newDueDate">New Date</Label>
            <Input
              id="newDueDate"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              disabled={isLoading}
            />
          </div>

          {/* Apply to Future */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="applyToFuture"
                checked={applyToFuture}
                onCheckedChange={(checked) => setApplyToFuture(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="applyToFuture"
                className="text-sm font-normal cursor-pointer"
              >
                Reschedule all future instances
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              If checked, this will move all upcoming instances of this recurring task
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you rescheduling?"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                "Reschedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
