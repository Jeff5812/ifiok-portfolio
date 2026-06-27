import { milestones } from "@/content/milestones";
import { milestonesIntro } from "@/content/profile";

const KIND_LABEL: Record<string, string> = {
  bootcamp: "Bootcamp",
  project: "Project",
  certification: "Certification",
  role: "Role",
  milestone: "Milestone",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function JourneySection() {
  return (
    <section id="journey" className="scroll-mt-16">
      <div>
        <p className="label-mono text-ink-soft mb-3">The journey</p>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink mb-2">
          Still early. Building in public anyway.
        </h2>
        <p className="mb-8 max-w-md text-sm text-ink-soft leading-relaxed">
          {milestonesIntro}
        </p>

        {milestones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong p-8 text-center">
            <p className="label-mono text-ink-soft mb-2">Nothing logged yet</p>
            <p className="text-sm text-ink-soft max-w-sm mx-auto">
              The timeline is ready — real milestones will start appearing
              here as they happen.
            </p>
          </div>
        ) : (
          <ol className="relative flex flex-col gap-8 border-l border-line pl-7">
            {milestones.map((m) => (
              <li key={m.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-ink"
                />
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <span className="label-mono text-ink-soft">
                    {formatDate(m.date)}
                  </span>
                  <span className="label-mono rounded-full border border-line-strong px-2 py-0.5 text-ink-soft">
                    {KIND_LABEL[m.kind]}
                  </span>
                </div>
                <h3 className="text-base font-medium tracking-tight text-ink">
                  {m.title}
                </h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
                  {m.description}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
