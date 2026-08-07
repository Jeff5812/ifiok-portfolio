"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function ImageLightbox({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  function closeAndReset() {
    setOpen(false);
    setZoomed(false);
    setPos({ x: 0, y: 0 });
  }

  function toggleZoom(e: React.MouseEvent) {
    e.stopPropagation();
    if (zoomed) {
      setZoomed(false);
      setPos({ x: 0, y: 0 });
    } else {
      setZoomed(true);
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!zoomed) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPos({ x: dragState.current.origX + dx, y: dragState.current.origY + dy });
  }

  function onPointerUp() {
    dragState.current.dragging = false;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} full size`}
        className={`group relative block w-full overflow-hidden rounded-2xl border border-line bg-panel2 focus-ring ${className ?? ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 576px, 92vw"
          className={`object-cover object-left-top transition-transform duration-500 group-hover:scale-105 ${imageClassName ?? ""}`}
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-line bg-panel/90 px-3 py-1 text-[11px] font-medium text-inkSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click to view full size
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAndReset}
            className="fixed inset-0 z-[2147483000] flex flex-col items-center justify-center bg-base/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt}, full size`}
          >
            <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-line bg-panel/90 px-3 py-1 text-[11px] font-medium text-inkSoft">
              {zoomed ? "Drag to pan · click image to zoom out" : "Click image to zoom in"}
            </div>

            <button
              onClick={closeAndReset}
              aria-label="Close full size image"
              className="focus-ring absolute right-4 top-4 z-10 rounded-full border border-line bg-panel p-2 text-inkSoft hover:text-ink"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[85vh] w-full max-w-6xl overflow-hidden"
              style={{ cursor: zoomed ? "grab" : "zoom-in" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <div
                onClick={toggleZoom}
                className="relative h-full w-full"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoomed ? 2.4 : 1})`,
                  transformOrigin: "center center",
                  transition: dragState.current.dragging ? "none" : "transform 0.25s ease",
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}