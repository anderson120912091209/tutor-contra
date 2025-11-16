import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${
    process.env.NOTION_CLIENT_ID
  }&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/notion/callback`
  )}&state=${user.id}`;

  return NextResponse.redirect(notionAuthUrl);
}

