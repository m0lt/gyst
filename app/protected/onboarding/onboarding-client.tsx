"use client";

import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

interface OnboardingClientProps {
  userId: string;
}

export function OnboardingClient({ userId }: OnboardingClientProps) {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/protected");
    router.refresh();
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Gyst! 🎨</h1>
          <p className="text-muted-foreground text-lg">
            Let's personalize your experience in just a few questions
          </p>
        </div>

        <OnboardingWizard userId={userId} onComplete={handleComplete} />
      </div>
    </div>
  );
}
