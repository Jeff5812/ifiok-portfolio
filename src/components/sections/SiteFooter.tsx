import Link from "next/link";
import { profile } from "@/content/profile";

const CONTENT_GROUPS = [
  {
    title: "Build",
    links: [
      { label: "Featured work", href: "/#work" },
      { label: "All projects", href: "/projects" },
      { label: "Journey & milestones", href: "/#journey" },
      { label: "Now building", href: "/#now" },
    ],
  },
];

// Built dynamically so a missing social link (e.g. LinkedIn, not added yet)
// is simply omitted rather than pointing at a placeholder URL.
function getConnectLinks() {
  const links: { label: string; href: string }[] = [
    { label: "Email", href: profile.social.email },
    { label: "GitHub", href: profile.social.github },
  ];
  if (profile.social.linkedin) {
    links.push({ label: "LinkedIn", href: profile.social.linkedin });
  }
  if (profile.social.twitter) {
    links.push({ label: "X / Twitter", href: profile.social.twitter });
  }
  return links;
}

export default function SiteFooter() {
  const connectLinks = getConnectLinks();

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:max-w-md sm:gap-8">
          {CONTENT_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="label-mono text-ink-soft mb-4">{group.title}</p>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/80 hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label-mono text-ink-soft mb-4">Connect</p>
            <ul className="flex flex-col gap-2.5">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/80 hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-line pt-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-status-live" aria-hidden />
            <p className="label-mono text-ink-soft">All systems building.</p>
          </div>
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {profile.name}. Designed &amp; built from scratch.
          </p>
        </div>
      </div>
    </footer>
  );
}
