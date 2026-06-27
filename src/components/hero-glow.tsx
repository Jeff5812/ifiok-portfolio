type HeroGlowProps = {
  className?: string;
};

export default function HeroGlow({ className = "" }: HeroGlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(560px,78vw)] -translate-x-1/2 -translate-y-1/2 aspect-square ${className}`}
    >
      <div className="hero-glow absolute inset-0">
        <span
          className="absolute left-[12%] top-[18%] h-[62%] w-[62%] rounded-full"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 65%)" }}
        />
        <span
          className="absolute left-[34%] top-[6%] h-[56%] w-[56%] rounded-full"
          style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 65%)" }}
        />
        <span
          className="absolute left-[48%] top-[22%] h-[58%] w-[58%] rounded-full"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 65%)" }}
        />
        <span
          className="absolute left-[18%] top-[44%] h-[60%] w-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 65%)" }}
        />
        <span
          className="absolute left-[44%] top-[48%] h-[56%] w-[56%] rounded-full"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 65%)" }}
        />
        <span
          className="absolute left-[6%] top-[50%] h-[58%] w-[58%] rounded-full"
          style={{ background: "radial-gradient(circle, #eab308 0%, transparent 65%)" }}
        />
      </div>
    </div>
  );
}

