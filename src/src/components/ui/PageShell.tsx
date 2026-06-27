import React from "react";

interface PageShellProps {
  children: React.ReactNode;
}

/**
 * PageShell: centers content in a narrow column (640px-720px) and applies
 * consistent vertical spacing between card sections. Replaces the wide
 * multi-column dashboard layout with a stacked-card feed experience.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="w-full bg-canvas">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-16">
        <div className="space-y-8 sm:space-y-10">
          {children}
        </div>
      </div>
    </div>
  );
}
