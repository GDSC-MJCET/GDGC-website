import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { FADE_MASK, GB_ROLES, type GoverningMember, type GoverningRole } from "./governingBody";
import { scrollToTarget } from "../fx/smooth";
import { Dot } from "../fx/designSystem";
import { EASE } from "../fx/tokens";
import { useQuality } from "../fx/quality";

const ROLES = GB_ROLES;
const N = ROLES.length;
/** the stage's light and grain fade in from the top, so the page header above runs into the stage with no seam */
const TOP_FADE = "linear-gradient(to bottom, transparent 0%, black 30%)";
/** how much scrolling each role gets, in viewport heights */
const PER_ROLE = 0.85;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Every portrait is the same shape, so a role's people are the same size as each other: the box is as wide as
// the row allows, and no taller than the stage can spare. On a phone, people overlap a little at the shoulders
// (the pictures have empty margins) so two or three still stand side by side at a readable size.
const BOX: Record<number, string> = {
  1: "w-[min(72vw,58svh,34rem)] md:w-[min(40vw,58svh,36rem)]",
  2: "w-[min(62vw,58svh,36rem)] max-md:-mx-[7vw] md:w-[min(40vw,58svh,36rem)]",
  3: "w-[min(46vw,48svh,30rem)] max-md:-mx-[6.5vw] md:w-[min(29vw,52svh,30rem)]",
};

function Person({ m, i, count, active, show, mx, my }: { m: GoverningMember; i: number; count: number; active: boolean; show: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = !!useReducedMotion();
  const depth = 0.7 + (i % 2) * 0.5;
  const x = useTransform(mx, (v) => v * 22 * depth);
  const y = useTransform(my, (v) => v * 8 * depth);
  const [first, ...rest] = m.name.split(" ");
  const delay = reduce ? 0 : 0.22 + i * 0.09;

  return (
    <motion.div className={`flex min-w-0 shrink-0 flex-col items-center ${BOX[count] ?? BOX[3]}`} style={{ x, y, zIndex: count === 3 && i === 1 ? 2 : 1 }}>
      {/* each person steps up into the light a beat after the last */}
      <motion.div
        className="w-full"
        initial={false}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 36 }}
        transition={{ duration: reduce ? 0 : 0.8, delay: active ? delay : 0, ease: EASE }}
      >
        <img
          src={show ? m.image : undefined}
          alt={`${m.name}, ${m.role}`}
          draggable={false}
          decoding="async"
          className="block aspect-[760/660] w-full select-none"
          style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        />
      </motion.div>

      <div className="relative z-10 -mt-[7%] flex min-h-[6.5rem] flex-col items-center text-center md:min-h-[8.5rem]">
        <p className="text-[clamp(1.15rem,5.2vw,1.9rem)] leading-[0.92] font-black tracking-[-0.035em] text-white uppercase md:text-[clamp(1.75rem,3.2vw,3.25rem)]">{first}</p>
        {rest.length > 0 && <p className="mt-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/60 uppercase md:text-[clamp(0.7rem,1vw,0.95rem)]">{rest.join(" ")}</p>}
        <motion.span
          aria-hidden
          className="mt-3 block h-[3px] w-14 origin-left rounded-full md:w-24"
          style={{ background: m.color, boxShadow: `0 0 16px ${m.color}99` }}
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: active ? delay + 0.25 : 0, ease: EASE }}
        />
        {m.organizer && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.15em] whitespace-nowrap text-white/80 uppercase sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-google-yellow" /> GDG Organizer
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Scene({ r, k, idx, p, mx, my }: { r: GoverningRole; k: number; idx: number; p: MotionValue<number>; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = !!useReducedMotion();
  const active = k === idx;
  // portraits load when their scene is the one showing or the next in either direction, and then stay
  const near = Math.abs(k - idx) <= 1;
  const [show, setShow] = useState(near);
  if (near && !show) setShow(true);
  const count = r.members.length;
  // the big word behind the people slides sideways with the scroll, and against the cursor
  const scrollX = useTransform(p, (v) => (reduce ? 0 : (v * N - k - 0.5) * -140));
  const cursorX = useTransform(mx, (v) => v * -22);
  const bgX = useTransform<number, number>([scrollX, cursorX], ([a, b]) => a + b);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      aria-hidden={!active}
      style={{ pointerEvents: active ? "auto" : "none" }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.6, delay: active && !reduce ? 0.12 : 0, ease: EASE }}
    >
      {/* the light on this part of the stage: a cone from above and a glow on the floor */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ maskImage: TOP_FADE, WebkitMaskImage: TOP_FADE }}>
        <div
          className="absolute top-0 left-1/2 h-[80%] w-[78%] -translate-x-1/2 opacity-60"
          style={{ background: `linear-gradient(to bottom, ${r.spot}66, transparent 85%)`, clipPath: "polygon(36% 0, 64% 0, 100% 100%, 0 100%)", filter: "blur(30px)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: `radial-gradient(ellipse 55% 100% at 50% 100%, ${r.spot}40, transparent 70%)` }} />
      </div>

      {/* the role's name, huge and faint, behind the people */}
      <motion.p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[19%] px-4 text-center leading-[0.84] font-black tracking-[-0.045em] text-white/[0.07] uppercase max-md:top-[26%]"
        style={{ x: bgX, fontSize: `clamp(2.25rem, ${Math.min(12.5, 88 / (Math.max(...r.plural.split(" ").map((w) => w.length)) * 0.68))}vw, 12.5rem)` }}
      >
        {r.plural}
      </motion.p>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-5 pt-[96px] sm:px-10 lg:px-16">
        <motion.div initial={false} animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : k < idx ? -18 : 18 }} transition={{ duration: reduce ? 0 : 0.6, delay: active ? 0.15 : 0, ease: EASE }}>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-white/55 uppercase">
            Role {String(k + 1).padStart(2, "0")} · {String(N).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[clamp(1.9rem,4.2vw,3.9rem)] leading-[0.95] font-black tracking-[-0.04em]">
            {r.plural}
            <Dot color="bg-google-yellow" />
          </p>
          <p className="mt-2 text-sm text-white/60 sm:text-base">{r.line}</p>
        </motion.div>

        <div className="mt-auto flex items-start justify-center pb-[4svh] max-md:-mx-5 max-md:pb-[11svh] md:gap-[1.5vw]">
          {r.members.map((m, i) => (
            <Person key={m.name} m={m} i={i} count={count} active={active} show={show} mx={mx} my={my} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Design 1. The governing body on a lit stage. One pinned scene steps through the roles as you scroll: each
// role is lit in its own colour, its people step up one after another, the role's name slides past behind
// them, and everyone shifts slightly as you move your cursor.
export default function GoverningStage() {
  const reduce = !!useReducedMotion();
  const full = useQuality() === "full";
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(p, "change", (v) => setIdx(Math.min(N - 1, Math.max(0, Math.floor(v * N)))));

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 90, damping: 18 });
  const my = useSpring(rawY, { stiffness: 90, damping: 18 });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / N));
  };

  return (
    <section ref={ref} aria-label="The governing body" className="relative" style={{ height: `${(N * PER_ROLE + 1) * 100}vh` }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#050506]"
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          const fx = (e.clientX - r.left) / r.width;
          const fy = (e.clientY - r.top) / r.height;
          rawX.set(fx - 0.5);
          rawY.set(fy - 0.5);
          e.currentTarget.style.setProperty("--lx", `${fx * 100}%`);
          e.currentTarget.style.setProperty("--ly", `${fy * 100}%`);
        }}
        onPointerLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
      >
        {ROLES.map((r, k) => (
          <Scene key={r.role} r={r} k={k} idx={idx} p={p} mx={mx} my={my} />
        ))}

        {/* the light that follows your cursor, and a little film grain over everything */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(520px_circle_at_var(--lx,50%)_var(--ly,40%),rgba(255,255,255,0.07),transparent_60%)]" style={{ maskImage: TOP_FADE, WebkitMaskImage: TOP_FADE }} />
        {/* a blended layer over the whole stage is repainted with everything under it, so only the full tier has it */}
        {full && <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN, maskImage: TOP_FADE, WebkitMaskImage: TOP_FADE }} />}

        <nav aria-label="Roles" className="absolute z-30 flex gap-3 max-md:bottom-4 max-md:left-1/2 max-md:-translate-x-1/2 md:top-1/2 md:right-6 md:-translate-y-1/2 md:flex-col lg:right-10">
          {ROLES.map((r, k) => (
            <button
              key={r.role}
              type="button"
              aria-label={r.plural}
              aria-current={k === idx ? "true" : undefined}
              onClick={() => jump(k)}
              className="group flex items-center gap-3 py-1 md:flex-row-reverse"
            >
              <span className={`text-[11px] font-semibold tabular-nums transition-colors ${k === idx ? "text-white" : "text-white/35 group-hover:text-white/70"}`}>{String(k + 1).padStart(2, "0")}</span>
              <span className="h-[3px] rounded-full transition-all duration-500" style={{ width: k === idx ? 30 : 14, background: k === idx ? r.spot : "rgba(255,255,255,0.28)" }} />
            </button>
          ))}
        </nav>

        {/* how far through the roles you are */}
        <motion.div aria-hidden className="absolute inset-x-0 bottom-0 z-30 h-[2px] origin-left bg-white/70" style={{ scaleX: p }} />
      </div>
    </section>
  );
}
