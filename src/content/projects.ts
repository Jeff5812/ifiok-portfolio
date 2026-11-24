// Every project, in the structure the previous site used (problem, key features, outcome, full case
// study), extended with what's new. Facts come from each project's own repository: its README and
// architecture docs, its tests, its evaluation reports and its production-readiness audits.
// Written in first person, in the same voice as the write-ups on the previous site.

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
      "Turns screenshots of a WhatsApp deal into a proper record of what was agreed, what was paid and what's still owed.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Supabase", "Gemini", "Claude", "WhatsApp", "Docker", "Playwright"],
    problem:
      "A lot of business here gets agreed in chat. Prices are negotiated, part-payments are promised and delivery fees get added along the way. When there's a dispute, nobody has a record, just a long scroll of messages. Going through it by hand is slow, and asking an AI to summarize it is risky, because a model that picks the first price instead of the one that was finally agreed gives you a confident, wrong receipt.",
    solution:
      "I built Chat Receipt to read the screenshots or a WhatsApp chat export, but the AI only reports what happened: offers, counter-offers, acceptances and payment claims, each linked to the message it came from. Rules in the code then work out the agreed price, the totals and the payment status with exact decimal math. Every field gets a state (confirmed, inferred, missing or contradictory), and anything uncertain goes to a person to check before the PDF or image record is made.",
    keyFeatures: [
      "Upload chat screenshots or a WhatsApp export, check and correct the details, then download a PDF or PNG record",
      "Works on WhatsApp too. Send screenshots to a number, fix details by typing (“it's 20k”) and confirm in the chat",
      "The AI reports events and cites the messages they came from, then the rules decide the price, so the accepted offer wins over the first quote",
      "Every figure has to appear in the message it cites. If two values contradict each other, the field is left empty and both are shown",
      "A payment mentioned in a chat is only a claim until the customer says the money arrived, and reused transfer references get flagged",
      "The other party can confirm a record through a wa.me link",
    ],
    outcome:
      "Live on the web and on WhatsApp since 20 November 2026. On a held-out set of 77 synthetic conversations, 95% of checks passed and no wrong amount was ever marked “confirmed”. The backend has 785 passing tests.",
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
        caption: "The final record. The totals come from the backend's own calculation, not from the AI.",
      },
    ],
    links: { live: "https://chatreceipt.vercel.app", source: `${GH}/chatreceipt` },
    caseStudy: {
      projectStatus:
        "Live since 20 November 2026, running on free plans: the website on Vercel, the API on Render, Postgres on Supabase and Gemini's free tier, with the WhatsApp channel connected. All 13 planned engineering phases are done. What's left is written down: a real-browser check of very long receipts, a load test and a demo script with seed data.",
      architecture:
        "It's a modular monolith, one Next.js website and one FastAPI app on PostgreSQL, with three ways in. The website is stateless. Screenshots go to the AI in one structured request, the browser holds the draft while the person reviews it, and every total comes from a decimal calculation endpoint. The WhatsApp channel checks Meta's signature, stores each message once and responds right away. A worker then reads the albums of screenshots, keeps the conversation going and sends replies through an outbound queue. A versioned /api/v1 engine serves integrations, and uploads there run as background jobs.\n\nThe intelligence pipeline transcribes the screenshots, merges them into one conversation (handling overlap, order and gaps) and asks the AI to interpret the events in each deal. Rules in negotiation.py and payments.py turn those events into a proposal where every field has a state. Validation and a single review policy then decide what blocks approval. Apart from the two AI calls, the whole pipeline is pure code, so every rule has unit tests.\n\nData lives in its own schema. Requests run under a restricted role with row-level security per customer. Versions, review decisions and events are append-only, enforced with grants and triggers, and money is stored as numeric all the way through. Jobs are rows claimed with FOR UPDATE SKIP LOCKED, under leases with fencing tokens, and outgoing events go through a transactional outbox, so results, job completion and events all commit together.",
      decisions: [
        "The AI interprets and the code decides. The model reports events along with the messages they came from, and its own idea of what was “agreed” is only used as a cross-check",
        "Every field gets its own state instead of one confidence score, because a person needs to know which detail to check, and “78% sure” doesn't tell them that",
        "PostgreSQL for everything, including the job queue. There's no Redis or message broker to run or pay for, and results, completion and events commit in one transaction",
        "The database keeps each customer's data apart, so a missing WHERE clause in the app code can't leak another customer's records",
        "On WhatsApp, store first and do the work later. The webhook only verifies, stores and acknowledges, because Meta retries slow webhooks and AI calls take a few seconds",
        "A payment in a chat stays a claim until the customer confirms the money arrived, because fake transfer receipts are common",
        "A modular monolith instead of microservices. The real limits are AI quota and WhatsApp's per-message charges, not CPU",
      ],
      challenges: [
        "Before I changed the rules on 19 November, the development set scored 16 of 39 fully correct, with a review precision of 50%. Clean records were being flagged because of wording like “pay on delivery” or an implied quantity of one. I fixed the rules instead of the prompt and re-scored the saved answers at no AI cost, which took it to 36 of 42",
        "Gemini's newest model was often overloaded on the free tier, so I let the evaluations pick the main model and added automatic fallback for overloads, timeouts and rate limits",
        "A chat screenshot never says whose phone it is. Asking up front slowed everyone down, so now the question comes once, at Confirm, and only when a name is missing. The answer is remembered after that",
        "WhatsApp now charges for replies above 1,000 a month, so I cut a returning customer's receipt flow from four replies to three",
      ],
      errorHandling: [
        "Failures are sorted into retryable and permanent, and retries back off up to a set maximum",
        "A worker that stalls loses its lease, and a fencing token stops it from finishing work another worker has already taken over",
        "No network call happens inside a database transaction",
        "Contradictory or unsupported values are never guessed. The field is left empty and the possible values are listed",
      ],
      retryStrategy: [
        "WhatsApp messages are stored once, keyed by Meta's message ID, so repeated deliveries are harmless",
        "Outgoing WhatsApp messages go through a queue with retries, with Meta's 24-hour window in mind",
        "Idempotency keys are saved in the same transaction as the change they protect, and optimistic concurrency stops two tabs from overwriting each other",
      ],
      security: [
        "Row-level security per customer in Postgres, with requests switched to a restricted role",
        "Meta's webhook signatures are verified, and a forged signature is refused (I checked this in production on 21 November)",
        "Rate limits count the address the proxy reports, so a spoofed X-Forwarded-For can't burn through the AI quota",
        "Screenshots from the website are processed in memory and thrown away. Logs keep counts and durations, never the conversation itself",
      ],
      whatWorkedWell:
        "Keeping the intelligence code pure. The AI requests are the only network calls, so every rule is unit-tested, and I can re-score stored AI answers after any rule change for free. That's how the evaluation improved without spending any quota.",
      biggestChallenge:
        "Deciding what the AI should be allowed to decide. The easy way is to ask the model for a total. The way you can trust is to make it report who offered what, and where, then let the rules do the math and refuse to guess.",
      futureImprovements: [
        "Match payment claims against real bank statements",
        "Test on real chats (with consent) labeled by a person, not just synthetic ones",
        "A real-browser check of very long names, many items and page overflow in the PDF",
        "A load test of the job queue, and a demo script with seed data",
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
      "A cinematic portfolio site for a video editing studio, with a back office that uploads films straight to Cloudflare R2 and writes their subtitles automatically.",
    stack: ["Next.js", "TypeScript", "Supabase", "Cloudflare", "Vercel", "Workers AI", "Playwright"],
    problem:
      "The studio needed a reel that plays well on mobile data, and a way for the owner to publish new films without needing a developer. The problem is that films are hundreds of megabytes. They can't pass through a serverless function (Vercel caps requests at 4.5 MB), uploads die when the connection drops, and writing subtitles by hand takes hours.",
    solution:
      "I made films upload from the owner's browser straight to private R2 storage in 8 MiB parts, three at a time. If the connection drops or the tab closes, the upload picks up from whatever R2 already has. Playback uses one-hour signed links that only work for published films. When a new film comes in, the browser splits its audio at quiet moments, Whisper on Workers AI writes the timed text, and Gemma translates it line by line into subtitle files.",
    keyFeatures: [
      "Resumable uploads straight to R2, in 8 MiB parts, three at a time, with retries and stall detection",
      "Automatic subtitles. The audio is decoded in the browser, split at silences, transcribed by Whisper and translated by Gemma",
      "A video player you can fully control from the keyboard, with captions, speed, picture-in-picture and resume where you left off",
      "Nothing downloads until you press play, and previews are skipped on phones, reduced motion and data-saver connections",
      "An owner-only back office (“the cutting room”), protected by row-level security and sessions checked on the server",
      "A film-inspired design with timecodes, a film strip, a playhead and a film-grade color palette",
    ],
    outcome:
      "Live and in use by the client, running on free tiers plus R2's pay-as-you-go storage. 179 tests cover the upload logic, subtitles, layout rules and a full owner journey against real services.",
    proof: ["Live for a client", "179 tests incl. end-to-end", "Uploads survive a closed tab"],
    image: {
      src: "/media/mayor-edits-desktop.webp",
      w: 1600,
      h: 1000,
      alt: "The Mayor Edits home page on a desktop: the headline 'We make every frame matter.' beside the studio's featured documentary",
    },
    links: { live: "https://mayor-edits.vercel.app", source: `${GH}/mayor-edits` },
    caseStudy: {
      projectStatus:
        "Live and in use by the client. It's built on Next.js 16 with Cache Components, so public pages are cached and refresh the moment the owner publishes, and normal visits never touch the database. I'm keeping it small on purpose. New features get added when there's a real reason for them.",
      architecture:
        "The public page reads published projects through a cache tag that every admin change expires, so updates show up instantly without a redeploy. It never reads cookies and never gets a video's storage key.\n\nTo upload, the browser asks the server what to send. The server checks that it's the admin, then returns signed links for each missing 8 MiB part, and the browser sends the parts straight to R2, three at a time, with retries. To finish, the server lists what R2 has, completes the upload, checks the size and updates the project. Uploads belong to the tab rather than the page, so the owner can keep working while one runs.\n\nPlayback only starts when a visitor presses play. A route reads the project as an anonymous visitor (so row-level security only finds published films) and returns a one-hour signed link. Subtitles sit next to each video in R2 as WebVTT files. The automatic ones are made in the owner's browser and through Workers AI, and they go through the same checks as an uploaded file.",
      decisions: [
        "Video never goes through the app server. The browser uploads to R2 with a signed URL for each part",
        "One MP4 (H.264) per film at 5–8 Mbps instead of adaptive streaming. It's simple and cheap, and the owner gets a warning above 10 Mbps",
        "Thumbnails are cropped to 16:9 and kept near 350 KB in the browser, because Supabase's free plan has no image transforms",
        "Automatic subtitles only add missing languages, so a file someone corrected by hand is never overwritten",
      ],
      challenges: [
        "With Cache Components, Next.js keeps a page alive after you leave it, so a hidden video kept playing in the background. I fixed it by pausing the video in a layout-effect cleanup and starting each visit to “New project” fresh",
        "Browsers never retry a subtitle track that fails to load, so the player tries twice more with a new track element, then lets the viewer know",
        "iPhones can't make a web page full screen, so on an iPhone the films open in the phone's own player instead",
      ],
      errorHandling: [
        "Network failures and 408, 429 and 5xx responses retry after 1, 3, 5, 10, 20 and 30 seconds, and a part with no progress for a minute is sent again",
        "If there's no connection at all, the upload waits as long as it takes and carries on by itself",
        "If a stored video can't be fetched for subtitles, the panel asks for the file from the device instead",
      ],
      retryStrategy: [
        "R2 remembers which parts arrived, so choosing the same file again resumes instead of restarting",
        "Expired playback links are fetched again automatically, and they stop working once a film is unpublished",
      ],
      security: [
        "Every server action checks the admin session first, and row-level security enforces access in the database",
        "R2 keys stay on the server, and the app doesn't need a Supabase service-role key at all",
        "The public page has no owner controls, so it looks the same to everyone, signed in or not",
      ],
      whatWorkedWell:
        "Making the upload belong to the tab instead of the page. The owner can move around the back office, start the next project or lose signal, and the upload just keeps going.",
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
      "An AI receptionist that books, reschedules and cancels consultations over Telegram, with the database, not the model, deciding what's actually allowed to happen.",
    stack: ["n8n", "MCP", "Gemini", "Google Calendar", "Supabase", "PostgreSQL", "Telegram"],
    problem:
      "An LLM agent is good at understanding what a customer wants. It's a bad place to put the actual source of truth for anything transactional, since a model can misremember, get talked into contradicting itself, or simply be wrong with total confidence. Scheduling needs something underneath it that can't be talked out of enforcing a rule.",
    solution:
      "I built a Telegram scheduling agent split into two workflows connected over MCP. One is the agent workflow that handles the conversation, and the other is a tool server that exposes calendar and database operations as tools the agent can call. The agent decides what the customer wants. Supabase, with real database constraints, decides whether it's allowed to happen. Google Calendar acts first, Supabase confirms second, and if Supabase says no, the calendar event gets rolled back automatically.",
    keyFeatures: [
      "Books, reschedules, cancels and lists consultations through normal conversation on Telegram",
      "Google Calendar creates the customer-facing event and sends real calendar invites",
      "Supabase Postgres has the final say, with database constraints that make double booking impossible, not just unlikely",
      "A customer's own retried request is recognized and confirmed instead of being rejected as a false conflict",
      "Duplicate Telegram message deliveries are dropped before they ever reach the agent",
      "If the database rejects a booking after the calendar event already exists, the event is deleted automatically, so the two systems never drift out of sync",
    ],
    outcome:
      "The result is a receptionist that never double-books, never leaves the calendar and the database disagreeing about what happened, and treats its own model's confidence as advice, not the final word. It's the clearest, smallest version of that pattern I could build end to end.",
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
          "The separate MCP tool server the agent calls: check_availability, book_appointment, reschedule_appointment, cancel_appointment, record_appointment, update_appointment_record and list_my_appointments. Each one talks to Google Calendar or Postgres directly.",
      },
    ],
    links: { source: `${DEMOS}/meridian-scheduling-agent` },
    caseStudy: {
      projectStatus:
        "Fully built and tested in a local n8n environment, including the MCP tool server, the confidence-gated booking flow and the automatic rollback path. This is a working prototype that demonstrates the architecture, not a production deployment. Before real customers use it, the MCP endpoint needs to move off a local tunnel, and the availability logic needs load testing with bookings closer together than manual testing can produce.",
      architecture:
        "Two workflows, connected over MCP. The Telegram agent workflow receives the message, builds a stable customer identity from the Telegram user ID, and claims message-level idempotency in Postgres before anything else happens. A duplicate delivery throws a unique-constraint violation and is dropped instead of being processed twice. The message then goes to a Gemini-backed agent with access to seven tools exposed by the second workflow, the MCP calendar server.\n\nThe agent calls those tools in a fixed order that the system prompt enforces. For a booking, Calendar acts first and creates the event, then Supabase is asked to record it, and that's the real gate. Supabase's own rules (a business-hours trigger, a duration limit and an exclusion constraint against overlapping time ranges) decide whether the booking is actually valid, whatever the agent believed when it called the tool. If Supabase rejects it, the agent deletes the calendar event it just created, so a rejected booking never leaves a live event behind.\n\nA second unique constraint on (customer_id, start_time) handles a trickier case, a customer's own retried request. Without it, a timeout and resend would look exactly like two different customers grabbing the same slot. With it, a retry from the same customer returns zero rows and no error and is confirmed as normal, while a real conflict between two customers still throws.",
      decisions: [
        "Calendar acts first, Supabase decides. I chose that order so the calendar invite the customer sees only stands once the database has actually accepted the booking",
        "Business hours, duration limits and overlap prevention are enforced with real Postgres constraints and a trigger, not by asking the LLM to police itself, so the rule holds even if the agent's reasoning is wrong",
        "Message idempotency uses a Postgres unique constraint and n8n's error output instead of a separate lookup before the insert. The duplicate case is the constraint violation itself, so no extra query is needed",
      ],
      challenges: [
        "A customer's own retried booking was being read as a real conflict and rejected, even though the first request had worked. I tested the fix directly with concurrent SQL inserts against Supabase, because model and network delays made it impossible to reliably force a real race through Telegram",
        "Because a booking is two separate writes, a rejected Supabase write could leave a calendar event behind with no matching record. I fixed it by making the agent's fallback an explicit rollback that deletes the calendar event, instead of just reporting the failure",
        "When the agent sent a field in a different shape than a tool expected, it failed with no useful message. The attendees field needed to be an array, not a string, and a duration with no default could end up undefined and crash a parameterized query",
      ],
      errorHandling: [
        "An error from record_appointment (the real booking gate) is treated as a real rejection. The agent explains why, offers another time and rolls back the calendar event it already created",
        "Zero rows and no error from record_appointment means it's a safe retry from the same customer, so it's confirmed as normal",
        "Any other failure falls back to one fixed message telling the customer the system is temporarily unavailable, instead of the agent making up an explanation",
      ],
      retryStrategy: [
        "The scheduling agent node retries on failure (3 tries, 5 seconds apart) before falling back to the fixed message",
        "Telegram replies retry up to 5 times, 2 seconds apart, since a dropped reply is worse than a slightly late one",
      ],
      security: [
        "customer_id comes from Telegram itself. The agent is told never to ask for one or accept one from the customer",
        "Every query that changes data filters on customer_id in the WHERE clause, so one customer's request can never change another customer's row",
        "The MCP tool server runs behind its own webhook path, separate from the customer-facing Telegram workflow",
      ],
      whatWorkedWell:
        "Treating “the agent decided to call a tool” and “the tool's effect actually happened” as two separate things. That's what makes the rollback possible, and it's the same discipline I'd want in place before letting any agent touch something transactional for a client.",
      biggestChallenge:
        "Telling a real double booking apart from a customer's own retried request. Both looked the same from the database's point of view until I added a second, more specific constraint to tell them apart.",
      futureImprovements: [
        "Make the retry key partial (WHERE status = 'confirmed'). Right now a canceled booking still holds its (customer, start time) pair, so booking that exact slot again would be mistaken for a retry. I found this in a later review",
        "Move the MCP endpoint off a local tunnel onto a stable hosted URL",
        "Load test availability with real concurrent bookings, and add a light rate limit in front of the agent",
        "Extend the rollback to the rarer case, where Calendar fails after Supabase has already saved the booking",
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
    status: { state: "warn", label: "Built · tested by hand" },
    tagline:
      "A Telegram bot that answers Stripe integration questions from Stripe's own docs, and says so plainly when it doesn't know.",
    stack: ["n8n", "Gemini", "Hugging Face", "Supabase", "PostgreSQL", "Telegram", "Google Sheets"],
    problem:
      "What a model learned about a fast-moving API like Stripe's goes out of date, and a model that answers integration questions from memory alone will eventually give a confident, wrong answer. Hooking up retrieval isn't the hard part. The hard part is making retrieval actually work against real documentation formatting, and making the agent admit when what it found doesn't answer the question.",
    solution:
      "I built a RAG pipeline over 26 official Stripe documentation pages. A custom step converts Stripe's pipe-delimited tables into plain sentences before embedding, because raw table syntax matches poorly against questions written in normal language. The agent is told to treat irrelevant results the same as no results, instead of using them as a springboard to answer from general knowledge.",
    keyFeatures: [
      "Answers developer questions on Stripe Payments, Checkout, Billing, Webhooks, Disputes and Errors from the retrieved documentation",
      "Won't answer from general knowledge when the docs it found don't actually address the question",
      "Remembers each user's conversation on Telegram, kept separate by chat ID, so follow-up questions carry context",
      "A custom ingestion step turns Stripe's pipe-delimited tables into normal sentences before chunking and embedding",
      "Every conversation turn is logged to Google Sheets for review",
    ],
    outcome:
      "The bot answers from Stripe's current documentation instead of the model's training data, and declines questions outside its 26 pages instead of guessing. Getting it to say no was the harder engineering problem, and it's the part of this build I'd point to first.",
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
        "Fully built and tested by hand across unclear questions, questions outside the docs and multi-turn conversations. There's no automated evaluation suite yet, so I checked the answers myself. That's the next step: a small labeled test set that catches retrieval regressions automatically.",
      architecture:
        "A separate ingestion workflow pulls the 26 Stripe documentation pages and cleans them (including the table fix below). It chunks them with n8n's Recursive Character Text Splitter at 1,800 characters with 200 characters of overlap, and embeds each chunk through the Hugging Face Inference API using mxbai-embed-large-v1 at 1,024 dimensions. The chunks go into a Supabase table with pgvector and are searched through a match_stripe_docs function.\n\nOn the runtime side, a Telegram trigger feeds a Gemini-backed agent that has a stripe_docs retrieval tool and Postgres chat memory keyed by Telegram chat ID, so a follow-up question carries the context of what was already discussed. Every turn is logged to Google Sheets. Replies use Telegram's HTML mode with manual escaping, because Stripe's docs are full of angle-bracket placeholders and snake_case that would otherwise break Telegram's message parser.",
      decisions: [
        "Supabase with pgvector instead of n8n's in-memory vector store, which resets with the workflow and can't support a real split between ingestion and runtime",
        "The table fix runs as its own preprocessing step that leaves fenced code blocks alone, instead of expecting Stripe's tables to already be clean Markdown, because they aren't formatted consistently",
        "HTML parse mode with manual escaping instead of Telegram's Markdown mode, which kept breaking on Stripe's own code syntax",
      ],
      challenges: [
        "Stripe's error reference lists API fields in pipe-delimited tables, which match poorly against normal questions, so a fully ingested page still couldn't answer questions about itself. I fixed it with a step that finds pipe-delimited lines outside code blocks and turns them into plain sentences before chunking",
        "The agent would use loosely related results as a springboard to answer from its general training, instead of noticing they didn't answer the question. I rewrote the instructions to separate “did the search return something” from “does it actually answer this”, and to treat a no on the second the same as an empty search",
        "I went through several embedding providers mid-build (OpenAI, then Ollama, then Gemini) before settling on Hugging Face's mxbai-embed-large-v1 for consistent dimensions and quality",
      ],
      errorHandling: [
        "When the search finds nothing relevant, the agent tells the user instead of falling back to general knowledge",
        "Conversation memory is scoped to each Telegram chat ID, so one user's context can't leak into another's",
      ],
      retryStrategy: [
        "Nothing beyond n8n's default handling. It's a read-heavy pipeline, and a failed search can safely come back as “I don't know” instead of being retried silently",
      ],
      security: [
        "The Google Sheets log stores what was asked and answered, never credentials or account data, since the bot only answers documentation questions",
        "Chat memory is kept separate per chat ID, so context can't bleed between users",
      ],
      whatWorkedWell:
        "The table fix. It's a small preprocessing step, but it was the real reason a fully ingested, fully embedded page was still failing real questions. It's a good example of search quality depending on how documents are structured, not just on having the right content stored.",
      biggestChallenge:
        "Getting the agent to reliably tell the difference between “I found something” and “I found something that answers this”. A simple instruction to stick to the docs treats them the same, and mixing them up is what causes confident wrong answers even with retrieval in place.",
      futureImprovements: [
        "A small labeled test set to catch retrieval regressions automatically, instead of relying on manual spot checks",
        "More of Stripe's docs beyond the current 26 pages (Stripe Tax, Stripe Connect)",
        "A relevance score threshold, so a weak match counts as no match instead of depending only on the agent's judgment",
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
    status: { state: "warn", label: "Built · not production-ready" },
    tagline:
      "Makes sure lab results actually reach patients, with timed reminders and a community health worker stepping in when nobody confirms.",
    stack: ["n8n", "PostgreSQL", "Gmail", "Webhooks"],
    problem:
      "In many clinics, a result is ready but the patient never comes back for it. They weren't told, they forgot, or they couldn't make it. For a critical result that gap is dangerous, and keeping track by hand of who has and hasn't collected their results doesn't scale.",
    solution:
      "Staff register each result in a form. A critical result alerts the patient and the clinician who ordered it right away. Every result then gets timed reminders, at 2, 6 and 24 hours for critical results and at 6, 24 and 48 hours for routine ones. Patients confirm pickup through a link. If a result still isn't confirmed at the final check, a Community Health Extension Worker gets an email to follow up in person.",
    keyFeatures: [
      "A registration form with common tests: malaria RDT, TB, HIV, hepatitis B and C, FBC, glucose, HbA1c, lipids, liver and kidney function, and more",
      "Checks emails against a list of disposable domains, formats Nigerian phone numbers properly and gives each result a tracking ID",
      "Separate reminder schedules for critical and routine results",
      "Pickup confirmation links for patients and follow-up links for health workers, with strict ID checks",
      "Every unconfirmed result ends up with a person, not lost in an inbox",
    ],
    outcome:
      "A working workflow with both escalation paths built, plus a written production-readiness audit. It isn't ready for real patient data yet, and the audit explains exactly why.",
    proof: ["Critical and routine reminders", "Ends with a health worker", "Written readiness audit"],
    image: {
      src: "/media/canvas-lab-follow-up.webp",
      w: 2400,
      h: 1365,
      alt: "The lab results follow-up workflow in n8n: registration, critical and routine reminder ladders, confirmation webhooks",
    },
    links: { source: `${GH}/clinic-lab-escalation-system` },
    caseStudy: {
      projectStatus:
        "Built and working in n8n, but not production-ready. The repo includes a readiness audit, and because this touches health information, the most important next steps are webhook authentication, retries, idempotency and patient-data privacy.",
      architecture:
        "A form trigger collects the result. A Code node checks and cleans it up (emails, the disposable-domain blocklist, phone numbers to +234, and a critical or routine flag) and generates a tracking ID like LR-YYYYMMDD-XXXXXX. Then the record is saved to Postgres.\n\nAn If node splits on urgency. For a critical result, the patient and the clinician are emailed right away, then the workflow waits 2 hours, sends a reminder, waits 4 more, reminds again, waits 18 more and checks Postgres. For a routine result, the patient is emailed, reminded at 6 and 24 hours, and checked at 48. If the result still isn't confirmed at the check, the patient gets a final notice and the Community Health Extension Worker is emailed.\n\nTwo webhooks close the loop. Confirm Pickup and Follow-Up Done each check the tracking ID strictly, update Postgres and reply to the patient or health worker.",
      decisions: [
        "Escalation goes to a Community Health Extension Worker, the person who can actually visit the patient, instead of another inbox",
        "Different schedules for different urgency. Critical results move in hours, routine ones in days",
        "Tracking IDs have a strict format, and the webhooks reject anything that doesn't match before touching the database",
      ],
      challenges: [
        "I found this one in a later review. As it's wired now, the reminders in between still go out even if the patient has already confirmed, because each wait splits into the email and a do-nothing branch joined by a merge, and only the final step checks Postgres again. The fix is a confirmation check before every reminder, or a scheduled sweep instead of long waits",
        "Long Wait nodes keep an execution open for up to two days per result. That's fine for one clinic, but a scheduled sweep would scale better",
      ],
      errorHandling: [
        "Invalid input fails fast with a clear error before anything is stored",
        "An error workflow is attached to the whole workflow, but there are no node-level fallbacks yet (this is documented)",
      ],
      retryStrategy: ["None yet. No node has retry-on-fail turned on, and the readiness audit lists it as a gap"],
      security: [
        "Credentials live in n8n's encrypted credential store",
        "The confirmation webhooks don't have authentication yet, and there's no retention policy for patient data. Both are documented as the first things to fix",
      ],
      whatWorkedWell:
        "Ending every path with a person. The automation handles the reminders, and a health worker handles the patient who doesn't respond.",
      biggestChallenge:
        "Being upfront about what isn't ready. It works, but it handles health data, so the audit lists every gap before anyone deploys it.",
      futureImprovements: [
        "Signed or token-protected confirmation links",
        "A confirmation check before every reminder",
        "Retries on the email and database steps, and an audit log of every reminder sent",
        "Collect less patient data, and add retention rules for what's kept",
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
    status: { state: "warn", label: "Built · not production-ready" },
    tagline:
      "Daily collections for a micro-lender. An AI reads each overdue account, code decides where it goes, and a person gets the unclear ones.",
    stack: ["n8n", "Gemini", "PostgreSQL", "WhatsApp", "Gmail", "Twilio"],
    problem:
      "A micro-lender's collections team goes through overdue accounts by hand every day, deciding who to remind, who to offer a new plan and who needs a legal letter. It's slow and inconsistent, and the wrong tone with a struggling borrower can lose a customer who would have paid.",
    solution:
      "Every morning, the workflow pulls overdue accounts that haven't been contacted that day. A Gemini agent reads each account and its messages and returns a risk tier, a sentiment score and how confident it is, as structured JSON. Code then checks the answer, moves a “medium” with hostile sentiment up to “high”, and only routes the account if confidence is at least 0.6. Low risk gets an SMS reminder, medium gets a WhatsApp offer to restructure the loan, and high gets a legal referral. Everything else goes to a person.",
    keyFeatures: [
      "Structured output with a risk tier, sentiment from −1 to 1, confidence from 0 to 1 and a one-line reason",
      "Code checks the output. An unknown tier becomes “review” with zero confidence, and a medium with negative sentiment goes up to high",
      "A confidence cutoff at 0.6. Anything below it goes to a person",
      "SMS reminders (Twilio), WhatsApp restructuring offers and legal referrals by email",
      "A hosted payment page and confirmation flow, with every contact and payment logged to Postgres",
      "Each account is contacted at most once a day, and staff get a daily summary",
    ],
    outcome:
      "A complete collections flow where the decisions happen in code and people handle anything uncertain. It's built and documented, but not ready for real money yet, and the readiness audit lists what's missing.",
    proof: ["0.6 confidence cutoff", "Hostile replies escalate in code", "A person gets the unclear ones"],
    image: {
      src: "/media/canvas-collections.webp",
      w: 2400,
      h: 1016,
      alt: "The collections router workflow in n8n: daily trigger, risk agent, confidence check, routing to SMS, WhatsApp, legal or human review",
    },
    links: { source: `${GH}/loan-collection-system` },
    caseStudy: {
      projectStatus:
        "Built and working in n8n, but not production-ready. Before this handles real money, the readiness audit puts webhook authentication, retries, idempotency and monitoring first.",
      architecture:
        "A schedule trigger fetches overdue accounts that were last contacted before today, most overdue first, and goes through them one at a time. A LangChain agent node with Gemini and a structured output parser returns the risk tier, sentiment, confidence and reason.\n\nA Code node checks the answer. A tier other than low, medium or high becomes “review” with zero confidence, and a medium tier with sentiment below −0.3 is moved up to high. An If node requires confidence of at least 0.6. A Switch then sends low to an SMS reminder, medium to a WhatsApp restructuring offer and high to a legal package sent by email, and its fallback output goes to human review.\n\nEvery path logs the contact to Postgres and marks the account as contacted. Separately, two webhooks serve a hosted payment page and a confirmation that clears the account and logs the payment. The same trigger also puts together a daily summary for staff.",
      decisions: [
        "The model suggests a tier, but code has the last word, including a hard-coded escalation when a reply sounds hostile or hopeless",
        "Anything the model isn't sure about goes to a person instead of being sent out",
        "The fetch query skips accounts already contacted today, so running it again can't message a borrower twice in one day",
      ],
      challenges: [
        "I caught two bugs in a review before publishing. The “Daily Trigger” was still set to fire every second from testing, and the execution log was writing the message reference into its status column. Both are fixed in the published version",
        "Choosing the cutoff. Too strict and nothing gets automated, too loose and the model's guesses reach borrowers. I started at 0.6 with a person as the fallback, to be tuned on real results",
      ],
      errorHandling: [
        "If the model answers with something unexpected, the account becomes a case for a person, never an automatic message",
        "An error workflow is attached to the whole workflow, but there are no node-level fallbacks yet (this is documented)",
      ],
      retryStrategy: ["None yet. No node has retry-on-fail turned on, and the readiness audit lists it as a gap"],
      security: [
        "All credentials (Postgres, Gmail, Twilio, WhatsApp, Gemini) live in n8n's encrypted credential store",
        "The payment webhooks don't have authentication yet. It's the first item in the audit",
      ],
      whatWorkedWell:
        "Keeping the model's job small. It reads and classifies, and it never picks a channel or writes to the database directly.",
      biggestChallenge:
        "Deciding where the judgment should sit. Collections is sensitive, because the right tone keeps a customer and the wrong one loses them. So only the clear cases are automated, and everything else is a person's call.",
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
      "The brief was an advisory firm that processes vendor invoices by hand. Someone opens each emailed PDF, retypes the totals into a spreadsheet and eyeballs the numbers. Two mistakes keep coming back and both cost real money when they're missed: line items that don't add up to the stated total, and the same invoice getting paid twice because it was sent again.",
    solution:
      "I built a workflow that watches the inbox, extracts every field from the PDF with Gemini, recalculates the math independently and checks the invoice number against everything already logged. Valid invoices are logged silently. Anything genuinely wrong gets a Slack alert. Duplicates get caught and filed in their own log, never a second row on the main ledger.",
    keyFeatures: [
      "Watches a Gmail inbox for PDF invoices, no manual upload step",
      "Gemini extracts the invoice number, vendor, totals and dates as structured fields",
      "Recalculates the line item sum independently and flags any mismatch down to the exact difference",
      "Duplicate invoice numbers are caught and filed to a separate audit tab, never logged twice",
      "Only a real anomaly triggers a Slack alert. Valid invoices log silently, so the channel stays useful",
      "Every invoice lands in one sortable Google Sheet with its status and a processed timestamp",
    ],
    outcome:
      "This replaces a manual review step that depends on someone catching a bad total by eye. Every invoice gets checked the same way, every time, and the only thing that reaches a person is something that actually needs a decision.",
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
        "Fully built and tested end to end in n8n, including Gmail intake, Gemini extraction, math validation and duplicate prevention. Three test invoices (two valid, one duplicate resend) are in the repo to show each path. The next phase is a real approve/reject loop back into the sheet, instead of resolving flagged invoices by hand.",
      architecture:
        "A Gmail trigger polls for emails with a PDF attachment and “invoice” in the subject line. The PDF goes to a Gemini-backed extraction step that returns the invoice number, client name, vendor email, total amount, line item sum, invoice date and due date as structured fields.\n\nFrom there the workflow does two independent checks. A Code node recalculates the line items and compares that figure to the stated total, catching any mismatch down to the exact difference. At the same time, a Sheets lookup checks whether that invoice number has already been logged. A Merge node brings both results back together before anything gets written anywhere.\n\nValid, non-duplicate invoices get one row in the Invoices tab and nothing else happens, no alert and no noise. A math discrepancy gets logged and triggers a Slack alert to the billing channel, since that's a real decision someone needs to make. A duplicate is redirected entirely to a separate Duplicates Log tab instead of the main ledger, so there's still a full audit trail, but it never creates a second payable-looking row and never interrupts anyone in Slack.",
      decisions: [
        "Duplicate detection matches on invoice number alone instead of a vendor plus invoice number key. It's simpler, easier to reason about and reliable enough for a small, known vendor list",
        "A Filter node sits between the ledger write and the Slack notification, so only a real anomaly reaches the channel and valid invoices never generate a message",
        "Duplicates get their own log tab, instead of either flooding Slack or disappearing into n8n's execution history where only a developer would find them",
      ],
      challenges: [
        "My first duplicate check would have collided on any two vendors that both issue an INV-1001. I weighed a composite key against the actual scope of the project and kept the simpler check, and documented it as a tradeoff rather than an oversight",
        "The first working version of the Slack alert fired on every processed invoice, which floods the channel fast and trains people to ignore it. I fixed it by putting the alert behind a Filter node that only lets a real anomaly through",
      ],
      errorHandling: [
        "Every node that calls an outside service (Gemini, Gmail, Sheets, Slack) retries three times, 4 seconds apart",
        "A dedicated error workflow is attached, so a node failure alerts separately from the business alerts in Slack",
        "A flagged invoice still gets a row in the sheet. Nothing about a mismatch stops the record from existing",
      ],
      retryStrategy: [
        "The Gmail trigger polls every 60 seconds, so there's a small, predictable delay instead of a missed email",
        "Outside API calls retry three times with a 4-second wait before the error workflow takes over",
      ],
      security: [
        "Only the first PDF attachment on an email is processed. That's a deliberate scope limit, not a silent gap",
        "Totals are parsed as plain numbers with currency symbols stripped. It assumes a single currency, and that's stated up front",
        "There's no OCR fallback yet, so a scanned invoice with no text layer fails extraction. It's a known limitation, not a surprise",
      ],
      whatWorkedWell:
        "Separating visibility from alerting. A duplicate still gets recorded somewhere a person can find it, but it never has to interrupt anyone, because once the system has handled it correctly there's no decision left to make.",
      biggestChallenge:
        "Getting the duplicate check right without over-engineering it. It would have been easy to build a vendor-plus-invoice-number key from day one. The harder, better call was recognizing that the simpler check was the right size for this project.",
      futureImprovements: [
        "Slack approve/reject buttons that write the decision back to the ledger",
        "A weekly digest of the total processed and flags caught",
        "Multi-currency support",
        "Vendor trust scoring based on each vendor's history of discrepancies",
        "An OCR fallback for scanned PDFs with no text",
        "Budget thresholds, so invoices above a set amount need a manager's sign-off",
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
      "A form fill only tells you what a prospect typed into structured fields. It doesn't tell you whether they're ready to buy or just browsing, and sorting that out by hand for every submission doesn't scale, especially once duplicate and low-quality submissions are mixed in with real ones.",
    solution:
      "I built a pipeline that sanitizes every submission and filters out disposable emails and repeat submissions before they reach anyone. It then combines fixed scoring rules (company size, budget, job title) with an AI read on intent and urgency from the free-text message. The combined score decides the SLA and which regional Slack channel gets notified.",
    keyFeatures: [
      "A nine-field intake form with browser-level checks for required fields and email format",
      "Sanitizes input and blocks disposable or suspicious email domains before anything reaches the CRM",
      "Duplicate detection against the CRM sheet stops repeat submissions from creating a second record or a second AI call",
      "Gemini reads the free-text message for intent and urgency, and that's combined with fixed scoring rules",
      "Three tiers. Hot gets a 1-hour SLA, Warm gets 24 hours, and Cold is logged with no notification",
      "Routes to the right regional Slack channel automatically, and sends the lead a branded confirmation email",
    ],
    outcome:
      "Every lead gets the same consistent, structured read, no submission waits for someone to be free to sort it by hand, and the team's attention goes to the leads actually worth an hour-long SLA instead of being split evenly across everything that comes in.",
    proof: ["AI adds to the score, never decides it", "Duplicates stopped before the AI call", "1-hour SLA for hot leads"],
    image: {
      src: "/media/canvas-lead-scoring.webp",
      w: 2400,
      h: 773,
      alt: "The lead scoring workflow in n8n: form trigger, sanitizing, duplicate check, Gemini scoring and regional routing",
    },
    links: { source: `${DEMOS}/ai-lead-scoring-and-routing` },
    caseStudy: {
      projectStatus:
        "Fully built and tested in n8n, covering sanitization, duplicate detection, AI scoring and regional routing end to end. The next phase is connecting it to a real CRM instead of Google Sheets, and a feedback loop so sales can mark a Hot lead as a false positive and have that feed back into the scoring rules.",
      architecture:
        "A form trigger collects nine fields and sends the visitor to a thank-you page straight away, and the actual pipeline runs in the background. The first stop is a Sanitize Data node that strips HTML, fixes text typed in all caps, collapses extra spaces and checks the email against a blocklist of disposable domains. If the email is disposable or something looks wrong, the submission goes straight to a review channel in Slack and stops there. It never reaches the CRM or the AI.\n\nEverything that passes goes to a Google Sheets lookup by email, merged back with the sanitized data. If that email already exists in the CRM, the lead gets a warm re-engagement email and the pipeline stops, with no duplicate row and no duplicate AI call.\n\nNew leads move on to Gemini, which reads the free-text message and returns a structured intent signal, an urgency flag and a one-sentence fit note. Those AI signals combine with fixed rules (company size, budget, service type, job title) into a single score. The score decides the category (Hot, Warm or Cold), which decides the SLA and which regional Slack channel gets notified. Every lead, whatever the outcome, is logged to the CRM sheet with its score and category.",
      decisions: [
        "Validation is split across two layers on purpose. The browser catches what it can (required fields, email format) and the workflow catches what the browser can't (disposable domains, suspicious patterns), so neither layer is doing the other's job",
        "AI signals add to a score instead of deciding the category outright. A lead still needs real structured signals (budget, company size) to reach Hot, so the model influences the outcome without controlling it alone",
        "alwaysOutputData is set on the CRM lookup node, because Google Sheets returns zero items when there's no match, which would otherwise stop a brand new lead from ever reaching the Merge node",
      ],
      challenges: [
        "Structured fields alone missed what actually mattered in a lead's message. A big-budget lead who wrote “just exploring” scored the same as one who wrote “need this live by end of month”. I fixed it by sending the message to Gemini for a structured intent and urgency read that feeds into the score but doesn't override it",
        "A duplicate submission was creating a second CRM row, a second Slack alert and a second Gemini call, tripling the cost and creating conflicting records for the same lead. I fixed it with a lookup-and-merge step before scoring ever runs",
      ],
      errorHandling: [
        "Gemini calls retry three times, since a temporary API failure or malformed JSON would otherwise drop a valid lead at the scoring step without anyone noticing",
        "A structured output parser enforces the shape of the AI's answer, so the routing logic never has to guess at free text",
        "An error workflow catches any unhandled failure, separately from the business alerts in Slack",
      ],
      retryStrategy: [
        "The Gemini step retries three times with a short wait between attempts before it counts as a real failure",
        "Re-submitting the same email is always safe. Duplicate detection catches it before any data is written twice",
      ],
      security: [
        "Disposable and suspicious email domains are blocked before a submission ever reaches the CRM or the AI, not after",
        "Every field is sanitized (HTML stripped, length capped) before it's stored or used in a prompt",
      ],
      whatWorkedWell:
        "Splitting validation into a browser layer and a workflow layer. It meant not over-engineering the frontend and not blindly trusting it either. Each layer only handles what the other can't.",
      biggestChallenge:
        "Getting the AI's part of the score right. It would have been easy to let the model's read on intent decide the category outright. The better design keeps the fixed signals as the backbone and lets the AI add nuance on top, instead of replacing judgment with a guess.",
      futureImprovements: [
        "Connect to a real CRM instead of Google Sheets",
        "A feedback loop so sales can flag a false-positive Hot lead and have that inform future scoring",
        "A weekly digest of lead volume, average score and SLA performance by region",
        "Scoring weights you can configure, instead of hard-coded points",
      ],
    },
  },
];

export const ARCHIVE = [
  {
    title: "Global error handler",
    note: "One n8n error workflow that all my other workflows report to, instead of five separate copies drifting apart.",
    href: `${DEMOS}/global-error-handler`,
  },
  {
    title: "Self-hosted n8n blueprint",
    note: "A Render blueprint that runs n8n on managed Postgres, so it works on a free instance with no persistent disk.",
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
