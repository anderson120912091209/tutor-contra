import { createClient } from "@/lib/supabase/server";
import { getTutorProfile } from "@/lib/db/tutor";
import { redirect } from "next/navigation";
import { ProfileEditorSplit } from "@/components/tutor/profile-editor-split";

export default async function EditTutorProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const tutorProfile = await getTutorProfile(user.id);

  if (!tutorProfile) {
    redirect("/auth/setup-tutor");
  }

  return <ProfileEditorSplit profile={tutorProfile} />;
}
