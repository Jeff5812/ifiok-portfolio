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
        inkSoft: "#98a0b0",
        brand: {
          from: "#ff5c7a",
          to: "#ffab5c",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
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
