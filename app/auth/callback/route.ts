import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if user has a profile (tutor or parent)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check for tutor profile
        const { data: tutorProfile } = await supabase
          .from("tutor_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        // Check for parent profile
        const { data: parentProfile } = await supabase
          .from("parent_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        // If no profile exists, redirect to role selection
        if (!tutorProfile && !parentProfile) {
          return NextResponse.redirect(`${origin}/auth/select-role`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}


