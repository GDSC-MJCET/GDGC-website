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

/** Jump to the top of the page at once, resetting Lenis too so it does not drag the old position back. */
export function scrollToTop() {
  if (current) current.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
