import type { CSSProperties } from "react";
import CountUp from "./CountUp";
import s from "./Stats.module.css";

// Every number can be checked: the projects on this site and their public repositories.
const STATS = [
  { n: 8, label: "Projects built", note: "2 software products and 6 AI automation systems" },
  { n: 2, label: "Live products", note: "Chat Receipt, my own product, and Mayor Edits, built for a video studio" },
  { n: 960, suffix: "+", label: "Automated tests", note: "Across the two live products" },
  { n: 8, suffix: "/8", label: "Projects with public code", note: "Read any of them on GitHub" },
];

export default function Stats() {
  return (
    <section className="wrap" aria-label="In numbers">
      <ul role="list" className={s.grid}>
        {STATS.map((st, i) => (
          <li key={st.label} className={`glass ${s.card}`} data-reveal style={{ "--delay": `${i * 90}ms` } as CSSProperties}>
            <span className={s.n}>
              <CountUp to={st.n} />
              {st.suffix}
            </span>
            <span className={s.label}>{st.label}</span>
            <span className={s.note}>{st.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
