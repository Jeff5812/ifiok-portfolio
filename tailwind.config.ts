import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0c11",
        panel: "#12151c",
        panel2: "#171b24",
        line: "#242a38",
        ink: "#f5f6f8",
        // The real problem wasn't brightness in isolation, it was that
        // inkSoft (#c9cdd4) sat too close to ink (#f5f6f8) — headings and
        // body text ended up reading at nearly the same visual weight, so
        // nothing led. This pulls it back down to create real hierarchy.
        // Font-weight was fixed separately (540), so this doesn't bring
        // back the "thin" problem — it's a contrast-of-role fix, not a
        // legibility one.
        inkSoft: "#a6aab3",
        brand: {
          from: "#ff5c7a",
          to: "#ffab5c",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "sans-serif"],
        hero: ["var(--font-hero)", "var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #ff5c7a 0%, #ff7a52 55%, #ffab5c 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,92,122,0.15), 0 10px 34px -10px rgba(255,92,122,0.22)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
