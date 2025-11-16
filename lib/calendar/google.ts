import { google } from "googleapis";
import type { CalendarTokens } from "@/lib/types/database";

export async function createGoogleCalendarEvent(
  tokens: CalendarTokens,
  calendarId: string,
  event: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
  }
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.start,
        timeZone: "Asia/Taipei",
      },
      end: {
        dateTime: event.end,
        timeZone: "Asia/Taipei",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
          { method: "email", minutes: 60 },
        ],
      },
    },
  });

  return response.data.id;
}

export async function updateGoogleCalendarEvent(
  tokens: CalendarTokens,
  calendarId: string,
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    start?: string;
    end?: string;
    location?: string;
  }
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.patch({
    calendarId: calendarId,
    eventId: eventId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start
        ? {
            dateTime: event.start,
            timeZone: "Asia/Taipei",
          }
        : undefined,
      end: event.end
        ? {
            dateTime: event.end,
            timeZone: "Asia/Taipei",
          }
        : undefined,
    },
  });
}

export async function deleteGoogleCalendarEvent(
  tokens: CalendarTokens,
  calendarId: string,
  eventId: string
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: calendarId,
    eventId: eventId,
  });
}

export async function refreshGoogleToken(refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return {
    access_token: credentials.access_token!,
    refresh_token: credentials.refresh_token || refreshToken,
    expiry_date: credentials.expiry_date!,
  };
}

