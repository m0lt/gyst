import { create } from "zustand";

export type StreakMilestone = {
  taskId: string;
  taskTitle: string;
  streakLength: number;
  achievedAt: Date;
  seen: boolean;
};

interface StreakState {
  // Recent milestones
  recentMilestones: StreakMilestone[];
  addMilestone: (milestone: Omit<StreakMilestone, "seen" | "achievedAt">) => void;
  markMilestoneSeen: (taskId: string, streakLength: number) => void;
  clearSeenMilestones: () => void;

  // Break credits
  breakCreditsEarned: Record<string, number>; // taskId -> credits
  updateBreakCredits: (taskId: string, credits: number) => void;
  useBreakCredit: (taskId: string) => boolean;

  // Streak celebration animation state
  celebratingTaskId: string | null;
  startCelebration: (taskId: string) => void;
  endCelebration: () => void;

  // Streak stats cache (for performance)
  streakStatsCache: Record<string, {
    currentStreak: number;
    longestStreak: number;
    lastCalculated: Date;
  }>;
  updateStreakCache: (taskId: string, current: number, longest: number) => void;
  invalidateStreakCache: (taskId?: string) => void;
}

export const useStreakStore = create<StreakState>()((set, get) => ({
  // Milestones
  recentMilestones: [],

  addMilestone: (milestone) => {
    const newMilestone: StreakMilestone = {
      ...milestone,
      achievedAt: new Date(),
      seen: false,
    };

    set((state) => ({
      recentMilestones: [newMilestone, ...state.recentMilestones].slice(0, 10), // Keep last 10
    }));
  },

  markMilestoneSeen: (taskId, streakLength) => {
    set((state) => ({
      recentMilestones: state.recentMilestones.map((m) =>
        m.taskId === taskId && m.streakLength === streakLength
          ? { ...m, seen: true }
          : m
      ),
    }));
  },

  clearSeenMilestones: () => {
    set((state) => ({
      recentMilestones: state.recentMilestones.filter((m) => !m.seen),
    }));
  },

  // Break credits
  breakCreditsEarned: {},

  updateBreakCredits: (taskId, credits) => {
    set((state) => ({
      breakCreditsEarned: {
        ...state.breakCreditsEarned,
        [taskId]: credits,
      },
    }));
  },

  useBreakCredit: (taskId) => {
    const current = get().breakCreditsEarned[taskId] || 0;
    if (current > 0) {
      get().updateBreakCredits(taskId, current - 1);
      return true;
    }
    return false;
  },

  // Celebration state
  celebratingTaskId: null,

  startCelebration: (taskId) => {
    set({ celebratingTaskId: taskId });

    // Auto-end celebration after 3 seconds
    setTimeout(() => {
      if (get().celebratingTaskId === taskId) {
        get().endCelebration();
      }
    }, 3000);
  },

  endCelebration: () => set({ celebratingTaskId: null }),

  // Streak cache
  streakStatsCache: {},

  updateStreakCache: (taskId, current, longest) => {
    set((state) => ({
      streakStatsCache: {
        ...state.streakStatsCache,
        [taskId]: {
          currentStreak: current,
          longestStreak: longest,
          lastCalculated: new Date(),
        },
      },
    }));
  },

  invalidateStreakCache: (taskId) => {
    if (taskId) {
      set((state) => {
        const { [taskId]: _, ...rest } = state.streakStatsCache;
        return { streakStatsCache: rest };
      });
    } else {
      set({ streakStatsCache: {} });
    }
  },
}));
