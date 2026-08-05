import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";
import GlobalChat from "@/components/chat/GlobalChat";

// Actual font files, loaded and self-hosted by Next at build time — replaces
// the old setup where "Inter" / "JetBrains Mono" were named in CSS but never
// loaded, so every visitor was silently seeing their OS default font instead.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ifiok Columba: Automation Engineer",
  description:
    "I design and build intelligent workflows, AI agents, and integrations that help businesses operate smarter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-base text-ink">
        <ChatProvider>
          {children}
          <GlobalChat />
        </ChatProvider>
      </body>
    </html>
  );
}
