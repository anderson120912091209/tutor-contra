import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete user's tutor profile (if exists)
    // This will cascade delete related data due to foreign key constraints
    await supabase
      .from("tutor_profiles")
      .delete()
      .eq("user_id", user.id);

    // Delete user's parent profile (if exists)
    await supabase
      .from("parent_profiles")
      .delete()
      .eq("user_id", user.id);

    // Delete user's photos from storage
    const { data: files } = await supabase.storage
      .from("tutor-photos")
      .list(user.id);

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${user.id}/${file.name}`);
      await supabase.storage.from("tutor-photos").remove(filePaths);
    }

    // Note: Supabase doesn't allow deleting auth users from client-side
    // You may need to set up a webhook or admin function to delete the auth user
    // For now, we'll just delete the profile data

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

