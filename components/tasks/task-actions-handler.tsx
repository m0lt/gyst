"use client";

import { useState } from "react";
import { TaskCompletionModal, CompletionData } from "./task-completion-modal";
import { StreakMilestoneModal } from "../streaks/streak-milestone-modal";
import { completeTask } from "@/app/actions/tasks";
import { compressImageToFile } from "@/lib/utils/image-compression";

interface Subtask {
  id: string;
  title: string;
  is_required: boolean;
  sort_order: number;
}

interface Task {
  id: string;
  title: string;
  estimated_minutes?: number | null;
  requires_photo_proof?: boolean | null;
  user_id: string;
}

interface TaskActionsHandlerProps {
  task: Task;
  subtasks?: Subtask[];
  children: (props: { onCompleteClick: () => void }) => React.ReactNode;
}

export function TaskActionsHandler({
  task,
  subtasks = [],
  children,
}: TaskActionsHandlerProps) {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneData, setMilestoneData] = useState<{
    milestone: number;
    earnedBreakCredits: number;
  } | null>(null);

  const handleCompleteClick = () => {
    setIsCompletionModalOpen(true);
  };

  const handleComplete = async (data: CompletionData) => {
    try {
      // Compress photo if provided
      let processedPhotoFile: File | undefined;
      if (data.photoFile) {
        try {
          processedPhotoFile = await compressImageToFile(data.photoFile, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.85,
            mimeType: "image/jpeg",
          });
        } catch (error) {
          console.error("Error compressing image:", error);
          // Fall back to original file if compression fails
          processedPhotoFile = data.photoFile;
        }
      }

      // Call the server action
      const result = await completeTask({
        taskId: data.taskId,
        userId: task.user_id,
        actualMinutes: data.actualMinutes,
        photoFile: processedPhotoFile,
        notes: data.notes,
        subtasksCompleted: data.subtasksCompleted,
      });

      // Close completion modal
      setIsCompletionModalOpen(false);

      // Show milestone celebration if reached
      if (result.milestone) {
        setMilestoneData({
          milestone: result.milestone,
          earnedBreakCredits: result.earnedBreakCredits || 0,
        });
        setIsMilestoneModalOpen(true);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      throw error; // Let the modal handle the error
    }
  };

  return (
    <>
      {children({ onCompleteClick: handleCompleteClick })}

      <TaskCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        taskId={task.id}
        taskTitle={task.title}
        estimatedMinutes={task.estimated_minutes || undefined}
        requiresPhotoProof={task.requires_photo_proof || false}
        subtasks={subtasks}
        onComplete={handleComplete}
      />

      {milestoneData && (
        <StreakMilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={() => {
            setIsMilestoneModalOpen(false);
            setMilestoneData(null);
          }}
          milestone={milestoneData.milestone}
          taskTitle={task.title}
          earnedBreakCredits={milestoneData.earnedBreakCredits}
        />
      )}
    </>
  );
}
