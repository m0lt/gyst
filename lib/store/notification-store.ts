import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 = permanent
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
};

interface NotificationState {
  // Notifications queue
  notifications: Notification[];

  // Add notification
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => string;

  // Remove notification
  removeNotification: (id: string) => void;

  // Clear all notifications
  clearAll: () => void;

  // Convenience methods
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
}

// Generate unique ID
const generateId = () => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      duration: notification.duration ?? 5000, // Default 5 seconds
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (if not permanent)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  // Convenience methods
  success: (title, message, duration) => {
    return get().addNotification({
      type: "success",
      title,
      message,
      duration,
    });
  },

  error: (title, message, duration = 7000) => {
    return get().addNotification({
      type: "error",
      title,
      message,
      duration,
    });
  },

  warning: (title, message, duration = 6000) => {
    return get().addNotification({
      type: "warning",
      title,
      message,
      duration,
    });
  },

  info: (title, message, duration) => {
    return get().addNotification({
      type: "info",
      title,
      message,
      duration,
    });
  },
}));
