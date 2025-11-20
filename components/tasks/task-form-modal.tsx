"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./task-form";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  color: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  frequency: "daily" | "weekly" | "custom";
  priority: "low" | "medium" | "high";
  scheduled_duration: number | null;
  tags: string[];
  reminder_minutes_before: number | null;
  preferred_time: string | null;
  recurrence_pattern: any;
  ai_image_url: string | null;
  ai_image_prompt: string | null;
};

interface TaskFormModalProps {
  categories: Category[];
  existingTask?: Task;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTaskUpdated?: () => void;
}

export function TaskFormModal({
  categories,
  existingTask,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onTaskUpdated,
}: TaskFormModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
    // Call the callback to notify parent components of the update
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // Default trigger button
  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      {t("tasks.modal.newTask")}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingTask ? t("tasks.modal.editTask") : t("tasks.modal.newTask")}
          </DialogTitle>
          <DialogDescription>
            {existingTask
              ? t("tasks.editTaskDescription")
              : t("tasks.createTaskDescription")}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          categories={categories}
          existingTask={existingTask}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
