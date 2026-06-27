import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type LeadPayload = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<LeadPayload> | null;
  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const projectType = (body?.projectType || "").trim();
  const message = (body?.message || "").trim();

  if (!name || !email || !projectType || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Lead capture is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const insert = await supabase.from("leads").insert({
    name,
    email,
    project_type: projectType,
    message,
  });

  if (insert.error) {
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, message }),
      });
    } catch {
      // no-op: lead is already stored in Supabase
    }
  }

  return NextResponse.json({ ok: true });
}

