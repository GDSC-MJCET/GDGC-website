import { motion, useReducedMotion } from "motion/react";
import { ThreeDPhotoCarousel } from "../ui/3d-carousel";
import { GB_MEMBERS } from "./governingBody";

const EASE = [0.22, 1, 0.36, 1] as const;

// Angular colour wedges bleeding in from the page edges (same language as the home Hero).
const WEDGES = [
  {
    cls: "top-[8%] -left-48 bg-google-red",
    clip: "polygon(0% 12%, 100% 40%, 100% 62%, 0% 88%)",
    o: 0.3,
    from: -80,
  },
  {
    cls: "top-[8%] -right-48 bg-google-yellow",
    clip: "polygon(0% 40%, 100% 12%, 100% 88%, 0% 62%)",
    o: 0.26,
    from: 80,
  },
  {
    cls: "top-[46%] -left-52 bg-google-blue",
    clip: "polygon(0% 8%, 100% 50%, 0% 92%)",
    o: 0.3,
    from: -80,
  },
  {
    cls: "top-[46%] -right-52 bg-google-green",
    clip: "polygon(100% 8%, 0% 50%, 100% 92%)",
    o: 0.28,
    from: 80,
  },
];

export default function GoverningBodyShowcase() {
  const reduce = !!useReducedMotion();

  // fade/slide-in helper; everything renders statically under reduced motion
  const rise = (delay: number, y = 16) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });
  const slideIn = (delay: number, x: number) => ({
    initial: reduce ? false : { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section className="relative overflow-hidden px-4 pt-6 pb-24 sm:pt-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {WEDGES.map((w, i) => (
          <motion.div
            key={w.cls}
            className={`absolute h-[460px] w-[520px] blur-[70px] ${w.cls}`}
            style={{ clipPath: w.clip }}
            initial={reduce ? false : { x: w.from, opacity: 0 }}
            animate={{ x: 0, opacity: w.o }}
            transition={{ duration: 1.6, delay: 0.1 + i * 0.12, ease: EASE }}
          />
        ))}
        <motion.div
          className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-google-red opacity-[0.2] blur-[130px]"
          animate={reduce ? undefined : { opacity: [0.2, 0.32, 0.2], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 -bottom-40 h-[420px] w-[420px] rounded-full bg-google-green opacity-[0.14] blur-[130px]"
          animate={reduce ? undefined : { opacity: [0.14, 0.24, 0.14], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* HUD */}
      <div aria-hidden className="pointer-events-none absolute top-4 left-8 z-10 hidden h-[calc(100%-6rem)] lg:block xl:left-[4.5rem]">
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-border"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        />
        <div className="space-y-1.5 pl-9 pt-3 text-[10px] tracking-[0.3em] text-white/70">
          {["LEARN", "BUILD", "CONNECT", "GROW"].map((w, i) => (
            <motion.div key={w} {...slideIn(0.9 + i * 0.12, -14)}>
              {w}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute top-24 left-0 -translate-x-1/2 text-xs text-foreground/30"
          initial={reduce ? false : { opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        >
          +
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-8 z-10 hidden gap-5 lg:flex xl:left-[4.5rem]"
      >
        <motion.span
          className="w-px origin-bottom bg-border"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: EASE }}
        />
        <p className="space-y-1.5 text-[10px] leading-5 tracking-[0.3em] text-white/70 uppercase">
          {["Students", "Technology", "Real Impact"].map((w, i) => (
            <motion.span key={w} className="block" {...slideIn(1.6 + i * 0.12, -14)}>
              {w}
            </motion.span>
          ))}
        </p>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-8 bottom-10 z-10 hidden items-end gap-5 lg:flex xl:right-[4.5rem]"
      >
        <motion.span
          className="mb-1 h-px w-20 origin-right bg-border"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.7, ease: EASE }}
        />
        <p className="space-y-1.5 text-[10px] leading-5 tracking-[0.3em] text-white/70 uppercase">
          {["A brighter", "tomorrow", "together."].map((w, i) => (
            <motion.span key={w} className="block" {...slideIn(1.8 + i * 0.12, 14)}>
              {w}
            </motion.span>
          ))}
        </p>
        <motion.span
          className="w-px origin-bottom self-stretch bg-border"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.7, ease: EASE }}
        />
      </div>

      {/* heading */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          className="text-[11px] tracking-[0.5em] text-white/60 uppercase"
          initial={reduce ? false : { opacity: 0, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
        >
          The people behind GDGC
        </motion.p>
        <h1 className="mt-5 text-[clamp(2.4rem,5.6vw,5.5rem)] leading-[0.95] font-black tracking-[-0.03em] text-white">
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
            >
              GOVERNING
            </motion.span>
          </span>{" "}
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block text-transparent"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
            >
              BODY
            </motion.span>
          </span>
          <motion.span
            className="ml-1 inline-block h-[0.14em] w-[0.14em] translate-y-[-0.02em] rounded-full bg-google-red align-baseline"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 14, delay: reduce ? 0 : 1.3 }}
          />
        </h1>
        <motion.p
          className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
          {...rise(1.0, 12)}
        >
          Students. Builders. Organizers. The minds steering GDGC MJCET towards a brighter tomorrow.
        </motion.p>
      </div>

      <motion.div className="relative z-10 mt-6 sm:mt-10" {...rise(0.9, 40)}>
        <ThreeDPhotoCarousel items={GB_MEMBERS} />
      </motion.div>
    </section>
  );
}
