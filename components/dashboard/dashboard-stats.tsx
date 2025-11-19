"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface DashboardStatsProps {
  totalTasks: number;
  completedToday: number;
  longestStreak: number;
  completionRate: number;
}

export function DashboardStats({
  totalTasks,
  completedToday,
  longestStreak,
  completionRate,
}: DashboardStatsProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t("dashboard.totalTasks"),
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: t("dashboard.completedToday"),
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: t("dashboard.longestStreak"),
      icon: Flame,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: t("dashboard.completionRate"),
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  const stats = [
    { value: totalTasks, suffix: "" },
    { value: completedToday, suffix: "" },
    { value: longestStreak, suffix: ` ${t("dashboard.days")}` },
    { value: Math.round(completionRate), suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const stat = stats[index];

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-art-nouveau">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground">
                    {stat.suffix}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
