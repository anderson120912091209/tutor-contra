import { createClient } from "@/lib/supabase/server";
import { ParentOnboarding } from "@/components/parent/onboarding/parent-onboarding";
import { redirect } from "next/navigation";

export default async function SetupParentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-white">
      <ParentOnboarding user={user} />
    </div>
  );
}
