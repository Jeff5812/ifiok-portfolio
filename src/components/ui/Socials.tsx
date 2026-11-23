import { SOCIALS, iconSrc } from "@/content/tools";
import s from "./Socials.module.css";

/** Social profiles as their real app logos (3D renders), with a label on hover and for screen readers. */
export default function Socials({ size = 52, className = "" }: { size?: number; className?: string }) {
  return (
    <ul role="list" className={`${s.list} ${className}`} style={{ "--size": `${size}px` } as React.CSSProperties}>
      {SOCIALS.map((so) => (
        <li key={so.slug}>
          <a href={so.href} className={s.link} aria-label={so.label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc(so.slug)} alt="" width={size} height={size} />
            <span className={s.tip} aria-hidden>
              {so.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
