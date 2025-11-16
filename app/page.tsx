import { LandingContent } from "@/components/landing/landing-content";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Determine user role and fetch profile if logged in
  let userRole: "tutor" | "parent" | null = null;
  let profileData = null;

  if (user) {
    // Check if user is a tutor
    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (tutorProfile) {
      userRole = "tutor";
      profileData = tutorProfile;
    } else {
      // Check if user is a parent
      const { data: parentProfile } = await supabase
        .from("parent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (parentProfile) {
        userRole = "parent";
        profileData = parentProfile;
      }
    }
  }

  // Only fetch basic tutor profiles for initial load
  // The modal will load additional data when opened
  const { data: tutors } = await supabase
    .from("tutor_profiles")
    .select("id, display_name, subjects, bio, location, years_experience, teaches_online, public_slug, avatar_photo_url")
    .limit(12);

  // Map to simpler structure
  const tutorsWithData = (tutors || []).map((tutor) => ({
    profile: tutor,
    stats: null, // Will be loaded on-demand
    heatmapData: null,
    testimonials: [],
    availability: [],
  }));

  return (
    <LandingContent 
      initialTutors={tutorsWithData}
      user={user}
      userRole={userRole}
      profileData={profileData}
    />
  );
}

