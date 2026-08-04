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
        <h1 className="mt-2 font-mono text-3xl font-bold md:text-4xl">
          Every workflow I&apos;ve shipped
        </h1>
        <p className="mt-4 max-w-xl text-inkSoft">
          Two live builds today, more get added here as they ship.
        </p>
      </div>
      <ProjectsSection onOpenChat={openChat} />
      <Footer />
    </main>
  );
}
