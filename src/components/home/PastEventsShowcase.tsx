import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FIRST_FEATURED, PAST_EVENTS, type PastEvent } from "./pastEvents";
import { eventsByYear } from "../events/PastEvents";

// "Moments That Built Us": past events as a row of glass cards running left to right, each turned at its
// own angle. The row is draggable (it follows the pointer and settles on a card) and loops round; arrow
// keys step one card.

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 160, damping: 24, mass: 0.9 } as const;

type Pose = { rY: number; rZ: number; s: number; y: number; o: number };

// Pose by position in the row (0 = leftmost visible card). Three wide cards show at once; positions -1, 3
// and 4 are off the ends and hidden, which is where a card wraps round to the other end.
const POSES: Record<number, Pose> = {
  [-1]: { rY: 26, rZ: 0, s: 0.9, y: 0.02, o: 0 },
  0: { rY: 18, rZ: 1, s: 0.96, y: 0.03, o: 1 },
  1: { rY: 9, rZ: 5, s: 1, y: 0.01, o: 1 },
  2: { rY: -6, rZ: -3, s: 1.06, y: -0.03, o: 1 },
  3: { rY: -14, rZ: -2, s: 0.97, y: 0.025, o: 1 },
  4: { rY: -22, rZ: 0, s: 0.9, y: 0.03, o: 0 },
};

function poseAt(k: number): Pose {
  const x = Math.max(-1, Math.min(4, k));
  const lo = Math.min(3, Math.floor(x));
  const t = x - lo;
  const a = POSES[lo];
  const b = POSES[lo + 1];
  const mix = (p: number, q: number) => p + (q - p) * t;
  return { rY: mix(a.rY, b.rY), rZ: mix(a.rZ, b.rZ), s: mix(a.s, b.s), y: mix(a.y, b.y), o: mix(a.o, b.o) };
}

// Position of card i in the row for a (possibly fractional) scroll position, wrapped into [-1, n-1).
function slotOf(i: number, position: number, n: number) {
  let k = i - position;
  while (k >= n - 1) k -= n;
  while (k < -1) k += n;
  return k;
}

// Gold lines curling around the cards (decorative), in a 1000x400 viewBox stretched over the stage.
const SWIRLS = [
  // under the first card, curling off the left edge
  "M-10 330 C 20 380, 90 400, 150 370 S 230 300, 270 350",
  // over the top of the second and third cards
  "M300 60 C 360 10, 470 30, 520 70 S 640 40, 700 20",
  // the loop under the last card
  "M740 370 C 790 410, 900 410, 960 360 S 990 300, 1010 330",
  // a faint thread across the back
  "M260 200 C 420 150, 560 260, 740 180",
];

export default function PastEventsShowcase() {
  const reduce = !!useReducedMotion();
  const n = PAST_EVENTS.length;
  const [first, setFirst] = useState(FIRST_FEATURED); // index of the leftmost card
  const [drag, setDrag] = useState(0); // in cards, positive = the row moves left
  const [dragging, setDragging] = useState(false);
  const dragged = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1400, h: 520 });

  // the gold lines drift a little with the mouse
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const swirlX = useTransform(mx, (v) => v * -22);
  const swirlY = useTransform(my, (v) => v * -12);

  // the masked headline lines start pushed out of view, so watch the heading itself, not the lines
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingIn = useInView(headingRef, { once: true, amount: 0.4 });
  const lineY = reduce || headingIn ? 0 : "105%";

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const next = useCallback(() => setFirst((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setFirst((a) => (a - 1 + n) % n), [n]);

  // four cards across on wide screens; on phones about one and a half, so the next one peeks in
  const wide = size.w >= 1024;
  // the event pictures are wide banners, so the cards are wide too: three across on big screens, one on phones
  // four near-square cards across on big screens; on phones one card with the next peeking in
  const spacing = wide ? size.w * 0.235 : size.w * 0.7;
  const cw = wide ? spacing * 0.92 : size.w * 0.66;
  const ch = cw * 0.8; // a little wider than tall, so the wide banner pictures lose less
  const x0 = wide ? size.w * 0.14 : size.w * 0.42; // centre of the leftmost card

  const reveal = (delay: number, y = 18) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Past events"
      className="relative overflow-hidden py-16 lg:py-20"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="relative mx-auto w-full max-w-[1600px]">
        {/* header */}
        <div className="relative z-[60] flex flex-col gap-8 px-6 sm:px-10 lg:flex-row lg:items-start lg:justify-between lg:px-[3%]">
          <div className="relative">
            <motion.p
              className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase"
              {...reveal(0.05, 10)}
            >
              Past Events
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-google-yellow" />
            </motion.p>
            <h2
              ref={headingRef}
              className="mt-4 text-[clamp(2.4rem,4.6vw,4.75rem)] leading-[0.95] font-black tracking-[-0.03em] text-white"
            >
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: lineY }}
                  transition={{ duration: 1, delay: 0.1, ease: EASE }}
                >
                  Moments
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block pl-[0.9em]"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: lineY }}
                  transition={{ duration: 1, delay: 0.22, ease: EASE }}
                >
                  <span
                    className="text-transparent"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
                  >
                    That
                  </span>{" "}
                  Built Us
                  <span className="ml-[0.04em] inline-block h-[0.13em] w-[0.13em] rounded-full bg-google-yellow align-baseline" />
                </motion.span>
              </span>
            </h2>
          </div>

          <motion.p
            className="max-w-[17rem] text-sm leading-relaxed text-white/70 lg:mt-12 lg:mr-[4%]"
            {...reveal(0.4)}
          >
            Ideas, people, and experiences that continue to drive us forward.
          </motion.p>
        </div>

        {/* the row of cards */}
        <motion.div
          ref={stageRef}
          className={`relative mt-4 w-full touch-pan-y select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ height: ch * 1.3, perspective: wide ? 1300 : 1000 }}
          onPointerDown={() => {
            dragged.current = false;
          }}
          onPointerMove={(e) => {
            if (reduce || e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          onPanStart={() => setDragging(true)}
          onPan={(_, info) => {
            if (Math.abs(info.offset.x) > 8) dragged.current = true;
            setDrag(Math.max(-2, Math.min(2, -info.offset.x / spacing)));
          }}
          onPanEnd={(_, info) => {
            // settle on a card, nudged by a quick flick
            const shift = Math.round(
              Math.max(-2, Math.min(2, -info.offset.x / spacing - (info.velocity.x / spacing) * 0.2))
            );
            setFirst((a) => (((a + shift) % n) + n) % n);
            setDrag(0);
            setDragging(false);
          }}
        >
          <motion.svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            style={{ x: swirlX, y: swirlY, filter: "drop-shadow(0 0 6px rgba(251,188,5,0.45))" }}
          >
            <defs>
              <linearGradient id="swirlGold" x1="0" x2="1">
                <stop offset="0" stopColor="#FBBC05" stopOpacity="0.15" />
                <stop offset="0.5" stopColor="#FBBC05" stopOpacity="0.95" />
                <stop offset="1" stopColor="#F59E0B" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {SWIRLS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="url(#swirlGold)"
                strokeWidth={i === 3 ? 0.8 : 1.8}
                strokeOpacity={i === 3 ? 0.4 : 1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="420 90"
                animate={reduce ? undefined : { strokeDashoffset: [0, -510] }}
                transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </motion.svg>

          {PAST_EVENTS.map((event, i) => {
            const k = slotOf(i, first + drag, n);
            const p = poseAt(k);
            return (
              <EventCard
                key={event.title}
                event={event}
                width={cw}
                height={ch}
                eager={k > -1 && k < 4}
                animate={{
                  x: x0 + k * spacing,
                  y: size.h / 2 + p.y * size.h,
                  rotateY: p.rY,
                  rotateZ: p.rZ,
                  scale: p.s,
                  opacity: p.o,
                }}
                zIndex={k >= 2 && k < 3 ? 20 : 10}
                instant={dragging || reduce}
                wasDragged={() => dragged.current}
                reduce={reduce}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

type CardProps = {
  event: PastEvent;
  width: number;
  height: number;
  eager: boolean;
  /** x/y are the card's centre */
  animate: { x: number; y: number; rotateY: number; rotateZ: number; scale: number; opacity: number };
  zIndex: number;
  /** follow the drag directly (no spring) */
  instant: boolean;
  wasDragged: () => boolean;
  reduce: boolean;
};

function EventCard({ event, width, height, eager, animate, zIndex, instant, wasDragged, reduce }: CardProps) {
  // the full record of this event, which the event-details page needs
  const full = eventsByYear[event.match.year]?.find((e) => e.title === event.match.title);
  // hover: a small lean toward the pointer, the photo panning a touch the other way
  const tiltX = useSpring(0, { stiffness: 180, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 20 });
  const panX = useSpring(0, { stiffness: 120, damping: 20 });
  const panY = useSpring(0, { stiffness: 120, damping: 20 });
  const panXp = useTransform(panX, (v) => `${v}%`);
  const panYp = useTransform(panY, (v) => `${v}%`);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(nx * 7);
    tiltX.set(-ny * 5);
    panX.set(-nx * 3);
    panY.set(-ny * 3);
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    panX.set(0);
    panY.set(0);
  };

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2, zIndex, transformStyle: "preserve-3d" }}
      initial={false}
      animate={animate}
      transition={instant ? { duration: 0 } : SPRING}
    >
      {/* thin glass frame */}
      <motion.div
        className="relative h-full w-full rounded-[18px] border border-white/30 bg-white/[0.06] p-[4px] shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
      >
        <Link
          to="/event-details"
          state={{ event: full, year: event.match.year }}
          draggable={false}
          aria-label={`${event.title}, ${event.date}. Open this event`}
          className="relative block h-full w-full overflow-hidden rounded-[14px] bg-card"
          onClick={(e) => {
            if (wasDragged()) e.preventDefault(); // a drag that ends on a card is not a click
          }}
        >
          {/* the photo fills the whole card */}
          <motion.img
            src={event.image}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ x: panXp, y: panYp, scale: 1.08 }}
          />
          {/* glass sheen at the top, darkening at the bottom behind the text */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          <span className="absolute right-[10%] bottom-[9%] left-[10%] text-left">
            <span
              className="block font-medium tracking-[0.12em] text-white/75 uppercase"
              style={{ fontSize: Math.max(10, width * 0.042) }}
            >
              {event.date}
            </span>
            <span className="mt-1 block leading-[1.15] font-bold text-white" style={{ fontSize: width * 0.078 }}>
              {event.title}
            </span>
            <span
              aria-hidden
              className="mt-[0.9em] flex items-center justify-center rounded-full border border-white/70 text-white"
              style={{ width: width * 0.13, height: width * 0.13 }}
            >
              <ArrowRight style={{ width: width * 0.06, height: width * 0.06 }} />
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
