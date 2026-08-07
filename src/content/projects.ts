export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  problem: string;
  // Card-level summary. Kept short on purpose — full narrative lives in `caseStudy`.
  solution: string;
  outcome: string;
  // 4-6 short, concrete bullets shown on the card. Pull these straight from
  // what the workflow actually does, not aspirational copy.
  keyFeatures: string[];
  // Drop a Canva/Figma export or a screenshot of the live n8n canvas here:
  // public/projects/<slug>.png, shown automatically if the file exists.
  screenshot: string;
  demoInChat: boolean; // if true, shows a "chat about this project" button on the card
  featured: boolean; // if true, shows on the homepage; all projects show on /projects
  // Full technical writeup, rendered at /projects/[slug]. Optional — a project
  // without one just won't get a "Read case study" link.
  caseStudy?: {
    projectStatus: string; // honest, roadmap-framed statement of current stage
    architecture: string; // 2-4 short paragraphs walking the request/data path end to end
    decisions: string[]; // engineering decisions and why, one per bullet
    challenges: string[]; // specific problems hit and how they were solved
    errorHandling: string[]; // what happens when a step fails
    retryStrategy: string[]; // waits, re-checks, escalation timing
    security: string[]; // input validation, data handling, access
    whatWorkedWell: string;
    biggestChallenge: string;
    futureImprovements: string[]; // roadmap-framed next milestones, not apologies
  };
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
      "I built an intake step that validates and logs each result, then splits critical and non-critical results into two separate reminder schedules, each ending in an automatic escalation to a community health worker if the patient never confirms.",
    keyFeatures: [
      "Checks and cleans every lab result as soon as it comes in, before it's saved",
      "Splits results into critical and non-critical, each with its own reminder schedule",
      "Critical: patient and clinician are alerted right away, then reminded at 2h, 4h, and 18h",
      "Non-critical: patient gets an immediate results-ready notice, then reminders at 6h, 18h, and 24h",
      "If a patient never confirms, a community health worker is automatically notified",
      "Patients confirm with a single click, no extra steps, no app to install",
    ],
    outcome:
      "This replaced a manual follow-up process that depended on someone remembering to check. Every result now has a timestamped record of what happened and when, notified, reminded, confirmed, or escalated. Critical results are far less likely to get missed, since escalation happens automatically instead of relying on staff to notice.",
    screenshot: "/projects/lab-result-followup.png",
    demoInChat: true,
    featured: true,
    caseStudy: {
      projectStatus:
        "This solution has been fully designed, built, and tested in a local n8n development environment. It demonstrates the complete workflow: intake, validation, urgency-based routing, escalation, and confirmation, end to end. The next phase is production deployment, containerization, hosting behind HTTPS, monitoring, automated backups, and a formal review of patient data handling and consent ahead of any real clinic use.",
      architecture:
        "It starts with a form where a new lab result gets entered. That data is checked and cleaned up, then saved to a database as the single source of truth for that result.\n\nFrom there, the workflow checks whether the result is critical. If it is, the patient and their clinician get an email right away, and the system starts checking in: after 2 hours, if there's no confirmation yet, it sends a reminder and waits 4 more hours, checks again, and if there's still no response, waits 18 more hours before finally escalating to the assigned community health worker. Non-critical results go through the same kind of check-in, just on a slower timeline, 6 hours, then 18 more, then 24 more, since there's no urgency that justifies checking more often.\n\nPatients confirm with a single click from their reminder email. Community health workers do the same when they've followed up on an escalation. Both of those clicks go through a webhook that checks the submitted information before updating the record, so the system never trusts unverified input.",
      decisions: [
        "Critical and non-critical results run on two completely separate schedules, so I can tighten or loosen either one without touching the other",
        "The system re-checks confirmation status from the database at every step rather than assuming nothing changed, so a patient confirming right before a reminder was due to fire doesn't get double-messaged",
        "Escalation goes to the specific community health worker assigned to that patient, not a shared inbox, so someone is actually accountable for following up",
      ],
      challenges: [
        "I needed a way to repeat the same 'check if confirmed, then wait, then check again' pattern at every stage without rewriting it each time, so I built it once and reused the same wait-then-check shape for both critical and non-critical paths",
        "Both public-facing confirmation links (patient and community health worker) needed to be safe against bad or malicious input, since anyone with the link URL could technically hit that endpoint",
      ],
      errorHandling: [
        "Incoming lab result data is checked and cleaned before it's ever saved, so a bad submission doesn't corrupt a record",
        "Both confirmation links check their input before updating anything in the database",
        "At every reminder checkpoint, there's a clear 'nothing to do here' path, so the workflow doesn't error out just because no action was needed at that moment",
      ],
      retryStrategy: [
        "Critical results: notify immediately, then check in at 2h, 4h, and 18h before escalating",
        "Non-critical results: check in at 6h, 18h, and 24h before escalating",
        "Every check-in reads the current confirmation status straight from the database, so a late confirmation is always caught at the next check, nothing is missed just because timing was close",
      ],
      security: [
        "Patient emails never contain the actual result or diagnosis, only that a result is ready, the test type, and a reference number. The result itself is only shared once the patient is confirmed in person or through a verified channel, not sent over email where it isn't safe to assume the inbox is private",
        "Both confirmation links (patient and community health worker) check what's submitted before it touches the database, so the system isn't trusting unverified input just because it came through a link",
        "Every email the system sends is built from information that was already checked when the result was first entered, not from unverified input",
        "This project was built around getting the timing and escalation logic right, not as a certified healthcare-compliance system. A real clinic deployment would need a proper review of how patient data is stored, who can access it, and formal consent for how results are communicated, none of which I've done a full pass on yet",
      ],
      whatWorkedWell:
        "The repeatable check-then-wait pattern made this easy to extend. Adding the non-critical path was mostly reusing the same shape with different timing, not new logic from scratch.",
      biggestChallenge:
        "Keeping the critical and non-critical schedules independently adjustable without duplicating the confirmation-check logic everywhere it was needed.",
      futureImprovements: [
        "Containerize the workflow with Docker for consistent, repeatable deployment",
        "Deploy on a VPS behind HTTPS",
        "Move both reminder schedules into a settings table so timing can be tuned per clinic without a workflow edit",
        "Add delivery monitoring so a failed email is flagged instead of assumed sent",
        "Set up automated backups for the patient and result records",
        "Complete a formal patient-data and consent review before any real clinic deployment",
      ],
    },
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
      "I built a daily job that scores every delinquent account for risk using an AI agent, sends anything the AI isn't confident about to a human instead of guessing, and automatically handles the rest through SMS, WhatsApp, or a legal referral email.",
    keyFeatures: [
      "Runs once a day and pulls every delinquent account that hasn't been contacted yet",
      "An AI agent scores each account as low, medium, or high risk, along with how confident it is",
      "If the AI isn't confident enough, that account goes to a person instead of being auto-decided",
      "Low risk gets an SMS reminder, medium risk gets a WhatsApp restructuring offer, high risk gets a legal referral packet",
      "A payment confirmation link (standing in for the lender's real payment system) clears the account automatically once payment comes through",
      "A daily summary email shows totals by risk level, channel used, and how confident the AI was on average",
    ],
    outcome:
      "This replaced a manual, once-a-day review of every delinquent account. The AI handles the triage, and anything it isn't sure about still goes to a person rather than being auto-decided, so human judgment stays in the loop exactly where it's needed. Database records, AI scoring, and three separate outreach channels (SMS, WhatsApp, email) now work together as one connected process instead of separate manual steps.",
    screenshot: "/projects/micro-lending-collection-restructuring-and-legal-router (1).png",
    demoInChat: true,
    featured: true,
    caseStudy: {
      projectStatus:
        "This solution has been fully designed, built, and tested in a local n8n development environment, including the AI risk-scoring agent, the confidence-based routing, and the multi-channel outreach. The next phase is production deployment, containerization, hosting behind HTTPS, connecting the payment step to a real payment processor, monitoring, automated backups, and CI/CD for workflow updates.",
      architecture:
        "Once a day, on a Schedule Trigger, the workflow pulls every delinquent account that hasn't been contacted yet today, along with its message history. Each account goes through an AI agent that reads the history and returns a risk level (low, medium, high), a sentiment read, and a confidence score for its own judgment.\n\nIf that confidence score is too low, the account is set aside for a person to review instead of letting the AI decide on its own. Everything above the confidence threshold gets routed by risk level: low risk gets an SMS, medium risk gets a WhatsApp message with a restructuring offer and a payment link, and high risk gets a legal referral packet compiled and emailed out. Every path, however the account was handled, logs what happened and marks the account as contacted today, so if the job somehow ran twice in one day it wouldn't message the same account twice. If the account is still delinquent tomorrow, it comes right back into the next day's list, that's intentional, an unresolved account should keep getting contacted daily until it's paid off.\n\nOn the payment side, I built a simple mock payment page to stand in for wherever a lender's actual payment processor would send its confirmation. It's not the workflow assuming a customer paid, it's the endpoint a real payment gateway would call once a payment genuinely clears. When that confirmation comes in, the account is looked up, matched, and only then marked as cleared. A separate daily job also emails a short summary of the day's activity.",
      decisions: [
        "I gate every action on a confidence score, so the AI's uncertainty actually changes what happens next instead of getting logged and ignored",
        "Each risk level goes through a genuinely different channel, matched to how collections is actually handled at each stage, rather than sending every account through the same message",
        "Payment clearing happens through a webhook a payment processor would call, not a manual update, and the account is looked up and matched before anything changes",
      ],
      challenges: [
        "Getting usable, structured output from the AI agent took some work, I paired it with a structured output parser instead of trying to parse free text, so the routing logic downstream could actually depend on the result",
        "I wanted low-confidence scores to never quietly slip through into an auto-decision, so the confidence check happens before the risk-level routing, not as an afterthought",
      ],
      errorHandling: [
        "Low-confidence AI results are routed to a person instead of being forced into a risk tier",
        "Every outbound message, whatever the channel, logs its outcome, so a failed send shows up in the record instead of disappearing silently",
        "Payment confirmations are matched against the actual account before anything is cleared, never taken at face value from the incoming request",
      ],
      retryStrategy: [
        "This runs as a daily batch rather than a live retry loop, so an account that didn't get routed cleanly simply comes back up in the next day's list",
        "The daily summary makes it easy to notice if AI confidence dropped or a channel underperformed on a given day",
      ],
      security: [
        "Payment confirmations are looked up and matched against the account server-side before the account is cleared, the system never trusts the incoming request on its own",
        "Legal referral packets are built from account data that's already been validated, not directly from user input",
      ],
      whatWorkedWell:
        "Gating on AI confidence made the whole system easier to trust. The failure mode for something the AI isn't sure about is 'a person looks at it,' not 'the wrong offer goes out.'",
      biggestChallenge:
        "Getting the AI agent to return output in a format I could reliably route on, rather than parsing free text and hoping the structure held every time.",
      futureImprovements: [
        "Containerize using Docker",
        "Deploy on a VPS with HTTPS",
        "Connect the payment step to a real payment processor in place of the mock page",
        "Add per-channel delivery tracking (SMS delivered, WhatsApp read)",
        "Move the AI confidence threshold into a setting so it can be tuned without a workflow edit",
        "Implement automated backups and monitoring/alerting",
        "Configure CI/CD for workflow updates",
      ],
    },
  },
];