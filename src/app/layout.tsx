import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import SiteFooter from "@/components/sections/SiteFooter";
import PersonJsonLd from "@/components/PersonJsonLd";
import ChatWidget from "@/components/assistant/chat-widget";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://ifiokcolumba.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: profile.seoTitle,
    template: `%s · ${profile.shortName}`,
  },
  description: profile.seoDescription,
  keywords: [
    "Ifiok Columba",
    "AI automation engineer",
    "n8n developer",
    "AI agent developer",
    "workflow automation",
    "full-stack developer",
    "Next.js developer",
    "AI automation portfolio",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: profile.seoTitle,
    description: profile.seoDescription,
    siteName: `${profile.name} · Digital HQ`,
  },
  twitter: {
    card: "summary_large_image",
    title: profile.seoTitle,
    description: profile.seoDescription,
    creator: profile.social.twitterHandle,
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <PersonJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-canvas focus:px-4 focus:py-2 focus:rounded-md label-mono"
        >
          Skip to content
        </a>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
