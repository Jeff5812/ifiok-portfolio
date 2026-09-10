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
  // Optional second workflow image for a project with more than one moving
  // part worth showing (e.g. a separate MCP tool-server canvas). Rendered
  // right under the main screenshot on the case study page only.
  secondaryScreenshot?: { src: string; caption: string };
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
    slug: "invoice-intake-anomaly-detection",
    title: "Invoice Intake & Anomaly Detection",
    tagline:
      "Catches invoice math errors and duplicate payments before they cost money, with zero manual data entry.",
    stack: ["n8n", "Gemini", "Gmail API", "Google Sheets", "Slack"],
    problem:
      "Meridian Advisory processes vendor invoices by hand: someone opens each emailed PDF, retypes the totals into a spreadsheet, and eyeballs the numbers. Two failure modes recur and both cost real money when missed, line items that don't add up to the stated total, and the same invoice getting paid twice because it was re-sent.",
    solution:
      "I built a workflow that watches the inbox, extracts every field from the PDF with Gemini, recalculates the math independently, and checks the invoice number against everything already logged. Valid invoices are logged silently. Anything genuinely wrong gets a Slack alert. Duplicates get caught and filed in their own log, never a second row on the main ledger.",
    keyFeatures: [
      "Watches a Gmail inbox for PDF invoices, no manual upload step",
      "Gemini extracts invoice number, vendor, totals, and dates as structured fields",
      "Recalculates the line item sum independently and flags any mismatch down to the exact dollar difference",
      "Duplicate invoice numbers are caught and filed to a separate audit tab, never double logged",
      "Only a genuine anomaly triggers a Slack alert, valid invoices log silently so the channel stays useful",
      "Every invoice lands in one sortable Google Sheet with status and a processed timestamp",
    ],
    outcome:
      "This replaced a manual review step that depended on someone catching a bad total by eye. Every invoice now gets checked the same way, every time, and the only thing that reaches a human is something that actually needs a decision.",
    screenshot: "/projects/invoice-intake-anomaly-detection.webp",
    demoInChat: true,
    featured: true,
    caseStudy: {
      projectStatus:
        "Fully built and tested end to end in n8n, including Gmail intake, Gemini extraction, math validation, and duplicate prevention. Three test invoices (two valid, one duplicate resend) are included in the repo to demonstrate each path. Next phase is a real approve/reject loop back into the sheet, rather than resolving flagged invoices by hand.",
      architecture:
        "A Gmail trigger polls for emails with a PDF attachment and 'invoice' in the subject line. The attached PDF goes to a Gemini-backed extraction step that returns invoice number, client name, vendor email, total amount, line item sum, invoice date, and due date as structured fields.\n\nFrom there the workflow does two independent checks. A Code node recalculates the line items and compares that figure to the stated total, catching any mismatch down to the exact dollar difference. In parallel, a Sheets lookup checks whether that invoice number has already been logged. A Merge node brings both results back together before anything gets written anywhere.\n\nValid, non-duplicate invoices get one row in the Invoices tab and nothing else happens, no alert, no noise. A math discrepancy gets logged and triggers a Slack alert to the billing channel, since that's a real decision someone needs to make. A duplicate gets redirected entirely, it's written to a separate Duplicates Log tab instead of the main ledger, so there's still a full audit trail, but it never creates a second payable-looking row and never interrupts anyone in Slack.",
      decisions: [
        "Duplicate detection matches on invoice number alone rather than a vendor plus invoice number composite key, a simpler design that's easier to reason about and reliable enough for a small, known vendor list",
        "A Filter node sits between the ledger write and the Slack notification so only a genuine anomaly reaches the channel, valid invoices never generate a message",
        "Duplicates get their own log tab instead of either flooding Slack or disappearing into n8n's execution history where only a developer would find them",
      ],
      challenges: [
        "The first duplicate check design would have collided on any two vendors that happened to both issue an INV-1001. Weighed a composite key against the actual scope of the project and kept the simpler check, documented as a tradeoff rather than an oversight",
        "The first working version of the Slack alert fired on every processed invoice, which floods the channel fast and trains people to ignore it. Fixed by gating the alert behind a Filter node that only lets a real anomaly through",
      ],
      errorHandling: [
        "Every external-call node (Gemini, Gmail, Sheets, Slack) has retry logic, three tries with a 4000ms backoff",
        "A dedicated Error Workflow is attached under this workflow's Settings, so a node failure alerts separately from the business-logic Slack alerts",
        "A flagged invoice still gets a row in the sheet even when it's flagged, nothing about a mismatch stops the record from existing",
      ],
      retryStrategy: [
        "Gmail Trigger polls every 60 seconds, so there's a small, predictable lag rather than a missed email",
        "External API calls retry three times with a 4-second wait before the error workflow takes over",
      ],
      security: [
        "Only the first PDF attachment on an email is processed, deliberate scope limit rather than a silent gap",
        "Totals are parsed as plain numbers with currency symbols stripped, single-currency assumption stated up front rather than hidden",
        "No OCR fallback yet, a scanned invoice with no text layer fails extraction rather than being flagged for manual review, noted as a known limitation, not a surprise",
      ],
      whatWorkedWell:
        "Separating visibility from alerting. A duplicate still gets recorded somewhere a human can find it, but it never has to interrupt anyone, because there's no decision left for a person to make once the system has already handled it correctly.",
      biggestChallenge:
        "Getting the duplicate check design right without over-engineering it. It would have been easy to build a compound vendor-plus-invoice-number key from day one. The harder, better call was recognizing the simpler check was actually the right size for this project.",
      futureImprovements: [
        "Slack approve/reject buttons that write a decision back to the ledger",
        "A weekly digest summarizing total dollars processed and flags caught",
        "Multi-currency normalization",
        "Vendor trust scoring based on historical discrepancy rate",
        "OCR fallback for scanned, non-text PDFs",
        "Budget-threshold routing so invoices above a set amount require manager sign-off",
      ],
    },
  },
  {
    slug: "ai-lead-scoring-and-routing",
    title: "AI Lead Scoring and Routing",
    tagline:
      "Scores every inbound lead on intent and fit, then routes it to the right regional team with an SLA attached, automatically.",
    stack: ["n8n", "Gemini", "Google Sheets", "Gmail", "Slack"],
    problem:
      "A form fill only tells you what a prospect typed into structured fields. It doesn't tell you whether they're ready to buy or just browsing, and sorting that out by hand for every submission doesn't scale, especially once duplicate and low-quality submissions are mixed in with real ones.",
    solution:
      "I built a pipeline that sanitizes every submission, filters out disposable emails and repeat submissions before they reach anyone, then combines deterministic scoring (company size, budget, job title) with an AI read on intent and urgency pulled from the free-text message. The combined score decides the SLA and which regional Slack channel gets notified.",
    keyFeatures: [
      "Nine-field intake form with browser-level required-field and email format validation",
      "Sanitizes input and blocks disposable or suspicious email domains before anything reaches the CRM",
      "Duplicate detection against the CRM sheet stops repeat submissions from creating a second record or a second AI call",
      "Gemini reads the free-text message for intent and urgency, combined with deterministic scoring rules",
      "Three-tier routing, Hot gets a 1-hour SLA, Warm gets 24 hours, Cold is logged with no notification",
      "Routes to the right regional Slack channel automatically, and sends a branded confirmation email to the lead",
    ],
    outcome:
      "Every lead now gets the same consistent, structured read, no submission waits on someone being free to triage it by hand, and the team's attention goes to the leads actually worth an hour-long SLA instead of being split evenly across everything that comes in.",
    screenshot: "/projects/ai-lead-scoring-and-routing.webp",
    demoInChat: true,
    featured: false,
    caseStudy: {
      projectStatus:
        "Fully built and tested in n8n, covering sanitization, duplicate detection, AI scoring, and regional routing end to end. Next phase is connecting this to a real CRM instead of Google Sheets, and building out a feedback loop so sales can mark a Hot lead as a false positive and have that feed back into the scoring rules.",
      architecture:
        "A Form Trigger collects nine fields and redirects the visitor to a thank-you page instantly, the actual pipeline runs in the background afterward. The first stop is a Sanitize Data node that strips HTML, normalizes shouted text, collapses whitespace, and checks the email against a blocklist of disposable domains. An IF node checks for any validation errors, if the email is disposable or something looks wrong, the submission goes straight to a Slack alert in a review channel and stops there, it never reaches the CRM or the AI.\n\nEverything that passes goes to a Google Sheets lookup by email, merged back with the sanitized data. A second IF node checks whether that email already exists in the CRM, if so, the lead gets a warm re-engagement email and the pipeline stops, no duplicate row, no duplicate AI call.\n\nNew leads move on to Gemini, which reads the free-text message and returns a structured intent signal, an urgency flag, and a one-sentence fit note. Those AI signals combine with deterministic rules, company size, budget, service type, job title, into a single score. That score decides the category (Hot, Warm, Cold), which decides the SLA and which regional Slack channel gets notified. Every lead, whatever the outcome, gets logged to the CRM sheet with its score and category attached.",
      decisions: [
        "Validation is deliberately split across two layers, the browser catches what it can (required fields, email format), and the workflow catches what the browser can't (disposable domains, suspicious patterns), so neither layer is doing the other's job",
        "AI signals add to a score rather than deciding the category outright, a lead still needs real structured signals (budget, company size) to reach Hot, the model influences the outcome without controlling it alone",
        "alwaysOutputData is set on the CRM lookup node, since Google Sheets returns zero items on no match, which would otherwise stop a brand new lead from ever reaching the Merge node",
      ],
      challenges: [
        "Structured fields alone missed what actually mattered in a lead's message, a big-budget lead who wrote 'just exploring' scored the same as one who wrote 'need this live by end of month.' Fixed by sending the message to Gemini for a structured intent and urgency read that feeds into, but doesn't override, the deterministic score",
        "A duplicate submission was creating a second CRM row, a second Slack alert, and a second Gemini call, tripling cost and creating conflicting records for the same lead. Fixed with a lookup-and-merge step before scoring ever runs",
      ],
      errorHandling: [
        "Gemini calls have retry logic (3 tries) since transient API failures or malformed JSON responses would otherwise silently drop a valid lead at the scoring step",
        "A Structured Output Parser enforces the shape of the AI's response, so downstream routing logic never has to guess at a free-text answer",
        "A connected Error Workflow catches any uncaught execution failure separately from the business-logic Slack alerts",
      ],
      retryStrategy: [
        "Judge Intent and Urgency (the Gemini step) retries three times with a short wait between attempts before it's treated as a real failure",
        "Re-submitting the same email is always safe, duplicate detection catches it before any data is written twice",
      ],
      security: [
        "Disposable and suspicious email domains are blocked before a submission ever reaches the CRM or the AI, not after",
        "Every field is sanitized (HTML stripped, length capped) before it's stored or used in a prompt",
      ],
      whatWorkedWell:
        "Splitting validation into a browser layer and a workflow layer. It meant not over-engineering the frontend and not blindly trusting it either, each layer only handles what the other genuinely can't.",
      biggestChallenge:
        "Getting the AI's contribution to the score right. It would have been easy to let the model's read on intent decide the category outright. The better design keeps deterministic signals as the backbone and lets AI add nuance on top, not replace judgment with a guess.",
      futureImprovements: [
        "Connect to a real CRM instead of Google Sheets",
        "A feedback loop so sales can flag a false-positive Hot lead and have that inform future scoring",
        "A weekly digest of lead volume, average score, and SLA adherence by region",
        "Configurable scoring weights instead of hardcoded point values",
      ],
    },
  },
  {
    slug: "meridian-scheduling-agent",
    title: "Meridian Advisory Scheduling Agent",
    tagline:
      "An AI receptionist that books, reschedules, and cancels consultations over Telegram, with the database, not the model, deciding what's actually allowed to happen.",
    stack: ["n8n", "MCP", "Gemini", "Google Calendar", "Supabase", "Telegram"],
    problem:
      "An LLM agent is good at understanding what a customer wants. It's a bad place to put the actual source of truth for anything transactional, since a model can misremember, get talked into contradicting itself, or simply be wrong with total confidence. Scheduling needs something underneath it that can't be talked out of enforcing a rule.",
    solution:
      "I built a Telegram scheduling agent split into two workflows connected over MCP, an agent workflow that handles the conversation, and a tool server that exposes calendar and database operations as callable tools. The agent decides what the customer wants. Supabase, with real database constraints, decides whether it's allowed to happen. Google Calendar acts first, Supabase confirms second, and if Supabase says no, the calendar event gets rolled back automatically.",
    keyFeatures: [
      "Books, reschedules, cancels, and lists consultations through natural conversation on Telegram",
      "Google Calendar creates the customer-facing event and sends real calendar invites",
      "Supabase Postgres is the final authority, with database-level constraints that make double booking structurally impossible, not just unlikely",
      "A customer's own retried request is recognized and confirmed silently instead of being rejected as a false conflict",
      "Duplicated Telegram message deliveries are dropped before they ever reach the agent",
      "If the database rejects a booking after the calendar event already exists, the calendar event is automatically deleted so the two systems never drift out of sync",
    ],
    outcome:
      "The result is a receptionist that never double-books, never leaves the calendar and the database disagreeing about what happened, and treats its own model's confidence as advisory, not authoritative. That's the pattern I use across client scheduling work, this is the clearest, smallest version of it I could build end to end.",
    screenshot: "/projects/meridian-scheduling-agent.webp",
    secondaryScreenshot: {
      src: "/projects/meridian-mcp-calendar-server.webp",
      caption:
        "The separate MCP tool server the agent calls into: check_availability, book_appointment, reschedule_appointment, cancel_appointment, record_appointment, update_appointment_record, and list_my_appointments, each backed by Google Calendar or Postgres directly.",
    },
    demoInChat: true,
    featured: true,
    caseStudy: {
      projectStatus:
        "Fully built and tested in a local n8n environment, including the MCP tool server, the confidence-gated booking flow, and the automatic rollback path. This is a working prototype demonstrating the architecture, not a production deployment. Before real customer use, the MCP endpoint needs to move off a local tunnel, and the availability logic needs load testing with concurrent bookings closer together than manual testing can produce.",
      architecture:
        "Two workflows, connected over MCP. The Telegram Agent Workflow receives the message, builds a stable customer identity from the Telegram user ID, and claims message-level idempotency in Postgres before anything else happens, a duplicate delivery throws a unique-constraint violation and is dropped silently rather than processed twice. The message then goes to a Gemini-backed agent with access to seven tools exposed by the second workflow, the MCP Calendar Server.\n\nThose seven tools cover check availability, book, reschedule, cancel, record, update record, and list appointments. The agent calls them in a fixed order the system prompt enforces: for a booking, Calendar acts first (creating the event), then Supabase is asked to record it, the real gate. Supabase's own constraints, a business-hours trigger, a duration bound, an exclusion constraint against overlapping time ranges, decide whether the booking is actually valid, regardless of what the agent believed when it called the tool. If Supabase rejects it, the agent deletes the calendar event it just created, so a rejected booking never leaves a live event behind.\n\nA second unique constraint on (customer_id, start_time) handles a subtler case: a customer's own retried request. Without it, a timeout-and-resend would look identical to two different customers grabbing the same slot. With it, a same-customer retry returns zero rows and no error, and is confirmed normally, while a real cross-customer conflict still throws.",
      decisions: [
        "Calendar acts first, Supabase decides, a deliberate ordering so the customer-facing artifact (the calendar invite) only ever exists once the underlying booking is something the database has actually accepted",
        "Business hours, duration bounds, and overlap prevention are enforced with real Postgres constraints and a trigger, not by asking the LLM to self-police, so the rule holds even if the agent's reasoning is wrong",
        "Message idempotency uses a Postgres unique constraint and onError continueErrorOutput rather than a separate lookup-then-insert, the duplicate case is the constraint violation itself, no extra query needed",
      ],
      challenges: [
        "A customer's own retried booking request was being read as a real conflict and rejected, even though the original request had actually succeeded. Validated the fix directly with concurrent SQL inserts against Supabase, since model and network latency made it impossible to reliably force a true race through the Telegram interface itself",
        "A rejected Supabase write could leave a calendar event behind with no matching database record, since booking is two separate writes. Fixed by making the agent's fallback path an explicit rollback, delete the calendar event, rather than just reporting the failure and leaving the mismatch",
        "Field-shape mismatches between what the agent sent and what a tool expected caused hard failures with no useful message, an attendees field needed to be an array, not a string, and a duration field with no default could resolve to undefined and crash a parameterized query outright",
      ],
      errorHandling: [
        "A thrown error from record_appointment (the real booking gate) is treated as a genuine rejection, the agent explains why and offers another time, then rolls back the calendar event it already created",
        "Zero rows with no error from record_appointment means a safe, same-customer retry, confirmed normally rather than treated as a failure",
        "Any other failure falls back to one honest, fixed message telling the customer the system is temporarily unavailable, rather than the agent improvising an explanation",
      ],
      retryStrategy: [
        "The Scheduling Agent node itself retries on failure (3 tries, 5 second wait) before falling back to the fixed unavailability message",
        "Telegram replies retry up to 5 times with a 2 second wait, since a dropped reply is worse than a slightly delayed one",
      ],
      security: [
        "customer_id comes from the Telegram platform itself and is injected directly, the agent is explicitly instructed never to ask for it or accept one the customer offers",
        "Every mutating database query filters on customer_id in the WHERE clause, not just as a value being written, so one customer's request can never modify another customer's row",
        "The MCP tool server runs behind its own webhook path, separate from the customer-facing Telegram workflow",
      ],
      whatWorkedWell:
        "Treating 'the agent decided to call a tool' and 'the tool's effect actually happened' as two genuinely separate things. That separation is what makes the rollback logic possible, and it's the same discipline I'd want in place before letting any agent touch something transactional for a client.",
      biggestChallenge:
        "Telling a genuine double-booking apart from a customer's own retried request, when both looked identical from the database's point of view until I added a second, more specific constraint to distinguish them.",
      futureImprovements: [
        "Move the MCP endpoint off a local tunnel onto a stable hosted URL",
        "Load test availability checking under real concurrent booking attempts",
        "Add a lightweight rate limit ahead of the agent",
        "Extend rollback logic to cover a Calendar failure that happens after a successful Supabase write, currently the rarer direction of the two",
      ],
    },
  },
  {
    slug: "stripe-docs-support-bot",
    title: "Stripe Docs Support Bot",
    tagline:
      "A Telegram bot that answers Stripe integration questions by retrieving Stripe's own docs, and says so plainly when it doesn't know.",
    stack: ["n8n", "Gemini", "Supabase", "Telegram"],
    problem:
      "An LLM's training data on a fast-moving API like Stripe's goes stale, and a model that answers integration questions from memory alone will eventually give a confident, wrong answer. The harder problem isn't hooking up retrieval, it's making sure retrieval actually works against real documentation formatting, and making the agent admit when what it retrieved doesn't actually answer the question.",
    solution:
      "I built a RAG pipeline over 26 official Stripe documentation pages, with a custom preprocessing step that converts Stripe's pipe-delimited tables into plain sentences before embedding, since raw table syntax embeds poorly against natural language questions. The retrieval agent is instructed to treat irrelevant retrieved content the same as no retrieved content, rather than using it as a springboard to answer from general knowledge.",
    keyFeatures: [
      "Answers developer questions on Stripe Payments, Checkout, Billing, Webhooks, Disputes, and Errors, citing the retrieved documentation",
      "Refuses to answer from general knowledge when the retrieved context doesn't actually address the question",
      "Persistent per-user conversation memory on Telegram, isolated by chat ID, so follow-up questions carry context",
      "Custom ingestion step flattens Stripe's pipe-delimited tables into natural language before chunking and embedding",
      "Logs every conversation turn to Google Sheets for review",
    ],
    outcome:
      "The bot answers from Stripe's actual current documentation instead of the model's training data, and correctly declines questions outside its 26-page corpus rather than guessing. That refusal behavior was the harder engineering problem, and it's the part of this build I'd point to first.",
    screenshot: "/projects/stripe-docs-support-bot.webp",
    demoInChat: true,
    featured: false,
    caseStudy: {
      projectStatus:
        "Fully built and manually tested across ambiguous, out-of-corpus, and multi-turn conversation scenarios. No automated evaluation suite yet, correctness was verified by hand rather than with a formal test harness. Next phase is exactly that, a small labeled test set to catch retrieval regressions automatically.",
      architecture:
        "A separate ingestion workflow pulls 26 Stripe documentation pages, runs them through a cleaning step (including the table-flattening fix below), chunks them with n8n's native Recursive Character Text Splitter at 1800 characters with 200 character overlap, and embeds each chunk via the Hugging Face Inference API using mixedbread-ai/mxbai-embed-large-v1 at 1024 dimensions. Chunks land in a Supabase table with pgvector, queried through a match_stripe_docs RPC function.\n\nOn the runtime side, a Telegram Trigger feeds a Gemini-backed agent with a stripe_docs retrieval tool and Postgres-backed chat memory keyed by Telegram chat ID, so a follow-up question carries the context of what was already discussed. Every turn is logged to Google Sheets. Replies are sent in Telegram's HTML parse mode with explicit entity escaping, since Stripe's own documentation is full of angle-bracket placeholders and snake_case syntax that would otherwise break Telegram's message parser.",
      decisions: [
        "Chose Supabase with pgvector over n8n's in-memory vector store, since an in-memory store resets with the workflow and can't support a real production ingestion-then-runtime split",
        "Table-flattening runs as a fenced-code-aware preprocessing step rather than requiring Stripe's tables to already be well-formed Markdown, since they aren't consistently formatted that way",
        "Standardized on HTML parse mode with manual entity escaping over Telegram's Markdown mode, which broke unpredictably on Stripe's own code syntax",
      ],
      challenges: [
        "Stripe's error reference page lists API fields using pipe-delimited table syntax, which embeds poorly against natural language questions, so a fully ingested page still failed to answer relevant questions about it. Fixed with a preprocessing step that detects pipe-delimited lines outside fenced code blocks and converts them to plain sentences before chunking",
        "The agent would use loosely related retrieved content as a springboard to answer from general training knowledge, rather than recognizing that content didn't actually address the question asked. Fixed by rewriting the grounding instructions to separate 'did retrieval return something' from 'does what it returned actually answer this,' and treating a no on the second question the same as an empty retrieval",
        "Went through several embedding provider swaps mid-build (OpenAI, then Ollama, then Gemini, before settling on Hugging Face's mxbai-embed-large-v1) chasing reliable dimensionality and quality before landing on the final stack",
      ],
      errorHandling: [
        "A retrieval that returns no relevant content routes the agent to explicitly tell the user rather than falling back to general knowledge",
        "Conversation memory is scoped per Telegram chat ID, so one user's context can never leak into another's",
      ],
      retryStrategy: [
        "No special retry logic beyond n8n's default node-level handling, since this is a read-heavy, low-write pipeline where a failed retrieval call is safe to simply surface as 'I don't know' rather than silently retried",
      ],
      security: [
        "Conversation logging to Google Sheets stores what was asked and answered, not any credentials or account-specific data, since this bot answers documentation questions, not account questions",
        "Chat memory isolation by Telegram chat ID prevents cross-user context bleed",
      ],
      whatWorkedWell:
        "The table-flattening fix. It's a small preprocessing step, but it was the actual reason a fully ingested, fully embedded page was still failing to answer real questions, and it's a good example of retrieval quality depending on document structure, not just on having the right content in the store.",
      biggestChallenge:
        "Getting the agent to reliably tell the difference between 'I retrieved something' and 'I retrieved something that answers this.' Those look identical to a naive grounding instruction, and conflating them is what causes confident wrong answers even with retrieval in place.",
      futureImprovements: [
        "Build a small labeled test set to catch retrieval regressions automatically instead of relying on manual spot checks",
        "Expand the corpus beyond the current 26 pages (Stripe Tax, Stripe Connect)",
        "Add a lightweight relevance score threshold so a weak retrieval match is treated as no match, rather than depending entirely on the agent's own judgment",
      ],
    },
  },
];