import { createClient } from "@/lib/supabase/server";
import type { Lesson, LessonConfirmation } from "@/lib/types/database";

export async function createLesson(lesson: {
  tutor_id: string;
  student_id: string;
  scheduled_start_at: string;
  scheduled_end_at: string;
  notes?: string;
}): Promise<Lesson | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert(lesson)
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error);
    return null;
  }

  // Create initial confirmation record
  await supabase.from("lesson_confirmations").insert({
    lesson_id: data.id,
  });

  return data;
}

export async function updateLessonStatus(
  lessonId: string,
  status: "scheduled" | "completed" | "cancelled"
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({ status })
    .eq("id", lessonId);

  if (error) {
    console.error("Error updating lesson status:", error);
    return false;
  }

  // If marking as completed, update tutor confirmation
  if (status === "completed") {
    await supabase
      .from("lesson_confirmations")
      .update({
        tutor_confirmed: true,
        tutor_confirmed_at: new Date().toISOString(),
      })
      .eq("lesson_id", lessonId);
  }

  return true;
}

export async function confirmLessonByParent(
  lessonId: string,
  confirmed: boolean,
  disputeNote?: string
): Promise<boolean> {
  const supabase = await createClient();

  const updates: any = {
    parent_confirmed: confirmed,
    parent_confirmed_at: new Date().toISOString(),
  };

  if (confirmed) {
    updates.final_status = "verified";
  } else {
    updates.final_status = "disputed";
    if (disputeNote) {
      updates.dispute_note = disputeNote;
    }
  }

  const { error } = await supabase
    .from("lesson_confirmations")
    .update(updates)
    .eq("lesson_id", lessonId);

  if (error) {
    console.error("Error confirming lesson:", error);
    return false;
  }

  return true;
}

export async function getVerifiedLessonsByTutor(
  tutorId: string,
  startDate?: Date,
  endDate?: Date
) {
  const supabase = await createClient();

  let query = supabase
    .from("lessons")
    .select(`
      *,
      lesson_confirmations!inner(final_status)
    `)
    .eq("tutor_id", tutorId)
    .eq("lesson_confirmations.final_status", "verified");

  if (startDate) {
    query = query.gte("scheduled_start_at", startDate.toISOString());
  }
  if (endDate) {
    query = query.lte("scheduled_start_at", endDate.toISOString());
  }

  const { data, error } = await query.order("scheduled_start_at", { ascending: true });

  if (error) {
    console.error("Error fetching verified lessons:", error);
    return [];
  }

  return data;
}

// Get heatmap data for a tutor (count of verified lessons per day)
export async function getTutorHeatmapData(tutorId: string, year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const lessons = await getVerifiedLessonsByTutor(tutorId, startDate, endDate);

  // Group by date
  const heatmapData: { [date: string]: number } = {};

  lessons.forEach((lesson) => {
    const date = new Date(lesson.scheduled_start_at).toISOString().split("T")[0];
    heatmapData[date] = (heatmapData[date] || 0) + 1;
  });

  return heatmapData;
}


