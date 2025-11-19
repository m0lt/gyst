"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  is_predefined: boolean;
}

interface CategorySelectorProps {
  categories: Category[];
  value?: string;
  onChange: (categoryId: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  groupByType?: boolean;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  groupByType = true,
}: CategorySelectorProps) {
  const { t } = useTranslation();

  const predefinedCategories = categories.filter((c) => c.is_predefined);
  const customCategories = categories.filter((c) => !c.is_predefined);

  const renderCategoryOption = (category: Category) => (
    <SelectItem key={category.id} value={category.id}>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span>{category.name}</span>
      </div>
    </SelectItem>
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || t("tasks.selectCategory", "Select a category")}>
            {value && categories.find((c) => c.id === value) && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      categories.find((c) => c.id === value)?.color,
                  }}
                />
                <span>{categories.find((c) => c.id === value)?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {groupByType && predefinedCategories.length > 0 && customCategories.length > 0 ? (
            <>
              {predefinedCategories.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {t("categories.predefined", "Predefined")}
                  </div>
                  {predefinedCategories.map(renderCategoryOption)}
                </div>
              )}
              {customCategories.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {t("categories.custom", "Custom")}
                  </div>
                  {customCategories.map(renderCategoryOption)}
                </div>
              )}
            </>
          ) : (
            categories.map(renderCategoryOption)
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
