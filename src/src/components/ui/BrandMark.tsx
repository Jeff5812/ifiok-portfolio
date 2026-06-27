interface BrandMarkProps {
  /** Pixel size of the square logo container. */
  size?: number;
  className?: string;
}

/**
 * The site's brand mark: a solid dark triangle sitting on a soft radial
 * rainbow glow, echoing the reference design's "agentic infrastructure"
 * hero icon. Kept as a small, self-contained SVG so it can be reused at
 * any size (header, favicon-style contexts, footer) without duplicating
 * the gradient definition.
 */
export default function BrandMark({ size = 36, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Ifiok Columba logo"
    >
      <defs>
        <radialGradient id="brandGlow" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#ffd6f5" stopOpacity="0.95" />
          <stop offset="28%" stopColor="#d6b8ff" stopOpacity="0.75" />
          <stop offset="52%" stopColor="#b6e3ff" stopOpacity="0.55" />
          <stop offset="74%" stopColor="#c4ffe0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fafaf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#brandGlow)" />
      <path d="M20 9L31 30H9L20 9Z" fill="var(--ink)" />
    </svg>
  );
}
