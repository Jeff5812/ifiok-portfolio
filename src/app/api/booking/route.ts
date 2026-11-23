// "Book a call" from the assistant. Sends the visitor's details by email through Resend, the same
// setup the previous site used: RESEND_API_KEY and BOOKING_NOTIFY_EMAIL. Unlike before, a failure is
// reported to the visitor instead of being swallowed, so no lead is silently lost.
const NOTIFY = process.env.BOOKING_NOTIFY_EMAIL || "wizicolumba@gmail.com";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function field(body: Record<string, unknown>, key: string, max: number): string | null {
  const v = body[key];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t && t.length <= max ? t : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // A hidden field real visitors never fill in.
  if (typeof body.company === "string" && body.company) return Response.json({ ok: true });

  const name = field(body, "name", 120);
  const email = field(body, "email", 200);
  const projectType = field(body, "projectType", 160) ?? "Not specified";
  const message = field(body, "message", 3000) ?? "";
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A name and a valid email are required." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "Email isn't configured." }, { status: 503 });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [NOTIFY],
        reply_to: email,
        subject: `New enquiry from ${name}`,
        html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
<h2 style="margin:0 0 12px">New enquiry from the portfolio assistant</h2>
<p><strong>Name:</strong> ${escape(name)}<br><strong>Email:</strong> ${escape(email)}<br><strong>Project:</strong> ${escape(projectType)}</p>
<p>${escape(message).replace(/\n/g, "<br>")}</p>
</div>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("booking: resend", res.status, (await res.text()).slice(0, 300));
      return Response.json({ error: "Sending failed." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("booking: failed", err instanceof Error ? err.name : "unknown");
    return Response.json({ error: "Sending failed." }, { status: 502 });
  }
}
