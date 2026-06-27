import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-2xl font-medium tracking-tight text-ink mt-10 mb-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-xl font-medium tracking-tight text-ink mt-10 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-medium tracking-tight text-ink mt-8 mb-3" {...props} />
  ),
  p: (props) => (
    <p className="text-[15px] leading-relaxed text-ink/90 mb-5" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-5 mb-5 flex flex-col gap-2 text-[15px] text-ink/90" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-5 mb-5 flex flex-col gap-2 text-[15px] text-ink/90" {...props} />
  ),
  a: ({ href, ...props }) => (
    <Link
      href={href ?? "#"}
      className="text-ink underline underline-offset-2 hover:text-ink/70"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-line-strong pl-5 italic text-ink-soft my-6"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="label-mono rounded bg-canvas-raised border border-line px-1.5 py-0.5 text-[0.8em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-xl border border-line bg-canvas-raised p-4 overflow-x-auto mb-6 text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="border-line my-10" />,
};
