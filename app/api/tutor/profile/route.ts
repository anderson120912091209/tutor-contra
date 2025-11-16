import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const educationSchema = z.object({
  university: z.string(),
  universityId: z.string(),
  degree: z.string(),
  major: z.string(),
  startYear: z.number(),
  endYear: z.number().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
});

const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  threads: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

const galleryPhotoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
});

const updateProfileSchema = z.object({
  display_name: z.string().min(1, "顯示名稱為必填"),
  bio: z.string().nullable().optional(),
  subjects: z.array(z.string()).optional(),
  location: z.string().nullable().optional(),
  teaches_online: z.boolean().optional(),
  years_experience: z.number().nullable().optional(),
  education: z.array(educationSchema).optional(),
  avatar_photo_url: z.string().nullable().optional(),
  gallery_photos: z.array(galleryPhotoSchema).optional(),
  gallery_display_style: z.enum(["carousel", "grid", "hidden"]).optional(),
  social_links: socialLinksSchema.optional(),
  public_slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小寫字母、數字和連字號")
    .optional(),
});

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
    const validatedData = updateProfileSchema.parse(body);

    // Clean up social links - remove empty strings
    const cleanSocialLinks = validatedData.social_links
      ? Object.fromEntries(
          Object.entries(validatedData.social_links).filter(([_, value]) => value && value.trim() !== "")
        )
      : {};

    const { data, error } = await supabase
      .from("tutor_profiles")
      .update({
        display_name: validatedData.display_name,
        bio: validatedData.bio ?? null,
        subjects: validatedData.subjects || [],
        location: validatedData.location ?? null,
        teaches_online: validatedData.teaches_online ?? false,
        years_experience: validatedData.years_experience ?? null,
        education: validatedData.education || [],
        avatar_photo_url: validatedData.avatar_photo_url ?? null,
        gallery_photos: validatedData.gallery_photos || [],
        gallery_display_style: validatedData.gallery_display_style || "carousel",
        social_links: cleanSocialLinks,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
