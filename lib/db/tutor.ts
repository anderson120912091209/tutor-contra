import { createClient } from "@/lib/supabase/server";
import type { TutorProfile, TutorStats, LessonWithDetails } from "@/lib/types/database";

export async function getTutorProfile(userId: string): Promise<TutorProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getTutorProfileBySlug(slug: string): Promise<TutorProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("public_slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function createTutorProfile(profile: {
  user_id: string;
  display_name: string;
  bio?: string;
  subjects?: string[];
  location?: string;
  teaches_online?: boolean;
  years_experience?: number;
  public_slug: string;
}): Promise<TutorProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tutor_profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error("Error creating tutor profile:", error);
    return null;
  }
  return data;
}

export async function updateTutorProfile(
  userId: string,
  updates: Partial<TutorProfile>
): Promise<TutorProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tutor_profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function getTutorStats(tutorId: string): Promise<TutorStats> {
  const supabase = await createClient();

  // Get verified lessons with duration
  const { data: verifiedLessons } = await supabase
    .from("lessons")
    .select(`
      *,
      lesson_confirmations!inner(final_status)
    `)
    .eq("tutor_id", tutorId)
    .eq("lesson_confirmations.final_status", "verified");

  // Calculate total verified hours
  const totalVerifiedHours = (verifiedLessons || []).reduce((acc, lesson) => {
    const start = new Date(lesson.scheduled_start_at);
    const end = new Date(lesson.scheduled_end_at);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return acc + hours;
  }, 0);

  // Get active students count
  const { count: activeStudentsCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", tutorId)
    .eq("active", true);

  // Get average rating from public testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("rating")
    .eq("tutor_id", tutorId)
    .eq("is_public", true);

  const averageRating =
    testimonials && testimonials.length > 0
      ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
      : 0;

  // Get total lessons
  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", tutorId);

  return {
    total_verified_hours: Math.round(totalVerifiedHours * 10) / 10,
    active_students_count: activeStudentsCount || 0,
    average_rating: Math.round(averageRating * 10) / 10,
    total_lessons: totalLessons || 0,
    verified_lessons: verifiedLessons?.length || 0,
  };
}

export async function getTodayLessons(tutorId: string): Promise<LessonWithDetails[]> {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("lessons")
    .select(`
      *,
      student:students(*),
      confirmation:lesson_confirmations(*)
    `)
    .eq("tutor_id", tutorId)
    .gte("scheduled_start_at", today.toISOString())
    .lt("scheduled_start_at", tomorrow.toISOString())
    .order("scheduled_start_at", { ascending: true });

  if (error) {
    console.error("Error fetching today's lessons:", error);
    return [];
  }

  return data as any;
}


