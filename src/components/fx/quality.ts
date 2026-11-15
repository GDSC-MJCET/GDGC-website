import { useSyncExternalStore } from "react";

// Three quality tiers, so the site runs on any device:
//   static  no motion: reduced motion is on, or the browser asked to save data. Stills instead of video and canvas.
//   lite    phones and modest machines: baked video and CSS-driven motion, lighter canvases.
//   full    everything.
// The starting tier is a guess from what the browser tells us. On "full", frames are then timed whenever the
// page is scrolled, and if the device cannot keep up the tier steps down to "lite" for the rest of the session.
// It never steps up on its own.
// ?quality=static|lite|full forces a tier for the session (handy for testing); ?quality=auto clears that.

export type Quality = "static" | "lite" | "full";

const FORCED_KEY = "gdgc-quality-forced";
const CAP_KEY = "gdgc-quality-cap";

const isQuality = (v: unknown): v is Quality => v === "static" || v === "lite" || v === "full";

function guess(): Quality {
  const mq = (q: string) => window.matchMedia(q).matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (mq("(prefers-reduced-motion: reduce)") || nav.connection?.saveData) return "static";
  const touchFirst = mq("(hover: none) and (pointer: coarse)");
  const modest = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  return touchFirst || modest ? "lite" : "full";
}

let forced = false;

function resolve(): Quality {
  if (typeof window === "undefined") return "full";
  try {
    const asked = new URLSearchParams(window.location.search).get("quality");
    if (asked === "auto") {
      sessionStorage.removeItem(FORCED_KEY);
      sessionStorage.removeItem(CAP_KEY);
    } else if (isQuality(asked)) sessionStorage.setItem(FORCED_KEY, asked);
    const stored = sessionStorage.getItem(FORCED_KEY);
    forced = isQuality(stored);
    if (isQuality(stored)) return stored;
    const guessed = guess();
    return guessed === "full" && sessionStorage.getItem(CAP_KEY) === "lite" ? "lite" : guessed;
  } catch {
    // storage unavailable: go by the guess alone
    return guess();
  }
}

let current: Quality = resolve();
const listeners = new Set<() => void>();

function apply(next: Quality) {
  if (typeof document !== "undefined") document.documentElement.dataset.quality = next;
  if (next === current) return;
  current = next;
  listeners.forEach((fn) => fn());
}
apply(current);

/** The tier right now. */
export const getQuality = () => current;

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** The tier, live: the component re-renders if the tier steps down. Use it for things that can change in
 * place (resolution, density, filters). For a choice that changes the page's layout, read getQuality() once
 * when the component mounts instead, so a scene is never swapped out from under the reader. */
export const useQuality = () => useSyncExternalStore(subscribe, getQuality, (): Quality => "full");

// ---- the frame watch ----

const WINDOW_MS = 1000; // frames are judged a second at a time
const SLOW_MS = 28; // a frame longer than this is under ~36fps
const STRIKES = 3; // this many bad seconds (a good one takes one back) and the tier steps down
const START_MS = 5000; // watch this long after the page opens
const SCROLL_MS = 1500; // and this long after every scroll

let holds = 0;

/** Stops the frame watch judging while something deliberately heavy plays (the intro). Returns the release. */
export function holdFrameWatch() {
  holds++;
  let released = false;
  return () => {
    if (!released) holds--;
    released = true;
  };
}

/** Starts watching (call once, from the app shell). Returns the cleanup. */
export function watchQuality() {
  let raf = 0;
  let until = 0;
  let last = 0;
  let start = 0;
  let slowTime = 0;
  let strikes = 0;

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const tick = (now: number) => {
    if (current !== "full" || now > until) return stop();
    raf = requestAnimationFrame(tick);
    const delta = now - last;
    last = now;
    // the tab was away, or the intro is playing: start the second over
    if (delta > 1000 || document.hidden || holds > 0) {
      start = now;
      slowTime = 0;
      return;
    }
    if (delta > SLOW_MS) slowTime += delta;
    if (now - start < WINDOW_MS) return;
    strikes = slowTime / (now - start) > 0.5 ? strikes + 1 : Math.max(0, strikes - 1);
    start = now;
    slowTime = 0;
    if (strikes >= STRIKES) {
      try {
        sessionStorage.setItem(CAP_KEY, "lite");
      } catch {
        // storage unavailable: the step-down lasts for this page only
      }
      apply("lite");
    }
  };

  const arm = (ms: number) => {
    if (forced || current !== "full") return;
    until = Math.max(until, performance.now() + ms);
    if (raf) return;
    last = start = performance.now();
    slowTime = 0;
    raf = requestAnimationFrame(tick);
  };

  const onScroll = () => arm(SCROLL_MS);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion = () => {
    if (!forced) apply(resolve());
  };

  arm(START_MS);
  window.addEventListener("scroll", onScroll, { passive: true });
  motion.addEventListener("change", onMotion);
  return () => {
    stop();
    window.removeEventListener("scroll", onScroll);
    motion.removeEventListener("change", onMotion);
  };
}
