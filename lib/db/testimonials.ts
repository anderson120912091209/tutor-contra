import { createClient } from "@/lib/supabase/server";
import type { Testimonial, TestimonialWithParent } from "@/lib/types/database";

export async function createTestimonial(testimonial: {
  tutor_id: string;
  parent_id: string;
  text: string;
  rating: number;
  is_public: boolean;
}): Promise<Testimonial | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert(testimonial)
    .select()
    .single();

  if (error) {
    console.error("Error creating testimonial:", error);
    return null;
  }
  return data;
}

export async function getPublicTestimonialsByTutor(
  tutorId: string
): Promise<TestimonialWithParent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(`
      *,
      parent:parent_profiles(name)
    `)
    .eq("tutor_id", tutorId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return data as any;
}

export async function getTestimonialsByTutor(tutorId: string): Promise<TestimonialWithParent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(`
      *,
      parent:parent_profiles(name)
    `)
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return data as any;
}


