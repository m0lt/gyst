"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { apiCreateCategory, apiUpdateCategory, apiDeleteCategory, apiUpdateCategoriesOrder } from "@/lib/api/categories";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  is_predefined: boolean;
  sort_order: number | null;
}

interface CategoryManagerProps {
  categories: Category[];
  userId: string;
}

const PRESET_COLORS = [
  "#8B4789", // Mucha Mauve
  "#A67FAC", // Lavender
  "#D4A574", // Gold
  "#2E8B57", // Emerald
  "#4682B4", // Steel Blue
  "#DC143C", // Ruby Red
  "#FF6347", // Terracotta
  "#FFD700", // Amber
  "#9370DB", // Medium Purple
  "#20B2AA", // Light Sea Green
];

export function CategoryManager({ categories, userId }: CategoryManagerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { success, error: showError } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    color: PRESET_COLORS[0],
    icon: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      color: PRESET_COLORS[0],
      icon: "",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingCategory) {
        // Update existing category
        const result = await apiUpdateCategory(editingCategory.id, formData);
        if (result.success) {
          success(
            t("settings.categories.categoryUpdated"),
            t("settings.categories.categoryUpdatedDesc", { name: formData.name })
          );
          setIsOpen(false);
          resetForm();
          router.refresh();
        } else {
          showError(t("settings.categories.updateFailed"), result.error.message);
        }
      } else {
        // Create new category
        const result = await apiCreateCategory({
          ...formData,
          user_id: userId,
          is_predefined: false,
        });
        if (result.success) {
          success(
            t("settings.categories.categoryCreated"),
            t("settings.categories.categoryCreatedDesc", { name: formData.name })
          );
          setIsOpen(false);
          resetForm();
          router.refresh();
        } else {
          showError(t("settings.categories.createFailed"), result.error.message);
        }
      }
    } catch (err) {
      showError(
        t("settings.categories.saveFailed"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(t("settings.categories.deleteConfirm", { name: categoryName }))) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiDeleteCategory(categoryId);
      if (result.success) {
        success(
          t("settings.categories.categoryDeleted"),
          t("settings.categories.categoryDeletedDesc", { name: categoryName })
        );
        router.refresh();
      } else {
        showError(t("settings.categories.deleteFailed"), result.error.message);
      }
    } catch (err) {
      showError(
        t("settings.categories.deleteFailed"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const reordered = [...customCategories];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];

    // Update sort_order for affected categories
    const updates = reordered.map((cat, idx) => ({
      id: cat.id,
      sort_order: idx,
    }));

    setIsLoading(true);
    try {
      const result = await apiUpdateCategoriesOrder(updates);
      if (result.success) {
        router.refresh();
      } else {
        showError(t("settings.categories.reorderFailed"), result.error.message);
      }
    } catch (err) {
      showError(
        t("settings.categories.reorderFailed"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === customCategories.length - 1) return;

    const reordered = [...customCategories];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];

    // Update sort_order for affected categories
    const updates = reordered.map((cat, idx) => ({
      id: cat.id,
      sort_order: idx,
    }));

    setIsLoading(true);
    try {
      const result = await apiUpdateCategoriesOrder(updates);
      if (result.success) {
        router.refresh();
      } else {
        showError(t("settings.categories.reorderFailed"), result.error.message);
      }
    } catch (err) {
      showError(
        t("settings.categories.reorderFailed"),
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const customCategories = categories.filter((c) => !c.is_predefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">{t("settings.categories.yourCategories")}</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              {t("settings.categories.newCategory")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t("settings.categories.editCategory") : t("settings.categories.createCategory")}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? t("settings.categories.updateDesc")
                  : t("settings.categories.createDesc")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.categories.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t("settings.categories.namePlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("settings.categories.color")}</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`
                          h-10 w-full rounded-lg border-2 transition-all
                          ${
                            formData.color === color
                              ? "border-primary scale-110"
                              : "border-border/50 hover:border-primary/50"
                          }
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {editingCategory ? t("settings.categories.update") : t("settings.categories.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customCategories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {t("settings.categories.noCategories")}
        </p>
      ) : (
        <div className="space-y-2">
          {customCategories.map((category, index) => (
            <div
              key={category.id}
              className="group flex items-center gap-2 p-3 rounded-lg border-2 border-border/50 hover:border-primary/30 transition-colors"
            >
              {/* Drag Handle */}
              <div className="text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Category Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium truncate">{category.name}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Reorder Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || isLoading}
                  className="h-8 w-8"
                  aria-label={t("common.moveUp", "Move up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === customCategories.length - 1 || isLoading}
                  className="h-8 w-8"
                  aria-label={t("common.moveDown", "Move down")}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {/* Edit/Delete */}
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                  disabled={isLoading}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={isLoading}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
