import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { validateEmailDomain } from "@/lib/utils/university-email-validator";
import { generateVerificationToken, hashToken, getTokenExpiryDate } from "@/lib/utils/verification-token";
import { sendUniversityVerificationEmail } from "@/lib/email/send-verification-email";
import { z } from "zod";

const initiateSchema = z.object({
  universityId: z.string().min(1),
  universityName: z.string().min(1),
  universityWebsite: z.string().optional(),
  email: z.string().email("請輸入有效的 email 地址"),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      );
    }

    // Get tutor profile
    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!tutorProfile) {
      return NextResponse.json(
        { error: "找不到教師檔案" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = initiateSchema.parse(body);

    // Validate email domain matches university
    const domainValidation = await validateEmailDomain(
      validated.email,
      validated.universityName,
      validated.universityWebsite
    );

    if (!domainValidation.valid) {
      return NextResponse.json(
        { error: domainValidation.error || "Email 域名驗證失敗" },
        { status: 400 }
      );
    }

    // Check if there's an existing pending verification
    const { data: existingVerification } = await supabase
      .from("university_verifications")
      .select("*")
      .eq("tutor_id", tutorProfile.id)
      .eq("university_id", validated.universityId)
      .eq("verified", false)
      .gt("token_expires_at", new Date().toISOString())
      .single();

    // Generate new token
    const token = generateVerificationToken();
    const hashedToken = hashToken(token);
    const expiresAt = getTokenExpiryDate();

    if (existingVerification) {
      // Update existing verification
      const { error: updateError } = await supabase
        .from("university_verifications")
        .update({
          verification_email: validated.email,
          verification_token: hashedToken,
          token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingVerification.id);

      if (updateError) {
        console.error("Error updating verification:", updateError);
        return NextResponse.json(
          { error: "更新驗證記錄失敗" },
          { status: 500 }
        );
      }
    } else {
      // Create new verification
      const { error: insertError } = await supabase
        .from("university_verifications")
        .insert({
          tutor_id: tutorProfile.id,
          university_id: validated.universityId,
          university_name: validated.universityName,
          verification_email: validated.email,
          verification_token: hashedToken,
          token_expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error("Error creating verification:", insertError);
        return NextResponse.json(
          { error: "建立驗證記錄失敗" },
          { status: 500 }
        );
      }
    }

    // Send verification email
    const emailResult = await sendUniversityVerificationEmail(
      validated.email,
      token, // Send plain token, not hashed
      validated.universityName
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || "發送驗證 email 失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "驗證 email 已發送到您的學校信箱",
    });
  } catch (error: any) {
    console.error("Error initiating verification:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "輸入資料無效" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}

