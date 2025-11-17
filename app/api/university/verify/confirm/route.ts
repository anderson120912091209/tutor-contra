import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyToken, isTokenExpired } from "@/lib/utils/verification-token";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return redirectToOnboarding("error", "缺少驗證 token");
    }

    const supabase = await createClient();

    // Find verification record
    const { data: verifications } = await supabase
      .from("university_verifications")
      .select("*")
      .eq("verified", false);

    if (!verifications || verifications.length === 0) {
      return redirectToOnboarding("error", "找不到驗證記錄");
    }

    // Find matching verification by comparing tokens
    let matchedVerification = null;
    for (const verification of verifications) {
      if (verifyToken(verification.verification_token, token)) {
        matchedVerification = verification;
        break;
      }
    }

    if (!matchedVerification) {
      return redirectToOnboarding("error", "無效的驗證連結");
    }

    // Check if token is expired
    if (isTokenExpired(matchedVerification.token_expires_at)) {
      return redirectToOnboarding("error", "驗證連結已過期，請重新申請驗證");
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from("university_verifications")
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchedVerification.id);

    if (updateError) {
      console.error("Error updating verification:", updateError);
      return redirectToOnboarding("error", "驗證失敗，請稍後再試");
    }

    // The trigger will automatically update tutor_profiles.university_verified
    return redirectToOnboarding("success", "身份驗證成功！");
  } catch (error: any) {
    console.error("Error confirming verification:", error);
    return redirectToOnboarding("error", "伺服器錯誤，請稍後再試");
  }
}

function redirectToOnboarding(status: "success" | "error", message: string) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  // Redirect to tutor profile page (where onboarding is shown)
  // The onboarding component will check for these params
  const url = new URL(`${origin}/tutor/profile`);
  url.searchParams.set("university_verification", status);
  url.searchParams.set("verification_message", encodeURIComponent(message));
  
  return NextResponse.redirect(url.toString());
}

