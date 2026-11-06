import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { eventsByYear, YEARS } from "../PastEvents";
import { CURRENT_EVENTS, CURRENT_YEAR } from "../currentPhase";
import { PHASE_YEARS, phaseName } from "../openEvent";
import { scrollToTarget } from "../../fx/smooth";
import { Dot, Outline } from "../../fx/designSystem";
import { EASE } from "../../fx/tokens";

// Put the next event here and the hero's "Up next" line announces it; null shows "nothing announced yet".
type Upcoming = { title: string; when: string; href: string };
const UPCOMING = null as Upcoming | null;

const POSTERS = [...CURRENT_EVENTS.map((e) => e.image), ...YEARS.flatMap((y) => (eventsByYear[y] ?? []).map((e) => e.poster || e.image1))];
const TOTAL = POSTERS.length;
const COLS = 6;
// each column gets every sixth poster (offset), so neighbours differ; columns drift at different speeds
const COLUMNS = Array.from({ length: COLS }, (_, c) => POSTERS.filter((_, i) => i % COLS === c));
const SPEEDS = [70, 95, 80, 105, 75, 90];

// The archive's opening: a wall of every event poster drifting in columns behind the title. Scrolling on,
// the wall sinks back and the title lifts away.
export default function ArchiveHero() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wallScale = useTransform(p, [0, 1], [1, reduce ? 1 : 1.15]);
  const wallOpacity = useTransform(p, [0, 1], [1, 0.3]);
  const textY = useTransform(p, [0, 1], [0, reduce ? 0 : -120]);
  const textOpacity = useTransform(p, [0, 0.7], [1, 0]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section ref={ref} aria-label="The archive" className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden">
      <motion.div aria-hidden className="absolute inset-[-6%] -z-10 flex gap-4" style={{ scale: wallScale, opacity: wallOpacity, rotate: -6 }}>
        {COLUMNS.map((col, c) => (
          <div key={c} className={`min-w-0 flex-1 ${c >= 5 ? "hidden lg:block" : c >= 3 ? "hidden md:block" : ""}`}>
            <div
              className={`flex flex-col gap-4 ${c % 2 ? "animate-marquee-y-reverse" : "animate-marquee-y"}`}
              style={{ "--marquee-duration": `${SPEEDS[c]}s` } as CSSProperties}
            >
              {[...col, ...col].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#050506]/65" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,5,6,0.2)_0%,rgba(5,5,6,0.85)_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#050506] to-transparent" />

      <motion.div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col items-center justify-center px-5 text-center sm:px-10" style={{ y: textY, opacity: textOpacity }}>
        <motion.p {...rise(0.05)} className="text-[11px] font-medium tracking-[0.3em] text-white/65 uppercase">
          The Archive · 2023 — Now
        </motion.p>
        <motion.h1 {...rise(0.15)} className="mt-5 text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] font-black tracking-[-0.045em] text-white">
          Every Event
          <br />
          Leaves a <Outline>Mark</Outline>
          <Dot color="bg-google-red" />
        </motion.h1>
        <motion.p {...rise(0.3)} className="mt-6 text-sm text-white/60 sm:text-base">
          {TOTAL} events · {PHASE_YEARS.length} phases · Since 2023
        </motion.p>
        <motion.div {...rise(0.42)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollToTarget("#archive", -72)}
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
          >
            Browse the Archive
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-y-0.5">
              <ArrowDown size={16} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToTarget("#archive", -72)}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-6 py-[15px] text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-google-red motion-reduce:animate-none" />
            Now Showing: Phase {phaseName(CURRENT_YEAR)}
          </button>
        </motion.div>
      </motion.div>

      <motion.div {...rise(0.6)} className="mx-auto mb-8 w-full max-w-[1500px] px-5 sm:px-10">
        <div className="flex flex-col items-center justify-center gap-1 text-center text-sm text-white/60 sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] text-white/80 uppercase">
            <span aria-hidden className="h-2 w-2 rounded-full bg-google-green shadow-[0_0_10px_#34A853]" />
            Up next
          </span>
          {UPCOMING ? (
            <a href={UPCOMING.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white hover:underline">
              {UPCOMING.title} · {UPCOMING.when} <ArrowUpRight size={14} />
            </a>
          ) : (
            <span>No upcoming events announced just yet.</span>
          )}
        </div>
      </motion.div>
    </section>
  );
}
