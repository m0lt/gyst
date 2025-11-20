"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskForm } from "./create-task-form";
import { useTranslation } from "react-i18next";

type Category = {
  id: string;
  name: string;
  color: string;
};

interface Props {
  categories: Category[];
}

export function CreateTaskCard({ categories }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="card-art-nouveau sticky top-24">
      <CardHeader>
        <CardTitle>{t("tasks.createNew")}</CardTitle>
        <CardDescription>{t("tasks.addNewTask")}</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateTaskForm categories={categories} />
      </CardContent>
    </Card>
  );
}
