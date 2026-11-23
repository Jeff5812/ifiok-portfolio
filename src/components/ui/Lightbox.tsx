"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./Lightbox.module.css";

/**
 * An image that opens full screen when clicked, like the previous site's workflow screenshots.
 * A native <dialog> gives focus handling and Escape-to-close for free.
 */
export default function Lightbox({
  src,
  alt,
  width,
  height,
  sizes,
  className = "",
  fit = "cover",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className={`${s.thumb} ${className}`} onClick={() => setOpen(true)} aria-label={`Enlarge: ${alt}`}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className={s.img} style={{ objectFit: fit }} />
        <span className={s.zoom} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
          </svg>
        </span>
      </button>
      <dialog ref={ref} className={s.dialog} onClose={() => setOpen(false)} onClick={(e) => e.target === ref.current && setOpen(false)}>
        {open && (
          <div className={s.frame}>
            <Image src={src} alt={alt} width={width} height={height} sizes="100vw" className={s.full} />
          </div>
        )}
        <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Close">
          ✕
        </button>
      </dialog>
    </>
  );
}
