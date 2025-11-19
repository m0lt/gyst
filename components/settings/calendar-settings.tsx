"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X, RefreshCw } from "lucide-react";

type CalendarProvider = "google" | "microsoft" | "apple";

interface CalendarConnection {
  id: string;
  provider: CalendarProvider;
  email: string;
  is_active: boolean;
  last_sync?: string;
}

interface Props {
  connections?: CalendarConnection[];
  onConnect: (provider: CalendarProvider) => Promise<void>;
  onDisconnect: (connectionId: string) => Promise<void>;
  onSync: (connectionId: string) => Promise<void>;
}

const PROVIDERS = [
  {
    id: "google" as CalendarProvider,
    name: "Google Calendar",
    icon: "🗓️",
    color: "bg-blue-500",
  },
  {
    id: "microsoft" as CalendarProvider,
    name: "Microsoft 365",
    icon: "📅",
    color: "bg-green-600",
  },
  {
    id: "apple" as CalendarProvider,
    name: "Apple Calendar",
    icon: "📆",
    color: "bg-gray-800",
  },
];

export function CalendarSettings({
  connections = [],
  onConnect,
  onDisconnect,
  onSync,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = async (provider: CalendarProvider) => {
    try {
      setLoading(provider);
      await onConnect(provider);
    } catch (error) {
      console.error(`Failed to connect to ${provider}:`, error);
      alert(`Failed to connect to ${provider}`);
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm("Are you sure you want to disconnect this calendar?")) {
      return;
    }

    try {
      setLoading(connectionId);
      await onDisconnect(connectionId);
    } catch (error) {
      console.error("Failed to disconnect:", error);
      alert("Failed to disconnect calendar");
    } finally {
      setLoading(null);
    }
  };

  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(connectionId);
      await onSync(connectionId);
    } catch (error) {
      console.error("Failed to sync:", error);
      alert("Failed to sync calendar");
    } finally {
      setSyncing(null);
    }
  };

  const getConnection = (provider: CalendarProvider) =>
    connections.find((c) => c.provider === provider);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-mucha-mauve" />
        <h2 className="text-xl font-semibold">Calendar Integration</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your calendars to sync your tasks and see your availability
        </p>

        {PROVIDERS.map((provider) => {
          const connection = getConnection(provider.id);
          const isConnected = !!connection;

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center text-white text-xl`}>
                  {provider.icon}
                </div>
                <div>
                  <div className="font-medium">{provider.name}</div>
                  {isConnected && connection && (
                    <div className="text-xs text-muted-foreground">
                      {connection.email}
                      {connection.last_sync && (
                        <> · Last sync: {new Date(connection.last_sync).toLocaleString()}</>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected && connection ? (
                  <>
                    <Badge variant={connection.is_active ? "default" : "secondary"}>
                      {connection.is_active ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSync(connection.id)}
                      disabled={!!syncing}
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing === connection.id ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(connection.id)}
                      disabled={loading === connection.id}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect(provider.id)}
                    disabled={loading === provider.id}
                  >
                    {loading === provider.id ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Calendar integration requires OAuth credentials from Google and Microsoft.
            Set up your OAuth apps in their respective developer consoles and add the credentials to your environment variables.
          </p>
        </div>
      </div>
    </Card>
  );
}
