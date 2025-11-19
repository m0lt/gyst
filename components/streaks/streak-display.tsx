"use client";

import { Flame, Award, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getNextMilestone } from "@/lib/utils/streak-calculator";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  availableBreaks?: number;
  isActiveToday?: boolean;
  taskTitle?: string;
  compact?: boolean;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  completionRate,
  availableBreaks = 0,
  isActiveToday = false,
  taskTitle,
  compact = false,
}: StreakDisplayProps) {
  const nextMilestone = getNextMilestone(currentStreak);
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  // Compact version for inline display (e.g., in task cards)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <Flame className="h-3 w-3 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
              {currentStreak}
            </span>
          </motion.div>
        )}
        {isActiveToday && (
          <Badge variant="secondary" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )}
      </div>
    );
  }

  // Full version for dedicated streak display
  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Streak Tracker
            </CardTitle>
            {taskTitle && (
              <CardDescription className="mt-1">{taskTitle}</CardDescription>
            )}
          </div>
          {availableBreaks > 0 && (
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              {availableBreaks} Break{availableBreaks > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50">
                <Flame className="h-12 w-12 text-orange-500" />
              </div>
            </div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <div className="text-4xl font-display font-bold text-foreground">
                {currentStreak}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Day{currentStreak !== 1 ? "s" : ""} Streak
              </div>
            </motion.div>
          </motion.div>

          {isActiveToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Active Today
              </span>
            </motion.div>
          )}
        </div>

        {/* Progress to Next Milestone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Milestone</span>
            <span className="font-semibold flex items-center gap-1">
              <Award className="h-4 w-4 text-amber-500" />
              {nextMilestone} days
            </span>
          </div>
          <Progress value={progressToMilestone} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {nextMilestone - currentStreak} day{nextMilestone - currentStreak !== 1 ? "s" : ""} to go
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          {/* Longest Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Longest</span>
            </div>
            <div className="text-2xl font-display font-bold text-foreground">
              {longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              day{longestStreak !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs">Rate</span>
            </div>
            <div className="text-2xl font-display font-bold text-foreground">
              {Math.round(completionRate)}%
            </div>
            <div className="text-xs text-muted-foreground">completed</div>
          </div>
        </div>

        {/* Break Credits Info */}
        {availableBreaks > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {availableBreaks} Break Credit{availableBreaks > 1 ? "s" : ""} Available
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Skip a day without breaking your streak
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
