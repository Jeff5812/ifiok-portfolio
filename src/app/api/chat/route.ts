import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/components/chat/chatData";

// Uses OpenAI's gpt-4o-mini — cheap enough for a portfolio chatbot's volume
// (fractions of a cent per conversation). Swap the model/endpoint below if
// you'd rather use Gemini or Claude instead.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI is not configured yet." }, { status: 500 });
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Cap history sent to the model to keep costs/latency low.
    const recent = messages.slice(-10);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        temperature: 0.6,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...recent],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return NextResponse.json({ error: "AI request failed" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API failed:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
