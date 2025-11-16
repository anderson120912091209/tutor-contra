import { createClient } from "@/lib/supabase/server";
import type { ParentProfile } from "@/lib/types/database";

export async function getParentProfile(userId: string): Promise<ParentProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parent_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function createParentProfile(profile: {
  user_id: string;
  name: string;
}): Promise<ParentProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parent_profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error("Error creating parent profile:", error);
    return null;
  }
  return data;
}

export async function getPendingConfirmations(parentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(`
      *,
      student:students(*),
      tutor:tutor_profiles(display_name),
      confirmation:lesson_confirmations(*)
    `)
    .eq("students.parent_id", parentId)
    .eq("status", "completed")
    .or("parent_confirmed.eq.false,parent_confirmed.is.null", {
      referencedTable: "lesson_confirmations",
    })
    .order("scheduled_start_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending confirmations:", error);
    return [];
  }

  return data as any;
}

export async function getParentLessonHistory(parentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(`
      *,
      student:students(*),
      tutor:tutor_profiles(display_name),
      confirmation:lesson_confirmations(*)
    `)
    .eq("students.parent_id", parentId)
    .eq("lesson_confirmations.final_status", "verified")
    .order("scheduled_start_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching lesson history:", error);
    return [];
  }

  return data as any;
}


