import { useRef, type CSSProperties, type RefObject } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import { RiseLines, Shape, type ShapeKind } from "./primitives";
import { useMedia } from "./useMedia";
import { GOOGLE_HEX } from "../fx/tokens";
import { JOIN_URL, WRAP } from "./constants";

type Piece = { kind: ShapeKind; fill: string; cls: string; rotate: number; delay: number; float: number };

// The four Google primitives, scattered over the right of the hero. With a mouse they can be picked up and thrown.
const PIECES: Piece[] = [
  {
    kind: "circle",
    fill: GOOGLE_HEX.blue,
    cls: "right-[5%] top-[7%] h-[42vw] w-[42vw] md:right-[6%] md:top-[9%] md:h-[27vw] md:w-[27vw] max-h-[470px] max-w-[470px]",
    rotate: 0,
    delay: 0.3,
    float: 14,
  },
  {
    kind: "pill",
    fill: GOOGLE_HEX.green,
    cls: "right-[42%] top-[5%] h-[12vw] w-[30vw] md:right-[30%] md:top-[12%] md:h-[6.4vw] md:w-[16vw] max-h-[112px] max-w-[280px]",
    rotate: -22,
    delay: 0.42,
    float: 9,
  },
  {
    kind: "square",
    fill: GOOGLE_HEX.red,
    cls: "right-[50%] top-[21%] h-[21vw] w-[21vw] md:right-[37%] md:top-[37%] md:h-[12vw] md:w-[12vw] max-h-[210px] max-w-[210px]",
    rotate: 14,
    delay: 0.54,
    float: 11,
  },
  {
    kind: "triangle",
    fill: GOOGLE_HEX.yellow,
    cls: "right-[3%] top-[33%] w-[25vw] md:right-[2%] md:top-[41%] md:w-[13vw] max-w-[230px]",
    rotate: -9,
    delay: 0.66,
    float: 12,
  },
];

const TICKER: { word: string; kind: ShapeKind; fill: string }[] = [
  { word: "Learn", kind: "circle", fill: GOOGLE_HEX.blue },
  { word: "Build", kind: "square", fill: GOOGLE_HEX.red },
  { word: "Connect", kind: "triangle", fill: GOOGLE_HEX.yellow },
  { word: "Grow", kind: "pill", fill: GOOGLE_HEX.green },
];

function DraggablePiece({ piece, bounds, draggable }: { piece: Piece; bounds: RefObject<HTMLElement | null>; draggable: boolean }) {
  const reduce = !!useReducedMotion();
  // The intro splash flies its globe onto the blue circle and dissolves into it, so the circle fades in
  // rather than scaling (the splash measures it the moment the page mounts).
  const isGlobe = piece.kind === "circle";
  return (
    <motion.div
      className={`absolute ${piece.cls} ${draggable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
      initial={reduce ? false : isGlobe ? { opacity: 0 } : { scale: 0, rotate: piece.rotate - 60 }}
      animate={isGlobe ? { opacity: 1 } : { scale: 1, rotate: piece.rotate }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: piece.delay }}
      drag={draggable}
      dragConstraints={bounds}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 16, power: 0.35 }}
      whileDrag={{ scale: 1.08 }}
      whileHover={draggable ? { scale: 1.03 } : undefined}
    >
      <motion.div
        data-hero-globe={isGlobe ? "" : undefined}
        className="h-full w-full"
        animate={reduce ? undefined : { y: [0, -piece.float, 0] }}
        transition={{ duration: 5 + piece.float / 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shape kind={piece.kind} fill={piece.fill} className={piece.kind === "triangle" ? "w-full" : "h-full w-full"} />
      </motion.div>
    </motion.div>
  );
}

export default function LandingHero() {
  const hero = useRef<HTMLElement>(null);
  const finePointer = useMedia("(pointer: fine)");
  const reduce = !!useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={hero} aria-label="Introduction" className="relative isolate flex min-h-[calc(100svh-88px)] flex-col overflow-hidden">
      {/* faint column grid */}
      <div aria-hidden className={`${WRAP} pointer-events-none absolute inset-0 grid grid-cols-4 md:grid-cols-6`}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={`border-l border-white/[0.05] ${i >= 4 ? "hidden md:block" : ""} ${i === 0 ? "border-l-0" : ""}`} />
        ))}
      </div>

      <div aria-hidden className="absolute inset-0 z-10">
        {PIECES.map((p) => (
          <DraggablePiece key={p.kind} piece={p} bounds={hero} draggable={finePointer} />
        ))}
      </div>

      <motion.div
        {...fadeUp(0.2)}
        className={`${WRAP} relative z-30 flex items-center justify-between gap-4 pt-5 font-tech text-[10px] tracking-[0.16em] text-white/55 uppercase sm:text-[11px]`}
      >
        <span>GDG on Campus — MJCET</span>
        <span className="hidden md:block">
          Students <span className="text-white/30">×</span> Technology <span className="text-white/30">×</span> Real Impact
        </span>
        <span>Est. 2023</span>
      </motion.div>

      <div className={`${WRAP} relative mt-auto flex items-end justify-between gap-6 pt-[46vw] md:pt-24`}>
        {/* difference blending inverts the type wherever it crosses a shape */}
        <div className="pointer-events-none relative z-20 mix-blend-difference">
          <RiseLines
            as="h1"
            immediate
            delay={0.15}
            lines={["Build", "together.", "Go further."]}
            className="font-display text-[16.5vw] md:text-[clamp(3rem,13.4vw,11.75rem)] leading-[0.84] font-extrabold tracking-[-0.045em] text-white"
          />
        </div>
        {finePointer && (
          <motion.p
            {...fadeUp(1.2)}
            className="relative z-30 mb-3 hidden shrink-0 items-center gap-2 font-tech text-[11px] tracking-[0.14em] text-white/45 uppercase lg:flex"
          >
            <MousePointer2 size={13} /> Drag the shapes
          </motion.p>
        )}
      </div>

      <motion.div
        {...fadeUp(0.7)}
        className={`${WRAP} relative z-30 mt-10 grid gap-7 border-t border-white/15 pt-6 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center`}
      >
        <p className="max-w-[34rem] text-base leading-relaxed text-white/70 sm:text-lg">
          GDGC MJCET is a student-led community under Google Developer Groups, where curious minds learn, build, and solve
          real-world problems together.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-colors hover:bg-google-yellow"
          >
            Join the Community
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </a>
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-[15px] text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-black"
          >
            Explore Events
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>

      <div aria-hidden className="relative z-30 overflow-hidden border-y border-white/10 bg-background py-4 sm:py-5">
        <div className="animate-marquee flex w-max" style={{ "--marquee-duration": "36s" } as CSSProperties}>
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-6 px-6 font-display text-3xl font-bold tracking-[-0.03em] text-white sm:gap-8 sm:px-8 sm:text-5xl">
                  {t.word}
                  <Shape kind={t.kind} fill={t.fill} className={t.kind === "pill" ? "h-5 w-11 sm:h-7 sm:w-16" : "h-6 w-6 sm:h-9 sm:w-9"} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
