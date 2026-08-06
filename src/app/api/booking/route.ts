import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Where booking notifications land — your Gmail.
const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || "wizicolumba@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, projectType, message } = data as {
      name?: string;
      email?: string;
      projectType?: string;
      message?: string;
    };

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      // Resend's shared "onboarding@resend.dev" sender works immediately with
      // no domain setup. Swap to a verified domain sender later if you want
      // "from" to show your own domain.
      from: "IC Portfolio <onboarding@resend.dev>",
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New booking request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Project type:</strong> ${escapeHtml(projectType || "Not specified")}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message || "").replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Booking email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
