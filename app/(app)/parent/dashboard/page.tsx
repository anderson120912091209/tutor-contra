import { createClient } from "@/lib/supabase/server";
import { getParentProfile, getPendingConfirmations, getParentLessonHistory } from "@/lib/db/parent";
import { redirect } from "next/navigation";
import { PendingConfirmations } from "@/components/parent/pending-confirmations";
import { LessonHistory } from "@/components/parent/lesson-history";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const parentProfile = await getParentProfile(user.id);

  if (!parentProfile) {
    redirect("/auth/setup-parent");
  }

  const [pendingConfirmations, lessonHistory] = await Promise.all([
    getPendingConfirmations(parentProfile.id),
    getParentLessonHistory(parentProfile.id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">家長入口</h1>
              <p className="text-sm text-muted-foreground">
                歡迎，{parentProfile.name}
              </p>
            </div>
            <form action="/api/auth/signout" method="post">
              <Button variant="ghost" type="submit">
                登出
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Pending Confirmations */}
        <PendingConfirmations lessons={pendingConfirmations} />

        {/* Lesson History */}
        <LessonHistory lessons={lessonHistory} />

        {/* TODO: Add testimonial section */}
        <div className="p-6 border rounded-lg text-center text-muted-foreground">
          <p>評價功能開發中...</p>
          <p className="text-sm mt-2">
            您可以透過確認課程記錄來為家教留下評價
          </p>
        </div>
      </main>
    </div>
  );
}

