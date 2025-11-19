"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  Lightbulb,
  Plus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskSuggestion, AIResponse } from "@/lib/ai/suggestions";
import { getAITaskSuggestions, applyAISuggestions } from "@/app/actions/ai-suggestions";
import { useTranslation } from "react-i18next";

interface AISuggestCardProps {
  userId: string;
  remainingRequests?: number;
  className?: string;
}

export function AISuggestCard({
  userId,
  remainingRequests = 10,
  className,
}: AISuggestCardProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [suggestions, setSuggestions] = useState<AIResponse | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const loadSuggestions = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAITaskSuggestions(userId, forceRefresh);

      if (result.success) {
        setSuggestions(result.data);
        setIsCached(result.cached);
        // Auto-select all suggestions initially
        const indices = new Set(
          result.data.suggestions.map((_, i) => i)
        );
        setSelectedIndices(indices);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t("ai.failedToLoad"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!suggestions || selectedIndices.size === 0) return;

    setIsApplying(true);
    setError(null);

    try {
      // Get the suggestion ID from the most recent cache
      // In a real implementation, you'd store this when loading suggestions
      // For now, we'll need to fetch it

      const result = await applyAISuggestions(
        userId,
        "temp-id", // This should be the actual suggestion ID
        Array.from(selectedIndices)
      );

      if (result.success) {
        // Success! Reset state
        setSuggestions(null);
        setSelectedIndices(new Set());
        // Show success message or redirect
      } else {
        setError(result.error || t("ai.failedToApply"));
      }
    } catch (err) {
      setError(t("ai.failedToApply"));
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "weekly":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Card className={cn("card-art-nouveau", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {t("ai.suggestions")}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("ai.personalizedRecommendations")}
            </CardDescription>
          </div>

          {!suggestions && (
            <Button
              onClick={() => loadSuggestions(false)}
              disabled={isLoading || remainingRequests === 0}
              className="shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("ai.generating")}
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {t("ai.getSuggestions")}
                </>
              )}
            </Button>
          )}
        </div>

        {remainingRequests !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <AlertCircle className="h-4 w-4" />
            {t("ai.requestsRemaining", { count: remainingRequests })}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {suggestions ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Personalized Message */}
              {suggestions.personalized_message && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    {suggestions.personalized_message}
                  </p>
                </div>
              )}

              {/* Cache indicator */}
              {isCached && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("ai.cachedSuggestions")}
                </div>
              )}

              {/* Suggestions List */}
              <div className="space-y-3">
                {suggestions.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all cursor-pointer",
                      selectedIndices.has(index)
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    )}
                    onClick={() => toggleSelection(index)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedIndices.has(index)}
                        onCheckedChange={() => toggleSelection(index)}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-foreground">
                            {suggestion.title}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            {suggestion.estimated_minutes && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Clock className="h-3 w-3" />
                                {suggestion.estimated_minutes}m
                              </Badge>
                            )}
                            <Badge
                              className={cn(
                                "text-xs",
                                getFrequencyBadgeColor(suggestion.frequency)
                              )}
                            >
                              {suggestion.frequency}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>

                        {suggestion.reasoning && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
                            <Lightbulb className="h-3 w-3 mt-0.5 text-amber-500" />
                            <span>{suggestion.reasoning}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleApply}
                  disabled={isApplying || selectedIndices.size === 0}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("ai.creatingTasks")}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("ai.addTasks", { count: selectedIndices.size })}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => loadSuggestions(true)}
                  disabled={isLoading || remainingRequests === 0}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              </div>
            </motion.div>
          ) : !isLoading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("ai.clickToGetSuggestions")}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
