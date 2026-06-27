import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card component: reusable container for stacked-card layout.
 * Features: soft elevated background, large rounded corners, generous spacing,
 * minimal shadow, no visible border.
 */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-canvas-raised
        rounded-2xl
        p-8 sm:p-10
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
