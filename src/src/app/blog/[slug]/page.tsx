import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPostBySlug(slug);
  if (!entry) return {};

  return {
    title: entry.post.title,
    description: entry.post.description,
    openGraph: {
      title: entry.post.title,
      description: entry.post.description,
      type: "article",
      publishedTime: entry.post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getPostBySlug(slug);
  if (!entry) notFound();

  const { post, content } = entry;

  return (
    <article className="mx-auto max-w-2xl px-5 sm:px-8 py-16 sm:py-24">
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 label-mono text-ink-soft mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        All writing
      </Link>

      <div className="flex items-center gap-3 label-mono text-ink-soft mb-4">
        <span>{formatDate(post.date)}</span>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink leading-tight">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="label-mono rounded-full border border-line px-2.5 py-1 text-ink-soft"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose-custom mt-12">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          ← Back to all writing
        </Link>
      </div>
    </article>
  );
}
