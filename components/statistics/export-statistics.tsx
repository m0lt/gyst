"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2 } from "lucide-react";
import { exportStatisticsCSV, type DateRange } from "@/app/actions/statistics";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ExportStatisticsProps {
  userId: string;
  dateRange: DateRange;
}

export function ExportStatistics({ userId, dateRange }: ExportStatisticsProps) {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await exportStatisticsCSV(userId, dateRange);

      // Create blob and download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gyst-statistics-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="card-art-nouveau">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          {t("statistics.exportData")}
        </CardTitle>
        <CardDescription>{t("statistics.exportDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-accent/5">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t("statistics.csvExport")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("statistics.csvExportDescription")}
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="min-w-[100px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("statistics.exporting")}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <p className="font-medium mb-1">{t("statistics.exportIncludes")}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t("statistics.exportItem1")}</li>
              <li>{t("statistics.exportItem2")}</li>
              <li>{t("statistics.exportItem3")}</li>
              <li>{t("statistics.exportItem4")}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
