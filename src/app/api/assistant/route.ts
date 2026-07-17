import { NextResponse } from "next/server";

// All assistant logic (intent routing, demo calculations, AI Q&A) now lives
// in the n8n workflow "Columba Assistant - Chat", hosted on Oracle Cloud.
// This route is a thin, rate-limited proxy so the n8n webhook URL and any
// future auth header never reach the browser.

const MAX_REQUESTS_PER_WINDOW = 15;
const WINDOW_MS = 60_000;

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
    return { ok: true as const };
  }
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { ok: false as const, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true as const };
}

export async function POST(req: Request) {
  const key = getClientKey(req);
  const limited = rateLimit(key);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": Math.ceil((limited.retryAfterMs ?? 0) / 1000).toString() } },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { message?: string; history?: Array<{ role: "user" | "assistant"; content: string }>; context?: string }
    | null;

  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Assistant is not configured. Set N8N_CHAT_WEBHOOK_URL." },
      { status: 503 },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        message,
        history: body?.history ?? [],
        context: body?.context ?? null,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("n8n chat webhook error:", res.status, text);
      return NextResponse.json({ error: "Assistant request failed." }, { status: 502 });
    }

    const data = (await res.json().catch(() => null)) as { content?: string } | null;
    if (!data?.content) {
      return NextResponse.json({ error: "Assistant returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ content: data.content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("n8n chat webhook request failed:", message);
    return NextResponse.json({ error: "Assistant is temporarily unavailable." }, { status: 500 });
  }
}
