import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user ID

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/tutor/profile?error=notion_connect_failed", request.url)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/notion/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Save to database
    const supabase = await createClient();
    const { error } = await supabase
      .from("tutor_profiles")
      .update({
        notion_calendar_enabled: true,
        notion_calendar_token: tokens,
        notion_database_id: tokens.workspace_id || null,
      })
      .eq("user_id", state);

    if (error) throw error;

    return NextResponse.redirect(
      new URL("/tutor/profile?success=notion_calendar_connected", request.url)
    );
  } catch (error) {
    console.error("Notion connection error:", error);
    return NextResponse.redirect(
      new URL("/tutor/profile?error=notion_connect_failed", request.url)
    );
  }
}

