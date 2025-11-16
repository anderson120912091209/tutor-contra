import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();

    // Fetch some tutor profiles to provide context
    const { data: tutors } = await supabase
      .from("tutor_profiles")
      .select("display_name, subjects, bio, location, years_experience, teaches_online")
      .limit(20);

    const tutorContext = tutors
      ? tutors
          .map(
            (t) =>
              `教師: ${t.display_name}, 科目: ${t.subjects?.join(", ")}, 地點: ${t.location}, 經驗: ${t.years_experience}年`
          )
          .join("\n")
      : "";

    const systemMessage = {
      role: "system" as const,
      content: `你是一個專業的家教媒合助理。你的任務是幫助家長找到最適合的家教老師。

當前平台上的部分教師資訊：
${tutorContext}

請用專業、友善且簡潔的方式回答。不要使用表情符號。當家長描述需求時，根據他們的要求（科目、地點、時間、預算等）推薦合適的教師。

回答時請：
1. 簡短且切中要點
2. 專業且友善
3. 如果資訊不足，主動詢問關鍵細節
4. 不要使用表情符號或過於口語化的表達
5. 以繁體中文回應`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Create a custom streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const data = `0:"${content}"\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Error processing chat request", { status: 500 });
  }
}

