"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import s from "./CopyEmail.module.css";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className={s.email}>
      <a href={`mailto:${email}`} className={s.emailLink}>
        {email}
      </a>
      <button type="button" className={s.copy} onClick={copy} data-copied={copied}>
        <Icon name={copied ? "check" : "copy"} />
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </div>
  );
}
