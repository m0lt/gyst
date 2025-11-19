"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, BellOff, Check, AlertCircle } from "lucide-react";

interface Props {
  userId: string;
  onSubscribe?: (subscription: PushSubscription) => Promise<void>;
  onUnsubscribe?: () => Promise<void>;
}

export function PushPermissionButton({ userId, onSubscribe, onUnsubscribe }: Props) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Failed to check subscription:", err);
    }
  }

  async function requestPermission() {
    try {
      setLoading(true);
      setError(null);

      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === "granted") {
        await subscribe();
      } else if (permission === "denied") {
        setError("Notification permission denied. Please enable in browser settings.");
      }
    } catch (err) {
      console.error("Failed to request permission:", err);
      setError("Failed to request permission");
    } finally {
      setLoading(false);
    }
  }

  async function subscribe() {
    try {
      setLoading(true);
      setError(null);

      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw-push.js');
        await navigator.serviceWorker.ready;
      }

      // Get VAPID public key from env
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("VAPID public key not configured");
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("✅ Push subscription created:", subscription);

      // Serialize subscription to plain object for server action
      const serializedSubscription = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth')),
        },
      };

      // Save subscription to server
      if (onSubscribe) {
        await onSubscribe(serializedSubscription as any);
      }

      setIsSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setError("Failed to subscribe to push notifications");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    try {
      setLoading(true);
      setError(null);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        console.log("✅ Push subscription removed");

        if (onUnsubscribe) {
          await onUnsubscribe();
        }
      }

      setIsSubscribed(false);
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      setError("Failed to unsubscribe from push notifications");
    } finally {
      setLoading(false);
    }
  }

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Helper function to convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-5 h-5 animate-pulse" />
          <p className="text-sm">Loading notification settings...</p>
        </div>
      </Card>
    );
  }

  // Check if push notifications are supported
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">
            Push notifications are not supported in this browser.
          </p>
        </div>
      </Card>
    );
  }

  if (permission === "denied") {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center gap-2 text-red-800">
          <BellOff className="w-5 h-5" />
          <p className="text-sm">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {isSubscribed ? (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">Push notifications enabled</p>
            </div>
            <Button
              onClick={unsubscribe}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? "Unsubscribing..." : "Disable"}
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={permission === "granted" ? subscribe : requestPermission}
          disabled={loading}
          className="w-full"
        >
          <Bell className="w-4 h-4 mr-2" />
          {loading
            ? "Enabling..."
            : permission === "granted"
            ? "Enable Push Notifications"
            : "Request Notification Permission"}
        </Button>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
