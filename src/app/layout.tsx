import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
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
