import type { CSSProperties } from "react";
import AskButton from "@/components/chat/AskButton";
import Icon from "@/components/ui/Icon";
import Socials from "@/components/ui/Socials";
import { iconSrc, toolBySlug } from "@/content/tools";
import HeroStage from "./HeroStage";
import s from "./Hero.module.css";

// Six tools, evenly spaced on the outer ring: angle in degrees (0 = right, clockwise), radius as a
// percentage of the stage, d a small parallax depth.
const ORBIT = [
  { slug: "n8n", angle: 210, d: 10 },
  { slug: "claude", angle: 270, d: 14 },
  { slug: "googlegemini", angle: 330, d: 10 },
  { slug: "python", angle: 30, d: 14 },
  { slug: "postgresql", angle: 90, d: 10 },
  { slug: "whatsapp", angle: 150, d: 14 },
].map((o, i) => ({
  ...o,
  delay: i * 1.3,
  x: +(50 + 45 * Math.cos((o.angle * Math.PI) / 180)).toFixed(2),
  y: +(50 + 45 * Math.sin((o.angle * Math.PI) / 180)).toFixed(2),
}));

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function Hero() {
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <p className={s.hello} data-enter>
            Hey, I&rsquo;m <span>Ifiok Columba</span>
          </p>
          <h1 id="hero-title" className={s.title} data-enter style={vars({ "--delay": "80ms" })}>
            <span className={s.titleSmall}>Software &amp;</span>
            AI Automation
            <br />
            Engineer
          </h1>
          <p className={s.sub} data-enter style={vars({ "--delay": "160ms" })}>
            I build full-stack products and AI automations for real businesses. The AI suggests; the code makes
            sure it&rsquo;s right.
          </p>
          <div className={s.actions} data-enter style={vars({ "--delay": "240ms" })}>
            <AskButton intent="booking" className="btn btn-primary">
              Hire me
            </AskButton>
            <a href="#work" className="btn btn-ghost">
              See my work <Icon name="arrowDown" />
            </a>
          </div>
          <div className={s.find} data-enter style={vars({ "--delay": "320ms" })}>
            <span>Find me on</span>
            <Socials size={40} />
          </div>
        </div>

        <HeroStage className={s.stage}>
          <div className={s.glow} style={vars({ "--d": 4 })} aria-hidden />
          <svg className={s.orbits} style={vars({ "--d": 4 })} viewBox="0 0 600 600" aria-hidden>
            <circle cx="300" cy="300" r="270" />
            <circle cx="300" cy="300" r="206" />
          </svg>

          <div className={s.figure} style={vars({ "--d": 6 })}>
            <div className={s.medallion}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/portrait-warm.webp" alt="Ifiok Columba" width={900} height={900} />
            </div>
            <span className={s.badge}>
              <span className={s.dot} aria-hidden /> Available for remote work
            </span>
            <span className={s.bubble} aria-hidden>
              Hi, I&rsquo;m Ifiok <span>👋</span>
            </span>
          </div>

          <ul role="list" className={s.icons} aria-label="Tools I build with">
            {ORBIT.map((o) => {
              const tool = toolBySlug(o.slug)!;
              return (
                <li
                  key={o.slug}
                  className={s.orbitIcon}
                  style={vars({ "--x": `${o.x}%`, "--y": `${o.y}%`, "--d": o.d, "--delay": `${o.delay}s` })}
                >
                  <a href={`/skills#stack-${o.slug}`} aria-label={`${tool.name}: ${tool.role}`}>
                    <span className={s.drift}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconSrc(o.slug)} alt="" width={72} height={72} />
                    </span>
                    <span className={s.tip} aria-hidden>
                      <strong>{tool.name}</strong> {tool.role}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </HeroStage>
      </div>
    </section>
  );
}
