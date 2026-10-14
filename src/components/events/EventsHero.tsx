import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import SectionHeading, { Dot, Outline } from "../home/SectionHeading";

// Events page hero: the headline on the left, and a cluster of event posters floating on an orbit on the right.

// poster, position in the cluster box (% of its width/height), width (%), tilts, depth (bigger = moves more)
const POSTERS = [
  { src: "/antigravityposter.jpeg", left: 14, top: 26, w: 18, rY: 24, rZ: -3, depth: 0.6 },
  { src: "/buildweekposter.jpeg", left: 33, top: 6, w: 24, rY: 8, rZ: -1, depth: 1 },
  { src: "/techfaceoffposter.jpeg", left: 56, top: 30, w: 16, rY: -14, rZ: 6, depth: 0.8 },
  { src: "/bugbountyposter.jpeg", left: 72, top: 18, w: 15, rY: -24, rZ: 4, depth: 0.7 },
  { src: "/pixelxposter.jpeg", left: 60, top: 4, w: 11, rY: -18, rZ: -4, depth: 0.4 },
] as const;
const FAINT = [
  { src: "/frtpposter.jpeg", left: 2, top: 40, w: 10, rZ: -6 },
  { src: "/dyeposter.png", left: 86, top: 52, w: 11, rZ: 5 },
] as const;
// The orbit, in the SVG's 100x60 viewBox (stretched over the cluster box), and the dots that sit on it.
const ORBIT = { cx: 50, cy: 34, rx: 47, ry: 22, rot: -6 };
// angle on the orbit (degrees), colour, size px
const DOTS = [
  [200, "#4285F4", 9],
  [250, "#FBBC05", 8],
  [355, "#EA4335", 11],
  [140, "#34A853", 11],
  [62, "#FBBC05", 8],
] as const;
// where a point at `deg` on the orbit lands, as % of the box
function onOrbit(deg: number) {
  const t = (deg * Math.PI) / 180;
  const r = (ORBIT.rot * Math.PI) / 180;
  const ex = ORBIT.rx * Math.cos(t);
  const ey = ORBIT.ry * Math.sin(t);
  const x = ORBIT.cx + ex * Math.cos(r) - ey * Math.sin(r);
  const y = ORBIT.cy + ex * Math.sin(r) + ey * Math.cos(r);
  return { left: x, top: (y / 60) * 100 };
}

function Rail({ words, align }: { words: string[]; align: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-0 hidden h-[78%] xl:block ${align === "left" ? "left-8" : "right-8"}`}
    >
      <span className={`absolute top-0 bottom-0 w-px bg-white/12 ${align === "left" ? "right-0" : "left-0"}`} />
      <div
        className={`space-y-1.5 text-[10px] tracking-[0.3em] text-white/55 ${align === "left" ? "pr-8 text-right" : "pl-8"}`}
      >
        {words.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <span className={`absolute bottom-0 text-xs text-white/30 ${align === "left" ? "-right-1" : "-left-1"}`}>+</span>
    </div>
  );
}

export default function EventsHero() {
  const reduce = !!useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  return (
    <section
      className="relative px-6 pt-10 pb-12 sm:px-10 lg:px-[7%] lg:pt-14"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <Rail words={["LEARN", "BUILD", "CONNECT", "GROW"]} align="left" />
      <Rail words={["IDEAS", "PEOPLE", "TECHNOLOGY", "IMPACT"]} align="right" />

      <div className="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeading
            eyebrow="GDGC MJCET / Events Archive"
            dot="bg-google-red"
            stagger={false}
            lines={[
              "Where ideas",
              <>
                become <Outline>action</Outline>
                <Dot color="bg-google-red" />
              </>,
            ]}
          />
          <p className="mt-6 max-w-[30rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Workshops, hackathons, conversations and the moments that move our community forward.
          </p>
        </div>

        {/* poster cluster on an orbit */}
        <div className="relative mx-auto aspect-[1.7] w-full max-w-[720px]" style={{ perspective: 1200 }}>
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
            <ellipse
              cx={ORBIT.cx}
              cy={ORBIT.cy}
              rx={ORBIT.rx}
              ry={ORBIT.ry}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.25"
              transform={`rotate(${ORBIT.rot} ${ORBIT.cx} ${ORBIT.cy})`}
            />
          </svg>
          {DOTS.map(([deg, c, size], i) => {
            const at = onOrbit(deg);
            return (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full"
                style={{
                  left: `${at.left}%`,
                  top: `${at.top}%`,
                  width: size,
                  height: size,
                  transform: "translate(-50%, -50%)",
                  background: c,
                  boxShadow: `0 0 ${size * 1.6}px ${c}`,
                }}
              />
            );
          })}
          {FAINT.map((p) => (
            <img
              key={p.src}
              src={p.src}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute hidden rounded-lg opacity-30 blur-[1.5px] sm:block"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.w}%`, transform: `rotate(${p.rZ}deg)` }}
            />
          ))}
          {POSTERS.map((p, i) => (
            <Poster key={p.src} p={p} i={i} mx={mx} my={my} reduce={reduce} />
          ))}
          <p className="absolute right-0 -bottom-6 hidden items-center gap-2 text-[10px] tracking-[0.3em] text-white/45 sm:flex">
            LEARN <span className="h-1 w-1 rounded-full bg-google-blue" /> BUILD{" "}
            <span className="h-1 w-1 rounded-full bg-google-red" /> CONNECT{" "}
            <span className="h-1 w-1 rounded-full bg-google-green" /> GROW
          </p>
        </div>
      </div>
    </section>
  );
}

type MV = ReturnType<typeof useSpring>;

function Poster({
  p,
  i,
  mx,
  my,
  reduce,
}: {
  p: (typeof POSTERS)[number];
  i: number;
  mx: MV;
  my: MV;
  reduce: boolean;
}) {
  const x = useTransform(mx, (v) => v * -30 * p.depth);
  const y = useTransform(my, (v) => v * -20 * p.depth);
  return (
    <motion.div
      className="absolute"
      style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.w}%`, x, y, zIndex: Math.round(p.depth * 10) }}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={p.src}
        alt=""
        aria-hidden
        draggable={false}
        className="w-full rounded-xl border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        style={{ rotateY: p.rY, rotateZ: p.rZ, transformPerspective: 1000 }}
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
