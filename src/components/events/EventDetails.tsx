import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import Nav from "../Nav";
import Footer from "../Footer";
import Background from "../Background";
import AmbientGlow from "../home/AmbientGlow";
import { Dot } from "../home/SectionHeading";
import { eventsByYear, type PastEvent } from "./PastEvents";
import { dateOf, metaOf, nameOf } from "./eventMeta";

// One event's page, in the same look as the events archive: a hero with the poster, then the overview,
// the story told in alternating text and photos, highlights, and links to the neighbouring events.

const EASE = [0.22, 1, 0.36, 1] as const;
const RIM = "linear-gradient(120deg, rgba(66,133,244,0.75), rgba(234,67,53,0.6), rgba(251,188,5,0.7), rgba(52,168,83,0.65))";
const HIGHLIGHT_DOTS = ["bg-google-blue", "bg-google-red", "bg-google-yellow", "bg-google-green"];

function Photo({ src, alt, tilt = 0 }: { src: string; alt: string; tilt?: number }) {
  return (
    <div
      className="rounded-[20px] border border-white/20 bg-white/[0.05] p-[6px] shadow-[0_30px_70px_rgba(0,0,0,0.55)] backdrop-blur-md"
      style={{ transform: `perspective(1200px) rotateY(${tilt}deg)` }}
    >
      <img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-[14px] object-cover" />
    </div>
  );
}

function Label({ n, text }: { n: string; text: string }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
      <span className="text-white">{n}</span>
      <span aria-hidden className="h-px w-8 bg-white/30" />
      {text}
    </p>
  );
}

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const event: PastEvent | undefined = location.state?.event;
  const year: string = location.state?.year || "2025-26";

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  if (!event) {
    return (
      <Background>
        <Nav />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-black tracking-[-0.03em] text-white">
            Event not found
            <Dot color="bg-google-red" />
          </h1>
          <button
            onClick={() => navigate("/events")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Back to Events
          </button>
        </div>
        <Footer />
      </Background>
    );
  }

  const list = eventsByYear[year] || [];
  const i = list.findIndex((e) => e.title === event.title && e.bg === event.bg);
  const prev = i > 0 ? list[i - 1] : null;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  const meta = metaOf(event);
  const story = [
    { text: event.neque, image: event.image1, title: "The story" },
    { text: event.neque1, image: event.image2, title: "The impact" },
  ].filter((s) => s.text?.trim());
  const go = (target: PastEvent) => {
    navigate("/event-details", { state: { event: target, year } });
    window.scrollTo(0, 0);
  };

  const NeighbourCard = ({ e, dir }: { e: PastEvent | null; dir: "prev" | "next" }) =>
    e ? (
      <button
        type="button"
        onClick={() => go(e)}
        className={`group flex flex-1 items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.02] p-3 transition-colors hover:border-white/40 ${
          dir === "next" ? "flex-row-reverse text-right" : "text-left"
        }`}
      >
        <img src={e.poster} alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] tracking-[0.2em] text-white/50 uppercase">
            {dir === "prev" ? "Previous" : "Next"}
          </span>
          <span className="mt-1 block truncate font-bold text-white uppercase">{nameOf(e)}</span>
        </span>
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-colors group-hover:bg-white group-hover:text-black"
        >
          {dir === "prev" ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
        </span>
      </button>
    ) : (
      <span className="hidden flex-1 sm:block" />
    );

  return (
    <Background>
      <Nav />
      <div className="relative overflow-hidden">
        <AmbientGlow />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-6 pb-16 sm:px-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
            <ArrowLeft size={18} /> Back to Events
          </Link>

          {/* hero */}
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
            <motion.div {...rise()}>
              <p className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
                GDGC MJCET / {year} / {meta.category}
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-google-yellow" />
              </p>
              <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.75rem)] leading-[0.95] font-black tracking-[-0.03em] text-white uppercase">
                {nameOf(event)}
                <Dot color="bg-google-red" />
              </h1>
              <div className="mt-5 flex flex-wrap gap-2">
                {meta.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/80">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/80">
                <CalendarDays size={16} /> {dateOf(event)}
              </p>
              <p className="mt-5 max-w-[38rem] text-base leading-relaxed text-white/70 sm:text-lg">{event.desc}</p>
              {event.page && (
                <Link
                  to={event.page.to}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                >
                  {event.page.label} <ArrowUpRight size={15} />
                </Link>
              )}
            </motion.div>

            <motion.div {...rise(0.1)} className="mx-auto w-full max-w-[460px]">
              <div className="rounded-[22px] p-[1.5px] shadow-[0_0_60px_rgba(66,133,244,0.18)]" style={{ background: RIM }}>
                <div className="rounded-[21px] bg-[#0d0f0e] p-3">
                  <img src={event.poster} alt={`${nameOf(event)} poster`} className="w-full rounded-[16px] object-cover" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* overview */}
          <motion.section {...rise()} className="mt-20 rounded-2xl border border-white/15 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-10">
            <Label n="01" text="Overview" />
            <p className="mt-5 max-w-[60rem] text-lg leading-relaxed text-white/80 sm:text-xl">{event.overview}</p>
          </motion.section>

          {/* the story, text and photos alternating */}
          {story.map((s, k) => (
            <motion.section
              {...rise()}
              key={s.title}
              className={`mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${k % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <Label n={String(k + 2).padStart(2, "0")} text={s.title} />
                <p className="mt-5 text-base leading-relaxed text-white/70">{s.text}</p>
              </div>
              <Photo src={s.image} alt={`${nameOf(event)}, photo ${k + 1}`} tilt={k % 2 ? 6 : -6} />
            </motion.section>
          ))}

          {/* highlights */}
          <motion.section {...rise()} className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Label n={String(story.length + 2).padStart(2, "0")} text="Highlights" />
              {event.highlights?.length ? (
                <ul className="mt-6 space-y-3">
                  {event.highlights.map((h, k) => (
                    <li
                      key={h}
                      className="flex items-center gap-4 rounded-xl border border-white/12 bg-white/[0.02] px-5 py-4 text-white/85"
                    >
                      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${HIGHLIGHT_DOTS[k % 4]}`} />
                      {h}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-base leading-relaxed text-white/60">Moments from the day.</p>
              )}
            </div>
            <Photo src={event.image3} alt={`${nameOf(event)}, photo 3`} tilt={-6} />
          </motion.section>

          {/* neighbours */}
          <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
            <NeighbourCard e={prev} dir="prev" />
            <Link
              to="/events"
              className="shrink-0 self-center rounded-full border border-white/30 px-6 py-3 text-sm text-white transition-colors hover:border-white/70"
            >
              View all events
            </Link>
            <NeighbourCard e={next} dir="next" />
          </div>
        </div>
      </div>
      <Footer />
    </Background>
  );
};

export default EventDetails;
