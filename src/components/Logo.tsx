export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="icGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff3d6e" />
            <stop offset="100%" stopColor="#ff8a3d" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="39" height="39" rx="10" stroke="url(#icGrad)" strokeOpacity="0.5" />
        <path
          d="M13 11v18"
          stroke="url(#icGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M22 12c-3.5 0-6 3.6-6 8s2.5 8 6 8c2.3 0 4.3-1.5 5.4-3.8"
          stroke="url(#icGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="leading-tight">
        <div className="font-semibold text-ink tracking-tight text-[15px]">IFIOK COLUMBA</div>
        <div className="label-mono text-inkSoft text-[10px]">AUTOMATION ENGINEER</div>
      </div>
    </div>
  );
}
