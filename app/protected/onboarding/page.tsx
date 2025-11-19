import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkOnboardingStatus } from "@/app/actions/onboarding";
import { OnboardingClient } from "./onboarding-client";

export const metadata = {
  title: "Welcome | Gyst",
  description: "Let's personalize your experience",
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Check if user has already completed onboarding
  const { completed } = await checkOnboardingStatus(user.id);

  if (completed) {
    return redirect("/protected");
  }

  return <OnboardingClient userId={user.id} />;
}
