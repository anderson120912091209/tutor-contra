import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send university verification email
 */
export async function sendUniversityVerificationEmail(
  email: string,
  token: string,
  universityName: string
): Promise<{ success: boolean; error?: string }> {
  // If Resend API key is not set, use Supabase email as fallback
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, using Supabase email fallback");
    return sendViaSupabase(email, token, universityName);
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/university/verify/confirm?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: "PinPin 家教平台 <onboarding@resend.dev>", // Update with your verified domain
      to: email,
      subject: `驗證您的 ${universityName} 身份`,
      html: getVerificationEmailTemplate(universityName, verificationUrl),
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message || "發送 email 失敗" };
  }
}

/**
 * Fallback: Send via Supabase Auth email
 */
async function sendViaSupabase(
  email: string,
  token: string,
  universityName: string
): Promise<{ success: boolean; error?: string }> {
  // This would require setting up Supabase email templates
  // For now, return an error suggesting to set up Resend
  return {
    success: false,
    error: "請設定 RESEND_API_KEY 環境變數以發送驗證 email",
  };
}

/**
 * Email template in Traditional Chinese
 */
function getVerificationEmailTemplate(
  universityName: string,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>驗證大學身份</title>
</head>
<body style="font-family: 'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif; line-height: 1.6; color: #373737; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: white; border-radius: 8px; padding: 40px; border: 1px solid #e5e7eb;">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #373737; margin: 0; font-size: 24px;">PinPin 家教平台</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #373737; font-size: 20px; margin-top: 0;">驗證您的 ${universityName} 身份</h2>
    
    <p style="color: #737373; font-size: 16px;">
      感謝您使用 PinPin 家教平台！為了驗證您的 ${universityName} 身份，請點擊下方的按鈕：
    </p>

    <!-- Verification Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" 
         style="display: inline-block; background-color: #373737; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
        驗證身份
      </a>
    </div>

    <!-- Alternative Link -->
    <p style="color: #737373; font-size: 14px; margin-top: 30px;">
      如果按鈕無法點擊，請複製以下連結到瀏覽器：
    </p>
    <p style="color: #737373; font-size: 12px; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 4px;">
      ${verificationUrl}
    </p>

    <!-- Expiry Notice -->
    <p style="color: #737373; font-size: 14px; margin-top: 30px;">
      <strong>注意：</strong>此驗證連結將在 24 小時後過期。
    </p>

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="color: #737373; font-size: 12px; margin: 0;">
        此為系統自動發送的 email，請勿回覆。<br>
        © 2024 PinPin 家教平台
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

