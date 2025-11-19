"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { TimeSpentData } from "@/app/actions/statistics";

interface TimeSpentChartProps {
  data: TimeSpentData[];
}

export function TimeSpentChart({ data }: TimeSpentChartProps) {
  if (data.length === 0) {
    return (
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time Spent by Category
          </CardTitle>
          <CardDescription>Total and average time invested</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for this time period
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMinutes = data.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Spent by Category
        </CardTitle>
        <CardDescription>
          Total: {totalHours}h {totalMinutes % 60}m invested
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={120}
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
              formatter={(value: number, name: string) => {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return [`${hours}h ${minutes}m`, name];
              }}
            />
            <Legend />
            <Bar
              dataKey="totalMinutes"
              fill="hsl(var(--chart-1))"
              radius={[0, 4, 4, 0]}
              name="Total Time (min)"
            />
            <Bar
              dataKey="avgMinutes"
              fill="hsl(var(--chart-2))"
              radius={[0, 4, 4, 0]}
              name="Avg Time (min)"
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {data.map((item) => {
            const hours = Math.floor(item.totalMinutes / 60);
            const minutes = item.totalMinutes % 60;
            return (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.category}</span>
                <div className="flex gap-3">
                  <span className="text-xs">
                    Total: {hours}h {minutes}m
                  </span>
                  <span className="text-xs font-medium">
                    Avg: {item.avgMinutes}min
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.count} tasks)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
