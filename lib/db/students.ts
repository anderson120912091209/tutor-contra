import { createClient } from "@/lib/supabase/server";
import type { Student, StudentWithStats } from "@/lib/types/database";

export async function getStudentsByTutor(tutorId: string): Promise<StudentWithStats[]> {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("tutor_id", tutorId)
    .order("active", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !students) {
    console.error("Error fetching students:", error);
    return [];
  }

  // Get stats for each student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      // Get verified lessons for this student
      const { data: verifiedLessons } = await supabase
        .from("lessons")
        .select(`
          *,
          lesson_confirmations!inner(final_status)
        `)
        .eq("student_id", student.id)
        .eq("lesson_confirmations.final_status", "verified");

      // Calculate total verified hours
      const totalVerifiedHours = (verifiedLessons || []).reduce((acc, lesson) => {
        const start = new Date(lesson.scheduled_start_at);
        const end = new Date(lesson.scheduled_end_at);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return acc + hours;
      }, 0);

      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .eq("student_id", student.id);

      return {
        ...student,
        total_verified_hours: Math.round(totalVerifiedHours * 10) / 10,
        total_lessons: totalLessons || 0,
      };
    })
  );

  return studentsWithStats;
}

export async function createStudent(student: {
  tutor_id: string;
  parent_id: string;
  name: string;
  subject?: string;
  level?: string;
}): Promise<Student | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();

  if (error) {
    console.error("Error creating student:", error);
    return null;
  }
  return data;
}


