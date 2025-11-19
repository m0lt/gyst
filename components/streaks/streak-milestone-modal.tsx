"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Flame, Trophy, Star, Zap, PartyPopper } from "lucide-react";

interface StreakMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: number;
  taskTitle?: string;
  earnedBreakCredits?: number;
}

export function StreakMilestoneModal({
  isOpen,
  onClose,
  milestone,
  taskTitle = "Your Task",
  earnedBreakCredits = 0,
}: StreakMilestoneModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getMilestoneIcon = (milestone: number) => {
    if (milestone >= 365) return Trophy;
    if (milestone >= 100) return Award;
    if (milestone >= 30) return Star;
    return Flame;
  };

  const getMilestoneMessage = (milestone: number) => {
    if (milestone >= 365) return "An entire year! You're unstoppable!";
    if (milestone >= 100) return "Triple digits! Absolutely legendary!";
    if (milestone >= 50) return "Halfway to 100! You're on fire!";
    if (milestone >= 30) return "A full month! Incredible dedication!";
    if (milestone >= 14) return "Two weeks strong! Keep it up!";
    if (milestone === 7) return "One week! You're building momentum!";
    return "Great milestone! Keep going!";
  };

  const MilestoneIcon = getMilestoneIcon(milestone);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: Math.random() * 1.5 + 0.5,
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                  className="absolute w-3 h-3"
                  style={{
                    backgroundColor: [
                      "#FFD700",
                      "#FFA500",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#45B7D1",
                      "#96CEB4",
                    ][Math.floor(Math.random() * 6)],
                    borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <DialogHeader className="text-center space-y-4">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-orange-500/40 to-amber-500/40 rounded-full" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                <MilestoneIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DialogTitle className="text-3xl font-display font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {milestone} Day Streak!
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {getMilestoneMessage(milestone)}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Task Info */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2 text-primary mb-1">
              <PartyPopper className="h-4 w-4" />
              <span className="font-semibold">{taskTitle}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You've completed this task {milestone} times in a row!
            </p>
          </div>

          {/* Rewards */}
          {earnedBreakCredits > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="font-display font-bold text-lg">
                  Reward Unlocked!
                </span>
              </div>
              <p className="text-center text-sm">
                You've earned{" "}
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {earnedBreakCredits} Break Credit{earnedBreakCredits > 1 ? "s" : ""}
                </span>
              </p>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Use {earnedBreakCredits > 1 ? "them" : "it"} to skip a day without breaking your
                streak
              </p>
            </motion.div>
          )}

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center p-3 rounded-lg bg-accent/5"
          >
            <p className="text-sm italic text-muted-foreground">
              "{getMotivationalQuote(milestone)}"
            </p>
          </motion.div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
            size="lg"
          >
            Keep the Streak Going!
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function getMotivationalQuote(milestone: number): string {
  const quotes = {
    7: "Success is the sum of small efforts repeated day in and day out.",
    14: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    30: "The secret of change is to focus all your energy on building the new.",
    50: "Discipline is choosing between what you want now and what you want most.",
    100: "The only impossible journey is the one you never begin.",
    365: "A year from now you'll wish you had started today. You did, and look where you are!",
  };

  // Find the closest milestone
  const milestones = [7, 14, 30, 50, 100, 365];
  const closest = milestones.reduce((prev, curr) =>
    Math.abs(curr - milestone) < Math.abs(prev - milestone) ? curr : prev
  );

  return quotes[closest as keyof typeof quotes] || quotes[7];
}
