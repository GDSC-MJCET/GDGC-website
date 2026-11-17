import { eventsByYear, YEARS, type PastEvent } from "../../events/PastEvents";
import { dateOf, eventHref, metaOf, nameOf, sortKey } from "../../events/eventMeta";
import { CURRENT_EVENTS, CURRENT_YEAR } from "../../events/currentPhase";
import { thumbOf } from "../../events/posterThumb";

// What the home page's archive chapter shows, in order: an opening title, then every year as a "phase" with
// its latest few events, the phase now showing, and "To Be Continued". Shared by the two ways the chapter is
// told: the fly-through (ArchiveTunnel) and the phone's stack of tickets (TicketStack).

const NUMERALS = ["One", "Two", "Three", "Four", "Five"];
export const ROMAN = ["I", "II", "III", "IV", "V"];
const DOTS = ["bg-google-green", "bg-google-red", "bg-google-blue", "bg-google-yellow"];
const PER_PHASE = 4;

export type Poster = {
  kind: "poster";
  key: string;
  name: string;
  date: string;
  /** the original picture, and its phone-sized copy */
  image: string;
  thumb: string;
  /** Workshop, Talk, ... */
  type: string;
  to: string;
  state?: unknown;
  /** which phase it belongs to (index into STOPS) and its number among all the posters, from 1 */
  phase: number;
  no: number;
};
export type Phase = { kind: "phase"; name: string; year: string; meta: string; dot: string; now: boolean; phase: number };
export type Item = { kind: "intro" } | Phase | Poster | { kind: "end" };

const phaseName = (n: number) => NUMERALS[n - 1] ?? String(n);
const phaseDot = (n: number) => DOTS[(n - 1) % DOTS.length];
/** "2025-26" as "2025–26" */
export const span = (year: string) => year.replace("-", "–");

// Oldest year first, so scrolling travels forward in time; within a year its latest few events, in date order.
const PAST = [...YEARS].reverse();
let count = 0;

/** one event of a year as a poster on the archive chapter; numbered in the order they are built */
const posterOf = (e: PastEvent, year: string, phase: number): Poster => {
  const image = e.poster || e.image1;
  return {
    kind: "poster",
    key: `${year}-${e.title}`,
    name: nameOf(e),
    date: dateOf(e),
    image,
    thumb: thumbOf(image),
    type: metaOf(e).category,
    to: eventHref(e, year),
    state: { event: e, year },
    phase,
    no: ++count,
  };
};
/** the events of the year now showing that have a recap page, latest few, in date order */
const CURRENT_PICKS = [...(eventsByYear[CURRENT_YEAR] ?? [])].sort((a, b) => sortKey(b) - sortKey(a)).slice(0, PER_PHASE).reverse();
export const ITEMS: Item[] = [
  { kind: "intro" },
  ...PAST.flatMap((year, idx): Item[] => {
    const n = idx + 1;
    const all = [...(eventsByYear[year] ?? [])].sort((a, b) => sortKey(b) - sortKey(a));
    const picks = all.slice(0, PER_PHASE).reverse();
    return [
      { kind: "phase", name: phaseName(n), year, meta: `Complete · ${span(year)} · ${all.length} events`, dot: phaseDot(n), now: false, phase: idx },
      ...picks.map((e) => posterOf(e, year, idx)),
    ];
  }),
  {
    kind: "phase",
    name: phaseName(PAST.length + 1),
    year: CURRENT_YEAR,
    meta: `Now Showing · ${span(CURRENT_YEAR)} · Just getting started`,
    dot: phaseDot(PAST.length + 1),
    now: true,
    phase: PAST.length,
  },
  ...CURRENT_PICKS.map((e) => posterOf(e, CURRENT_YEAR, PAST.length)),
  ...CURRENT_EVENTS.map(
    (e): Poster => ({ kind: "poster", key: e.key, name: e.name, date: e.date, image: e.image, thumb: thumbOf(e.image), type: e.category, to: "/events", phase: PAST.length, no: ++count })
  ),
  { kind: "end" },
];

export const POSTERS = ITEMS.filter((it): it is Poster => it.kind === "poster");

// the phase titles, for the jump buttons
export const STOPS = ITEMS.flatMap((it, i) => (it.kind === "phase" ? [{ i, name: it.name, year: it.year, now: it.now, dot: it.dot }] : []));
