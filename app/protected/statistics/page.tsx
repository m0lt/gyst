import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatisticsClient } from "./statistics-client";

export const metadata = {
  title: "Statistics | Gyst",
  description: "View your task completion statistics and analytics",
};

export default async function StatisticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <StatisticsClient userId={user.id} />;
}
