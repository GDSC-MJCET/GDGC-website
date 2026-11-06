import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "lucide-react";
import Chapter from "./Chapter";
import { seeded } from "./rand";
import { useMedia } from "../../landing/useMedia";
import { Dot, Outline } from "../../fx/designSystem";

const PHOTOS = [
  "/home/community/tech-faceoff-2.webp",
  "/home/community/pixelx-2.webp",
  "/home/community/doodle3.webp",
  "/home/community/au2.webp",
  "/home/community/adsophos-1.webp",
  "/home/community/tech-faceoff-1.webp",
  "/home/community/dy1.webp",
  "/home/community/aig3.webp",
  "/home/community/antigravityiii.webp",
  "/home/community/frtp-2.webp",
  "/home/community/c9.webp",
  "/home/community/tech24-4.webp",
];

// Where each photo lands: a loose collage framing the middle of the screen. x, y = centre (vw, vh),
// w = width (vw), r = final tilt, depth = how much it drifts while you scroll on (parallax).
type Spot = { x: number; y: number; w: number; r: number; depth: number };
const WIDE: Spot[] = [
  { x: -33, y: -22, w: 16, r: -4, depth: 1.2 },
  { x: -14, y: -31, w: 13, r: 3, depth: 0.6 },
  { x: 10, y: -29, w: 15, r: -2, depth: 1 },
  { x: 34, y: -25, w: 17, r: 4, depth: 0.7 },
  { x: -42, y: 2, w: 12, r: 3, depth: 0.9 },
  { x: 42, y: -1, w: 12, r: -3, depth: 1.3 },
  { x: -34, y: 29, w: 15, r: 3, depth: 0.8 },
  { x: -11, y: 32, w: 14, r: -3, depth: 1.1 },
  { x: 12, y: 30, w: 12, r: 2, depth: 0.6 },
  { x: 35, y: 28, w: 16, r: -4, depth: 1 },
  { x: -25, y: 14, w: 8, r: -6, depth: 1.6 },
  { x: 25, y: -14, w: 8, r: 6, depth: 1.5 },
];
const NARROW: Spot[] = [
  { x: -31, y: -33, w: 30, r: -4, depth: 1.1 },
  { x: 2, y: -36, w: 26, r: 3, depth: 0.6 },
  { x: 33, y: -31, w: 28, r: -2, depth: 1 },
  { x: -30, y: -22, w: 24, r: 3, depth: 0.8 },
  { x: 30, y: -21, w: 26, r: -3, depth: 1.2 },
  { x: -33, y: 30, w: 28, r: 3, depth: 0.9 },
  { x: 31, y: 31, w: 24, r: -3, depth: 1.1 },
  { x: -29, y: 42, w: 26, r: -2, depth: 0.7 },
  { x: 3, y: 44, w: 28, r: 4, depth: 1 },
  { x: 33, y: 43, w: 26, r: -4, depth: 0.8 },
  { x: -6, y: -28, w: 16, r: -6, depth: 1.5 },
  { x: 6, y: 34, w: 16, r: 6, depth: 1.4 },
];

const rand = seeded(42);
const SCATTER = PHOTOS.map(() => ({
  x: (rand() - 0.5) * 220,
  y: (rand() - 0.5) * 220,
  r: (rand() - 0.5) * 90,
  s: 0.4 + rand() * 0.6,
  d: rand() * 0.14,
}));

const LAND = 0.42; // by here every photo has landed

function Photo({ src, i, p, spot }: { src: string; i: number; p: MotionValue<number>; spot: Spot }) {
  const sc = SCATTER[i];
  const start = 0.02 + sc.d;
  const end = start + (LAND - 0.16);
  // fly in from far off-screen, land in the collage, drift with depth, then spread outward at the end
  const x = useTransform(p, [start, end, 0.78, 1], [`${sc.x}vw`, `${spot.x}vw`, `${spot.x}vw`, `${spot.x * 1.35}vw`]);
  const y = useTransform(
    p,
    [start, end, 0.78, 1],
    [`${sc.y}vh`, `${spot.y}vh`, `${spot.y - spot.depth * 6}vh`, `${(spot.y - spot.depth * 6) * 1.35}vh`]
  );
  const rotate = useTransform(p, [start, end, 1], [sc.r, spot.r, spot.r * 1.6]);
  const scale = useTransform(p, [start, end, 0.78, 1], [sc.s, 1, 1 + spot.depth * 0.06, 1.15 + spot.depth * 0.1]);
  const opacity = useTransform(p, [start, start + 0.06, 0.85, 1], [0, 1, 1, 0.35]);
  return (
    <motion.div className="absolute top-1/2 left-1/2" style={{ x, y, rotate, scale, opacity, zIndex: Math.round(spot.depth * 10) }}>
      <div
        className="group -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-transform duration-500 hover:scale-110"
        style={{ width: `${spot.w}vw`, aspectRatio: "3 / 2" }}
      >
        <img src={src} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}

// Chapter 04: photos from all over the community fly in from far off-screen and land as a collage framing
// "People. Projects. Progress.", drift at different depths as you keep scrolling, then spread outward while
// the way to the gallery comes up in the middle.
export default function Gather() {
  const reduce = !!useReducedMotion();
  const wide = useMedia("(min-width: 768px)");
  const spots = wide ? WIDE : NARROW;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const titleScale = useTransform(p, [0, LAND, 1], [reduce ? 1 : 1.25, 1, 0.92]);
  const titleOpacity = useTransform(p, [0, 0.08], [0, 1]);
  const outro = useTransform(p, [0.55, 0.7], [0, 1]);
  const outroY = useTransform(p, [0.55, 0.7], [20, 0]);
  const glow = useTransform(p, [0.2, LAND], [0, 1]);

  return (
    <section ref={ref} aria-label="From our community" className="relative h-[340vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Chapter n="03" name="The People" />
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(66,133,244,0.22),rgba(52,168,83,0.08),transparent)] blur-2xl"
          style={{ opacity: glow }}
        />
        {PHOTOS.map((src, i) => (
          <Photo key={src} src={src} i={i} p={p} spot={spots[i]} />
        ))}

        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <p className="text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">From Our Community</p>
          <p className="mt-4 text-[clamp(2.4rem,5.4vw,5.75rem)] leading-[0.95] font-black tracking-[-0.04em] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] md:whitespace-nowrap">
            People. <Outline>Projects</Outline>. Progress
            <Dot color="bg-google-green" />
          </p>
          <motion.div className="pointer-events-auto mt-6 flex flex-col items-center gap-5" style={{ opacity: outro, y: outroY }}>
            <p className="max-w-[24rem] text-sm leading-relaxed text-white/70 sm:text-base">
              Workshops. Talks. Communities. And the people who make it happen.
            </p>
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
            >
              Open the Gallery
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
