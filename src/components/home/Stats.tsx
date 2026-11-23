import type { CSSProperties } from "react";
import CountUp from "./CountUp";
import s from "./Stats.module.css";

// Every number is from the projects' own repositories.
const STATS = [
  { n: 2, label: "Live products", note: "Chat Receipt, and Mayor Edits for a client" },
  { n: 8, label: "Projects built and documented", note: "Software products and AI automations" },
  { n: 785, label: "Tests passing in Chat Receipt", note: "Backend suite, 21 Nov 2026" },
  { n: 119, label: "Conversations in its AI evaluation", note: "Fixed split, 77 held out" },
];

export default function Stats() {
  return (
    <section className="wrap" aria-label="In numbers">
      <ul role="list" className={s.grid}>
        {STATS.map((st, i) => (
          <li key={st.label} className={`glass ${s.card}`} data-reveal style={{ "--delay": `${i * 90}ms` } as CSSProperties}>
            <span className={s.n}>
              <CountUp to={st.n} />
            </span>
            <span className={s.label}>{st.label}</span>
            <span className={s.note}>{st.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
