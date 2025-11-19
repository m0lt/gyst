"use client";

import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/lib/store/task-store";
import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskFiltersProps {
  categories: Array<{ id: string; name: string; color: string }>;
}

export function TaskFilters({ categories }: TaskFiltersProps) {
  const { t } = useTranslation();
  const { filter, setFilter, clearFilter } = useTaskStore();

  const hasActiveFilters =
    filter.categoryId !== undefined ||
    filter.frequency !== undefined ||
    filter.isActive !== undefined;

  const toggleCategory = (categoryId: string) => {
    setFilter({
      categoryId: filter.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const toggleFrequency = (frequency: "daily" | "weekly" | "custom") => {
    setFilter({
      frequency: filter.frequency === frequency ? undefined : frequency,
    });
  };

  const toggleActiveStatus = (isActive: boolean) => {
    setFilter({
      isActive: filter.isActive === isActive ? undefined : isActive,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {t("common.filter", "Filter")}
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {[filter.categoryId, filter.frequency, filter.isActive].filter(
                  Boolean
                ).length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {/* Category Filters */}
          <DropdownMenuLabel>
            {t("tasks.category", "Category")}
          </DropdownMenuLabel>
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={filter.categoryId === category.id}
              onCheckedChange={() => toggleCategory(category.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          {/* Frequency Filters */}
          <DropdownMenuLabel>
            {t("tasks.frequency", "Frequency")}
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filter.frequency === "daily"}
            onCheckedChange={() => toggleFrequency("daily")}
          >
            {t("tasks.daily", "Daily")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filter.frequency === "weekly"}
            onCheckedChange={() => toggleFrequency("weekly")}
          >
            {t("tasks.weekly", "Weekly")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filter.frequency === "custom"}
            onCheckedChange={() => toggleFrequency("custom")}
          >
            {t("tasks.custom", "Custom")}
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Status Filters */}
          <DropdownMenuLabel>{t("common.status", "Status")}</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filter.isActive === true}
            onCheckedChange={() => toggleActiveStatus(true)}
          >
            {t("common.active", "Active")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filter.isActive === false}
            onCheckedChange={() => toggleActiveStatus(false)}
          >
            {t("tasks.paused", "Paused")}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          {t("common.clearFilters", "Clear")}
        </Button>
      )}
    </div>
  );
}
