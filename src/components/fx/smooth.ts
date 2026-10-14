import type Lenis from "lenis";

// The page's Lenis instance, shared so other components can scroll through it (SiteEffects creates it).
let current: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  current = l;
};

/** Smoothly scroll to an element (or the top of the page), through Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (current) current.scrollTo(target, { offset });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
