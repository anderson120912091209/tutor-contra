import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const availabilitySlotSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_available: z.boolean().optional().default(true),
});

const updateAvailabilitySchema = z.object({
  slots: z.array(availabilitySlotSchema),
});

// GET - Fetch tutor's availability
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get tutor profile
    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    // Get availability slots
    const { data: slots, error } = await supabase
      .from("tutor_availability")
      .select("*")
      .eq("tutor_id", tutorProfile.id)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ slots: slots || [] });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update tutor's availability
export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateAvailabilitySchema.parse(body);

    // Get tutor profile
    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    // Delete existing slots
    await supabase
      .from("tutor_availability")
      .delete()
      .eq("tutor_id", tutorProfile.id);

    // Insert new slots
    if (validatedData.slots.length > 0) {
      const slotsToInsert = validatedData.slots.map((slot) => ({
        tutor_id: tutorProfile.id,
        ...slot,
      }));

      const { error } = await supabase
        .from("tutor_availability")
        .insert(slotsToInsert);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error updating availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

