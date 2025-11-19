"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Camera,
  Clock,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Subtask {
  id: string;
  title: string;
  is_required: boolean;
  sort_order: number;
}

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  estimatedMinutes?: number;
  requiresPhotoProof?: boolean;
  subtasks?: Subtask[];
  onComplete: (data: CompletionData) => Promise<void>;
}

export interface CompletionData {
  taskId: string;
  actualMinutes?: number;
  photoFile?: File;
  notes?: string;
  subtasksCompleted?: string[]; // IDs of completed subtasks
}

export function TaskCompletionModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  estimatedMinutes,
  requiresPhotoProof = false,
  subtasks = [],
  onComplete,
}: TaskCompletionModalProps) {
  const [actualMinutes, setActualMinutes] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [completedSubtasks, setCompletedSubtasks] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setActualMinutes(estimatedMinutes ? String(estimatedMinutes) : "");
      setNotes("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setCompletedSubtasks(new Set());
      setIsSubmitting(false);
    }
  }, [isOpen, estimatedMinutes]);

  const handlePhotoSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const toggleSubtask = (subtaskId: string) => {
    setCompletedSubtasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subtaskId)) {
        newSet.delete(subtaskId);
      } else {
        newSet.add(subtaskId);
      }
      return newSet;
    });
  };

  const canSubmit = () => {
    // Check if photo is required
    if (requiresPhotoProof && !photoFile) {
      return false;
    }

    // Check if required subtasks are completed
    const requiredSubtasks = subtasks.filter((st) => st.is_required);
    const allRequiredCompleted = requiredSubtasks.every((st) =>
      completedSubtasks.has(st.id)
    );

    if (!allRequiredCompleted) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const completionData: CompletionData = {
        taskId,
        actualMinutes: actualMinutes ? parseInt(actualMinutes, 10) : undefined,
        photoFile: photoFile || undefined,
        notes: notes || undefined,
        subtasksCompleted: Array.from(completedSubtasks),
      };

      await onComplete(completionData);
      onClose();
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to complete task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Complete Task
          </DialogTitle>
          <DialogDescription className="text-base font-medium">
            {taskTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Time Tracking */}
          <div className="space-y-2">
            <Label htmlFor="actual-minutes" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Actual Time Spent (minutes)
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="actual-minutes"
                type="number"
                min="0"
                value={actualMinutes}
                onChange={(e) => setActualMinutes(e.target.value)}
                placeholder={estimatedMinutes ? `Est. ${estimatedMinutes} min` : "Enter minutes"}
                className="flex-1"
              />
              {estimatedMinutes && actualMinutes && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded",
                    parseInt(actualMinutes) <= estimatedMinutes
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  )}
                >
                  {parseInt(actualMinutes) <= estimatedMinutes ? "On track!" : "Over estimate"}
                </motion.div>
              )}
            </div>
          </div>

          {/* Subtasks Checklist */}
          {subtasks.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Subtasks
              </Label>
              <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-accent/5">
                {subtasks
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent/10 transition-colors"
                    >
                      <Checkbox
                        id={`subtask-${subtask.id}`}
                        checked={completedSubtasks.has(subtask.id)}
                        onCheckedChange={() => toggleSubtask(subtask.id)}
                      />
                      <label
                        htmlFor={`subtask-${subtask.id}`}
                        className={cn(
                          "flex-1 text-sm cursor-pointer",
                          completedSubtasks.has(subtask.id) && "line-through text-muted-foreground"
                        )}
                      >
                        {subtask.title}
                        {subtask.is_required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground">
                * Required subtasks must be completed
              </p>
            </div>
          )}

          {/* Photo Upload */}
          {requiresPhotoProof && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Photo Proof
                <span className="text-red-500">*</span>
              </Label>

              {photoPreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-lg overflow-hidden border-2 border-primary/20"
                >
                  <Image
                    src={photoPreview}
                    alt="Photo proof preview"
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/5"
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        {isDragging ? (
                          <Upload className="h-6 w-6 text-primary" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this completion..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Task
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
