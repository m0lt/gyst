"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  CheckCircle,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { PersonalRecord } from "@/app/actions/statistics";

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

const iconMap = {
  flame: Flame,
  trophy: Trophy,
  "check-circle": CheckCircle,
  calendar: Calendar,
  "trending-up": TrendingUp,
  clock: Clock,
};

export function PersonalRecords({ records }: PersonalRecordsProps) {
  if (records.length === 0) {
    return (
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Personal Records
          </CardTitle>
          <CardDescription>Your achievements and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Complete some tasks to see your records!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Personal Records
        </CardTitle>
        <CardDescription>Your achievements and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const Icon = iconMap[record.icon as keyof typeof iconMap] || Trophy;

            return (
              <div
                key={record.id}
                className="relative p-4 rounded-lg border bg-gradient-to-br from-accent/5 to-accent/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {record.title}
                    </h3>
                    <p className="text-2xl font-bold mt-1 text-primary">
                      {record.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {record.description}
                    </p>
                    {record.date && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {record.date}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {records.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Keep completing tasks to unlock more achievements!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
