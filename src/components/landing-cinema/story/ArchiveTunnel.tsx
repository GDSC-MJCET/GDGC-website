import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Chapter from "./Chapter";
import { seeded } from "./rand";
import { Dot, Outline } from "../../fx/designSystem";
import { eventsByYear, YEARS, type PastEvent } from "../../events/PastEvents";
import { dateOf, eventHref, nameOf, sortKey } from "../../events/eventMeta";
import { JOIN_URL } from "../theme";
import { CURRENT_EVENTS, CURRENT_YEAR } from "../../events/currentPhase";
import { scrollToTarget } from "../../fx/smooth";

const NUMERALS = ["One", "Two", "Three", "Four", "Five"];
const DOTS = ["bg-google-green", "bg-google-red", "bg-google-blue", "bg-google-yellow"];
const PER_PHASE = 4;
const GAP = 900; // px of depth between items

type Poster = { kind: "poster"; key: string; name: string; date: string; image: string; to: string; state?: unknown };
type Item =
  | { kind: "intro" }
  | { kind: "phase"; name: string; year: string; meta: string; dot: string; now: boolean }
  | Poster
  | { kind: "end" };

const phaseName = (n: number) => NUMERALS[n - 1] ?? String(n);
const phaseDot = (n: number) => DOTS[(n - 1) % DOTS.length];

// Oldest year first, so scrolling travels forward in time; within a year its latest few events, in date order.
const PAST = [...YEARS].reverse();
const ITEMS: Item[] = [
  { kind: "intro" },
  ...PAST.flatMap((year, idx): Item[] => {
    const n = idx + 1;
    const all = [...(eventsByYear[year] ?? [])].sort((a, b) => sortKey(b) - sortKey(a));
    const picks = all.slice(0, PER_PHASE).reverse();
    return [
      { kind: "phase", name: phaseName(n), year, meta: `Complete · ${year.replace("-", "–")} · ${all.length} events`, dot: phaseDot(n), now: false },
      ...picks.map(
        (e: PastEvent): Poster => ({
          kind: "poster",
          key: `${year}-${e.title}`,
          name: nameOf(e),
          date: dateOf(e),
          image: e.poster || e.image1,
          to: eventHref(e, year),
          state: { event: e, year },
        })
      ),
    ];
  }),
  {
    kind: "phase",
    name: phaseName(PAST.length + 1),
    year: CURRENT_YEAR,
    meta: `Now Showing · ${CURRENT_YEAR.replace("-", "–")} · Just getting started`,
    dot: phaseDot(PAST.length + 1),
    now: true,
  },
  ...CURRENT_EVENTS.map((e): Poster => ({ kind: "poster", key: e.key, name: e.name, date: e.date, image: e.image, to: "/events" })),
  { kind: "end" },
];
const TOTAL = (ITEMS.length - 1) * GAP;

// posters alternate sides of the path, with a little jitter
const rand = seeded(7);
const PLACES = ITEMS.map((it, i) => {
  if (it.kind !== "poster") return { x: 0, y: 0, ry: 0 };
  const side = i % 2 ? -1 : 1;
  return { x: side * (20 + rand() * 6), y: (rand() - 0.5) * 14, ry: -side * (10 + rand() * 8) };
});

const G = GAP / TOTAL; // scroll distance between two items
const atOf = (i: number) => (i * GAP) / TOTAL; // scroll position where the camera reaches item i
const isTitle = (it: Item) => it.kind !== "poster";

// the phase titles, for the jump buttons
const STOPS = ITEMS.flatMap((it, i) => (it.kind === "phase" ? [{ i, name: it.name, year: it.year, now: it.now }] : []));

// When each item fades in, holds, and fades out. Titles take turns in the middle of the screen: each shows
// only around its own moment and is gone before the next arrives. Posters show from far off, but never while
// the title before them is still up.
const WINDOWS = ITEMS.map((it, i) => {
  const at = atOf(i);
  if (isTitle(it)) return i === 0 ? [-1, -0.5, 0, 0.35 * G] : [at - 0.6 * G, at - 0.3 * G, at, at + 0.35 * G];
  let prevTitle = i - 1;
  while (prevTitle > 0 && !isTitle(ITEMS[prevTitle])) prevTitle--;
  const start = Math.max(at - 2.4 * G, atOf(prevTitle) + 0.35 * G);
  return [start, start + 0.3 * G, at, at + 0.5 * G];
});

function Thing({ item, i, p }: { item: Item; i: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, WINDOWS[i], [0, 1, 1, 0]);
  const events = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));
  const place = PLACES[i];

  let body: ReactNode;
  if (item.kind === "intro") {
    body = (
      <div className="w-[90vw] max-w-[60rem] text-center">
        <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">Past Events</p>
        <p className="mt-5 text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] font-black tracking-[-0.04em] text-white">
          Moments That
          <br />
          Built <Outline>Us</Outline>
          <Dot />
        </p>
        <p className="mt-6 text-sm text-white/50">Keep scrolling to travel through them</p>
      </div>
    );
  } else if (item.kind === "phase") {
    body = (
      <div className="w-[90vw] max-w-[56rem] text-center">
        <p className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-medium tracking-[0.2em] text-white/55 uppercase sm:text-[11px] sm:tracking-[0.3em]">
          {item.now && <span className="h-2 w-2 animate-pulse rounded-full bg-google-red motion-reduce:animate-none" />}
          {item.meta}
        </p>
        <p className="mt-4 text-[clamp(4rem,13vw,12rem)] leading-[0.88] font-black tracking-[-0.05em] text-white">
          Phase <br className="sm:hidden" />
          <Outline>{item.name}</Outline>
          <Dot color={item.dot} />
        </p>
      </div>
    );
  } else if (item.kind === "poster") {
    body = (
      <Link to={item.to} state={item.state} className="group block w-[min(42vw,20rem)]">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition group-hover:ring-2 group-hover:ring-white">
          <img src={item.image} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
        </div>
        <p className="mt-3 text-[11px] font-medium tracking-[0.2em] text-white/55 uppercase">{item.date}</p>
        <p className="mt-1 text-lg leading-tight font-bold text-white">{item.name}</p>
      </Link>
    );
  } else {
    body = (
      <div className="flex w-[90vw] max-w-[56rem] flex-col items-center text-center">
        <span className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">Phase Four is only getting started</span>
        <span className="mt-5 text-[clamp(3.25rem,9vw,8rem)] leading-[0.9] font-black tracking-[-0.045em] text-white">
          To Be
          <br />
          <Outline>Continued</Outline>
          <Dot color="bg-google-yellow" />
        </span>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
          >
            Be part of the next chapter
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </a>
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-[15px] text-sm font-medium text-white transition-colors hover:border-white"
          >
            Browse all events <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        x: `calc(-50% + ${place.x}vw)`,
        y: `calc(-50% + ${place.y}vh)`,
        z: -i * GAP,
        rotateY: place.ry,
        opacity,
        pointerEvents: events,
      }}
    >
      {body}
    </motion.div>
  );
}

// Chapter 03: the archive as a journey forward in time. The camera travels through space while event posters
// drift past on either side, each year announced as a phase, ending on the phase now showing and "To Be Continued".
export default function ArchiveTunnel() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const camera = useTransform(p, [0, 1], [0, TOTAL]);
  const [current, setCurrent] = useState(-1);
  useMotionValueEvent(p, "change", (v) => {
    let c = -1;
    STOPS.forEach((st, k) => {
      if (v >= atOf(st.i) - 0.6 * G) c = k;
    });
    setCurrent(c);
  });
  // scroll to the moment the camera reaches a phase's title
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (el.offsetHeight - window.innerHeight) * atOf(i));
  };

  if (reduce) {
    return (
      <section ref={ref} aria-label="Past events" className="mx-auto max-w-[1500px] px-5 py-28 sm:px-10 lg:px-16">
        <p className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] font-black tracking-[-0.04em] text-white">Moments That Built Us</p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {ITEMS.filter((it): it is Poster => it.kind === "poster").map((it) => (
            <Link key={it.key} to={it.to} state={it.state} className="block">
              <img src={it.image} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
              <p className="mt-2 font-bold text-white">{it.name}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Past events" className="relative" style={{ height: `${ITEMS.length * 60}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ perspective: "1000px" }}>
        <Chapter n="02" name="The Archive" />
        {/* faint stars rushing by give the sense of speed */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(66,133,244,0.10),transparent_60%)]" />
        <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", z: camera }}>
          {ITEMS.map((it, i) => (
            <Thing key={i} item={it} i={i} p={p} />
          ))}
        </motion.div>
        <nav aria-label="Jump to a phase" className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/50 p-1 backdrop-blur-md">
            {STOPS.map((st, k) => {
              const on = k === current;
              return (
                <button
                  key={st.year}
                  type="button"
                  onClick={() => jump(st.i)}
                  aria-current={on ? "step" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-xs ${
                    on ? "text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  {on && <motion.span layoutId="phase-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative flex items-center gap-1.5">
                    {st.now && <span className="h-1.5 w-1.5 rounded-full bg-google-red" />}
                    <span className="sm:hidden">{["I", "II", "III", "IV", "V"][k]}</span>
                    <span className="hidden sm:inline">Phase {st.name}</span>
                    <span className={`hidden md:inline ${on ? "text-black/50" : "text-white/35"}`}>{st.year.slice(2).replace("-", "–")}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <span className="relative h-px w-40 bg-white/15">
            <motion.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: p }} />
          </span>
        </nav>
      </div>
    </section>
  );
}
