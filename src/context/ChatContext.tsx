"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextValue = {
  open: boolean;
  intent: string | null;
  openChat: (intent?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<string | null>(null);

  function openChat(newIntent?: string) {
    setIntent(newIntent ?? null);
    setOpen(true);
  }
  function closeChat() {
    setOpen(false);
  }
  function toggleChat() {
    setOpen((v) => !v);
  }

  return (
    <ChatContext.Provider value={{ open, intent, openChat, closeChat, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
