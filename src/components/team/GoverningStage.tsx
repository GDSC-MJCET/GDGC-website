import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { GB_MEMBERS, type GoverningMember } from "./governingBody";
import { scrollToTarget } from "../fx/smooth";
import { Dot } from "../fx/designSystem";
import { EASE, GOOGLE_HEX } from "../fx/tokens";

// Top-down: the Chief Coordinators first. `spot` is the colour of the light on that role's part of the stage.
const ROLES = [
  { role: "Chief Coordinator", plural: "Chief Coordinators", line: "The ones who run it all", spot: GOOGLE_HEX.red },
  { role: "General Secretary", plural: "General Secretaries", line: "Keeping every plan on track", spot: GOOGLE_HEX.blue },
  { role: "Chief Representative", plural: "Chief Representatives", line: "The voice in every room", spot: GOOGLE_HEX.green },
  { role: "Treasurer", plural: "Treasurer", line: "Every rupee, accounted for", spot: GOOGLE_HEX.yellow },
  { role: "Tech Captain", plural: "Tech Captains", line: "The ones who build it", spot: GOOGLE_HEX.blue },
]
  .map((r) => ({ ...r, members: GB_MEMBERS.filter((m) => m.role === r.role) }))
  .filter((r) => r.members.length);
const N = ROLES.length;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const SIZE: Record<number, string> = {
  1: "h-[min(58svh,38rem)] max-w-[80vw]",
  2: "h-[min(54svh,34rem)] max-w-[48vw] max-md:max-w-[52vw]",
  3: "h-[min(48svh,30rem)] max-w-[31vw] max-md:max-w-[44vw]",
};

function Person({ m, i, count, active, mx, my }: { m: GoverningMember; i: number; count: number; active: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = !!useReducedMotion();
  const depth = 0.7 + (i % 2) * 0.5;
  const x = useTransform(mx, (v) => v * 26 * depth);
  const y = useTransform(my, (v) => v * 10 * depth);
  const [first, ...rest] = m.name.split(" ");
  const delay = reduce ? 0 : 0.35 + i * 0.1;

  return (
    <motion.div className={`flex min-w-0 flex-col items-center ${count > 1 ? "max-md:-mx-[5vw]" : ""}`} style={{ x, y, zIndex: i % 2 ? 2 : 1 }}>
      <div className="relative">
        <img
          src={m.image}
          alt={`${m.name}, ${m.role}`}
          draggable={false}
          decoding="async"
          className={`block w-auto object-contain object-bottom ${SIZE[count] ?? SIZE[3]}`}
          style={{
            filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
            maskImage: "linear-gradient(to bottom, black 78%, transparent 99%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 99%)",
          }}
        />
        {/* a faint reflection in the floor */}
        <div aria-hidden className="pointer-events-none absolute top-full left-0 h-full w-full opacity-[0.16] [mask-image:linear-gradient(to_bottom,black,transparent_32%)]">
          <img src={m.image} alt="" draggable={false} className="h-full w-full -scale-y-100 object-contain object-bottom" />
        </div>
      </div>

      <div className="relative z-10 -mt-2 text-center">
        <p className="text-[clamp(1.5rem,3.4vw,3.4rem)] leading-[0.92] font-black tracking-[-0.035em] text-white uppercase max-md:text-[clamp(1.1rem,5vw,1.7rem)]">{first}</p>
        {rest.length > 0 && <p className="mt-1 text-[clamp(0.7rem,1.1vw,1rem)] font-semibold tracking-[0.18em] text-white/60 uppercase">{rest.join(" ")}</p>}
        <motion.span
          aria-hidden
          className="mx-auto mt-3 block h-[3px] w-[min(9rem,60%)] origin-left rounded-full"
          style={{ background: m.color, boxShadow: `0 0 16px ${m.color}99` }}
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: active ? delay : 0, ease: EASE }}
        />
        {m.organizer && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full whitespace-nowrap border border-white/25 px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.15em] text-white/80 uppercase sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-google-yellow" /> GDG Organizer
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Scene({ r, k, idx, mx, my }: { r: (typeof ROLES)[number]; k: number; idx: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = !!useReducedMotion();
  const active = k === idx;
  const count = r.members.length;
  const bgX = useTransform(mx, (v) => v * -22);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      aria-hidden={!active}
      style={{ pointerEvents: active ? "auto" : "none" }}
      initial={false}
      animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: k < idx ? -28 : 28, filter: reduce ? "blur(0px)" : "blur(12px)" }}
      transition={{ duration: reduce ? 0 : 0.75, delay: active && !reduce ? 0.18 : 0, ease: EASE }}
    >
      {/* the light on this part of the stage: a cone from above and a glow on the floor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-1/2 h-[80%] w-[78%] -translate-x-1/2 opacity-60"
          style={{ background: `linear-gradient(to bottom, ${r.spot}66, transparent 85%)`, clipPath: "polygon(36% 0, 64% 0, 100% 100%, 0 100%)", filter: "blur(30px)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: `radial-gradient(ellipse 55% 100% at 50% 100%, ${r.spot}40, transparent 70%)` }} />
      </div>

      {/* the role's name, huge and faint, behind the people; it drifts the opposite way to them */}
      <motion.p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[17%] px-4 text-center leading-[0.84] font-black tracking-[-0.045em] text-white/[0.08] uppercase max-md:top-[24%]"
        style={{ x: bgX, fontSize: `clamp(2.25rem, ${Math.min(12.5, 88 / (Math.max(...r.plural.split(" ").map((w) => w.length)) * 0.68))}vw, 12.5rem)` }}
      >
        {r.plural}
      </motion.p>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-5 pt-[96px] sm:px-10 lg:px-16">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-white/55 uppercase">
            Role {String(k + 1).padStart(2, "0")} · {String(N).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[clamp(1.9rem,4.2vw,3.9rem)] leading-[0.95] font-black tracking-[-0.04em]">
            {r.plural}
            <Dot color="bg-google-yellow" />
          </p>
          <p className="mt-2 text-sm text-white/60 sm:text-base">{r.line}</p>
        </div>

        <div className="mt-auto flex items-start justify-center gap-[2.4vw] pb-[7svh] max-md:gap-0 max-md:pb-[10svh]">
          {r.members.map((m, i) => (
            <Person key={m.name} m={m} i={i} count={count} active={active} mx={mx} my={my} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// The governing body on a lit stage. One pinned scene steps through the roles as you scroll (a short run,
// so the page can carry more below it): each role is lit in its own colour, the people stand in front of a
// faint floor reflection, and they shift slightly as you move your cursor, like walking around them.
export default function GoverningStage() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
    <section ref={ref} aria-label="The governing body" className="relative" style={{ height: `${N * 60}vh` }}>
      <div
        ref={stage}
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
          <Scene key={r.role} r={r} k={k} idx={idx} mx={mx} my={my} />
        ))}

        {/* the light that follows your cursor, and a little film grain over everything */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(520px_circle_at_var(--lx,50%)_var(--ly,40%),rgba(255,255,255,0.07),transparent_60%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

        <nav aria-label="Roles" className="absolute z-30 flex gap-3 max-md:bottom-3 max-md:left-1/2 max-md:-translate-x-1/2 md:top-1/2 md:right-6 md:-translate-y-1/2 md:flex-col lg:right-10">
          {ROLES.map((r, k) => (
            <button
              key={r.role}
              type="button"
              aria-label={r.plural}
              aria-current={k === idx ? "true" : undefined}
              onClick={() => jump(k)}
              className="group flex items-center gap-3 md:flex-row-reverse"
            >
              <span className={`text-[11px] font-semibold tabular-nums transition-colors ${k === idx ? "text-white" : "text-white/35 group-hover:text-white/70"}`}>{String(k + 1).padStart(2, "0")}</span>
              <span className="h-[3px] rounded-full transition-all duration-500" style={{ width: k === idx ? 30 : 14, background: k === idx ? r.spot : "rgba(255,255,255,0.28)" }} />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
