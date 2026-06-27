const TOOLS = [
  "n8n",
  "Next.js",
  "TypeScript",
  "Supabase",
  "Gemini",
  "OpenAI",
  "Vercel",
  "Google Sheets API",
  "Slack API",
  "Tailwind CSS",
];

export default function ToolsStrip() {
  return (
    <section className="border-b border-line bg-canvas-raised/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
        <p className="label-mono text-ink-soft mb-6 text-center sm:text-left">
          Building with
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-10 gap-y-4">
          {TOOLS.map((tool) => (
            <span
              key={tool}
              className="text-sm sm:text-base font-medium text-ink-soft/70 hover:text-ink transition-colors tracking-tight"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
