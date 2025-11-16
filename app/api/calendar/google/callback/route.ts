import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user ID

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/tutor/profile?error=calendar_connect_failed", request.url)
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get primary calendar ID
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const calendarList = await calendar.calendarList.list();
    const primaryCalendar = calendarList.data.items?.find((cal) => cal.primary);

    // Save to database
    const supabase = await createClient();
    const { error } = await supabase
      .from("tutor_profiles")
      .update({
        google_calendar_enabled: true,
        google_calendar_token: tokens,
        google_calendar_id: primaryCalendar?.id || "primary",
      })
      .eq("user_id", state);

    if (error) throw error;

    return NextResponse.redirect(
      new URL("/tutor/profile?success=google_calendar_connected", request.url)
    );
  } catch (error) {
    console.error("Google Calendar connection error:", error);
    return NextResponse.redirect(
      new URL("/tutor/profile?error=calendar_connect_failed", request.url)
    );
  }
}

