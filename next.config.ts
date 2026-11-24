import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The dev-only Next.js badge in the corner looked like part of the site; it never appears in production anyway.
  devIndicators: false,
  // A stray package-lock.json in the user's home folder would otherwise be taken as the workspace root.
  turbopack: { root: process.cwd() },
  // URLs match the previous site (/projects, /projects/<slug>, /about, /services, /contact); this keeps
  // links from the rebuild's earlier preview working.
  async redirects() {
    return [
      { source: "/work/:slug*", destination: "/projects/:slug*", permanent: true },
    ];
  },
};

export default nextConfig;
