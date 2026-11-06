import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MarkBackdrop from "./MarkBackdrop";
import { Dot, Outline } from "../fx/designSystem";
import { EASE } from "../fx/tokens";
import { JOIN_URL, WRAP } from "./theme";

// The hero is a scene you scroll through. It stays pinned while: the line lifts and blurs away, the camera
// flies into the GDG mark (the intro settles into this same mark), a caption passes in the dark, and then the
// page carries on.
export default function CinemaHero({ ready }: { ready: boolean }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const markScale = useTransform(p, [0, 0.85], [1, reduce ? 1 : 5.5]);
  const markOpacity = useTransform(p, [0, 0.45, 0.8], [1, 0.85, 0]);
  const shade = useTransform(p, [0, 0.3], [1, 0.4]);
  const textOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const textY = useTransform(p, [0, 0.28], [0, reduce ? 0 : -110]);
  const textBlur = useTransform(p, [0, 0.28], ["blur(0px)", reduce ? "blur(0px)" : "blur(12px)"]);
  const capOpacity = useTransform(p, [0.42, 0.55, 0.78, 0.92], [0, 1, 1, 0]);
  const capScale = useTransform(p, [0.42, 0.92], [0.92, 1.08]);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  const enter = (delay: number, y = 30) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, delay, ease: EASE },
  });
  const line = (delay: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: ready ? { y: 0 } : undefined,
    transition: { duration: 1.2, delay, ease: EASE },
  });

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[260vh]">
      <div className="sticky top-0 isolate flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden">
        <motion.div className="absolute inset-0 -z-10" style={{ scale: markScale, opacity: markOpacity }}>
          <MarkBackdrop />
        </motion.div>
        {/* shade, so the type reads over the photos; it lifts as the type leaves */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: shade }}>
          <div className="absolute inset-0 bg-[#050506]/30" />
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#050506] via-[#050506]/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050506]/80 to-transparent" />
        </motion.div>

        {/* caption that passes by in the dark, mid flight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ opacity: capOpacity, scale: capScale }}
        >
          <p className="text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">Est. 2023</p>
          <p className="mt-5 text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[0.95] font-black tracking-[-0.03em] text-white">
            Same curiosity.
            <br />
            <Outline>Bigger possibilities</Outline>
            <Dot color="bg-google-blue" />
          </p>
        </motion.div>

        <motion.div className={`${WRAP} pb-10 sm:pb-14`} style={{ opacity: textOpacity, y: textY, filter: textBlur }}>
          <motion.p {...enter(0.05, 12)} className="flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] whitespace-nowrap text-white/70 uppercase sm:gap-3 sm:text-[11px] sm:tracking-[0.3em]">
            Students <span className="text-white/35">×</span> Technology <span className="text-white/35">×</span> Real Impact
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-google-yellow" />
          </motion.p>

          <h1 className="mt-5 text-[clamp(3.25rem,8.6vw,8.5rem)] leading-[0.92] font-black tracking-[-0.035em] text-white">
            <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
              <motion.span className="block" {...line(0.12)}>
                Build <Outline>Together</Outline>
              </motion.span>
            </span>
            <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
              <motion.span className="block pl-[0.45em]" {...line(0.24)}>
                Go Further
                <Dot color="bg-google-red" />
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 grid gap-7 border-t border-white/15 pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <motion.p {...enter(0.45)} className="max-w-[34rem] text-base leading-relaxed text-white/70 sm:text-lg">
              GDGC MJCET is a student-led community under Google Developer Groups, where curious minds learn, build, and solve
              real-world problems together.
            </motion.p>
            <motion.div {...enter(0.58)} className="flex flex-wrap items-center gap-3">
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
              >
                Join the Community
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </a>
              <Link
                to="/events"
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-6 py-[15px] text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white"
              >
                Explore Events <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.span
          aria-hidden
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-[10px] font-medium tracking-[0.3em] text-white/45 uppercase md:block"
          style={{ opacity: cueOpacity }}
        >
          Scroll ↓
        </motion.span>
      </div>
    </section>
  );
}
