import { NextResponse } from "next/server";
import { assistantContextText } from "@/content/assistant-context";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const MAX_REQUESTS_PER_WINDOW = 15;
const WINDOW_MS = 60_000; // 1 minute

type Bucket = { resetAt: number; count: number };
const buckets = new Map<string, Bucket>();

function getClientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(key: string) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now > existing.resetAt) {
    buckets.set(key, { resetAt: now + WINDOW_MS, count: 1 });
    return { ok: true as const, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { ok: false as const, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true as const, remaining: MAX_REQUESTS_PER_WINDOW - existing.count };
}

function strictSystemPrompt() {
  return [
    "You are Columba AI Assistant for a portfolio site.",
    "Your ONLY job is to answer questions about Ifiok Columba's work, skills, stack, journey, availability, and how to get in touch.",
    "Be concise, helpful, and professional. Use the provided SITE CONTEXT as the source of truth.",
    "If asked for anything unrelated (general knowledge, politics, medical, legal, personal data beyond the context, etc.), politely refuse and redirect to portfolio-related help.",
    "Do not invent projects, companies, or achievements.",
    "",
    "SITE CONTEXT:",
    assistantContextText(),
  ].join("\n");
}

async function callOpenAI(messages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content?.trim() || "";
}

async function callGemini(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY (or GOOGLE_API_KEY) is not set");

  const userText = messages
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  const systemText = messages.find((m) => m.role === "system")?.content ?? "";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-1.5-flash"}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemText}\n\n${userText}` }] }],
        generationConfig: { temperature: 0.2 },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

export async function POST(req: Request) {
  const key = getClientKey(req);
  const limited = rateLimit(key);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": Math.ceil(limited.retryAfterMs / 1000).toString() } },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { message?: string; history?: Array<{ role: "user" | "assistant"; content: string }> }
    | null;

  const message = body?.message?.trim();
  const history = body?.history ?? [];

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: strictSystemPrompt() },
    ...history
      .slice(-10)
      .map((m) => ({ role: m.role, content: String(m.content ?? "") }))
      .filter((m) => m.content.trim().length > 0),
    { role: "user", content: message },
  ];

  try {
    const provider = (process.env.ASSISTANT_PROVIDER || "").toLowerCase();
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

    const content =
      provider === "gemini"
        ? await callGemini(messages)
        : provider === "openai"
          ? await callOpenAI(messages)
          : hasOpenAI
            ? await callOpenAI(messages)
            : hasGemini
              ? await callGemini(messages)
              : "";

    if (!content) {
      return NextResponse.json(
        {
          error:
            "Assistant is not configured. Set OPENAI_API_KEY or GEMINI_API_KEY in .env.local.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

