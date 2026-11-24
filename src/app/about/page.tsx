import type { Metadata } from "next";
import { About, ContactBand } from "@/components/home/Closing";
import Method from "@/components/home/Method";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ifiok Columba is a software and AI automation engineer based in Nigeria who works remotely. His background, how he builds, and his certification.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <About as="h1" />
      <Method />
      <ContactBand />
    </>
  );
}
