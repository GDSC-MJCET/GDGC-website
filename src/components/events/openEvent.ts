import { flushSync } from "react-dom";
import type { NavigateFunction } from "react-router-dom";
import { YEARS } from "./PastEvents";
import { CURRENT_YEAR } from "./currentPhase";
import { slugOf } from "./eventMeta";
import type { PastEvent } from "./PastEvents";

// Years in order, oldest first: each is a "phase" (2023-24 is Phase One).
export const PHASE_YEARS = [...[...YEARS].reverse(), CURRENT_YEAR];
const NUMERALS = ["One", "Two", "Three", "Four", "Five", "Six"];
export const phaseNumber = (year: string) => PHASE_YEARS.indexOf(year) + 1;
export const phaseName = (year: string) => NUMERALS[phaseNumber(year) - 1] ?? String(phaseNumber(year));
export const PHASE_DOTS = ["bg-google-green", "bg-google-red", "bg-google-blue", "bg-google-yellow"];
export const phaseDot = (year: string) => PHASE_DOTS[(phaseNumber(year) - 1) % PHASE_DOTS.length];

/** The name that pairs an event's poster on the archive with the poster on its own page. */
export const posterName = (e: PastEvent, year: string) => `poster-${year}-${slugOf(e)}`;

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown };

/** Go to an event's page; where the browser supports it, the clicked poster morphs into the page's poster. */
export function openWithPoster(navigate: NavigateFunction, href: string, state?: unknown) {
  const doc = document as DocWithVT;
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigate(href, { state });
    return;
  }
  doc.startViewTransition(() => {
    flushSync(() => navigate(href, { state }));
    window.scrollTo(0, 0);
  });
}
