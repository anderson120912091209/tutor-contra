import { getTutorProfileBySlug, getTutorStats } from "@/lib/db/tutor";
import { getPublicTestimonialsByTutor } from "@/lib/db/testimonials";
import { getTutorHeatmapData } from "@/lib/db/lessons";
import { notFound } from "next/navigation";
import { VisibilitySettings } from "@/components/tutor/visibility-settings";
import { createClient } from "@/lib/supabase/server";
import { ProfileBlock } from "@/lib/types/database";
import { CopyLinkButton } from "@/components/tutor/copy-link-button";
import { PublicProfileLayout } from "@/components/tutor/public-profile-layout";

export default async function PublicTutorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const tutorProfile = await getTutorProfileBySlug(params.slug);

  if (!tutorProfile) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Privacy Check
  const isOwner = user?.id === tutorProfile.user_id;
  const visibility = tutorProfile.visibility || 'public';

  if (!isOwner) {
    if (visibility === 'private') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9f7]">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-2">此個人檔案目前不公開</h1>
            <p className="text-gray-500">該教師目前設定為私人模式</p>
          </div>
        </div>
      );
    }
  }

  const [stats, heatmapData, testimonials, availabilityData, parentAvailabilityData] = await Promise.all([
    getTutorStats(tutorProfile.id),
    getTutorHeatmapData(tutorProfile.id, new Date().getFullYear()),
    getPublicTestimonialsByTutor(tutorProfile.id),
    supabase
      .from("tutor_availability")
      .select("*")
      .eq("tutor_id", tutorProfile.id)
      .eq("is_available", true),
    user ? supabase
      .from("parent_availability")
      .select("*")
      .in("parent_id", (await supabase.from("parent_profiles").select("id").eq("user_id", user.id)).data?.map(p => p.id) || [])
      : Promise.resolve({ data: undefined }),
  ]);

  const availability = availabilityData.data || [];
  const parentAvailability = parentAvailabilityData.data || undefined;

  return (
    <div className="min-h-screen bg-[#f9f9f7] font-sans selection:bg-stone-200 text-[#2c2c2c]">
      {/* Navigation / Controls */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 pointer-events-none">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          <a href="/" className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-sm hover:bg-white transition-all">
            ← 返回首頁
          </a>
          
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur p-1 rounded-lg shadow-sm border border-gray-200">
             {isOwner && (
               <>
                 <VisibilitySettings tutorId={tutorProfile.id} initialVisibility={visibility} />
                 <div className="w-px h-4 bg-gray-200 mx-1" />
                 <div className="text-[10px] font-mono px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    PREVIEW
              </div>
                 <div className="w-px h-4 bg-gray-200 mx-1" />
               </>
             )}
             <CopyLinkButton />
          </div>
        </div>
      </nav>

      <PublicProfileLayout
        tutorProfile={tutorProfile}
        stats={stats}
        heatmapData={heatmapData}
        testimonials={testimonials}
        availability={availability}
        parentAvailability={parentAvailability}
        isOwner={isOwner}
      />
    </div>
  );
}
