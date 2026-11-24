import type { CSSProperties } from "react";
import AskButton from "@/components/chat/AskButton";
import Icon from "@/components/ui/Icon";
import { iconSrc, toolBySlug } from "@/content/tools";
import s from "./Hero.module.css";

// Three tools on the ring, one for each half of the job: software, automation and AI.
// angle in degrees (0 = right, clockwise); the ring's radius is 46% of the stage.
const ORBIT = [
  { slug: "python", angle: 208 },
  { slug: "n8n", angle: 332 },
  { slug: "claude", angle: 90 },
].map((o) => ({
  ...o,
  x: +(50 + 46 * Math.cos((o.angle * Math.PI) / 180)).toFixed(2),
  y: +(50 + 46 * Math.sin((o.angle * Math.PI) / 180)).toFixed(2),
}));

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function Hero() {
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <p className="status" data-state="ok" data-enter>
            Available for remote work
          </p>
          <h1 id="hero-title" className={s.title} data-enter style={vars({ "--delay": "80ms" })}>
            <span className={s.name}>Ifiok Columba</span>
            <span className={s.role}>Software &amp; AI automation engineer</span>
          </h1>
          <p className={s.sub} data-enter style={vars({ "--delay": "160ms" })}>
            I build web apps and AI automations that take repetitive work off a team&rsquo;s plate. The AI does the
            reading, and my code checks its work before anything happens.
          </p>
          <div className={s.actions} data-enter style={vars({ "--delay": "240ms" })}>
            <AskButton intent="booking" className="btn btn-primary">
              Hire me
            </AskButton>
            <a href="#work" className="btn btn-ghost">
              See my work <Icon name="arrowDown" />
            </a>
          </div>
        </div>

        <div className={s.stage} data-enter style={vars({ "--delay": "120ms" })}>
          <span className={s.ring} aria-hidden />
          <div className={s.medallion}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/portrait-warm.webp" alt="Ifiok Columba" width={1000} height={1000} />
          </div>

          <ul role="list" className={s.icons} aria-label="Tools I build with">
            {ORBIT.map((o) => {
              const tool = toolBySlug(o.slug)!;
              return (
                <li key={o.slug} className={s.icon} style={vars({ "--x": `${o.x}%`, "--y": `${o.y}%` })}>
                  <a href={`/skills#stack-${o.slug}`} aria-label={`${tool.name}: ${tool.role}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconSrc(o.slug)} alt="" width={64} height={64} />
                    <span className={s.tip} aria-hidden>
                      <strong>{tool.name}</strong> {tool.role}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
