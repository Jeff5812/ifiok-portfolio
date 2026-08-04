"use client";

import { useChat } from "@/context/ChatContext";
import ChatWidget from "./ChatWidget";
import ChatTrigger from "./ChatTrigger";

export default function GlobalChat() {
  const { open, intent, closeChat, toggleChat } = useChat();
  return (
    <>
      <ChatWidget open={open} onClose={closeChat} intent={intent} />
      <ChatTrigger open={open} onClick={toggleChat} />
    </>
  );
}
