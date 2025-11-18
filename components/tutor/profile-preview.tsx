import type { TutorProfile } from "@/lib/types/database";
import { PublicProfileLayout } from "@/components/tutor/public-profile-layout";

interface ProfilePreviewProps {
  profile: TutorProfile;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  // Since this is a preview component used in the editor, we mock the stats/data
  // In a real scenario, these could be passed in or fetched if needed, 
  // but for visual preview of profile changes, static placeholders or existing profile data is usually fine.
  
  const mockStats = {
    total_verified_hours: 0,
    active_students_count: 0,
    average_rating: 0,
    total_lessons: 0,
    verified_lessons: 0,
  };

  // We pass empty heatmap/testimonials/availability for the preview 
  // unless we want to fetch them here too. 
  // Usually the profile editor focuses on bio/education/subjects.
  
  return (
    <div className="min-h-screen bg-[#f9f9f7] font-sans selection:bg-stone-200 text-[#2c2c2c]">
       <PublicProfileLayout 
          tutorProfile={profile}
          stats={mockStats}
          heatmapData={{}}
          testimonials={[]}
          availability={[]}
          isOwner={true} // Always owner in preview mode
       />
    </div>
  );
}
