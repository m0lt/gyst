"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Clock,
  Camera,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TaskCompletion {
  id: string;
  completed_at: string;
  actual_minutes: number | null;
  photo_url: string | null;
  notes: string | null;
  subtasks_completed: string[] | null;
}

interface TaskCompletionHistoryProps {
  completions: TaskCompletion[];
  taskTitle?: string;
  estimatedMinutes?: number;
  subtasks?: Array<{ id: string; title: string }>;
}

export function TaskCompletionHistory({
  completions,
  taskTitle,
  estimatedMinutes,
  subtasks = [],
}: TaskCompletionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (completions.length === 0) {
    return (
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Completion History
          </CardTitle>
          <CardDescription>No completions yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Complete this task to see your history here
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedCompletions = [...completions].sort(
    (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getSubtaskTitle = (subtaskId: string) => {
    return subtasks.find((st) => st.id === subtaskId)?.title || subtaskId;
  };

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Completion History
            </CardTitle>
            {taskTitle && <CardDescription className="mt-1">{taskTitle}</CardDescription>}
          </div>
          <Badge variant="secondary">{completions.length} completions</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {sortedCompletions.map((completion) => {
          const isExpanded = expandedId === completion.id;
          const hasDetails =
            completion.notes ||
            completion.photo_url ||
            (completion.subtasks_completed && completion.subtasks_completed.length > 0);

          return (
            <motion.div
              key={completion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              {/* Summary */}
              <div className="p-4 bg-accent/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatDate(completion.completed_at)}</span>
                    </div>

                    {/* Time */}
                    {completion.actual_minutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {completion.actual_minutes} minutes
                        </span>
                        {estimatedMinutes && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              completion.actual_minutes <= estimatedMinutes
                                ? "text-green-600 border-green-600/30 bg-green-50 dark:bg-green-900/20"
                                : "text-amber-600 border-amber-600/30 bg-amber-50 dark:bg-amber-900/20"
                            )}
                          >
                            {completion.actual_minutes <= estimatedMinutes
                              ? "On track"
                              : `+${completion.actual_minutes - estimatedMinutes} min`}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Quick indicators */}
                    <div className="flex items-center gap-2">
                      {completion.photo_url && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Camera className="h-3 w-3" />
                          Photo
                        </Badge>
                      )}
                      {completion.notes && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <FileText className="h-3 w-3" />
                          Notes
                        </Badge>
                      )}
                      {completion.subtasks_completed &&
                        completion.subtasks_completed.length > 0 && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {completion.subtasks_completed.length} subtasks
                          </Badge>
                        )}
                    </div>
                  </div>

                  {/* Expand button */}
                  {hasDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(completion.id)}
                      className="shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && hasDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border/50"
                  >
                    <div className="p-4 space-y-4">
                      {/* Photo */}
                      {completion.photo_url && (
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <Camera className="h-4 w-4 text-primary" />
                            Photo Proof
                          </Label>
                          <div className="relative rounded-lg overflow-hidden border border-border/50">
                            <Image
                              src={completion.photo_url}
                              alt="Completion photo"
                              width={600}
                              height={400}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Subtasks */}
                      {completion.subtasks_completed &&
                        completion.subtasks_completed.length > 0 && (
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Completed Subtasks
                            </Label>
                            <ul className="space-y-1 pl-6">
                              {completion.subtasks_completed.map((subtaskId) => (
                                <li
                                  key={subtaskId}
                                  className="text-sm text-muted-foreground list-disc"
                                >
                                  {getSubtaskTitle(subtaskId)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Notes */}
                      {completion.notes && (
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="h-4 w-4 text-primary" />
                            Notes
                          </Label>
                          <p className="text-sm text-muted-foreground p-3 rounded-lg bg-accent/5 border border-border/30">
                            {completion.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Helper Label component (if not already imported)
function Label({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none", className)} {...props}>
      {children}
    </label>
  );
}
