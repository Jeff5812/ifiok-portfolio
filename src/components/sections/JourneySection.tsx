export default function JourneySection() {
  return (
    <section id="about" className="scroll-mt-16">
      <div>
        <p className="label-mono text-ink-soft mb-3">About me</p>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink mb-5">
          I work where operations meet automation.
        </h2>

        <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink-soft max-w-md">
          <p>
            Most businesses don&apos;t lose time because people aren&apos;t
            working hard enough. They lose time because the process itself
            depends on someone remembering the next step, chasing a reply,
            or copying the same data between tools by hand.
          </p>
          <p>That&apos;s the part I build to remove.</p>
          <p>
            I&apos;m Ifiok Columba, an AI Automation Engineer. I design
            workflows and AI agents that take over the steps that don&apos;t
            need a person watching them: routing a lead to the right place,
            checking a document before it moves forward, deciding what
            happens next instead of just logging that something happened.
          </p>
          <p>
            I build with n8n for orchestration and AI Agent nodes powered by
            Gemini and OpenAI for the steps that need real judgment, with
            Claude when a task calls for more careful reasoning. I think
            in systems because I built my own from scratch, this site
            included, down to the AI assistant you can talk to right now.
            That habit, build it, run it, see where it breaks, shapes how I
            approach every workflow after.
          </p>
          <p>
            I learn by building, not studying. Every pattern I pick up
            gets tested against a real workflow before I trust it.
          </p>
          <p>
            What matters most to me isn&apos;t just that a workflow runs
            once. It&apos;s that it keeps running the way a real team
            actually works, so it gets trusted and used, not abandoned
            after the demo.
          </p>
        </div>
      </div>
    </section>
  );
}
