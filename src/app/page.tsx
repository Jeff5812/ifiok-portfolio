"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import { useChat } from "@/context/ChatContext";

export default function Home() {
  const { openChat } = useChat();

  return (
    <main>
      <Header onOpenChat={openChat} />
      <Hero onOpenChat={openChat} />
      <ProjectsSection onOpenChat={openChat} featuredOnly showViewAll />
      <Skills />
      <Services onOpenChat={openChat} featuredOnly showViewAll />
      <Footer />
    </main>
  );
}
