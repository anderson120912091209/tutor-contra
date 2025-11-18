"use server";

import { createClient } from "@/lib/supabase/server";
import { ProfileBlock, ProfileVisibility } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function updateProfileBlocks(tutorId: string, blocks: ProfileBlock[]) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("tutor_profiles")
    .update({ 
      profile_blocks: blocks,
      updated_at: new Date().toISOString()
    })
    .eq("id", tutorId);

  if (error) {
    console.error("Error updating profile blocks:", error);
    throw new Error("Failed to update profile blocks");
  }

  revalidatePath("/t/[slug]", "page");
}

export async function updateProfileVisibility(tutorId: string, visibility: ProfileVisibility) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("tutor_profiles")
    .update({ 
      visibility,
      updated_at: new Date().toISOString()
    })
    .eq("id", tutorId);

  if (error) {
    console.error("Error updating profile visibility:", error);
    throw new Error("Failed to update profile visibility");
  }

  revalidatePath("/t/[slug]", "page");
}
