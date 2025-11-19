"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Flame } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function QuickActionsCard() {
  const { t } = useTranslation();

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle>{t("dashboard.quickActions")}</CardTitle>
        <CardDescription>{t("dashboard.quickActionsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/protected/tasks">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("dashboard.addNewTask")}
          </Button>
        </Link>
        <Link href="/protected/tasks">
          <Button size="lg" variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            {t("dashboard.viewAllTasks")}
          </Button>
        </Link>
        <Link href="/protected/statistics">
          <Button size="lg" variant="outline" className="gap-2">
            <Flame className="h-4 w-4" />
            {t("dashboard.viewStatistics")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
