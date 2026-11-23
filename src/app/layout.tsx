import type { Metadata, Viewport } from "next";
// Global CSS first, so component CSS modules can override it.
import "./globals.css";
import { ChatProvider } from "@/components/chat/ChatContext";
import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/site/Footer";
import Interactions from "@/components/site/Interactions";
import Nav from "@/components/site/Nav";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Software & AI Automation Engineer`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en",
    url: SITE.url,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ifiok Columba, Software & AI Automation Engineer" }],
  },
  twitter: { card: "summary_large_image", creator: "@rust_automates", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0e0806",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script marks the document before first paint, so scroll reveals can wait for JS;
    // without JS nothing waits and everything is simply shown.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" href="/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <ChatProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
        </ChatProvider>
        <Interactions />
      </body>
    </html>
  );
}
