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

  // Points at the n8n "Columba Assistant - Lead Capture" workflow's
  // Webhook node, hosted on Oracle Cloud (see N8N_LEAD_WEBHOOK_URL in .env).
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Lead capture is not configured. Set N8N_LEAD_WEBHOOK_URL." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({ name, email, projectType, message }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("n8n lead webhook returned non-ok status:", res.status, text);
      return NextResponse.json({ error: "Failed to submit lead to webhook." }, { status: 500 });
    }
  } catch (err) {
    console.error("n8n lead webhook request failed:", err);
    return NextResponse.json({ error: "Failed to submit lead to webhook." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
