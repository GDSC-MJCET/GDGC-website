import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Member = { image: string; name: string; role: string; color?: string };

const BLOB_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

// How far each step away from the centre sits, in card widths, plus how it is turned, shrunk and dimmed.
// Values between whole steps are interpolated, so cards glide continuously around the ring.
const POS = [0, 0.98, 1.78, 2.34, 2.65, 2.85];
const ROT = [0, 38, 48, 55, 60, 62];
const SCALE = [1, 0.88, 0.78, 0.7, 0.62, 0.56];
const DIM = [0, 0.22, 0.4, 0.55, 0.68, 0.75];

// Speeds in cards per second (the ring turns to the left): once, shortly after the page loads, the ring is
// flung at KICK_SPEED, bleeds off speed with time constant SLOW_TAU and never stops, settling into a slow
// merry-go-round drift at CRUISE_SPEED.
const KICK_SPEED = 42;
const CRUISE_SPEED = 0.5;
const SLOW_TAU = 0.9; // seconds; smaller = brakes harder
const FIRST_KICK_MS = 2000; // the one fling, this long after the page loads
const CALM_SPEED = 1.5; // below this the ring counts as "slow" and the card in the centre is highlighted
const IDLE_RESUME_MS = 2500; // after a manual move or release, wait this long before drifting again
const REFLECTION = 0.42; // reflection height as a fraction of the card height

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const wrapTo = (v: number, length: number) => ((v % length) + length) % length;

// Sample one of the tables above at a fractional distance from the centre.
function sample(table: number[], a: number) {
  const x = Math.min(a, table.length - 1);
  const i = Math.floor(x);
  return lerp(table[i], table[Math.min(i + 1, table.length - 1)], x - i);
}

// Signed distance (in cards) from the spinning position `pos` to `index`, taking the short way round.
function getOffset(index: number, pos: number, length: number) {
  let offset = index - pos;
  offset -= Math.round(offset / length) * length;
  return offset;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CardProps = {
  member: Member;
  offset: number;
  visible: number;
  cw: number;
  ch: number;
  eager: boolean;
  settled: boolean; // false while the ring is whipping round: nobody is "shown" yet
  onSelect: () => void;
};

const MemberCard = ({ member, offset, visible, cw, ch, eager, settled, onSelect }: CardProps) => {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  const isActive = settled && abs < 0.5;
  const color = member.color ?? "#4285F4";

  const opacity = clamp01(visible + 1 - abs);
  const dim = sample(DIM, abs);

  return (
    <div
      className="absolute top-0 left-1/2 will-change-transform"
      style={{
        width: cw,
        height: ch,
        marginLeft: -cw / 2,
        zIndex: 1000 - Math.round(abs * 100),
        opacity,
        cursor: isActive ? "default" : "pointer",
        transform: `translateX(${sign * sample(POS, abs) * cw}px) rotateY(${sign * sample(ROT, abs)}deg) scale(${sample(SCALE, abs)})`,
      }}
      onClick={onSelect}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[22px] bg-card transition-shadow duration-500"
        style={{
          boxShadow: isActive
            ? `0 0 0 1px ${color}aa, 0 0 38px ${color}44, 0 18px 50px rgba(0,0,0,0.55)`
            : "0 0 0 1px rgba(255,255,255,0.1), 0 18px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* the Google-coloured corner glows behind the photo */}
        <div aria-hidden className="absolute inset-0">
          {BLOB_COLORS.map((c, b) => (
            <div
              key={c}
              className="absolute h-1/2 w-1/2 rounded-full opacity-30 blur-2xl"
              style={{
                background: c,
                top: b % 2 === 0 ? "-10%" : "auto",
                bottom: b % 2 !== 0 ? "-10%" : "auto",
                left: b < 2 ? "-10%" : "auto",
                right: b >= 2 ? "-10%" : "auto",
              }}
            />
          ))}
        </div>

        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />

        {/* dims the cards further from the centre */}
        <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-[7%] pt-16 pb-[6%]">
          {/* re-keyed on focus so the name and role slide in whenever a card becomes the active one */}
          <motion.div
            key={isActive ? "active" : "idle"}
            initial={{ opacity: 0, y: isActive ? 14 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: isActive ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: color, boxShadow: isActive ? `0 0 8px ${color}` : "none" }}
              />
              <p
                className={`truncate font-semibold text-white ${
                  isActive ? "text-[clamp(0.95rem,1.15vw,1.2rem)]" : "text-[clamp(0.8rem,0.9vw,0.95rem)]"
                }`}
              >
                {member.name}
              </p>
            </div>
            <p
              className={`mt-0.5 truncate pl-4 text-white/60 ${
                isActive ? "text-[clamp(0.8rem,0.95vw,1rem)]" : "text-[clamp(0.7rem,0.8vw,0.85rem)]"
              }`}
            >
              {member.role}
            </p>
          </motion.div>
        </div>
      </div>

      {/* mirrored reflection that fades into the floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-full left-0 w-full overflow-hidden rounded-b-[22px]"
        style={{
          height: ch * REFLECTION,
          marginTop: 6,
          opacity: 0.22,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
        }}
      >
        <img
          src={member.image}
          alt=""
          className="absolute top-0 left-0 w-full -scale-y-100 object-cover object-top"
          style={{ height: ch }}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export function ThreeDPhotoCarousel({ items }: { items: Member[] }) {
  const length = items.length;
  // `pos` is the (fractional) index sitting at the centre; it keeps drifting so the ring turns like a merry-go-round.
  const [pos, setPos] = useState(0);
  const [settled, setSettled] = useState(true);
  const [stageW, setStageW] = useState(1200);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const wheelLock = useRef(0);

  const posRef = useRef(0);
  const targetRef = useRef<number | null>(null); // set while easing to a chosen member
  const holdUntil = useRef(0); // spinning is paused until this time (touch, manual moves)
  const holding = useRef(false); // finger/pointer currently down
  const velRef = useRef(CRUISE_SPEED); // current speed of the drift/fling, cards per second
  const nextKick = useRef(0); // when the next fling happens
  const calmRef = useRef(true);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animation loop: ease to a manual target; otherwise drift, after one fast fling at the start that slows back to the drift.
  useEffect(() => {
    if (length < 2) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    nextKick.current = last + FIRST_KICK_MS;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let p = posRef.current;
      const target = targetRef.current;
      if (target !== null) {
        p += (target - p) * (1 - Math.exp(-dt * 7));
        if (Math.abs(target - p) < 0.002) {
          p = target;
          targetRef.current = null;
        }
        velRef.current = CRUISE_SPEED;
        nextKick.current = Math.max(nextKick.current, holdUntil.current + 1500);
      } else if (!reduced && !holding.current && now >= holdUntil.current && !document.hidden) {
        if (now >= nextKick.current) {
          velRef.current = KICK_SPEED;
          nextKick.current = Infinity; // only the one fling
        }
        // exponential brake toward the cruising speed, never below it
        velRef.current = CRUISE_SPEED + (velRef.current - CRUISE_SPEED) * Math.exp(-dt / SLOW_TAU);
        p += velRef.current * dt;
      }
      const calm = velRef.current < CALM_SPEED;
      if (calm !== calmRef.current) {
        calmRef.current = calm;
        setSettled(calm);
      }
      if (p !== posRef.current) {
        posRef.current = p; // unbounded; offsets wrap on their own
        setPos(p);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [length]);

  // Move to the member `by` places along, or to a specific member by the shortest way round.
  const move = useCallback((by: number) => {
    const base = targetRef.current ?? Math.round(posRef.current);
    velRef.current = CRUISE_SPEED; // a manual move cancels any fling in progress
    targetRef.current = base + by;
    holdUntil.current = performance.now() + IDLE_RESUME_MS;
  }, []);
  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);
  const goTo = useCallback(
    (i: number) => {
      const from = posRef.current;
      velRef.current = CRUISE_SPEED;
      targetRef.current = from + getOffset(i, from, length);
      holdUntil.current = performance.now() + IDLE_RESUME_MS;
    },
    [length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Layout derives from the stage width so cards, spacing and the floor scale together.
  const cw = Math.min(290, Math.max(190, stageW * 0.17));
  const ch = Math.round(cw * 1.53);
  const visible = stageW < 640 ? 1 : stageW < 1024 ? 2 : 4;
  const stageH = Math.round(ch * (1 + REFLECTION * 0.6)) + 30;

  const activeIndex = wrapTo(Math.round(pos), length);
  const bars = Math.min(5, length);
  const activeBar = Math.min(bars - 1, Math.floor((activeIndex * bars) / length));
  const reduced = prefersReducedMotion();

  return (
    <div className="relative w-full">
      <motion.div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Governing Body members"
        className="relative mx-auto w-full max-w-[1900px] touch-pan-y select-none"
        style={{ height: stageH, perspective: 1700, perspectiveOrigin: "50% 38%" }}
        onPointerDown={() => {
          dragged.current = false;
          holding.current = true;
        }}
        onPointerUp={() => {
          holding.current = false;
          holdUntil.current = performance.now() + IDLE_RESUME_MS;
        }}
        onPointerLeave={() => {
          holding.current = false;
        }}
        onPan={(_, info) => {
          if (Math.abs(info.offset.x) > 8) dragged.current = true;
        }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -50) next();
          else if (info.offset.x > 50) prev();
        }}
        onWheel={(e) => {
          // horizontal gestures only, so vertical page scrolling is never hijacked
          if (Math.abs(e.deltaX) < 24 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
          const now = performance.now();
          if (now - wheelLock.current < 450) return;
          wheelLock.current = now;
          if (e.deltaX > 0) next();
          else prev();
        }}
      >
        {/* floor: soft pool of light + the orbit ring the cards stand on */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: ch * 0.96,
            width: "94%",
            height: ch * 0.3,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.05), rgba(255,255,255,0) 68%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-white/25"
          style={{
            top: ch * 0.62,
            width: "92%",
            height: ch * 0.5,
            zIndex: 1,
            maskImage: "linear-gradient(to bottom, transparent 42%, black 62%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 42%, black 62%)",
          }}
        />

        {items.map((member, i) => {
          const offset = getOffset(i, pos, length);
          if (Math.abs(offset) > visible + 1) return null;
          return (
            <MemberCard
              key={member.image}
              member={member}
              offset={offset}
              visible={visible}
              cw={cw}
              ch={ch}
              eager={i < 5}
              settled={settled}
              onSelect={() => {
                if (dragged.current || Math.abs(offset) < 0.5) return;
                goTo(i);
              }}
            />
          );
        })}
      </motion.div>

      {/* progress bars */}
      <div className="relative z-10 mt-2 flex items-center justify-center gap-3">
        {Array.from({ length: bars }, (_, b) => (
          <button
            key={b}
            type="button"
            aria-label={`Go to members group ${b + 1}`}
            aria-current={b === activeBar}
            onClick={() => goTo(Math.round((b * length) / bars))}
            className="group flex h-6 items-center"
          >
            <span
              className={`block h-[3px] rounded-full bg-white transition-all ${
                reduced ? "" : "duration-500"
              } ${b === activeBar ? "w-14 opacity-90" : "w-9 opacity-25 group-hover:opacity-50"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
