"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Check,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type Subtask = {
  id: string;
  title: string;
  is_required: boolean;
  sort_order: number;
};

type SubtaskListProps = {
  taskId?: string; // Optional: for existing tasks
  initialSubtasks?: Subtask[];
  onChange?: (subtasks: Subtask[]) => void;
  readonly?: boolean;
};

export function SubtaskList({
  taskId,
  initialSubtasks = [],
  onChange,
  readonly = false
}: SubtaskListProps) {
  const { t } = useTranslation();
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced when saved to DB
      title: newSubtaskTitle.trim(),
      is_required: false,
      sort_order: subtasks.length,
    };

    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    setNewSubtaskTitle("");
    onChange?.(updated);
  };

  const handleDeleteSubtask = (id: string) => {
    const updated = subtasks
      .filter(st => st.id !== id)
      .map((st, index) => ({ ...st, sort_order: index }));
    setSubtasks(updated);
    onChange?.(updated);
  };

  const handleToggleRequired = (id: string) => {
    const updated = subtasks.map(st =>
      st.id === id ? { ...st, is_required: !st.is_required } : st
    );
    setSubtasks(updated);
    onChange?.(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...subtasks];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Update sort_order
    updated.forEach((st, i) => st.sort_order = i);
    setSubtasks(updated);
    onChange?.(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === subtasks.length - 1) return;
    const updated = [...subtasks];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    // Update sort_order
    updated.forEach((st, i) => st.sort_order = i);
    setSubtasks(updated);
    onChange?.(updated);
  };

  const handleStartEdit = (subtask: Subtask) => {
    setEditingId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingTitle.trim()) {
      handleCancelEdit();
      return;
    }

    const updated = subtasks.map(st =>
      st.id === id ? { ...st, title: editingTitle.trim() } : st
    );
    setSubtasks(updated);
    setEditingId(null);
    setEditingTitle("");
    onChange?.(updated);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t('tasks.subtasks')}
          {subtasks.length > 0 && (
            <span className="ml-2 text-muted-foreground">({subtasks.length})</span>
          )}
        </Label>
      </div>

      {/* Subtask List */}
      {subtasks.length > 0 && (
        <div className="space-y-2">
          {subtasks.map((subtask, index) => (
            <div
              key={subtask.id}
              className={cn(
                "group relative flex items-center gap-2 p-3 rounded-lg border bg-card",
                "hover:border-primary/30 transition-colors"
              )}
            >
              {/* Drag Handle */}
              <div className="text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Required Checkbox */}
              <div className="flex items-center">
                <Checkbox
                  id={`required-${subtask.id}`}
                  checked={subtask.is_required}
                  onCheckedChange={() => handleToggleRequired(subtask.id)}
                  disabled={readonly}
                  aria-label={t('tasks.subtask_required')}
                />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                {editingId === subtask.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(subtask.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                    className="h-8 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => !readonly && handleStartEdit(subtask)}
                    className={cn(
                      "text-sm text-left w-full truncate",
                      subtask.is_required && "font-medium",
                      !readonly && "hover:text-primary cursor-text"
                    )}
                  >
                    {subtask.title}
                  </button>
                )}
              </div>

              {/* Edit Actions */}
              {editingId === subtask.id && (
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSaveEdit(subtask.id)}
                    className="h-7 w-7"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-7 w-7"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Reorder & Delete Actions */}
              {!readonly && editingId !== subtask.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-7 w-7"
                    aria-label={t('tasks.move_up')}
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === subtasks.length - 1}
                    className="h-7 w-7"
                    aria-label={t('tasks.move_down')}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Subtask */}
      {!readonly && (
        <div className="flex gap-2">
          <Input
            placeholder={t('tasks.add_subtask_placeholder')}
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            className="flex-1"
          />
          <Button
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim()}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Helper Text */}
      {!readonly && subtasks.length === 0 && (
        <p className="text-xs text-muted-foreground">
          {t('tasks.subtasks_helper')}
        </p>
      )}
    </div>
  );
}
