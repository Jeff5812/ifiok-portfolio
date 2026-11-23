import type { CSSProperties } from "react";
import s from "./PageHeader.module.css";

/** The top of every inner page: an eyebrow, an h1 with one orange phrase, a lead and actions. */
export default function PageHeader({
  eyebrow,
  children,
  lead,
  actions,
}: {
  eyebrow: string;
  children: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className={`wrap ${s.head}`}>
      <p className="eyebrow" data-enter>
        {eyebrow}
      </p>
      <h1 className={s.title} data-enter style={{ "--delay": "80ms" } as CSSProperties}>
        {children}
      </h1>
      {lead && (
        <p className={`lead ${s.lead}`} data-enter style={{ "--delay": "160ms" } as CSSProperties}>
          {lead}
        </p>
      )}
      {actions && (
        <div className={s.actions} data-enter style={{ "--delay": "240ms" } as CSSProperties}>
          {actions}
        </div>
      )}
    </header>
  );
}
