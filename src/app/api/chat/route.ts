import { assistantPrompt } from "@/lib/assistant-prompt";

// The portfolio assistant. OpenAI, as before, so the existing Vercel environment keeps working:
// OPENAI_API_KEY (required) and OPENAI_MODEL (optional, defaults to the model the old site used).
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_MESSAGES = 10;
const MAX_CHARS = 2000;

type Incoming = { role: "user" | "assistant"; content: string };

function valid(body: unknown): Incoming[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) return null;
  const out: Incoming[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) out.push({ role, content: text });
  }
  const recent = out.slice(-MAX_MESSAGES);
  return recent.length > 0 && recent[recent.length - 1]!.role === "user" ? recent : null;
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "The assistant isn't configured." }, { status: 503 });

  let messages: Incoming[] | null = null;
  try {
    messages = valid(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return Response.json({ error: "Send at least one user message." }, { status: 400 });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 400,
        messages: [{ role: "system", content: assistantPrompt() }, ...messages],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) {
      console.error("assistant: upstream", res.status, (await res.text()).slice(0, 300));
      return Response.json({ error: "The AI service didn't answer." }, { status: 502 });
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return Response.json({ error: "Empty answer." }, { status: 502 });
    return Response.json({ reply });
  } catch (err) {
    console.error("assistant: failed", err instanceof Error ? err.name : "unknown");
    return Response.json({ error: "The AI service didn't answer." }, { status: 502 });
  }
}
