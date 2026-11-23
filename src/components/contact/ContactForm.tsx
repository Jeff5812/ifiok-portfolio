"use client";

import { useState } from "react";
import { SITE } from "@/content/site";
import s from "./ContactForm.module.css";

const TYPES = ["An AI product or web app", "A WhatsApp or Telegram assistant", "Workflow automation (n8n)", "A full-time or contract role", "Something else"];

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

/** Posts to /api/booking, the same route the assistant uses. Failures are shown, never swallowed. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries()) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 400) {
        setStatus({ kind: "error", message: "Please add your name and a valid email." });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ kind: "sent", name: (body.name ?? "").split(" ")[0] ?? "" });
    } catch {
      setStatus({ kind: "error", message: `That didn't send, so nothing was delivered. Please email ${SITE.email} instead.` });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className={`glass ${s.done}`} role="status">
        <p className={s.doneTitle}>Thanks{status.name ? `, ${status.name}` : ""}. It&rsquo;s sent.</p>
        <p>I&rsquo;ll reply by email, usually within a day or two.</p>
      </div>
    );
  }

  return (
    <form className={`glass ${s.form}`} onSubmit={onSubmit} noValidate={false}>
      <div className={s.row}>
        <label className={s.field}>
          <span>Your name</span>
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className={s.field}>
          <span>Your email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <label className={s.field}>
        <span>What&rsquo;s it about?</span>
        <select name="projectType" defaultValue={TYPES[0]}>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className={s.field}>
        <span>Tell me a little more</span>
        <textarea name="message" rows={5} maxLength={3000} placeholder="What should it do, and for whom?" />
      </label>
      {/* Real visitors never see or fill this; bots do. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className={s.trap} aria-hidden />
      <div className={s.submit}>
        <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className={s.note} role="status" aria-live="polite">
          {status.kind === "error" ? <span className={s.error}>{status.message}</span> : "I reply to every message."}
        </p>
      </div>
    </form>
  );
}
