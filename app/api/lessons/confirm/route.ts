import { createClient } from "@/lib/supabase/server";
import { confirmLessonByParent } from "@/lib/db/lessons";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, confirmed, disputeNote } = await request.json();

  if (!lessonId || confirmed === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const success = await confirmLessonByParent(lessonId, confirmed, disputeNote);

  if (!success) {
    return NextResponse.json({ error: "Failed to confirm lesson" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}


