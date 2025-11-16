import { getTutorProfileBySlug, getTutorStats } from "@/lib/db/tutor";
import { getPublicTestimonialsByTutor } from "@/lib/db/testimonials";
import { getTutorHeatmapData } from "@/lib/db/lessons";
import { notFound } from "next/navigation";
import { TeachingHeatmap } from "@/components/tutor/teaching-heatmap";
import { EducationDisplay } from "@/components/tutor/education-display";
import { SocialLinksDisplay } from "@/components/tutor/social-links-display";
import { PhotoGalleryDisplay } from "@/components/tutor/photo-gallery-display";
import { AvailabilityDisplay } from "@/components/tutor/availability-display";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

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

  const [stats, heatmapData, testimonials, availabilityData] = await Promise.all([
    getTutorStats(tutorProfile.id),
    getTutorHeatmapData(tutorProfile.id, new Date().getFullYear()),
    getPublicTestimonialsByTutor(tutorProfile.id),
    supabase
      .from("tutor_availability")
      .select("*")
      .eq("tutor_id", tutorProfile.id)
      .eq("is_available", true),
  ]);

  const availability = availabilityData.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simple Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← 返回首頁
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            {tutorProfile.avatar_photo_url && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg mb-4">
                <Image
                  src={tutorProfile.avatar_photo_url}
                  alt={tutorProfile.display_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Name & Social */}
            <h1 className="text-4xl font-bold mb-3">{tutorProfile.display_name}</h1>
            
            {tutorProfile.social_links && (
              <div className="mb-4">
                <SocialLinksDisplay socialLinks={tutorProfile.social_links} />
              </div>
            )}

            {/* Subjects */}
            {tutorProfile.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {tutorProfile.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground mb-6">
              {tutorProfile.location && (
                <div className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{tutorProfile.location}</span>
                </div>
              )}
              {tutorProfile.years_experience && (
                <div className="flex items-center gap-1.5">
                  <span>👨‍🏫</span>
                  <span>{tutorProfile.years_experience} 年經驗</span>
                </div>
              )}
              {tutorProfile.teaches_online && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  <span>💻</span>
                  <span>線上教學</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {tutorProfile.bio && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {tutorProfile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        {tutorProfile.gallery_photos &&
          tutorProfile.gallery_photos.length > 0 &&
          tutorProfile.gallery_display_style !== "hidden" && (
            <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">相片集</h2>
              <PhotoGalleryDisplay
                photos={tutorProfile.gallery_photos}
                displayStyle={tutorProfile.gallery_display_style}
              />
            </div>
          )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.total_verified_hours || 0}
            </div>
            <div className="text-sm text-muted-foreground">驗證時數</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.total_students || 0}
            </div>
            <div className="text-sm text-muted-foreground">學生數</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.average_rating ? stats.average_rating.toFixed(1) : "-"}
            </div>
            <div className="text-sm text-muted-foreground">平均評分</div>
          </div>
        </div>

        {/* Availability */}
        {availability.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">可預約時間</h2>
            <AvailabilityDisplay availability={availability} />
          </div>
        )}

        {/* Teaching Heatmap */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">教學記錄</h2>
          <TeachingHeatmap data={heatmapData} year={new Date().getFullYear()} />
        </div>

        {/* Education */}
        {tutorProfile.education && tutorProfile.education.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">學歷背景</h2>
            <EducationDisplay education={tutorProfile.education} />
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">學生評價</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-muted-foreground mb-2">{testimonial.content}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">
                      {"★".repeat(testimonial.rating)}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(testimonial.created_at).toLocaleDateString("zh-TW")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
