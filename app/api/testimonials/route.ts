import { createClient } from "@/lib/supabase/server";
import { getParentProfile } from "@/lib/db/parent";
import { createTestimonial } from "@/lib/db/testimonials";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentProfile = await getParentProfile(user.id);
  if (!parentProfile) {
    return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
  }

  const { tutorId, text, rating, isPublic } = await request.json();

  if (!tutorId || !text || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const testimonial = await createTestimonial({
    tutor_id: tutorId,
    parent_id: parentProfile.id,
    text,
    rating,
    is_public: isPublic || false,
  });

  if (!testimonial) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }

  return NextResponse.json({ success: true, testimonial });
}


