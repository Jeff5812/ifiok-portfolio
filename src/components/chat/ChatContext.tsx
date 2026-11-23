"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ChatState = {
  open: boolean;
  intent: string | null;
  /** Bumped on every openChat call, so the widget can react to the same intent twice. */
  nonce: number;
  openChat: (intent?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const Ctx = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const openChat = useCallback((next?: string) => {
    setIntent(next ?? null);
    setNonce((n) => n + 1);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);
  const toggleChat = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ open, intent, nonce, openChat, closeChat, toggleChat }),
    [open, intent, nonce, openChat, closeChat, toggleChat],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
