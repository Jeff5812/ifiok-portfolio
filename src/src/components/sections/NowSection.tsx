export default function NowSection() {
  return (
    <section id="now" className="bg-ink scroll-mt-16">
      <div className="py-12 sm:py-16">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          <span className="label-mono text-canvas/60">Building right now</span>
        </div>
      </div>
    </section>
  );
}
