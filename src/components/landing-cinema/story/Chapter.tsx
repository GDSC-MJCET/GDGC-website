import { motion, type MotionValue } from "motion/react";

// The small "Ch. 01 — Origin" marker in the corner of each pinned scene.
export default function Chapter({ n, name, opacity }: { n: string; name: string; opacity?: MotionValue<number> }) {
  return (
    <motion.p
      className="pointer-events-none absolute top-[96px] left-5 z-20 flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase sm:left-10 lg:left-16"
      style={{ opacity }}
    >
      <span className="text-white">Ch. {n}</span>
      <span aria-hidden className="h-px w-8 bg-white/30" />
      {name}
    </motion.p>
  );
}
