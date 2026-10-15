import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown } from "lucide-react";
import SectionHeading, { Dot } from "../home/SectionHeading";
import SpotlightCard from "../fx/SpotlightCard";
import { eventsByYear, YEARS, type PastEvent } from "./PastEvents";
import { CATEGORIES, dateOf, metaOf, nameOf, sortKey, type Category } from "./eventMeta";

// The events archive: filters and a year picker, a featured (newest) event, three compact rows beside it,
// and the rest as a grid. Every card opens the existing event-details page.

const FILTERS: { label: string; value: Category | null }[] = [
  { label: "All events", value: null },
  { label: "Workshops", value: "Workshop" },
  { label: "Talks", value: "Talk" },
  { label: "Competitions", value: "Competition" },
  { label: "Community", value: "Community" },
];
const DOT: Record<Category, string> = {
  Workshop: "bg-google-blue",
  Talk: "bg-google-yellow",
  Competition: "bg-google-red",
  Community: "bg-google-green",
};

function Tags({ e }: { e: PastEvent }) {
  return (
    <span className="mt-2 flex flex-wrap gap-1.5">
      {metaOf(e).tags.map((t) => (
        <span key={t} className="rounded-full border border-white/25 px-2.5 py-0.5 text-[11px] text-white/75">
          {t}
        </span>
      ))}
    </span>
  );
}

function RoundArrow() {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-colors group-hover:bg-white group-hover:text-black"
    >
      <ArrowRight size={17} />
    </span>
  );
}

export default function EventsArchive() {
  const reduce = !!useReducedMotion();
  const navigate = useNavigate();
  const [year, setYear] = useState(YEARS[0]);
  const [filter, setFilter] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const events = useMemo(
    () =>
      [...(eventsByYear[year] ?? [])]
        .filter((e) => !filter || metaOf(e).category === filter)
        .sort((a, b) => sortKey(b) - sortKey(a)),
    [year, filter]
  );
  const [featured, ...rest] = events;
  const side = rest.slice(0, 3);
  const grid = rest.slice(3);

  const openEvent = (event: PastEvent) => {
    navigate("/event-details", { state: { event, year } });
    window.scrollTo(0, 0);
  };
  const appear = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: Math.min(i, 6) * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="archive" className="scroll-mt-24 px-6 pt-24 pb-20 sm:px-10 lg:px-[6%] lg:pt-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="The Archive"
            compact
            dot="bg-google-blue"
            stagger={false}
            lines={[
              <>
                Every event leaves a{" "}
                <span className="whitespace-nowrap">
                  mark
                  <Dot />
                </span>
              </>,
            ]}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
            {FILTERS.map((f) => {
              const on = filter === f.value;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    on ? "border-white bg-white text-black" : "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {f.value && <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT[f.value]}`} />}
                  {f.label}
                </button>
              );
            })}
            </div>
            <div ref={dropRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex items-center gap-6 rounded-lg border border-white/25 px-4 py-2 text-sm text-white"
              >
                {year}
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute right-0 z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-white/15 bg-[#0F1211] shadow-2xl">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(y);
                        setOpen(false);
                      }}
                      className={`block w-full px-5 py-2.5 text-left text-sm ${y === year ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {!featured ? (
          <p className="mt-16 text-center text-white/55">No events in this category for {year}.</p>
        ) : (
          <>
            <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
              {/* featured event */}
              <motion.article
                {...appear(0)}
                className="relative overflow-hidden rounded-2xl p-[1.5px]"
                style={{ background: "linear-gradient(120deg, rgba(66,133,244,0.7), rgba(234,67,53,0.6), rgba(251,188,5,0.7), rgba(52,168,83,0.6))" }}
              >
                <div className="relative flex h-full flex-col gap-8 rounded-[15px] bg-[#0d0f0e] p-6 sm:flex-row sm:p-8">
                  <img
                    src={featured.poster}
                    alt=""
                    className="aspect-[4/3] w-full rounded-xl object-cover sm:w-[46%]"
                    loading="eager"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[11px] tracking-[0.3em] text-white/55 uppercase">Featured event</p>
                    <h3 className="mt-2 text-2xl font-black tracking-[-0.01em] text-white uppercase sm:text-3xl">{nameOf(featured)}</h3>
                    <Tags e={featured} />
                    <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
                      <CalendarDays size={16} /> {dateOf(featured)}
                    </p>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/65">{featured.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <button
                        type="button"
                        onClick={() => openEvent(featured)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                      >
                        Explore event <ArrowUpRight size={15} />
                      </button>
                      {featured.page && (
                        <Link
                          to={featured.page.to}
                          className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm text-white hover:border-white/70"
                        >
                          {featured.page.label}
                        </Link>
                      )}
                    </div>
                  </div>
                  <span aria-hidden className="pointer-events-none absolute right-6 bottom-3 text-6xl font-black text-white/[0.06]">
                    01
                  </span>
                </div>
              </motion.article>

              {/* the next three, as compact rows */}
              <div className="flex flex-col gap-5">
                {side.map((e, i) => (
                  <motion.div {...appear(i + 1)} key={e.title} className="flex flex-1">
                    <SpotlightCard className="flex-1 rounded-2xl border border-white/15 bg-white/[0.02] transition-colors hover:border-white/40">
                      <button
                        type="button"
                        onClick={() => openEvent(e)}
                        className="group relative flex h-full w-full items-center gap-5 p-4 text-left"
                      >
                        <img src={e.poster} alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-lg object-cover sm:h-[72px] sm:w-28" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] tracking-[0.15em] text-white/50 uppercase">{dateOf(e)}</span>
                          <span className="mt-1 block text-base leading-tight font-bold text-white uppercase">{nameOf(e)}</span>
                        </span>
                        <RoundArrow />
                      </button>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* everything else */}
            {grid.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {grid.map((e, i) => (
                  <motion.div {...appear(i)} key={e.title}>
                  <SpotlightCard className="group flex items-center gap-5 rounded-2xl border border-white/15 bg-white/[0.02] p-5 transition-colors hover:border-white/40">
                    <button type="button" onClick={() => openEvent(e)} className="relative flex min-w-0 flex-1 items-center gap-5 text-left">
                      <img src={e.poster} alt="" loading="lazy" className="h-[76px] w-28 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] tracking-[0.15em] text-white/50 uppercase">{dateOf(e)}</span>
                        <span className="mt-1 block text-[15px] leading-tight font-bold text-white uppercase">{nameOf(e)}</span>
                        <Tags e={e} />
                      </span>
                      <RoundArrow />
                    </button>
                    {e.page && (
                      <Link to={e.page.to} className="sr-only focus:not-sr-only">
                        {e.page.label}
                      </Link>
                    )}
                  </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
