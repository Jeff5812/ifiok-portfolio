"use client";

import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { useChat } from "@/context/ChatContext";

export default function AboutPage() {
  const { openChat } = useChat();
  return (
    <main>
      <Header onOpenChat={openChat} />
      <About />
      <Footer />
    </main>
  );
}
