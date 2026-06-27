import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-5 sm:px-8 py-24">
      <p className="label-mono text-ink-soft mb-4">404</p>
      <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
        This node doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft leading-relaxed">
        Whatever you&apos;re looking for either moved, never shipped, or was
        never wired up. Let&apos;s get you back to something that exists.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas hover:opacity-85"
      >
        Back to home
      </Link>
    </div>
  );
}
