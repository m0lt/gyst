"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { StreakHistoryPoint } from "@/app/actions/statistics";

interface StreakHistoryChartProps {
  data: StreakHistoryPoint[];
}

export function StreakHistoryChart({ data }: StreakHistoryChartProps) {
  if (data.length === 0) {
    return (
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Streak History
          </CardTitle>
          <CardDescription>Your task completion streaks over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for this time period
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxStreak = Math.max(...data.map(d => d.streak), 0);

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Streak History
        </CardTitle>
        <CardDescription>
          Your task completion streaks over time (Peak: {maxStreak} days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value} days`, "Streak"]}
            />
            <Area
              type="monotone"
              dataKey="streak"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#streakGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
