import { iconSrc, logoFor } from "@/content/tools";
import s from "./StackChips.module.css";

/** A project's stack: real 3D logos where one exists, a plain chip otherwise. */
export default function StackChips({ stack, size = 30 }: { stack: string[]; size?: number }) {
  return (
    <ul role="list" className={s.list} aria-label="Built with">
      {stack.map((name) => {
        const logo = logoFor(name);
        return (
          <li key={name} className={logo ? s.logo : s.chip} title={name}>
            {logo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconSrc(logo)} alt={name} width={size} height={size} loading="lazy" />
                <span className={s.name}>{name}</span>
              </>
            ) : (
              name
            )}
          </li>
        );
      })}
    </ul>
  );
}
