"use client";

import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";
import { useChat } from "@/context/ChatContext";

export default function ProjectsPage() {
  const { openChat } = useChat();
  return (
    <main>
      <Header onOpenChat={openChat} />
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="label-mono text-brand-from">All projects</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Every workflow I&apos;ve shipped
        </h1>
      </div>
      <ProjectsSection onOpenChat={openChat} />
      <Footer />
    </main>
  );
}
