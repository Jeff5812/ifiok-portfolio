import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";
import GlobalChat from "@/components/chat/GlobalChat";

export const metadata: Metadata = {
  title: "Ifiok Columba: Automation Engineer",
  description:
    "I design and build intelligent workflows, AI agents, and integrations that help businesses operate smarter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base text-ink">
        <ChatProvider>
          {children}
          <GlobalChat />
        </ChatProvider>
      </body>
    </html>
  );
}
