"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function NoTasksCard() {
  const { t } = useTranslation();

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle>{t("dashboard.noTasksYet")}</CardTitle>
        <CardDescription>{t("dashboard.noTasksDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/protected/tasks">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("dashboard.createFirstTask")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
