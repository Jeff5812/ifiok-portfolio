import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/content/projects";

export default function WorkSection() {
  return (
    <section id="work" className="scroll-mt-16">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="label-mono text-ink-soft mb-3">Selected work</p>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink max-w-xl">
              Every system I build will land here.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft leading-relaxed">
            Projects are rendered as nodes on a workflow canvas — because
            that&apos;s genuinely how these get built. Each one opens into
            the full problem, process, and outcome.
          </p>
        </div>

        <WorkflowCanvas />

        {projects.length > 0 && (
          <div className="mt-10 flex justify-center sm:justify-start">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
            >
              View all projects
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
