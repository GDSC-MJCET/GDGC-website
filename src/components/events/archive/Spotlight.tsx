import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { eventsByYear, type PastEvent } from "../PastEvents";
import { CURRENT_EVENTS, CURRENT_YEAR } from "../currentPhase";
import { dateOf, eventHref, metaOf, nameOf, sortKey } from "../eventMeta";
import { PHASE_YEARS, openWithPoster, phaseDot, phaseName, posterName } from "../openEvent";
import { scrollToTarget } from "../../fx/smooth";
import { useMedia } from "../../landing/useMedia";
import { Dot, Outline } from "../../fx/designSystem";
import { EASE } from "../../fx/tokens";

type Item = {
  key: string;
  name: string;
  date: string;
  poster: string;
  category: string;
  tags: string[];
  desc: string;
  href?: string;
  state?: unknown;
  transitionName?: string;
};

const CAT_DOT: Record<string, string> = {
  Workshop: "bg-google-blue",
  Talk: "bg-google-yellow",
  Competition: "bg-google-red",
  Community: "bg-google-green",
};

// newest phase first; within a phase, newest event first (undated ones on top, they are the latest)
const PHASES = [...PHASE_YEARS].reverse().map((year) => {
  const now = year === CURRENT_YEAR;
  const items: Item[] = now
    ? CURRENT_EVENTS.map((e) => ({
        key: e.key,
        name: e.name,
        date: e.date,
        poster: e.image,
        category: e.category,
        tags: [],
        desc: "The year opened with GDGC 101, our welcome for new members. The full recap is on its way.",
      }))
    : [...(eventsByYear[year] ?? [])]
        .sort((a: PastEvent, b: PastEvent) => (Number.isFinite(sortKey(b)) ? sortKey(b) : Infinity) - (Number.isFinite(sortKey(a)) ? sortKey(a) : Infinity))
        .map((e) => {
          const m = metaOf(e);
          return {
            key: `${year}-${e.title}`,
            name: nameOf(e),
            date: dateOf(e),
            poster: e.poster || e.image1,
            category: m.category,
            tags: m.tags,
            desc: e.desc,
            href: eventHref(e, year),
            state: { event: e, year },
            transitionName: posterName(e, year),
          };
        });
  return { year, now, name: phaseName(year), dot: phaseDot(year), items };
});

function Chapter({ phase }: { phase: (typeof PHASES)[number] }) {
  const reduce = !!useReducedMotion();
  const navigate = useNavigate();
  const wide = useMedia("(min-width: 768px)");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const item = phase.items[active] ?? phase.items[0];

  // the title nearest the middle of the screen is the one in the spotlight
  useEffect(() => {
    const el = list.current;
    if (!el || !wide) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(Number((en.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    el.querySelectorAll("[data-i]").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [wide]);

  const open = (it: Item) => it.href && openWithPoster(navigate, it.href, it.state);

  return (
    <section id={`phase-${phase.year}`} aria-label={`Phase ${phase.name}`} className="pt-24 md:pt-36">
      <motion.header
        className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between"
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
            {phase.now && <span className="h-2 w-2 animate-pulse rounded-full bg-google-red motion-reduce:animate-none" />}
            {phase.now ? "Now Showing" : "Complete"} · {phase.year.replace("-", "–")}
          </p>
          <h2 className="mt-3 text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] font-black tracking-[-0.045em] text-white">
            Phase <Outline>{phase.name}</Outline>
            <Dot color={phase.dot} />
          </h2>
        </div>
        <p className="text-sm text-white/55 md:mb-2">
          {phase.items.length} {phase.items.length === 1 ? "event" : "events"}
          {phase.now && " · just getting started"}
        </p>
      </motion.header>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
        {/* the spotlight: one big poster, pinned while its titles scroll by */}
        {wide && (
          <div className="relative">
            <div className="sticky top-[calc(var(--nav-h,72px)+68px)] transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[min(30rem,calc((100vh-240px)*0.8))]" style={{ perspective: 1400 }}>
                <AnimatePresence initial={false}>
                  <motion.button
                    key={item.key}
                    type="button"
                    onClick={() => open(item)}
                    disabled={!item.href}
                    aria-label={item.href ? `Open ${item.name}` : `${item.name}, recap coming soon`}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, rotateY: -32, scale: 0.92 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, rotateY: 28, scale: 0.94 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <img
                      src={item.poster}
                      alt=""
                      draggable={false}
                      className="h-full w-full rounded-2xl object-cover shadow-[0_50px_110px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/15"
                      style={{ viewTransitionName: item.transitionName }}
                    />
                  </motion.button>
                </AnimatePresence>
              </div>
              <div className="mx-auto mt-5 flex w-full max-w-[min(30rem,calc((100vh-240px)*0.8))] items-center justify-between text-xs text-white/50">
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${CAT_DOT[item.category] ?? "bg-white"}`} />
                  {item.category}
                </span>
                <span className="font-semibold text-white/70 tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(phase.items.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* the titles */}
        <ol ref={list}>
          {phase.items.map((it, i) => {
            const on = !wide || i === active;
            return (
              <li
                key={it.key}
                data-i={i}
                className={`flex flex-col justify-center border-b border-white/10 py-10 last:border-b-0 md:min-h-[44vh] ${i === 0 ? "md:pt-0" : ""}`}
              >
                {!wide && (
                  <button type="button" onClick={() => open(it)} disabled={!it.href} className="mb-6 block w-full">
                    <img src={it.poster} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-white/15" style={{ viewTransitionName: it.transitionName }} />
                  </button>
                )}
                <p className={`text-sm font-semibold tabular-nums transition-colors duration-500 ${on ? "text-white/60" : "text-white/20"}`}>{String(i + 1).padStart(2, "0")}</p>
                <button
                  type="button"
                  onClick={() => (it.href ? open(it) : setActive(i))}
                  className={`mt-2 text-left text-[clamp(2rem,4.2vw,4rem)] leading-[0.98] font-black tracking-[-0.035em] transition-colors duration-500 ${
                    on ? "text-white" : "text-white/20 hover:text-white/50"
                  }`}
                >
                  {it.name}
                </button>
                <motion.div
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, height: on ? "auto" : 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-2 pt-5">
                    <span className="mr-2 inline-flex items-center gap-2 text-sm text-white/75">
                      <CalendarDays size={15} /> {it.date}
                    </span>
                    {it.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/75">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 line-clamp-3 max-w-[36rem] text-base leading-relaxed text-white/60">{it.desc}</p>
                  {it.href ? (
                    <button
                      type="button"
                      onClick={() => open(it)}
                      className="group mt-6 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
                    >
                      Open Episode
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight size={15} />
                      </span>
                    </button>
                  ) : (
                    <p className="mt-6 inline-flex rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/75">Recap coming soon</p>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// The archive as a spotlight: each phase is a chapter; one big poster stays pinned on the left while the
// phase's event titles scroll by on the right, and whichever title reaches the middle of the screen takes
// the spotlight. A slim bar on top jumps between phases.
export default function Spotlight() {
  const [current, setCurrent] = useState(PHASES[0].year);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setCurrent(en.target.id.replace("phase-", ""));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    PHASES.forEach((ph) => {
      const el = document.getElementById(`phase-${ph.year}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const jump = (year: string) => scrollToTarget(`#phase-${year}`, -((bar.current?.offsetHeight ?? 56) + 16));

  return (
    <section id="archive" aria-label="All events" className="relative">
      <div ref={bar} className="sticky top-[var(--nav-h,72px)] z-40 border-y transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-white/10 bg-[#050506]/80 backdrop-blur-xl">
        <nav aria-label="Phases" className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden">
          {PHASES.map((ph) => {
            const on = ph.year === current;
            return (
              <button
                key={ph.year}
                type="button"
                onClick={() => jump(ph.year)}
                aria-current={on ? "true" : undefined}
                className={`relative shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${on ? "text-black" : "text-white/60 hover:text-white"}`}
              >
                {on && <motion.span layoutId="spot-phase" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative flex items-center gap-1.5">
                  {ph.now && <span className="h-1.5 w-1.5 rounded-full bg-google-red" />}
                  Phase {ph.name}
                  <span className={on ? "text-black/45" : "text-white/35"}>{ph.year.slice(2).replace("-", "–")}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mx-auto max-w-[1500px] px-5 pb-16 sm:px-10 lg:px-16">
        {PHASES.map((ph) => (
          <Chapter key={ph.year} phase={ph} />
        ))}
      </div>
    </section>
  );
}
