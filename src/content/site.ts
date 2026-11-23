// Everything about the person and the site in one place. Edit here; pages read from it.

export const SITE = {
  name: "Ifiok Columba",
  role: "Software & AI automation engineer",
  url: "https://ifiok-portfolio.vercel.app",
  location: "Nigeria (WAT, UTC+1)",
  availability: "Open to remote roles and selected freelance projects",
  email: "wizicolumba@gmail.com",
  links: {
    github: "https://github.com/Jeff5812",
    x: "https://x.com/rust_automates",
    upwork: "https://www.upwork.com/freelancers/~01c94dc22db54d989f",
    source: "https://github.com/Jeff5812/ifiok-portfolio",
  },
  /** Shown in the footer and the Now section. Bump when the content changes. */
  revised: "2026-11-24",
  description:
    "Ifiok Columba is a software and AI automation engineer building AI-powered products, agents and workflows where the AI suggests and the code makes sure it is right. Case studies, live demos and an AI assistant.",
} as const;

export type NowItem = {
  date: string;
  state: "ok" | "warn" | "flow";
  stateLabel: string;
  title: string;
  body: string;
  href?: string;
};

// Only things that are documented in the repositories, with the date they happened.
export const NOW: NowItem[] = [
  {
    date: "2026-11-21",
    state: "ok",
    stateLabel: "Shipped",
    title: "Chat Receipt: who is who, and what's really been paid",
    body:
      "The WhatsApp channel now works out which side of a deal the customer is on, remembers the people they trade with by phone number rather than by name, and treats “I've paid” as a claim until the customer says the money arrived. The other party can confirm a record through a wa.me link.",
    href: "/projects/chat-receipt",
  },
  {
    date: "Next",
    state: "flow",
    stateLabel: "In progress",
    title: "Matching payment claims against bank statements",
    body:
      "Chat Receipt deliberately never claims to verify a payment. Checking claims against real statements is the next step, once there are real statements to build it from.",
  },
  {
    date: "2026-11-24",
    state: "ok",
    stateLabel: "Shipped",
    title: "This site, rebuilt",
    body:
      "New design, every project in full with its case study, a live demo of the collections router's decision logic, and the AI assistant back, now grounded in the real project data.",
  },
];
