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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiCreateCategory, apiUpdateCategory, apiDeleteCategory } from "@/lib/api/categories";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  is_predefined: boolean;
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
          success("Category updated", `${formData.name} has been updated`);
          setIsOpen(false);
          resetForm();
          router.refresh();
        } else {
          showError("Failed to update category", result.error.message);
        }
      } else {
        // Create new category
        const result = await apiCreateCategory({
          ...formData,
          user_id: userId,
          is_predefined: false,
        });
        if (result.success) {
          success("Category created", `${formData.name} has been created`);
          setIsOpen(false);
          resetForm();
          router.refresh();
        } else {
          showError("Failed to create category", result.error.message);
        }
      }
    } catch (err) {
      showError(
        "Failed to save category",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiDeleteCategory(categoryId);
      if (result.success) {
        success("Category deleted", `${categoryName} has been deleted`);
        router.refresh();
      } else {
        showError("Failed to delete category", result.error.message);
      }
    } catch (err) {
      showError(
        "Failed to delete category",
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
        <h3 className="font-display font-semibold text-lg">Your Categories</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update your custom category"
                  : "Add a new custom category for your tasks"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Hobbies"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
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
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customCategories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No custom categories yet. Create one to get started!
        </p>
      ) : (
        <div className="space-y-2">
          {customCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg border-2 border-border/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={isLoading}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
