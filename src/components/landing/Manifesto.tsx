import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Label, RiseLines, Shape, type ShapeKind } from "./primitives";
import { EASE, GOOGLE_HEX } from "../fx/tokens";
import { WRAP } from "./constants";

type Chip = { img: string } | { kind: ShapeKind; fill: string };

// The story, with small photo and shape chips set into the line like words.
const STORY: (string | Chip)[] = [
  "What started as a small group of curious students",
  { img: "/home/community/c9.webp" },
  "has grown into a thriving tech community —",
  { img: "/home/community/tech-faceoff-1.webp" },
  "hosting workshops,",
  { kind: "circle", fill: GOOGLE_HEX.blue },
  "building projects,",
  { kind: "square", fill: GOOGLE_HEX.red },
  "and creating opportunities for every student at MJCET.",
  { kind: "triangle", fill: GOOGLE_HEX.yellow },
];

const UNITS = STORY.flatMap<string | Chip>((part) => (typeof part === "string" ? part.split(" ") : [part]));

const STATS: { value: number | null; suffix: string; label: string; kind: ShapeKind; fill: string }[] = [
  { value: 3, suffix: "+", label: "Years", kind: "circle", fill: GOOGLE_HEX.blue },
  { value: 20, suffix: "+", label: "Events", kind: "square", fill: GOOGLE_HEX.red },
  { value: 1000, suffix: "+", label: "Students reached", kind: "triangle", fill: GOOGLE_HEX.yellow },
  { value: null, suffix: "∞", label: "Bigger ambitions", kind: "pill", fill: GOOGLE_HEX.green },
];

function renderUnit(u: string | Chip): ReactNode {
  if (typeof u === "string") return u;
  if ("img" in u) {
    return (
      <span className="mx-[0.06em] inline-block h-[0.8em] w-[1.75em] translate-y-[0.1em] overflow-hidden rounded-full align-baseline">
        <img src={u.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span className={`mx-[0.06em] inline-block align-baseline ${u.kind === "triangle" ? "w-[0.72em]" : "h-[0.62em] w-[0.62em]"}`}>
      <Shape kind={u.kind} fill={u.fill} className={u.kind === "triangle" ? "w-full" : "h-full w-full"} />
    </span>
  );
}

function Unit({ progress, i, n, children }: { progress: MotionValue<number>; i: number; n: number; children: ReactNode }) {
  const opacity = useTransform(progress, [i / n, Math.min(1, (i + 1.5) / n)], [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}

function Story() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  return (
    <p
      ref={ref}
      className="font-display text-[clamp(1.75rem,3.6vw,3.6rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-white"
    >
      {UNITS.map((u, i) => (
        <span key={i}>
          {reduce ? renderUnit(u) : <Unit progress={scrollYProgress} i={i} n={UNITS.length}>{renderUnit(u)}</Unit>}{" "}
        </span>
      ))}
    </p>
  );
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = !!useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export default function Manifesto() {
  return (
    <section aria-label="What drives us" className="pt-24 pb-12 md:pt-36 md:pb-16">
      <div className={WRAP}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2.15fr)] md:gap-16">
          <div>
            <Label index="01">What drives us</Label>
            <RiseLines
              lines={[
                "More than",
                <>
                  events<span className="text-google-yellow">.</span>
                </>,
              ]}
              className="mt-6 font-display text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-white"
            />
            <p className="mt-6 max-w-[17rem] text-base leading-relaxed text-white/60">
              A community that learns, builds, and creates real impact.
            </p>
            <Link
              to="/team-page"
              className="group mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm font-medium text-white transition-colors hover:border-white"
            >
              Meet the team <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <Story />
        </div>

        <dl className="mt-24 grid grid-cols-2 border-t border-white/15 md:mt-36 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`relative flex flex-col justify-between gap-10 py-8 pr-4 md:py-10 md:pr-6 ${i % 2 === 1 ? "border-l border-white/15 pl-5" : ""} ${
                i >= 2 ? "border-t border-white/15 md:border-t-0" : ""
              } ${i > 0 ? "md:border-l md:border-white/15 md:pl-8" : ""}`}
            >
              <dt className="flex items-center justify-between font-tech text-[11px] tracking-[0.16em] text-white/55 uppercase">
                {s.label}
                <span className={s.kind === "pill" ? "h-3 w-7" : s.kind === "triangle" ? "w-4" : "h-3.5 w-3.5"}>
                  <Shape kind={s.kind} fill={s.fill} className={s.kind === "triangle" ? "w-full" : "h-full w-full"} />
                </span>
              </dt>
              <dd className="font-display text-[clamp(3.25rem,6.5vw,6.75rem)] leading-[0.85] font-extrabold tracking-[-0.06em] text-white">
                {s.value === null ? s.suffix : <CountUp to={s.value} suffix={s.suffix} />}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
