"use client";

import { useChat } from "./ChatContext";

/** Opens the assistant, optionally straight into a project ("project:<slug>") or a booking ("booking"). */
export default function AskButton({
  intent,
  className = "btn btn-ghost",
  children,
}: {
  intent?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openChat } = useChat();
  return (
    <button type="button" className={className} onClick={() => openChat(intent)}>
      {children}
    </button>
  );
}
