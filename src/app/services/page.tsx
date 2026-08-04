"use client";

import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import { useChat } from "@/context/ChatContext";

export default function ServicesPage() {
  const { openChat } = useChat();
  return (
    <main>
      <Header onOpenChat={openChat} />
      <Services onOpenChat={openChat} />
      <Footer />
    </main>
  );
}
