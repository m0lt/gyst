"use client";

import { useEffect } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore, type Notification } from "@/lib/store/notification-store";
import { Button } from "@/components/ui/button";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
};

const iconColors = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotificationStore();
  const Icon = icons[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg
        ${colors[notification.type]}
      `}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColors[notification.type]}`} />

      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-foreground">
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-muted-foreground mt-1">
            {notification.message}
          </p>
        )}
        {notification.action && (
          <Button
            size="sm"
            variant="link"
            className="mt-2 p-0 h-auto"
            onClick={notification.action.onClick}
          >
            {notification.action.label}
          </Button>
        )}
      </div>

      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function NotificationToast() {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem notification={notification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
