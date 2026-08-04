export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  problem: string;
  solution: string;
  outcome: string;
  // Drop a Canva/Figma export or a screenshot of the live n8n canvas here:
  // public/projects/<slug>.png, shown automatically if the file exists.
  screenshot: string;
  demoInChat: boolean; // if true, "Try it in the chat" button appears on the card
  featured: boolean; // if true, shows on the homepage; all projects show on /projects
};

export const projects: Project[] = [
  {
    slug: "lab-result-followup",
    title: "Clinic Lab Result Follow-Up & Escalation System",
    tagline:
      "Closes the loop between a lab result and a patient actually being seen, automatically.",
    stack: ["n8n", "PostgreSQL", "Gmail API", "Webhooks"],
    problem:
      "Clinics were losing track of patients between a lab result being ready and the patient coming back in, especially critical results, where a missed follow-up is a real safety risk. Nothing tracked who had been notified, who had confirmed, and who needed a community health worker to step in.",
    solution:
      "A form captures each result the moment it's recorded, validates and cleans the data (email format, phone formatting, disposable-domain checks), then branches by urgency. Critical results trigger immediate patient + clinician emails and a fast reminder cadence (2h → 6h → 24h); routine results get a slower cadence (6h → 24h → 48h). Every reminder carries a one-click confirmation link. If a patient still hasn't confirmed after the final reminder, the assigned community health worker is automatically escalated with a one-click 'mark as followed up' link, so nothing falls through the cracks.",
    outcome:
      "Every result now has an audit trail: logged, notified, reminded, confirmed or escalated, with timestamps at each stage, no spreadsheet, no manual chasing.",
    screenshot: "/projects/lab-result-followup.png",
    demoInChat: true,
    featured: true,
  },
  {
    slug: "micro-lending-collection",
    title: "Autonomous Micro-Lending Collection System",
    tagline:
      "AI-scored risk tiers route every overdue loan to the right channel automatically, reminder, restructuring offer, or legal referral.",
    stack: ["n8n", "PostgreSQL", "Gemini (AI agent)", "Twilio", "WhatsApp API", "Gmail API"],
    problem:
      "Collections staff were manually reviewing every delinquent account each day to decide whether it needed a reminder, a restructuring offer, or legal escalation, slow, inconsistent, and impossible to scale as the loan book grew.",
    solution:
      "A daily job pulls every delinquent, not-yet-contacted account with its message history, and an AI agent scores each one for risk tier (low/medium/high) and sentiment with a confidence score. Anything below a 0.6 confidence threshold is pulled out for human review instead of being auto-actioned. The rest route automatically: low risk gets an SMS reminder, medium risk gets a WhatsApp restructuring offer with a self-service payment link, and high risk gets a compiled legal referral packet emailed for review. The payment link leads to a page where a customer can confirm payment, which clears their delinquent status and closes the loop, no manual updating required. Every decision and action is logged, and a daily summary email reports totals by risk tier, channel, and average AI confidence.",
    outcome:
      "A fully autonomous daily collections run: AI does the triage, low-confidence edge cases are routed to a human instead of guessed at, and every account gets the right touch without anyone reviewing the full delinquent list by hand.",
    screenshot: "/projects/micro-lending-collection.png",
    demoInChat: true,
    featured: true,
  },
];
