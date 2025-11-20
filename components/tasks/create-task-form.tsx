"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTask } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useTranslation } from "react-i18next";

type Category = {
  id: string;
  name: string;
  color: string;
};

type CreateTaskFormProps = {
  categories: Category[];
};

export function CreateTaskForm({ categories }: CreateTaskFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { success, error } = useNotificationStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const frequency = formData.get("frequency") as "daily" | "weekly" | "custom";

    try {
      await createTask({
        title,
        description,
        category_id: selectedCategory || categories[0]?.id,
        frequency,
      });

      // Show success notification
      success(t("tasks.taskCreated"), t("tasks.taskCreatedDesc", { title }));

      // Reset form
      e.currentTarget.reset();
      setSelectedCategory("");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create task:", err);
      error(
        t("tasks.failedToCreate"),
        err?.message || t("tasks.somethingWentWrong")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("tasks.taskTitle")}</Label>
        <Input
          id="title"
          name="title"
          placeholder={t("tasks.taskTitlePlaceholder")}
          required
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("tasks.descriptionOptional")}</Label>
        <Input
          id="description"
          name="description"
          placeholder={t("tasks.addDetails")}
          disabled={isLoading}
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label>{t("tasks.category")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              disabled={isLoading}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${
                  selectedCategory === category.id
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border/50 hover:border-primary/50"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: category.color }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label htmlFor="frequency">{t("tasks.frequency")}</Label>
        <select
          id="frequency"
          name="frequency"
          className="w-full h-11 rounded-lg border-2 border-border/50 bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          disabled={isLoading}
        >
          <option value="daily">{t("tasks.daily")}</option>
          <option value="weekly">{t("tasks.weekly")}</option>
          <option value="custom">{t("tasks.custom")}</option>
        </select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("tasks.creating") : t("tasks.createTask")}
      </Button>
    </form>
  );
}
