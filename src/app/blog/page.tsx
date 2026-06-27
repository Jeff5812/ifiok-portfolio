import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on AI automation, n8n workflows, and building in public from Ifiok Columba.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <p className="label-mono text-ink-soft mb-3">Writing</p>
      <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-ink">
        Notes from the build.
      </h1>
      <p className="mt-5 max-w-xl text-ink-soft leading-relaxed">
        Short, specific write-ups from inside the workflows, what worked,
        what broke, and what I&apos;d do differently. No filler, no listicles.
      </p>

      {posts.length === 0 ? (
        <p className="mt-16 text-sm text-ink-soft">
          Nothing published yet, first post is on the way.
        </p>
      ) : (
        <div className="mt-16 flex flex-col">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 border-t border-line py-7 first:border-t-0"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-medium tracking-tight text-ink transition-colors group-hover:text-ink/70">
                  {post.title}
                </h2>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:rotate-45 group-hover:text-ink" />
              </div>
              <p className="text-sm text-ink-soft">{post.description}</p>
              <div className="mt-1 flex items-center gap-3 label-mono text-ink-soft">
                <span>{formatDate(post.date)}</span>
                <span aria-hidden>·</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
