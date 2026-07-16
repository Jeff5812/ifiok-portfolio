import { NextResponse } from "next/server";

type LeadPayload = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<LeadPayload> | null;
  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const projectType = (body?.projectType || "").trim();
  const message = (body?.message || "").trim();

  if (!name || !email || !projectType || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Lead capture is not configured. Set N8N_WEBHOOK_URL." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, projectType, message }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("n8n webhook returned non-ok status:", res.status, text);
      return NextResponse.json({ error: "Failed to submit lead to webhook." }, { status: 500 });
    }
  } catch (err) {
    console.error("n8n webhook request failed:", err);
    return NextResponse.json({ error: "Failed to submit lead to webhook." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
