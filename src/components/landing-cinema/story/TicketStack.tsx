import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ITEMS, POSTERS, ROMAN, STOPS, span, type Phase, type Poster } from "./archiveItems";
import { Dot, Outline } from "../../fx/designSystem";
import { JOIN_URL } from "../theme";
import { getQuality } from "../../fx/quality";

// The archive chapter on phones: every event is a ticket (a boarding pass, with its poster as the picture),
// in one row you swipe through, each year announced by a "Phase" card. It is the same journey as the
// fly-through on wide screens, but one screen tall, and it moves by the browser's own scrolling: the row snaps
// card by card, and the tilt as a ticket passes and the progress line are CSS scroll-driven animations
// (see .ticket-row in index.css), so nothing here runs per frame. Browsers without those get a plain row.

const BARCODE =
  "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 8px, currentColor 8px 11px, transparent 11px 13px)";
const EYEBROW = "text-[10px] font-medium tracking-[0.22em] text-white/50 uppercase";
const CARD = "shrink-0 snap-center";

function PhaseCard({ item }: { item: Phase }) {
  return (
    <li data-phase={item.phase} data-stop={item.phase} className={`${CARD} flex w-[62vw] max-w-[16rem] flex-col justify-center`}>
      <p className={`flex items-center gap-2 ${EYEBROW}`}>
        {item.now && <span className="h-2 w-2 animate-pulse rounded-full bg-google-red motion-reduce:animate-none" />}
        {item.now ? "Now Showing" : "Complete"} · {span(item.year)}
      </p>
      <p className="mt-3 text-[clamp(3.25rem,18vw,5.5rem)] leading-[0.86] font-black tracking-[-0.05em] text-white">
        Phase
        <br />
        <Outline>{item.name}</Outline>
        <Dot color={item.dot} />
      </p>
    </li>
  );
}

function Ticket({ item }: { item: Poster }) {
  const stop = STOPS[item.phase];
  return (
    <li data-phase={item.phase} className={`${CARD} w-[78vw] max-w-[20rem]`}>
      <Link
        to={item.to}
        state={item.state}
        className="relative block h-full overflow-hidden rounded-[22px] bg-[#101114] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/12"
      >
        <span aria-hidden className={`absolute inset-x-0 top-0 z-10 h-1 ${stop.dot}`} />
        <div className="aspect-[4/5] bg-white/5">
          <img src={item.thumb} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
        </div>
        {/* the tear line, with a notch punched out of each edge */}
        <div aria-hidden className="relative mx-4 border-t border-dashed border-white/25">
          <span className="absolute -top-[10px] -left-[26px] h-5 w-5 rounded-full bg-[#050506] ring-1 ring-white/12" />
          <span className="absolute -top-[10px] -right-[26px] h-5 w-5 rounded-full bg-[#050506] ring-1 ring-white/12" />
        </div>
        <div className="px-5 pt-4 pb-5">
          <p className={EYEBROW}>
            Phase {ROMAN[item.phase]} · {span(stop.year)}
          </p>
          <p className="mt-1.5 line-clamp-2 min-h-[2.5em] text-[1.15rem] leading-tight font-bold text-white">{item.name}</p>
          <dl className="mt-4 grid grid-cols-[1.3fr_1fr_auto] gap-3">
            {[
              ["Date", item.date],
              ["Type", item.type],
              ["No.", `${String(item.no).padStart(2, "0")}/${POSTERS.length}`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-[9px] font-medium tracking-[0.2em] text-white/40 uppercase">{label}</dt>
                <dd className="mt-1 truncate text-[13px] font-semibold text-white/90">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center justify-between">
            <span aria-hidden className="h-6 w-24 text-white/45" style={{ background: BARCODE }} />
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
              Open <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

function EndCard() {
  const last = STOPS[STOPS.length - 1];
  return (
    <li data-phase={STOPS.length - 1} className={`${CARD} flex w-[78vw] max-w-[20rem] flex-col justify-center`}>
      <p className={EYEBROW}>Phase {last.name} is only getting started</p>
      <p className="mt-4 text-[clamp(2.5rem,13vw,3.75rem)] leading-[0.9] font-black tracking-[-0.045em] text-white">
        To Be
        <br />
        <Outline>Continued</Outline>
        <Dot color="bg-google-yellow" />
      </p>
      <div className="mt-7 flex flex-col items-start gap-3">
        <a
          href={JOIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-5 text-sm font-semibold text-black"
        >
          Be part of the next chapter
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <ArrowUpRight size={16} />
          </span>
        </a>
        <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white">
          Browse all events <ArrowRight size={15} />
        </Link>
      </div>
    </li>
  );
}

export default function TicketStack() {
  const row = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);

  // the phase of whichever card is crossing the middle of the row is the one lit in the jump buttons
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.phase));
      },
      { root: el, rootMargin: "0px -50% 0px -50%" }
    );
    el.querySelectorAll("[data-phase]").forEach((card) => seen.observe(card));
    return () => seen.disconnect();
  }, []);

  // bring a phase's title card to the middle of the row
  const jump = (k: number) => {
    const el = row.current;
    const card = el?.querySelector<HTMLElement>(`[data-stop="${k}"]`);
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: getQuality() === "static" ? "auto" : "smooth" });
  };

  return (
    <section aria-label="Past events" className="ticket-scope relative py-20">
      <div className="px-5">
        <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
          <span className="text-white">Ch. 02</span>
          <span aria-hidden className="h-px w-8 bg-white/30" />
          The Archive
        </p>
        <h2 className="mt-6 text-[clamp(2.75rem,13vw,4.5rem)] leading-[0.92] font-black tracking-[-0.04em] text-white">
          Moments That
          <br />
          Built <Outline>Us</Outline>
          <Dot />
        </h2>
        <p className="mt-4 text-sm text-white/55">
          {POSTERS.length} tickets, {STOPS.length} phases. Swipe to travel through them.
        </p>
      </div>

      <nav aria-label="Jump to a phase" className="mt-7 flex gap-2 px-5">
        {STOPS.map((st, k) => {
          const on = k === current;
          return (
            <button
              key={st.year}
              type="button"
              onClick={() => jump(k)}
              aria-current={on ? "step" : undefined}
              aria-label={`Phase ${st.name}, ${span(st.year)}`}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                on ? "border-white bg-white text-black" : "border-white/15 text-white/60"
              }`}
            >
              {st.now && <span className="h-1.5 w-1.5 rounded-full bg-google-red" />}
              {ROMAN[k]}
              <span className={on ? "text-black/50" : "text-white/35"}>{span(st.year.slice(2))}</span>
            </button>
          );
        })}
      </nav>

      <ol
        ref={row}
        className="ticket-row relative mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[max(11vw,calc(50vw-10rem))] pt-4 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ITEMS.map((it) => {
          if (it.kind === "phase") return <PhaseCard key={it.year} item={it} />;
          if (it.kind === "poster") return <Ticket key={it.key} item={it} />;
          return it.kind === "end" ? <EndCard key="end" /> : null;
        })}
      </ol>

      <div aria-hidden className="ticket-track mx-5 h-px bg-white/15">
        <span className="ticket-progress block h-full origin-left bg-white" />
      </div>
    </section>
  );
}
