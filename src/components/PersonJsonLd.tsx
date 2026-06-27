import { profile } from "@/content/profile";

const siteUrl = "https://ifiokcolumba.dev";

export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role,
    description: profile.seoDescription,
    sameAs: [profile.social.github, profile.social.linkedin, profile.social.twitter].filter(
      (url): url is string => Boolean(url)
    ),
    knowsAbout: [
      "AI automation",
      "n8n",
      "AI agents",
      "Workflow automation",
      "Next.js",
      "Full-stack development",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
