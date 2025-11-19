import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TaskFilter = {
  categoryId?: string;
  frequency?: "daily" | "weekly" | "custom";
  isActive?: boolean;
  searchQuery?: string;
};

export type TaskSortBy = "created" | "title" | "streak" | "category" | "frequency";
export type TaskSortOrder = "asc" | "desc";

export type TaskViewMode = "list" | "grid" | "compact";

interface TaskState {
  // Filters
  filter: TaskFilter;
  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;

  // Sorting
  sortBy: TaskSortBy;
  sortOrder: TaskSortOrder;
  setSorting: (sortBy: TaskSortBy, sortOrder?: TaskSortOrder) => void;

  // View mode
  viewMode: TaskViewMode;
  setViewMode: (mode: TaskViewMode) => void;

  // UI State
  selectedTaskIds: string[];
  setSelectedTasks: (ids: string[]) => void;
  toggleTaskSelection: (id: string) => void;
  clearSelection: () => void;

  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingTaskId: string | null;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (taskId: string) => void;
  closeEditModal: () => void;

  // Completion modal
  isCompletionModalOpen: boolean;
  completingTaskId: string | null;
  openCompletionModal: (taskId: string) => void;
  closeCompletionModal: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // Initial filter state
      filter: {},

      setFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),

      clearFilter: () => set({ filter: {} }),

      // Initial sorting state
      sortBy: "created",
      sortOrder: "desc",

      setSorting: (sortBy, sortOrder) => {
        const currentSortBy = get().sortBy;
        const currentSortOrder = get().sortOrder;

        // Toggle order if clicking same column
        if (sortBy === currentSortBy && !sortOrder) {
          set({ sortOrder: currentSortOrder === "asc" ? "desc" : "asc" });
        } else {
          set({
            sortBy,
            sortOrder: sortOrder || "asc",
          });
        }
      },

      // Initial view mode
      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),

      // Selection state
      selectedTaskIds: [],
      setSelectedTasks: (ids) => set({ selectedTaskIds: ids }),

      toggleTaskSelection: (id) => {
        const current = get().selectedTaskIds;
        if (current.includes(id)) {
          set({ selectedTaskIds: current.filter((taskId) => taskId !== id) });
        } else {
          set({ selectedTaskIds: [...current, id] });
        }
      },

      clearSelection: () => set({ selectedTaskIds: [] }),

      // Create/Edit modal state
      isCreateModalOpen: false,
      isEditModalOpen: false,
      editingTaskId: null,

      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),

      openEditModal: (taskId) =>
        set({ isEditModalOpen: true, editingTaskId: taskId }),

      closeEditModal: () =>
        set({ isEditModalOpen: false, editingTaskId: null }),

      // Completion modal state
      isCompletionModalOpen: false,
      completingTaskId: null,

      openCompletionModal: (taskId) =>
        set({ isCompletionModalOpen: true, completingTaskId: taskId }),

      closeCompletionModal: () =>
        set({ isCompletionModalOpen: false, completingTaskId: null }),
    }),
    {
      name: "task-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist user preferences, not UI state
      partialize: (state) => ({
        filter: state.filter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        viewMode: state.viewMode,
      }),
    }
  )
);
