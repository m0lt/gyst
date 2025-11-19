"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  Users,
  Dog,
  Leaf,
  Music,
  Sun,
  Moon,
  Sunrise,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/app/actions/onboarding";
import { useTranslation } from "react-i18next";

interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
}

export interface OnboardingAnswers {
  lives_alone?: boolean;
  has_pets?: boolean;
  has_plants?: boolean;
  plays_instruments?: boolean;
  preferred_task_time?: "morning" | "afternoon" | "evening";
}

interface Step {
  id: string;
  title: string;
  description: string;
  question: string;
  field: keyof OnboardingAnswers;
  type: "boolean" | "choice";
  options?: Array<{
    value: any;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
  }>;
}

export function OnboardingWizard({ userId, onComplete }: OnboardingWizardProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STEPS: Step[] = [
    {
      id: "living",
      title: t("onboarding.living.title"),
      description: t("onboarding.living.description"),
      question: t("onboarding.living.question"),
      field: "lives_alone",
      type: "boolean",
    },
    {
      id: "pets",
      title: t("onboarding.pets.title"),
      description: t("onboarding.pets.description"),
      question: t("onboarding.pets.question"),
      field: "has_pets",
      type: "boolean",
    },
    {
      id: "plants",
      title: t("onboarding.plants.title"),
      description: t("onboarding.plants.description"),
      question: t("onboarding.plants.question"),
      field: "has_plants",
      type: "boolean",
    },
    {
      id: "instruments",
      title: t("onboarding.instruments.title"),
      description: t("onboarding.instruments.description"),
      question: t("onboarding.instruments.question"),
      field: "plays_instruments",
      type: "boolean",
    },
    {
      id: "time",
      title: t("onboarding.time.title"),
      description: t("onboarding.time.description"),
      question: t("onboarding.time.question"),
      field: "preferred_task_time",
      type: "choice",
      options: [
        {
          value: "morning",
          label: t("onboarding.time.morning"),
          icon: Sunrise,
          description: t("onboarding.time.morningDesc"),
        },
        {
          value: "afternoon",
          label: t("onboarding.time.afternoon"),
          icon: Sun,
          description: t("onboarding.time.afternoonDesc"),
        },
        {
          value: "evening",
          label: t("onboarding.time.evening"),
          icon: Moon,
          description: t("onboarding.time.eveningDesc"),
        },
      ],
    },
  ];

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [step.field]: value,
    }));

    // Auto-advance for boolean questions
    if (step.type === "boolean") {
      setTimeout(() => {
        if (isLastStep) {
          handleComplete({ ...answers, [step.field]: value });
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }, 300);
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleComplete(answers);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = async (finalAnswers: OnboardingAnswers) => {
    setIsSubmitting(true);
    try {
      // Save onboarding answers to database - this will redirect on success
      await completeOnboarding(userId, finalAnswers);
      // If we get here without error, redirect happened successfully
    } catch (error: any) {
      // Server actions use redirect() which throws - check if it's a redirect error
      if (error?.digest?.includes("NEXT_REDIRECT")) {
        // This is expected - let the redirect happen
        throw error;
      }
      // Otherwise it's an actual error
      console.error("Onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    return answers[step.field] !== undefined;
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl" hideClose>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <DialogTitle className="text-2xl">{t("onboarding.title")}</DialogTitle>
          </div>
          <DialogDescription>
            {t("onboarding.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {t("onboarding.step", { current: currentStep + 1, total: STEPS.length })}
            </span>
            <span>{t("onboarding.progress", { percent: Math.round(progress) })}</span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <p className="text-lg font-medium">{step.question}</p>
            </div>

            <div className="space-y-3">
              {step.type === "boolean" ? (
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(true)}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all text-left",
                      answers[step.field] === true
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                        <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-semibold">{t("onboarding.yes")}</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(false)}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all text-left",
                      answers[step.field] === false
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900/30 mb-3">
                        <Home className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <p className="font-semibold">{t("onboarding.no")}</p>
                    </div>
                  </motion.button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {step.options?.map((option) => {
                    const Icon = option.icon;
                    const isSelected = answers[step.field] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "flex items-center justify-center w-12 h-12 rounded-full",
                              isSelected
                                ? "bg-primary/20"
                                : "bg-accent"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-6 w-6",
                                isSelected ? "text-primary" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{option.label}</p>
                            {option.description && (
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("onboarding.back")}
          </Button>

          {step.type === "choice" && (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isSubmitting ? (
                t("onboarding.settingUp")
              ) : isLastStep ? (
                t("onboarding.complete")
              ) : (
                <>
                  {t("onboarding.next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
