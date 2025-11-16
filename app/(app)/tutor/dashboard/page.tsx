import { createClient } from "@/lib/supabase/server";
import { getTutorProfile, getTutorStats, getTodayLessons } from "@/lib/db/tutor";
import { getStudentsByTutor } from "@/lib/db/students";
import { getTutorHeatmapData } from "@/lib/db/lessons";
import { redirect } from "next/navigation";
import { TeachingHeatmap } from "@/components/tutor/teaching-heatmap";
import { StatsCard } from "@/components/tutor/stats-card";
import { LessonList } from "@/components/tutor/lesson-list";
import { StudentList } from "@/components/tutor/student-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TutorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const tutorProfile = await getTutorProfile(user.id);

  if (!tutorProfile) {
    redirect("/auth/setup-tutor");
  }

  const [stats, todayLessons, students, heatmapData] = await Promise.all([
    getTutorStats(tutorProfile.id),
    getTodayLessons(tutorProfile.id),
    getStudentsByTutor(tutorProfile.id),
    getTutorHeatmapData(tutorProfile.id, new Date().getFullYear()),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">家教儀表板</h1>
              <p className="text-sm text-muted-foreground">
                歡迎回來，{tutorProfile.display_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/t/${tutorProfile.public_slug}`} target="_blank">
                <Button variant="outline">查看公開檔案</Button>
              </Link>
              <Link href="/tutor/profile">
                <Button variant="ghost">編輯檔案</Button>
              </Link>
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost" type="submit">
                  登出
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="總驗證時數"
            value={`${stats.total_verified_hours} 小時`}
            description={`共 ${stats.verified_lessons} 堂已驗證課程`}
          />
          <StatsCard
            title="活躍學生"
            value={stats.active_students_count}
            description="正在教學中的學生"
          />
          <StatsCard
            title="平均評分"
            value={stats.average_rating > 0 ? stats.average_rating.toFixed(1) : "尚無評分"}
            description="來自家長的評價"
          />
          <StatsCard
            title="總課程數"
            value={stats.total_lessons}
            description="所有排定的課程"
          />
        </div>

        {/* Today's Lessons */}
        <LessonList lessons={todayLessons} title="今日課程" />

        {/* Teaching Heatmap */}
        <div className="border rounded-lg p-6">
          <TeachingHeatmap data={heatmapData} year={new Date().getFullYear()} />
        </div>

        {/* Students List */}
        <StudentList students={students} />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/tutor/schedule">
            <Button variant="outline" className="w-full h-20 text-lg">
              📅 排程新課程
            </Button>
          </Link>
          <Link href="/tutor/students">
            <Button variant="outline" className="w-full h-20 text-lg">
              👥 管理學生
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

