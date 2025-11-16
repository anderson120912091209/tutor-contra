import { Client } from "@notionhq/client";
import type { CalendarTokens } from "@/lib/types/database";

export async function createNotionPage(
  token: CalendarTokens,
  databaseId: string,
  page: {
    title: string;
    description?: string;
    start: string;
    end: string;
    subject?: string;
  }
) {
  const notion = new Client({ auth: token.access_token });

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: page.title,
            },
          },
        ],
      },
      Date: {
        date: {
          start: page.start,
          end: page.end,
          time_zone: "Asia/Taipei",
        },
      },
      ...(page.subject && {
        Subject: {
          rich_text: [
            {
              text: {
                content: page.subject,
              },
            },
          ],
        },
      }),
      ...(page.description && {
        Description: {
          rich_text: [
            {
              text: {
                content: page.description,
              },
            },
          ],
        },
      }),
    },
  });

  return response.id;
}

export async function updateNotionPage(
  token: CalendarTokens,
  pageId: string,
  page: {
    title?: string;
    description?: string;
    start?: string;
    end?: string;
    subject?: string;
  }
) {
  const notion = new Client({ auth: token.access_token });

  const properties: any = {};

  if (page.title) {
    properties.Name = {
      title: [{ text: { content: page.title } }],
    };
  }

  if (page.start && page.end) {
    properties.Date = {
      date: {
        start: page.start,
        end: page.end,
        time_zone: "Asia/Taipei",
      },
    };
  }

  if (page.subject) {
    properties.Subject = {
      rich_text: [{ text: { content: page.subject } }],
    };
  }

  if (page.description) {
    properties.Description = {
      rich_text: [{ text: { content: page.description } }],
    };
  }

  await notion.pages.update({
    page_id: pageId,
    properties,
  });
}

export async function deleteNotionPage(token: CalendarTokens, pageId: string) {
  const notion = new Client({ auth: token.access_token });

  await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
}

