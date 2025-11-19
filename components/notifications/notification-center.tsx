"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export interface Notification {
  id: string;
  type: string;
  channel: "email" | "push";
  subject: string | null;
  body: string | null;
  scheduled_for: string;
  sent_at: string | null;
  failed_at: string | null;
  created_at: string;
}

interface Props {
  userId: string;
  notifications: Notification[];
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function NotificationCenter({
  userId,
  notifications: initialNotifications,
  onMarkAsRead,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "sent" | "pending" | "failed">("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "sent") return !!notif.sent_at;
    if (filter === "pending") return !notif.sent_at && !notif.failed_at;
    if (filter === "failed") return !!notif.failed_at;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    if (onMarkAsRead) {
      await onMarkAsRead(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (onDelete) {
      await onDelete(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const getNotificationIcon = (channel: "email" | "push") => {
    return channel === "email" ? (
      <Mail className="w-4 h-4" />
    ) : (
      <Smartphone className="w-4 h-4" />
    );
  };

  const getStatusBadge = (notification: Notification) => {
    if (notification.failed_at) {
      return <Badge variant="destructive">{t("notifications.failed")}</Badge>;
    }
    if (notification.sent_at) {
      return <Badge variant="default">{t("notifications.sent")}</Badge>;
    }
    return <Badge variant="secondary">{t("notifications.pending")}</Badge>;
  };

  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("notifications.noNotifications")}</h3>
        <p className="text-muted-foreground">
          {t("notifications.noNotificationsDesc")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          {t("notifications.all")} ({notifications.length})
        </Button>
        <Button
          variant={filter === "sent" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("sent")}
        >
          {t("notifications.sent")} ({notifications.filter((n) => n.sent_at).length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          {t("notifications.pending")} ({notifications.filter((n) => !n.sent_at && !n.failed_at).length})
        </Button>
        <Button
          variant={filter === "failed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("failed")}
        >
          {t("notifications.failed")} ({notifications.filter((n) => n.failed_at).length})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            {t("notifications.noFilterNotifications", { filter })}
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.channel)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {notification.subject || t("notifications.taskReminder")}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.body || t("notifications.noDescription")}
                      </p>
                    </div>
                    {getStatusBadge(notification)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="capitalize">{notification.type.replace("_", " ")}</span>
                    <span>•</span>
                    <span>
                      {notification.sent_at
                        ? `${t("notifications.sent")} ${getFormattedDate(notification.sent_at)}`
                        : `${t("notifications.scheduled")} ${getFormattedDate(notification.scheduled_for)}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!notification.sent_at && !notification.failed_at && onMarkAsRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title={t("notifications.markAsRead")}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      title={t("notifications.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
