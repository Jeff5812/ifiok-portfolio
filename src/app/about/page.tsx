import type { Metadata } from "next";
import { About, ContactBand } from "@/components/home/Closing";
import Method from "@/components/home/Method";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ifiok Columba is a software and AI automation engineer based in Nigeria, working remotely: background, how he builds, certification and what he's working on now.",
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
