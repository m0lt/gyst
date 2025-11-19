"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Database } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  userId: string;
  onExport: () => Promise<string>;
}

export function DataManagement({ userId, onExport }: Props) {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const jsonData = await onExport();

      // Create download link
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gyst-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-mucha-mauve" />
        <h2 className="text-xl font-semibold">{t("settings.dataManagement.title")}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{t("settings.dataManagement.exportData")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("settings.dataManagement.exportDescription")}
          </p>
          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="outline"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("settings.dataManagement.exporting")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t("settings.dataManagement.exportButton")}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
