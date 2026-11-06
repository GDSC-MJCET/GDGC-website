import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import Nav from "../Nav";
import Footer from "../Footer";
import { eventsByYear, type PastEvent } from "./PastEvents";
import { dateOf, eventHref, findEventBySlug, metaOf, nameOf, sortKey } from "./eventMeta";
import { openWithPoster, phaseDot, phaseName, posterName } from "./openEvent";
import { Dot, Outline } from "../fx/designSystem";
import { EASE } from "../fx/tokens";

// One event's page, told like an episode: a hero with its poster (the archive's poster morphs into it), the
// overview lighting up as it scrolls, the story and impact beside photos that open up on scroll, the
// highlights as numbered beats, then the previous and next episodes. Resolved from the URL
// (/events/:year/:slug), so refreshing, bookmarking and sharing work.

const WRAP = "mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16";
const BEAT_DOTS = ["bg-google-blue", "bg-google-red", "bg-google-yellow", "bg-google-green"];

// oldest first; events without a date yet ("TBA") count as the newest
const chrono = (year: string) => {
  const key = (e: PastEvent) => (Number.isFinite(sortKey(e)) ? sortKey(e) : Number.MAX_SAFE_INTEGER);
  return [...(eventsByYear[year] ?? [])].sort((a, b) => key(a) - key(b));
};

function Label({ n, text }: { n: string; text: string }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
      <span className="text-white">{n}</span>
      <span aria-hidden className="h-px w-8 bg-white/30" />
      {text}
    </p>
  );
}

function Word({ i, n, progress, children }: { i: number; n: number; progress: MotionValue<number>; children: string }) {
  const opacity = useTransform(progress, [i / n, Math.min(1, (i + 2) / n)], [0.15, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

// big type that lights up word by word as it scrolls through
function LitText({ text }: { text: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className="mt-8 max-w-[64rem] text-[clamp(1.5rem,2.9vw,2.9rem)] leading-[1.18] font-bold tracking-[-0.025em] text-white">
      {reduce ? text : words.map((w, i) => <Word key={i} i={i} n={words.length} progress={scrollYProgress}>{w}</Word>)}
    </p>
  );
}

// a photo that starts as a framed card and opens out to the full width of the screen
function OpeningShot({ src, alt }: { src: string; alt: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clipPath = useTransform(scrollYProgress, (v) => {
    const k = reduce ? 0 : 1 - Math.min(1, Math.max(0, v));
    return `inset(${10 * k}% ${16 * k}% ${10 * k}% ${16 * k}% round ${28 * k}px)`;
  });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.3, 1]);
  return (
    <div ref={ref} className="relative mt-14 h-[62vh] min-h-[360px] md:h-[84vh]">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
        <motion.img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ scale }} />
      </motion.div>
    </div>
  );
}

// two photos side by side, drifting at different speeds
function Pair({ a, b, alt }: { a: string; b: string; alt: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ya = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const yb = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -40, reduce ? 0 : 90]);
  return (
    <div ref={ref} className="mt-14 grid gap-4 md:grid-cols-[1.2fr_1fr] md:gap-6">
      <motion.img src={a} alt={`${alt}, photo 2`} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover" style={{ y: ya }} />
      <motion.img src={b} alt={`${alt}, photo 3`} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover md:mt-24" style={{ y: yb }} />
    </div>
  );
}

function Episode({ e, year, dir }: { e: PastEvent | null; year: string; dir: "prev" | "next" }) {
  const navigate = useNavigate();
  if (!e) return <span className="hidden md:block" />;
  const href = eventHref(e, year);
  return (
    <a
      href={href}
      onClick={(ev) => {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
        ev.preventDefault();
        openWithPoster(navigate, href, { event: e, year });
      }}
      className={`group relative flex h-56 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-64 ${dir === "next" ? "justify-end text-right" : ""}`}
    >
      <img
        src={e.poster || e.image1}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        style={{ viewTransitionName: posterName(e, year) }}
      />
      <div className={`absolute inset-0 ${dir === "next" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-black/90 via-black/60 to-black/20`} />
      <div className="relative flex flex-col justify-end p-6 sm:p-8">
        <span className={`flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase ${dir === "next" ? "justify-end" : ""}`}>
          {dir === "prev" && <ArrowLeft size={14} />}
          {dir === "prev" ? "Previous episode" : "Next episode"}
          {dir === "next" && <ArrowRight size={14} />}
        </span>
        <span className="mt-2 text-2xl leading-tight font-black tracking-[-0.02em] text-white sm:text-3xl">{nameOf(e)}</span>
        <span className="mt-1 text-sm text-white/60">{dateOf(e)}</span>
      </div>
    </a>
  );
}

const EventDetails = () => {
  const { year = "2025-26", slug } = useParams<{ year: string; slug: string }>();
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const event = findEventBySlug(year, slug);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });
  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050506] text-white">
        <Nav />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-black tracking-[-0.03em]">
            Event not found
            <Dot color="bg-google-red" />
          </h1>
          <button
            onClick={() => navigate("/events")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Back to the Archive
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const list = chrono(year);
  const idx = list.findIndex((e) => e.title === event.title);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const meta = metaOf(event);
  const name = nameOf(event);
  const poster = event.poster || event.image1;
  let n = 1;
  const num = () => String(n++).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <Nav />
      <main>
        {/* hero */}
        <section aria-label={name} className="relative isolate overflow-hidden">
          <img
            aria-hidden
            src={poster}
            alt=""
            className="pointer-events-none absolute top-[-30%] left-1/2 -z-10 w-[110%] max-w-none -translate-x-1/2 opacity-[0.22] blur-[140px] saturate-150"
          />
          {/* keep the glow a tint, and fade it out before the hero ends */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#050506]/45" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[#050506] to-transparent" />
          <div className={`${WRAP} grid items-center gap-12 pt-8 pb-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16 md:pt-14 md:pb-28`}>
            <div>
              <motion.div {...rise(0)}>
                <Link to="/events" className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                  <ArrowLeft size={16} /> The Archive
                </Link>
              </motion.div>
              <motion.p {...rise(0.08)} className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
                <span className={`h-1.5 w-1.5 rounded-full ${phaseDot(year)}`} />
                Phase {phaseName(year)} · {year.replace("-", "–")} · {meta.category}
              </motion.p>
              <motion.p {...rise(0.12)} className="mt-3 text-sm text-white/45">
                Episode {String(idx + 1).padStart(2, "0")} of {String(list.length).padStart(2, "0")}
              </motion.p>
              <motion.h1 {...rise(0.18)} className="mt-5 text-[clamp(2.75rem,6.2vw,6.25rem)] leading-[0.92] font-black tracking-[-0.04em] text-white">
                {name}
                <Dot color="bg-google-red" />
              </motion.h1>
              <motion.div {...rise(0.28)} className="mt-6 flex flex-wrap items-center gap-2">
                <span className="mr-2 inline-flex items-center gap-2 text-sm text-white/80">
                  <CalendarDays size={16} /> {dateOf(event)}
                </span>
                {meta.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/80">
                    {t}
                  </span>
                ))}
              </motion.div>
              <motion.p {...rise(0.36)} className="mt-6 max-w-[38rem] text-base leading-relaxed text-white/70 sm:text-lg">
                {event.desc}
              </motion.p>
              {event.page && (
                <motion.div {...rise(0.44)}>
                  <Link
                    to={event.page.to}
                    className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
                  >
                    {event.page.label}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* no entrance animation here: the archive's poster morphs straight into this one */}
            <motion.div
              className="mx-auto w-full max-w-[460px]"
              style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
              onPointerMove={(e) => {
                if (reduce || e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
                rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
              }}
              onPointerLeave={() => {
                rx.set(0);
                ry.set(0);
              }}
            >
              <img
                src={poster}
                alt={`${name} poster`}
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
                style={{ viewTransitionName: posterName(event, year) }}
              />
            </motion.div>
          </div>
        </section>

        {/* overview */}
        {event.overview?.trim() && (
          <section aria-label="Overview" className={`${WRAP} pt-12 md:pt-20`}>
            <Label n={num()} text="Overview" />
            <LitText text={event.overview} />
          </section>
        )}

        {/* the story */}
        <section aria-label="The story" className="pt-24 md:pt-36">
          {event.neque?.trim() && (
            <motion.div {...reveal()} className={WRAP}>
              <Label n={num()} text="The Story" />
              <p className="mt-6 max-w-[44rem] text-lg leading-relaxed text-white/75 sm:text-xl">{event.neque}</p>
            </motion.div>
          )}
          {event.image1 && <OpeningShot src={event.image1} alt={`${name}, photo 1`} />}
        </section>

        {/* the impact */}
        <section aria-label="The impact" className={`${WRAP} pt-24 md:pt-36`}>
          {event.neque1?.trim() && (
            <motion.div {...reveal()} className="md:ml-auto md:max-w-[44rem]">
              <Label n={num()} text="The Impact" />
              <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">{event.neque1}</p>
            </motion.div>
          )}
          {event.image2 && event.image3 && <Pair a={event.image2} b={event.image3} alt={name} />}
        </section>

        {/* highlights */}
        {!!event.highlights?.length && (
          <section aria-label="Highlights" className={`${WRAP} pt-24 md:pt-36`}>
            <Label n={num()} text="Highlights" />
            <ol className="mt-10 border-t border-white/10">
              {event.highlights.map((h, k) => (
                <motion.li key={h} {...reveal(k * 0.06)} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-white/10 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] md:py-8">
                  <span className="text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-black tracking-[-0.04em] text-white">
                    <Outline>{String(k + 1).padStart(2, "0")}</Outline>
                  </span>
                  <span className="flex items-start gap-3 text-lg leading-snug text-white/85 sm:text-2xl">
                    <span aria-hidden className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${BEAT_DOTS[k % 4]}`} />
                    {h}
                  </span>
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {/* episodes */}
        <section aria-label="More episodes" className={`${WRAP} pt-24 pb-6 md:pt-36`}>
          <div className="grid gap-4 md:grid-cols-2">
            <Episode e={prev} year={year} dir="prev" />
            <Episode e={next} year={year} dir="next" />
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white"
            >
              <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" /> Back to the Archive
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
