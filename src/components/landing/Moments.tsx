import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Label, RiseLines, Shape, type ShapeKind } from "./primitives";
import { useMedia } from "./useMedia";
import { PAST_EVENTS } from "../home/pastEvents";
import { eventsByYear } from "../events/PastEvents";
import { eventHref } from "../events/eventMeta";
import { GOOGLE_HEX } from "../fx/tokens";
import { WRAP } from "./constants";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const stamp = (date: string) => {
  const [m, y] = date.toLowerCase().split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m.slice(0, 3));
};

// newest first
const EVENTS = [...PAST_EVENTS].sort((a, b) => stamp(b.date) - stamp(a.date));

const ACCENTS: { kind: ShapeKind; fill: string }[] = [
  { kind: "circle", fill: GOOGLE_HEX.blue },
  { kind: "square", fill: GOOGLE_HEX.red },
  { kind: "triangle", fill: GOOGLE_HEX.yellow },
  { kind: "pill", fill: GOOGLE_HEX.green },
];

function EventCard({ event, i }: { event: (typeof EVENTS)[number]; i: number }) {
  const full = eventsByYear[event.match.year]?.find((e) => e.title === event.match.title);
  const accent = ACCENTS[i % ACCENTS.length];
  return (
    <Link
      to={full ? eventHref(full, event.match.year) : "/events"}
      state={full ? { event: full, year: event.match.year } : undefined}
      className="group block w-[78vw] shrink-0 snap-start sm:w-[24rem] md:w-[min(31vw,32rem,calc((100vh-24rem)*1.25))]"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1rem] bg-white/5">
        <img
          src={event.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1.5 font-tech text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-sm">
          {event.date}
        </span>
        <span className="absolute right-4 bottom-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <h3 className="font-display text-[clamp(1.4rem,1.9vw,2rem)] leading-[1] font-bold tracking-[-0.035em] text-white">{event.title}</h3>
        <span className="mt-1 flex shrink-0 items-center gap-2 font-tech text-[11px] text-white/45">
          {String(i + 1).padStart(2, "0")}
          <span className={accent.kind === "pill" ? "h-2.5 w-5" : accent.kind === "triangle" ? "w-3" : "h-2.5 w-2.5"}>
            <Shape kind={accent.kind} fill={accent.fill} className={accent.kind === "triangle" ? "w-full" : "h-full w-full"} />
          </span>
        </span>
      </div>
    </Link>
  );
}

function EndCard() {
  return (
    <Link
      to="/events"
      className="group flex aspect-[5/4] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[1rem] bg-google-yellow p-7 text-black sm:w-[24rem] md:w-[min(31vw,32rem,calc((100vh-24rem)*1.25))]"
    >
      <span className="font-tech text-[11px] tracking-[0.16em] uppercase">The full archive</span>
      <span className="flex items-end justify-between gap-4">
        <span className="font-display text-[clamp(2.25rem,3.4vw,3.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
          See every
          <br />
          event
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight size={22} />
        </span>
      </span>
    </Link>
  );
}

// "Moments that built us": on wider screens the section pins and the row of events slides sideways as you
// scroll down; on phones (and with reduced motion) it is a plain swipeable row.
export default function Moments() {
  const reduce = !!useReducedMotion();
  const wide = useMedia("(min-width: 768px)");
  const pinned = wide && !reduce;

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el || !pinned) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const header = (
    <div className={`${WRAP} flex flex-col gap-6 md:flex-row md:items-end md:justify-between`}>
      <div>
        <Label index="03">Past events</Label>
        <RiseLines
          lines={[
            "Moments that",
            <>
              built us<span className="text-google-red">.</span>
            </>,
          ]}
          className="mt-6 font-display text-[clamp(2.75rem,6vw,5.75rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-white"
        />
      </div>
      {pinned ? (
        <div className="mb-2 flex w-56 items-center gap-4 font-tech text-[11px] text-white/45">
          <span>01</span>
          <span className="relative h-px flex-1 bg-white/15">
            <motion.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: scrollYProgress }} />
          </span>
          <span>{String(EVENTS.length).padStart(2, "0")}</span>
        </div>
      ) : (
        <p className="text-sm text-white/50">Swipe to see more →</p>
      )}
    </div>
  );

  const cards = (
    <>
      {EVENTS.map((e, i) => (
        <EventCard key={e.title} event={e} i={i} />
      ))}
      <EndCard />
    </>
  );

  if (!pinned) {
    return (
      <section ref={section} aria-label="Past events" className="py-24">
        {header}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} aria-label="Past events" style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden py-16">
        {header}
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-10 will-change-transform lg:px-[max(4rem,calc((100vw-1600px)/2+4rem))]">
          {cards}
        </motion.div>
      </div>
    </section>
  );
}
