"use client";

import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useChat } from "@/context/ChatContext";

export default function ContactPage() {
  const { openChat } = useChat();
  return (
    <main>
      <Header onOpenChat={openChat} />
      <Contact onOpenChat={openChat} />
      <Footer />
    </main>
  );
}
