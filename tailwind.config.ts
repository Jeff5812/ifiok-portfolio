import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#0b0d12",
        panel: "#11141b",
        panel2: "#161a23",
        line: "#232837",
        ink: "#f3f4f6",
        inkSoft: "#9aa1b0",
        brand: {
          from: "#ff3d6e",
          to: "#ff8a3d",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #ff3d6e 0%, #ff6a4d 60%, #ff8a3d 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,61,110,0.25), 0 8px 30px -8px rgba(255,61,110,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
