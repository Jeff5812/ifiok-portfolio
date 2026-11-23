// Every project, in the structure the previous site used (problem, key features, outcome, full case
// study), extended with what's new. Facts come from each project's own repository: its README and
// architecture docs, its tests, its evaluation reports and its production-readiness audits.

export type StateKey = "ok" | "warn";

export type Media = { src: string; w: number; h: number; alt: string; caption?: string };

export type CaseStudy = {
  projectStatus: string;
  architecture: string; // paragraphs separated by a blank line
  decisions: string[];
  challenges: string[];
  errorHandling: string[];
  retryStrategy: string[];
  security: string[];
  whatWorkedWell: string;
  biggestChallenge: string;
  futureImprovements: string[];
};

export type Project = {
  slug: string; // URL: /projects/<slug>
  number: string;
  title: string;
  group: "product" | "automation";
  featured: boolean;
  kind: string;
  date: string;
  status: { state: StateKey; label: string };
  tagline: string;
  stack: string[]; // names; ones with a 3D logo in content/tools.ts render as logos
  problem: string;
  solution: string;
  keyFeatures: string[];
  outcome: string;
  proof: string[];
  image?: Media; // the card and case-study hero
  gallery?: Media[];
  links: { live?: string; source?: string };
  caseStudy: CaseStudy;
};

const GH = "https://github.com/Jeff5812";
const DEMOS = `${GH}/ifiok-automation-demos/tree/main`;

export const PROJECTS: Project[] = [
  // ------------------------------------------------------------------------------------------------
  {
    slug: "chat-receipt",
    number: "01",
    title: "Chat Receipt",
    group: "product",
    featured: true,
    kind: "Product · web + WhatsApp",
    date: "Nov 2026",
    status: { state: "ok", label: "Live" },
    tagline:
      "Turns screenshots of a WhatsApp deal into a proper transaction record: what was agreed, what was paid and what is still owed.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Supabase", "Gemini", "Claude", "WhatsApp", "Docker", "Playwright"],
    problem:
      "In informal commerce, deals are agreed in chat: prices are negotiated, part-payments promised, delivery fees added along the way. When there's a dispute, nobody has a record, only a long scroll of messages. Reading it by hand is slow, and asking an AI to summarise it is risky: a model that picks the first price instead of the agreed one produces a confident, wrong receipt.",
    solution:
      "Chat Receipt reads the screenshots or a WhatsApp chat export, but the AI only reports events: offers, counter-offers, acceptances and payment claims, each tied to the message it came from. Deterministic rules then work out the agreed price, the totals and the payment status in Decimal arithmetic, give every field a state (confirmed, inferred, missing, contradictory), and ask a person to check anything uncertain before a PDF or image record is produced.",
    keyFeatures: [
      "Upload chat screenshots or a WhatsApp export, review and correct the details, download a PDF or PNG record",
      "A WhatsApp channel: send screenshots to a number, fix details by typing (“it's 20k”), confirm in the chat",
      "The AI reports events with message citations; rules decide the price, so the accepted offer wins, not the first quote",
      "Every figure must appear in the message it cites; contradictory values are left empty with both candidates shown",
      "A payment in a chat is a claim until the customer says the money arrived; reused transfer references are flagged",
      "The other party can confirm a record through a wa.me link",
    ],
    outcome:
      "Live on the web and on WhatsApp since 20 November 2026. On a held-out set of 77 synthetic conversations, 95% of checks passed and no wrong amount was ever marked “confirmed”. The backend suite runs 785 tests.",
    proof: ["785 backend tests passing", "0 wrong amounts marked confirmed (held-out eval)", "Live on web + WhatsApp"],
    image: {
      src: "/media/chatreceipt-hero.webp",
      w: 1600,
      h: 1033,
      alt: "Chat Receipt's landing page: 'Turn your conversations into proper transaction records'",
    },
    gallery: [
      {
        src: "/media/chatreceipt-record.webp",
        w: 920,
        h: 1250,
        alt: "A printed Chat Receipt transaction record for a leather bag, ₦23,000 plus ₦2,000 delivery",
        caption: "The printed record. Totals come from the backend's own calculation, never from the model.",
      },
    ],
    links: { live: "https://chatreceipt.vercel.app", source: `${GH}/chatreceipt` },
    caseStudy: {
      projectStatus:
        "Live since 20 November 2026 on free plans: the website on Vercel, the API on Render, Postgres on Supabase and Gemini's free tier, with the WhatsApp channel connected. Of the 13 planned engineering phases, all are complete; the open items are written down: a real-browser check of very long receipts, a load test, and a demonstration script with seed data.",
      architecture:
        "A modular monolith: one Next.js website and one FastAPI application on PostgreSQL. There are three ways in. The website is stateless: screenshots go to the AI in one structured request, the browser holds the draft while the person reviews it, and every total comes from a Decimal calculation endpoint. The WhatsApp channel verifies Meta's signature, stores each message once and returns immediately; a worker reads albums of screenshots, holds the conversation and sends replies through an outbound queue. A versioned /api/v1 engine serves integrations, with uploads processed as background jobs.\n\nThe intelligence pipeline transcribes screenshots, merges them into one conversation (overlap, order, gaps), and asks the AI to interpret events for each deal. Rules in negotiation.py and payments.py turn those events into a proposal where every field has a state, then validation and one review policy decide what blocks approval. The whole pipeline is pure code apart from the two AI calls, so every rule is unit-tested.\n\nData lives in its own schema. Requests run under a restricted role with row-level security per customer; versions, review decisions and events are append-only, enforced by grants and triggers; money is numeric end to end. Jobs are rows claimed with FOR UPDATE SKIP LOCKED under leases with fencing tokens, and outgoing events use a transactional outbox, so results, job completion and events commit together.",
      decisions: [
        "The AI interprets; Chat Receipt's code decides. The model reports events with the messages they came from, and its own “agreed” reading is only a cross-check",
        "A state for every field instead of one confidence score, because a person needs to know which detail to check, not that the record is “78% sure”",
        "PostgreSQL for everything, including the job queue: no Redis or broker to run or pay for, and results, completion and events commit in one transaction",
        "Tenant isolation enforced by the database, so a missing WHERE clause in application code can't leak another customer's records",
        "Store first, work later on WhatsApp: the webhook only verifies, stores and acknowledges, because Meta retries slow webhooks and AI calls take seconds",
        "A payment in a chat stays a claim until the customer confirms it arrived, since fake transfer receipts are common",
        "A modular monolith, not microservices: what limits it is AI quota and WhatsApp's per-message charge, not CPU",
      ],
      challenges: [
        "Before the rule changes of 19 November, the development set scored 16 of 39 fully correct, with review precision of 50%: clean records were flagged for wording like “pay on delivery” and implied quantities of one. Fixing the rules (not the prompt) and re-scoring saved answers at no AI cost took it to 36 of 42",
        "Gemini's newest model was often overloaded on the free tier, so evaluations decided the primary model, with automatic fallback on overloads, timeouts and rate limits",
        "A chat never says whose phone it is. Asking up front slowed everyone down, so the question now comes once, at Confirm, only when a name is missing, and the answer is remembered",
        "WhatsApp now charges for replies above 1,000 a month, so a returning customer's receipt was cut from four replies to three",
      ],
      errorHandling: [
        "Failures are classified as retryable or permanent; retries back off up to a configured maximum",
        "A worker that stalls loses its lease, and a fencing token stops it from completing work another worker has taken over",
        "No network call happens inside a database transaction",
        "Contradictory or unsupported values are never guessed: the field is left empty and the candidates are listed",
      ],
      retryStrategy: [
        "WhatsApp messages are stored once, keyed by Meta's message ID, so repeated deliveries are harmless",
        "Outgoing WhatsApp messages go through a queue with retries, with Meta's 24-hour window in mind",
        "Idempotency keys are stored in the same transaction as the change they protect; optimistic concurrency stops two tabs overwriting each other",
      ],
      security: [
        "Row-level security per customer in Postgres, with requests switched to a restricted role",
        "Meta webhook signatures are verified; a forged signature is refused (checked in production on 21 November)",
        "Rate limits count the address the proxy reports, so a spoofed X-Forwarded-For can't burn the AI quota",
        "Website screenshots are processed in memory and discarded; logs keep counts and durations, never conversation content",
      ],
      whatWorkedWell:
        "Keeping the intelligence code pure. With the AI requests as the only network calls, every rule is unit-tested, and stored AI answers can be re-scored after any rule change for free. That is how the evaluation improved without spending quota.",
      biggestChallenge:
        "Deciding what the AI is allowed to decide. The easy version asks the model for a total. The trustworthy version makes it report who offered what, and where, and lets rules do the arithmetic and refuse to guess.",
      futureImprovements: [
        "Match payment claims against real bank statements",
        "Evaluate on real, consented chats labelled by a person, not only synthetic ones",
        "A real-browser check of very long names, many items and page overflow in the PDF",
        "A load test of the job queue, and a demonstration script with seed data",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "mayor-edits",
    number: "02",
    title: "Mayor Edits",
    group: "product",
    featured: true,
    kind: "Client site · video studio",
    date: "Nov 2026",
    status: { state: "ok", label: "Live · client" },
    tagline:
      "A cinematic portfolio for a video-editing studio, with a back office that uploads films straight to Cloudflare R2 and writes their subtitles automatically.",
    stack: ["Next.js", "TypeScript", "Supabase", "Cloudflare", "Vercel", "Workers AI", "Playwright"],
    problem:
      "The studio needed a reel that plays well on mobile connections and a way for the owner to publish new films without a developer. But films are hundreds of megabytes: they can't pass through a serverless function (Vercel caps requests at 4.5 MB), uploads die when a connection drops, and subtitles take hours to write by hand.",
    solution:
      "Films go from the owner's browser straight to private R2 storage in 8 MiB parts, three at a time, resuming from whatever R2 already holds after a dropped connection or a closed tab. Playback uses one-hour signed links that only work for published films. When a film arrives, the browser cuts its audio at quiet moments, Whisper on Workers AI writes timed text, and Gemma translates it line for line into subtitle files.",
    keyFeatures: [
      "Resumable multipart uploads straight to R2: 8 MiB parts, three in parallel, retries and stall detection",
      "Automatic subtitles: audio decoded in the browser, split at silences, transcribed by Whisper, translated by Gemma",
      "A full keyboard player: play, skip, seek, captions, speed, picture-in-picture, and resume where you left off",
      "Nothing downloads until play; previews skip phones, reduced motion and data-saver connections",
      "An owner-only back office (“the cutting room”) behind row-level security and server-checked sessions",
      "A cinematic design language: timecode, film strip, playhead and a film-grade palette",
    ],
    outcome:
      "Live for the client, running on free tiers plus R2's pay-as-you-go storage. 179 tests cover the upload logic, subtitles, layout rules and an end-to-end owner journey against real services.",
    proof: ["Live for a client", "179 tests incl. end-to-end", "Uploads survive a closed tab"],
    image: {
      src: "/media/mayor-edits-hero.webp",
      w: 990,
      h: 1040,
      alt: "Mayor Edits: 'We make every frame matter' in condensed capitals with a running timecode",
    },
    links: { live: "https://mayor-edits.vercel.app", source: `${GH}/mayor-edits` },
    caseStudy: {
      projectStatus:
        "Live and in use by the client. Built on Next.js 16 with Cache Components: public pages are cached and refreshed the moment the owner publishes, so ordinary visits never touch the database. It's kept deliberately small; new features need a concrete reason.",
      architecture:
        "The public page reads published projects through a cache tag that every admin change expires, so updates appear instantly with no redeploy. It never reads cookies and never receives a video's storage key.\n\nTo upload, the browser asks the server what to send. The server checks the admin, then returns signed links for each missing 8 MiB part, and the browser sends the parts straight to R2, three at a time, with retries. Finalising lists what R2 holds, completes the upload, checks the size and updates the project. Uploads belong to the tab rather than the page, so the owner can keep working while one runs.\n\nPlayback starts only when a visitor presses play: a route reads the project as an anonymous visitor (so row-level security only finds published films) and returns a one-hour signed link. Subtitles live beside each video in R2 as WebVTT files; automatic ones are made in the owner's browser and through Workers AI, and are saved through the same checks as an uploaded file.",
      decisions: [
        "Video never passes through the app server: the browser uploads to R2 with signed part URLs",
        "One MP4 (H.264) per film at 5–8 Mbps instead of adaptive streaming: simple and cheap, with a warning above 10 Mbps",
        "Thumbnails are cropped to 16:9 and kept near 350 KB in the browser, because Supabase's free plan has no image transforms",
        "Automatic subtitles only add missing languages, so a hand-corrected file is never overwritten",
      ],
      challenges: [
        "With Cache Components, Next.js keeps a page alive after you leave it, so a hidden video kept playing. Fixed by pausing in a layout-effect cleanup and starting each visit to “New project” fresh",
        "Browsers never retry a failed subtitle track, so the player tries twice more with a new track element, then tells the viewer",
        "An iPhone can't make a web page full screen, so its films open in the iPhone's own player instead",
      ],
      errorHandling: [
        "Network failures, 408, 429 and 5xx responses retry after 1, 3, 5, 10, 20 and 30 seconds; a part with no progress for a minute is sent again",
        "With no connection at all, the upload waits, however long, and carries on by itself",
        "If a stored video can't be fetched for subtitles, the panel asks for the file from the device instead",
      ],
      retryStrategy: [
        "R2 remembers which parts arrived, so choosing the same file again resumes instead of restarting",
        "Expired playback links are fetched again automatically, and stop working once a film is unpublished",
      ],
      security: [
        "Every server action checks the admin session first; row-level security enforces access in the database",
        "R2 keys are server-only, and the app needs no Supabase service-role key at all",
        "The public page has no owner controls, so it looks the same to everyone, signed in or not",
      ],
      whatWorkedWell:
        "Treating the upload as something the tab owns rather than the page. The owner can move around the back office, start the next project or lose signal, and the upload keeps going.",
      biggestChallenge: "Making very large uploads reliable on unreliable connections, without paying for a media service.",
      futureImprovements: [],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "meridian-scheduling-agent",
    number: "03",
    title: "Meridian Scheduling Agent",
    group: "automation",
    featured: true,
    kind: "AI agent · n8n + MCP + Postgres",
    date: "Sep 2026",
    status: { state: "warn", label: "Working prototype" },
    tagline:
      "An AI receptionist that books, reschedules and cancels consultations over Telegram, with the database, not the model, deciding what's allowed to happen.",
    stack: ["n8n", "MCP", "Gemini", "Google Calendar", "Supabase", "PostgreSQL", "Telegram"],
    problem:
      "An LLM agent is good at understanding what a customer wants. It's a bad place to keep the source of truth for anything transactional: a model can misremember, be talked into contradicting itself, or be wrong with total confidence. Scheduling needs something underneath it that can't be talked out of a rule.",
    solution:
      "A Telegram scheduling agent split into two workflows connected over MCP: an agent workflow that handles the conversation, and a tool server that exposes calendar and database operations as tools. The agent decides what the customer wants; Supabase, with real database constraints, decides whether it's allowed. Google Calendar acts first, Supabase confirms second, and if Supabase says no, the calendar event is rolled back automatically.",
    keyFeatures: [
      "Books, reschedules, cancels and lists consultations in natural conversation on Telegram",
      "Google Calendar creates the customer-facing event and sends real invites",
      "Postgres constraints make double booking structurally impossible, not just unlikely",
      "A customer's own retried request is recognised and confirmed instead of rejected as a conflict",
      "Duplicate Telegram deliveries are dropped before they reach the agent",
      "If the database rejects a booking, the calendar event is deleted so the two systems never drift apart",
    ],
    outcome:
      "A receptionist that never double-books, never leaves the calendar and the database disagreeing, and treats its own model's confidence as advisory, not authoritative. It's the clearest, smallest version of that pattern I could build end to end.",
    proof: ["Double booking blocked by a Postgres constraint", "7 tools served over MCP", "Automatic calendar rollback"],
    image: {
      src: "/media/canvas-meridian-agent.webp",
      w: 2400,
      h: 1260,
      alt: "The Meridian scheduling agent workflow in n8n: Telegram trigger, idempotency check, AI agent with Gemini, memory and MCP tools",
    },
    gallery: [
      {
        src: "/media/canvas-meridian-mcp.webp",
        w: 2400,
        h: 1092,
        alt: "The MCP calendar server workflow in n8n",
        caption:
          "The MCP tool server the agent calls into: check_availability, book_appointment, reschedule_appointment, cancel_appointment, record_appointment, update_appointment_record and list_my_appointments, each backed by Google Calendar or Postgres directly.",
      },
    ],
    links: { source: `${DEMOS}/meridian-scheduling-agent` },
    caseStudy: {
      projectStatus:
        "Fully built and tested in a local n8n environment, including the MCP tool server, the confidence-gated booking flow and the automatic rollback path. It's a working prototype that demonstrates the architecture, not a production deployment: the MCP endpoint needs to move off a local tunnel, and availability needs load testing with concurrent bookings.",
      architecture:
        "Two workflows, connected over MCP. The Telegram agent workflow receives the message, builds a stable customer identity from the Telegram user ID, and claims message-level idempotency in Postgres before anything else happens: a duplicate delivery throws a unique-constraint violation and is dropped silently. The message then goes to a Gemini-backed agent with access to seven tools exposed by the second workflow, the MCP calendar server.\n\nFor a booking, the system prompt enforces a fixed order: Calendar acts first (creating the event), then Supabase is asked to record it, which is the real gate. A business-hours trigger, a duration bound and an exclusion constraint against overlapping time ranges decide whether the booking is valid, whatever the agent believed. If Supabase rejects it, the agent deletes the calendar event it just created.\n\nA second unique constraint on (customer_id, start_time) handles a subtler case: a customer's own retried request. Without it, a timeout-and-resend would look identical to two customers grabbing the same slot. With it, a same-customer retry returns zero rows and no error and is confirmed normally, while a real cross-customer conflict still throws.",
      decisions: [
        "Calendar acts first, Supabase decides: the customer-facing invite only stands once the database has accepted the booking",
        "Business hours, duration bounds and overlap prevention are real Postgres constraints and a trigger, not instructions to the model",
        "Message idempotency uses a unique constraint and the error output itself, rather than a separate lookup-then-insert",
      ],
      challenges: [
        "A customer's own retried booking was being rejected as a conflict even though the original had succeeded. The fix was validated with concurrent SQL inserts against Supabase, since model and network latency made a true race impossible to force through Telegram",
        "A rejected database write could leave a calendar event behind with no matching record, because booking is two writes. Fixed by making the fallback an explicit rollback that deletes the event",
        "Field-shape mismatches between what the agent sent and what a tool expected failed with no useful message: attendees had to be an array, and a duration with no default could reach a parameterised query as undefined",
      ],
      errorHandling: [
        "An error from record_appointment (the real gate) is a genuine rejection: the agent explains, offers another time and rolls back the calendar event",
        "Zero rows and no error from record_appointment means a safe same-customer retry, confirmed normally",
        "Any other failure falls back to one fixed, honest message that the system is temporarily unavailable",
      ],
      retryStrategy: [
        "The agent node retries on failure (3 tries, 5-second wait) before the fixed fallback message",
        "Telegram replies retry up to 5 times with a 2-second wait, since a dropped reply is worse than a late one",
      ],
      security: [
        "customer_id comes from Telegram itself; the agent is told never to ask for one or accept one from the customer",
        "Every mutating query filters on customer_id in the WHERE clause, so one customer can never modify another's row",
        "The MCP tool server runs behind its own webhook path, separate from the customer-facing workflow",
      ],
      whatWorkedWell:
        "Treating “the agent decided to call a tool” and “the tool's effect actually happened” as two separate things. That separation is what makes the rollback possible, and it's the discipline I want before any agent touches something transactional.",
      biggestChallenge:
        "Telling a genuine double booking apart from a customer's own retried request, when both looked identical to the database until a second, more specific constraint distinguished them.",
      futureImprovements: [
        "Make the retry key partial (WHERE status = 'confirmed'): today a cancelled booking still holds its (customer, start time) pair, so rebooking that exact slot would be mistaken for a retry. Found in a later review",
        "Move the MCP endpoint off a local tunnel onto a stable hosted URL",
        "Load test availability under real concurrent bookings, and add a rate limit ahead of the agent",
        "Roll back the rarer direction too: a Calendar failure after a successful Supabase write",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "stripe-docs-support-bot",
    number: "04",
    title: "Stripe Docs Support Bot",
    group: "automation",
    featured: false,
    kind: "RAG · Telegram",
    date: "Sep 2026",
    status: { state: "warn", label: "Built · manually tested" },
    tagline:
      "A Telegram bot that answers Stripe integration questions by retrieving Stripe's own docs, and says so plainly when it doesn't know.",
    stack: ["n8n", "Gemini", "Hugging Face", "Supabase", "PostgreSQL", "Telegram", "Google Sheets"],
    problem:
      "An LLM's knowledge of a fast-moving API like Stripe's goes stale, and a model answering integration questions from memory will eventually give a confident, wrong answer. The hard part isn't hooking up retrieval; it's making retrieval work against real documentation formatting, and making the agent admit when what it retrieved doesn't answer the question.",
    solution:
      "A RAG pipeline over 26 official Stripe documentation pages, with a custom step that converts Stripe's pipe-delimited tables into plain sentences before embedding, because raw table syntax embeds poorly against natural-language questions. The agent treats irrelevant retrieved content the same as no content, rather than as a springboard to answer from general knowledge.",
    keyFeatures: [
      "Answers questions on Stripe Payments, Checkout, Billing, Webhooks, Disputes and Errors from the retrieved documentation",
      "Refuses to answer from general knowledge when the retrieved context doesn't address the question",
      "Per-user conversation memory on Telegram, isolated by chat ID, so follow-ups keep their context",
      "A custom ingestion step flattens pipe-delimited tables into sentences before chunking and embedding",
      "Every conversation turn is logged to Google Sheets for review",
    ],
    outcome:
      "The bot answers from Stripe's current documentation instead of the model's training data, and declines questions outside its 26-page corpus rather than guessing. That refusal behaviour was the harder engineering problem, and it's the part of this build I'd point to first.",
    proof: ["26 Stripe pages in pgvector", "Tables flattened before embedding", "Declines what it can't answer"],
    image: {
      src: "/media/canvas-stripe-rag.webp",
      w: 2000,
      h: 1949,
      alt: "The Stripe docs support bot workflows in n8n: ingestion pipeline and Telegram agent",
    },
    links: { source: `${DEMOS}/stripe-docs-support-bot` },
    caseStudy: {
      projectStatus:
        "Fully built and manually tested across ambiguous, out-of-corpus and multi-turn conversations. There's no automated evaluation suite yet; correctness was verified by hand. That suite is the next step: a small labelled test set to catch retrieval regressions automatically.",
      architecture:
        "A separate ingestion workflow pulls 26 Stripe documentation pages, cleans them (including the table-flattening fix), chunks them with a recursive character splitter at 1,800 characters with 200 of overlap, and embeds each chunk with mxbai-embed-large-v1 through Hugging Face's Inference API at 1,024 dimensions. Chunks land in a Supabase table with pgvector, queried through a match_stripe_docs function.\n\nAt runtime, a Telegram trigger feeds a Gemini-backed agent with a stripe_docs retrieval tool and Postgres chat memory keyed by chat ID, so follow-ups carry context. Every turn is logged to Google Sheets. Replies use Telegram's HTML mode with explicit escaping, because Stripe's docs are full of angle-bracket placeholders and snake_case that break Telegram's Markdown parser.",
      decisions: [
        "Supabase with pgvector over n8n's in-memory store, which resets with the workflow and can't support a real ingestion-then-runtime split",
        "Table flattening is fenced-code-aware, since Stripe's tables aren't consistently formatted as Markdown",
        "HTML parse mode with manual escaping over Telegram's Markdown mode, which broke unpredictably on Stripe's code syntax",
      ],
      challenges: [
        "Stripe's error reference lists fields as pipe-delimited tables, which embed poorly against natural-language questions, so a fully ingested page still failed to answer questions about it. Fixed by converting those lines to sentences before chunking",
        "The agent used loosely related content as a springboard to answer from general knowledge. Fixed by separating “did retrieval return something” from “does it answer this”, and treating a no on the second the same as an empty retrieval",
        "Several embedding providers were tried mid-build (OpenAI, Ollama, Gemini) before settling on mxbai-embed-large-v1 for reliable dimensions and quality",
      ],
      errorHandling: [
        "A retrieval with no relevant content routes the agent to tell the user, rather than falling back to general knowledge",
        "Conversation memory is scoped per chat ID, so one user's context can't leak into another's",
      ],
      retryStrategy: [
        "No special retry logic beyond n8n's defaults: it's a read-heavy pipeline where a failed retrieval is safe to surface as “I don't know”",
      ],
      security: [
        "Logs store what was asked and answered, never credentials or account data, since the bot answers documentation questions only",
        "Memory isolation by chat ID prevents cross-user context bleed",
      ],
      whatWorkedWell:
        "The table-flattening fix. It's a small preprocessing step, but it was the reason a fully embedded page still failed real questions: retrieval quality depends on document structure, not just on having the right content in the store.",
      biggestChallenge:
        "Getting the agent to tell “I retrieved something” apart from “I retrieved something that answers this”. A naive grounding instruction treats them the same, and that's what causes confident wrong answers even with retrieval in place.",
      futureImprovements: [
        "A small labelled test set to catch retrieval regressions automatically",
        "A relevance-score threshold, so a weak match counts as no match",
        "A larger corpus (Stripe Tax, Stripe Connect)",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "lab-results-follow-up",
    number: "05",
    title: "Lab Results Follow-Up",
    group: "automation",
    featured: true,
    kind: "Workflow · clinic operations",
    date: "Aug 2026",
    status: { state: "warn", label: "Built · not hardened" },
    tagline:
      "Makes sure lab results actually reach patients, with reminder ladders and escalation to a community health worker when nobody confirms.",
    stack: ["n8n", "PostgreSQL", "Gmail", "Webhooks"],
    problem:
      "In many clinics a result is ready but the patient never comes back for it: they weren't told, they forgot, or they couldn't make it. For a critical result that gap is dangerous, and tracking by hand who has and hasn't collected their results doesn't scale.",
    solution:
      "Staff register each result in a form. Critical results alert the patient and the requesting clinician at once; every result then runs a timed reminder ladder (critical: 2, 6 and 24 hours; routine: 6, 24 and 48 hours). Patients confirm pickup through a link. If a result is still unconfirmed at the final check, a Community Health Extension Worker is emailed to follow up in person.",
    keyFeatures: [
      "A registration form with common tests: malaria RDT, TB, HIV, hepatitis B and C, FBC, glucose, HbA1c, lipids, liver and kidney function, and more",
      "Validates emails against a disposable-domain blocklist, normalises Nigerian phone numbers and issues a tracking ID",
      "Separate ladders for critical and routine results",
      "Pickup-confirmation links for patients and follow-up links for health workers, with strict ID checks",
      "Every unconfirmed result ends with a person, not a dead letter",
    ],
    outcome:
      "A working workflow with both escalation paths built and a written production-readiness audit. It isn't hardened for real patient data yet, and the audit says exactly why.",
    proof: ["Critical and routine ladders", "Ends with a health worker", "Written readiness audit"],
    image: {
      src: "/media/canvas-lab-follow-up.webp",
      w: 2400,
      h: 1365,
      alt: "The lab results follow-up workflow in n8n: registration, critical and routine reminder ladders, confirmation webhooks",
    },
    links: { source: `${GH}/clinic-lab-escalation-system` },
    caseStudy: {
      projectStatus:
        "Built and working in n8n; not production-hardened. The repository includes a candid readiness audit: webhook authentication, retries, idempotency and patient-data privacy are the highest-value next steps, since this touches health information.",
      architecture:
        "A form trigger collects the result. A Code node validates and normalises it (emails, a disposable-domain blocklist, phone numbers to +234, a result flag of critical or routine) and generates a tracking ID in the form LR-YYYYMMDD-XXXXXX, then the record is inserted into Postgres.\n\nAn If node branches on urgency. Critical results email the patient and the clinician immediately, then wait 2 hours, remind, wait 4 more, remind, wait 18 more, and check Postgres; routine results email the patient, then remind at 6 and 24 hours and check at 48. If the result is still unconfirmed at the check, the patient gets a final notice and the Community Health Extension Worker is emailed.\n\nTwo webhooks close the loop: Confirm Pickup and Follow-Up Done each validate the tracking ID strictly, update Postgres and respond to the patient or health worker.",
      decisions: [
        "Escalation goes to a Community Health Extension Worker, the person who can actually visit the patient, rather than to another inbox",
        "Different ladders for different urgency: critical results move in hours, routine ones in days",
        "Tracking IDs have a strict format, and the webhooks reject anything that doesn't match before touching the database",
      ],
      challenges: [
        "Found in a later review: as wired, the intermediate reminders are sent even if the patient has already confirmed, because each wait fans out to the email and a no-op joined by a merge, and only the final step re-checks Postgres. The fix is a confirmation check before every reminder, or a scheduled sweep instead of long waits",
        "Long Wait nodes hold an execution open for up to two days per result; fine at clinic scale, but a scheduled sweep would scale better",
      ],
      errorHandling: [
        "Invalid input fails fast with a clear error before anything is stored",
        "A workflow-level error workflow is attached; there are no node-level fallbacks yet (documented)",
      ],
      retryStrategy: ["None yet: no node has retry-on-fail enabled. It's listed in the readiness audit as a gap"],
      security: [
        "Credentials live in n8n's encrypted credential store",
        "The confirmation webhooks are unauthenticated today, and patient data has no retention policy yet; both are documented as the first things to fix",
      ],
      whatWorkedWell:
        "Ending every path with a person. Automation handles the reminders; a health worker handles the patient who doesn't respond.",
      biggestChallenge:
        "Being honest about readiness. It works, but it handles health data, so the audit lists every gap before anyone deploys it.",
      futureImprovements: [
        "Signed or token-protected confirmation links",
        "A confirmation check before every reminder",
        "Retries on email and database steps, and an audit log of every reminder sent",
        "Data minimisation and retention rules for patient information",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "loan-collections-router",
    number: "06",
    title: "Loan Collections Router",
    group: "automation",
    featured: false,
    kind: "Workflow · micro-lending",
    date: "Aug 2026",
    status: { state: "warn", label: "Built · not hardened" },
    tagline:
      "Daily collections triage for a micro-lender: an AI reads each overdue account, code routes it, and people get the unsure ones.",
    stack: ["n8n", "Gemini", "PostgreSQL", "WhatsApp", "Gmail", "Twilio"],
    problem:
      "A micro-lender's collections team works through overdue accounts by hand every day: who to remind, who to offer a new plan, who needs a legal letter. It's slow and inconsistent, and the wrong tone with a struggling borrower can lose a customer who would have paid.",
    solution:
      "Every morning the workflow pulls delinquent accounts that haven't been contacted today. A Gemini agent reads each account and its messages and returns a risk tier, a sentiment score and its confidence as structured JSON. Code checks the answer, escalates a “medium” with hostile sentiment to “high”, and routes it only if confidence is at least 0.6: low risk gets an SMS reminder, medium a WhatsApp restructuring offer, high a legal referral. Everything else goes to a person.",
    keyFeatures: [
      "Structured output: risk tier, sentiment from −1 to 1, confidence from 0 to 1, and a one-line rationale",
      "Code guards: an unknown tier becomes “review” with zero confidence; a negative-sentiment medium escalates to high",
      "A confidence gate at 0.6: anything below goes to human review",
      "SMS reminders (Twilio), WhatsApp restructuring offers and legal referrals by email",
      "A hosted payment page and confirmation flow; every contact and payment logged to Postgres",
      "Each account contacted at most once a day, plus a daily summary for staff",
    ],
    outcome:
      "A complete collections flow with the decision path in code and people in the loop for anything uncertain. Built and documented; not yet hardened for real money, and the readiness audit lists what's missing.",
    proof: ["0.6 confidence gate", "Deterministic sentiment override", "People get the unsure ones"],
    image: {
      src: "/media/canvas-collections.webp",
      w: 2400,
      h: 1016,
      alt: "The collections router workflow in n8n: daily trigger, risk agent, confidence check, routing to SMS, WhatsApp, legal or human review",
    },
    links: { source: `${GH}/loan-collection-system` },
    caseStudy: {
      projectStatus:
        "Built and working in n8n; not production-hardened. The readiness audit puts webhook authentication, retries, idempotency and monitoring first before this handles real money.",
      architecture:
        "A schedule trigger fetches delinquent accounts whose last contact was before today, most overdue first, and loops over them one at a time. A LangChain agent node with Gemini and a structured output parser returns the risk tier, sentiment, confidence and rationale.\n\nA Code node guards the answer: a tier outside low, medium and high becomes “review” with zero confidence, and a medium tier with sentiment below −0.3 is escalated to high. An If node requires confidence of at least 0.6; a Switch then routes low to an SMS reminder, medium to a WhatsApp restructuring offer, and high to a compiled legal package sent by email, with its fallback output going to human review.\n\nEvery path logs the contact to Postgres and marks the account contacted. Separately, two webhooks serve a hosted payment page and a confirmation that clears the account and logs the payment, and the same trigger compiles a daily summary for staff.",
      decisions: [
        "The model proposes a tier; code has the last word, including a hard-coded escalation for hostile or despairing replies",
        "Anything the model isn't confident about goes to a person instead of a channel",
        "The fetch query skips accounts already contacted today, so a re-run can't message a borrower twice in a day",
      ],
      challenges: [
        "Found in review before publishing: the “Daily Trigger” was still set to fire every second from testing, and the execution log wrote the message reference into its status column. Both are fixed in the published version",
        "Choosing the threshold: too strict and nothing is automated, too loose and the model's guesses reach borrowers. 0.6 with a human-review fallback is the starting point, to be tuned on real outcomes",
      ],
      errorHandling: [
        "Out-of-vocabulary answers from the model are converted to a human-review case, never routed",
        "A workflow-level error workflow is attached; there are no node-level fallbacks yet (documented)",
      ],
      retryStrategy: ["None yet: no node has retry-on-fail enabled. It's listed in the readiness audit as a gap"],
      security: [
        "All credentials (Postgres, Gmail, Twilio, WhatsApp, Gemini) live in n8n's encrypted credential store",
        "The payment webhooks are unauthenticated today; it's the first item in the audit",
      ],
      whatWorkedWell:
        "Keeping the model's job small. It reads and classifies; it never chooses a channel or writes to the database directly.",
      biggestChallenge:
        "Deciding where judgement should sit. Collections is sensitive: the right tone keeps a customer, the wrong one loses them. Confident cases are automated; everything else is a person's call.",
      futureImprovements: [
        "Authenticate the payment webhooks (signatures or tokens)",
        "Retries and idempotency keys on every send",
        "Monitoring beyond the error workflow, and data-retention rules for borrower information",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "invoice-intake-anomaly-detection",
    number: "07",
    title: "Invoice Intake & Anomaly Detection",
    group: "automation",
    featured: false,
    kind: "Workflow · finance ops",
    date: "Sep 2026",
    status: { state: "warn", label: "Built · tested end to end" },
    tagline:
      "Catches invoice math errors and duplicate payments before they cost money, with zero manual data entry.",
    stack: ["n8n", "Gemini", "Gmail", "Google Sheets", "Slack"],
    problem:
      "In the brief, an advisory firm processes vendor invoices by hand: someone opens each emailed PDF, retypes the totals into a spreadsheet and eyeballs the numbers. Two failure modes recur and both cost money when missed: line items that don't add up to the stated total, and the same invoice getting paid twice because it was re-sent.",
    solution:
      "A workflow that watches the inbox, extracts every field from the PDF with Gemini, recalculates the math independently and checks the invoice number against everything already logged. Valid invoices are logged silently. Anything genuinely wrong gets a Slack alert. Duplicates are caught and filed in their own log, never a second row on the main ledger.",
    keyFeatures: [
      "Watches a Gmail inbox for PDF invoices, with no manual upload step",
      "Gemini extracts invoice number, vendor, totals and dates as structured fields",
      "Recalculates the line-item sum independently and flags any mismatch down to the exact difference",
      "Duplicate invoice numbers are filed to a separate audit tab, never logged twice",
      "Only a genuine anomaly triggers a Slack alert; valid invoices log silently so the channel stays useful",
      "Every invoice lands in one sortable Google Sheet with its status and a processed timestamp",
    ],
    outcome:
      "This replaces a review step that depended on someone catching a bad total by eye. Every invoice is checked the same way, every time, and the only thing that reaches a person is something that needs a decision.",
    proof: ["Math re-checked in code", "Duplicates never reach the ledger", "Alerts only on real anomalies"],
    image: {
      src: "/media/canvas-invoice.webp",
      w: 2400,
      h: 566,
      alt: "The invoice intake workflow in n8n: Gmail trigger, Gemini extraction, math validation, duplicate check, Sheets and Slack",
    },
    links: { source: `${DEMOS}/invoice-intake-anomaly-detection` },
    caseStudy: {
      projectStatus:
        "Fully built and tested end to end in n8n, including Gmail intake, Gemini extraction, math validation and duplicate prevention. Three test invoices (two valid, one duplicate resend) are in the repository to demonstrate each path. The next phase is a real approve/reject loop back into the sheet.",
      architecture:
        "A Gmail trigger polls for emails with a PDF attachment and “invoice” in the subject. The PDF goes to a Gemini-backed extraction step that returns the invoice number, client name, vendor email, total, line-item sum, invoice date and due date as structured fields.\n\nTwo independent checks follow. A Code node recalculates the line items and compares them with the stated total, catching any mismatch down to the exact difference. In parallel, a Sheets lookup checks whether the invoice number has already been logged. A Merge node brings both results together before anything is written.\n\nValid, non-duplicate invoices get one row in the Invoices tab and nothing else happens. A math discrepancy is logged and triggers a Slack alert. A duplicate is redirected entirely to a separate Duplicates Log tab, so there's still a full audit trail but never a second payable-looking row.",
      decisions: [
        "Duplicate detection matches on invoice number alone rather than vendor plus number: simpler, and reliable enough for a small, known vendor list",
        "A Filter node between the ledger write and Slack, so only a genuine anomaly reaches the channel",
        "Duplicates get their own log tab instead of flooding Slack or disappearing into n8n's execution history",
      ],
      challenges: [
        "The first duplicate check would have collided on two vendors that both issue INV-1001. A composite key was weighed against the project's scope and the simpler check kept, documented as a trade-off rather than an oversight",
        "The first Slack alert fired on every processed invoice, which trains people to ignore it. Fixed by gating it behind a Filter that only lets real anomalies through",
      ],
      errorHandling: [
        "Every external call (Gemini, Gmail, Sheets, Slack) retries three times with a 4-second wait",
        "A dedicated error workflow alerts separately from the business alerts",
        "A flagged invoice still gets a row: nothing about a mismatch stops the record from existing",
      ],
      retryStrategy: [
        "The Gmail trigger polls every 60 seconds: a small, predictable lag rather than a missed email",
        "External API calls retry three times before the error workflow takes over",
      ],
      security: [
        "Only the first PDF attachment on an email is processed, a deliberate scope limit",
        "Totals are parsed as plain numbers with currency symbols stripped: a single-currency assumption, stated up front",
        "No OCR fallback yet: a scanned invoice with no text layer fails extraction, a known limitation",
      ],
      whatWorkedWell:
        "Separating visibility from alerting. A duplicate is still recorded where a person can find it, but it never interrupts anyone, because there's no decision left to make.",
      biggestChallenge:
        "Getting the duplicate check right without over-engineering it. The harder, better call was recognising that the simpler check was the right size for the project.",
      futureImprovements: [
        "Slack approve/reject buttons that write the decision back to the ledger",
        "A weekly digest of dollars processed and flags caught",
        "Multi-currency normalisation and an OCR fallback for scanned PDFs",
        "Budget thresholds that route large invoices for manager sign-off",
      ],
    },
  },
  // ------------------------------------------------------------------------------------------------
  {
    slug: "ai-lead-scoring-and-routing",
    number: "08",
    title: "AI Lead Scoring and Routing",
    group: "automation",
    featured: false,
    kind: "Workflow · sales ops",
    date: "Sep 2026",
    status: { state: "warn", label: "Built · tested end to end" },
    tagline:
      "Scores every inbound lead on intent and fit, then routes it to the right regional team with an SLA attached, automatically.",
    stack: ["n8n", "Gemini", "Google Sheets", "Gmail", "Slack"],
    problem:
      "A form fill only tells you what a prospect typed into structured fields. It doesn't tell you whether they're ready to buy or just browsing, and sorting that out by hand for every submission doesn't scale, especially once duplicate and low-quality submissions are mixed in.",
    solution:
      "A pipeline that sanitises every submission, filters out disposable emails and repeats before they reach anyone, then combines deterministic scoring (company size, budget, job title) with an AI read of intent and urgency from the free-text message. The combined score decides the SLA and which regional Slack channel is notified.",
    keyFeatures: [
      "A nine-field intake form with browser-level validation",
      "Sanitises input and blocks disposable or suspicious email domains before anything reaches the CRM",
      "Duplicate detection against the CRM sheet stops repeats from creating a second record or a second AI call",
      "Gemini reads the free-text message for intent and urgency, combined with deterministic scoring rules",
      "Three tiers: Hot gets a 1-hour SLA, Warm 24 hours, Cold is logged with no notification",
      "Routes to the right regional Slack channel and sends the lead a branded confirmation email",
    ],
    outcome:
      "Every lead gets the same consistent read, no submission waits for someone to triage it, and the team's attention goes to the leads worth an hour-long SLA.",
    proof: ["AI adds to the score, never decides it", "Duplicates stopped before the AI call", "1-hour SLA for hot leads"],
    image: {
      src: "/media/canvas-lead-scoring.webp",
      w: 2400,
      h: 773,
      alt: "The lead scoring workflow in n8n: form trigger, sanitising, duplicate check, Gemini scoring and regional routing",
    },
    links: { source: `${DEMOS}/ai-lead-scoring-and-routing` },
    caseStudy: {
      projectStatus:
        "Fully built and tested in n8n, covering sanitising, duplicate detection, AI scoring and regional routing end to end. The next phase is a real CRM instead of Google Sheets, and a feedback loop so sales can mark a Hot lead as a false positive.",
      architecture:
        "A form trigger collects nine fields and redirects the visitor to a thank-you page at once; the pipeline runs in the background. A sanitising node strips HTML, normalises shouted text, collapses whitespace and checks the email against disposable domains. If anything looks wrong, the submission goes to a review channel in Slack and stops: it never reaches the CRM or the AI.\n\nEverything that passes is looked up in the CRM sheet by email. If the lead already exists, they get a warm re-engagement email and the pipeline stops: no duplicate row and no duplicate AI call.\n\nNew leads go to Gemini, which returns a structured intent signal, an urgency flag and a one-sentence fit note. Those signals combine with deterministic rules (company size, budget, service type, job title) into one score, which decides the tier, the SLA and the regional Slack channel. Every lead is logged with its score and tier.",
      decisions: [
        "Validation is split across two layers: the browser catches what it can, the workflow catches what the browser can't",
        "AI signals add to a score rather than deciding the tier outright, so a lead still needs real structured signals to reach Hot",
        "alwaysOutputData on the CRM lookup, because Sheets returns zero items on no match, which would otherwise stop a brand-new lead",
      ],
      challenges: [
        "Structured fields alone missed what mattered: a big-budget lead who wrote “just exploring” scored the same as one who wrote “need this live by end of month”. Fixed with a structured intent and urgency read that feeds into, but doesn't override, the score",
        "A duplicate submission created a second row, a second Slack alert and a second Gemini call. Fixed with a lookup-and-merge step before scoring runs",
      ],
      errorHandling: [
        "Gemini calls retry three times, since a transient failure or malformed JSON would otherwise drop a valid lead",
        "A structured output parser enforces the shape of the AI's answer",
        "An error workflow catches uncaught failures separately from the business alerts",
      ],
      retryStrategy: [
        "The scoring step retries three times with a short wait before it counts as a failure",
        "Re-submitting the same email is always safe: duplicate detection catches it before anything is written",
      ],
      security: [
        "Disposable and suspicious domains are blocked before a submission reaches the CRM or the AI",
        "Every field is sanitised (HTML stripped, length capped) before it's stored or used in a prompt",
      ],
      whatWorkedWell:
        "Splitting validation into a browser layer and a workflow layer: not over-engineering the frontend, and not blindly trusting it either.",
      biggestChallenge:
        "Getting the AI's contribution right. It would have been easy to let the model's read decide the tier. The better design keeps deterministic signals as the backbone and lets AI add nuance on top.",
      futureImprovements: [
        "A real CRM instead of Google Sheets",
        "A feedback loop for false-positive Hot leads",
        "A weekly digest of volume, average score and SLA adherence by region",
        "Configurable scoring weights instead of hard-coded points",
      ],
    },
  },
];

export const ARCHIVE = [
  {
    title: "Global error handler",
    note: "One n8n error workflow that every other build reports to, instead of five drifting copies.",
    href: `${DEMOS}/global-error-handler`,
  },
  {
    title: "Self-hosted n8n blueprint",
    note: "A Render blueprint: n8n on managed Postgres, so it runs on a free instance with no persistent disk.",
    href: `${GH}/columba-n8n-infra`,
  },
];

export const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export function neighbours(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? PROJECTS[i - 1] : undefined,
    next: i >= 0 && i < PROJECTS.length - 1 ? PROJECTS[i + 1] : undefined,
  };
}
