// Shared motion constants — the single source of truth for how things move.
// Every animated element on the site should pull from here rather than
// hardcoding its own timing, so the whole experience feels like one
// deliberate system instead of a collection of separately-tuned animations.

/** Cubic-bezier ease-out: starts fast, settles slowly. Never linear, never bouncy. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Standard entrance: fade in + rise 14px, the site's one consistent "arrival" motion. */
export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

/** Slightly larger rise, used for hero-scale elements that should feel weightier. */
export const fadeUpLarge = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/** Standard entrance duration — within the 600–800ms premium range. */
export const DURATION = 0.7;
export const DURATION_SLOW = 0.8;

/** Stagger delay between siblings in a group (cards, grid items, list rows). */
export const STAGGER = 0.09;

/** Builds a transition object with consistent easing, optionally staggered by index. */
export function transition(delay = 0, duration = DURATION) {
  return { duration, ease: EASE_OUT, delay };
}

/** Convenience for staggered groups: pass the item's index. */
export function staggerTransition(index: number, base = 0, duration = DURATION) {
  return { duration, ease: EASE_OUT, delay: base + index * STAGGER };
}

/** Hover micro-interaction — subtle scale, never abrupt. Spec: 1.02x over 200–300ms. */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.25, ease: EASE_OUT },
};

/** Viewport-triggered reveal config for elements below the fold — fires once,
 * slightly before the element fully enters, so it doesn't feel delayed. */
export const viewportOnce = { once: true, margin: "-80px" };
