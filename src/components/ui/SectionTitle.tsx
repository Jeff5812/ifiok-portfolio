import s from "./SectionTitle.module.css";

export default function SectionTitle({
  eyebrow,
  id,
  children,
  lead,
  aside,
  center = false,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <header className={s.head} data-center={center} data-reveal>
      <div className={s.main}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="h2">
          {children}
        </h2>
        {lead && <p className={`lead ${s.lead}`}>{lead}</p>}
      </div>
      {aside && <div className={s.aside}>{aside}</div>}
    </header>
  );
}
