import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BARS, INTRO_PHOTOS, MARK_VIEWBOX, MARK_WIDTH, barRect, barTransform } from "./mark";

// The GDG mark as the hero's backdrop: four bars, each a window onto event photos that slowly cross-fade
// one bar at a time. Same size and place as where the intro's mark settles.
export default function MarkBackdrop({ className = "" }: { className?: string }) {
  const reduce = !!useReducedMotion();
  const [tick, setTick] = useState(0);
  const n = INTRO_PHOTOS.length;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <svg viewBox={MARK_VIEWBOX} className="block shrink-0 overflow-visible" style={{ width: MARK_WIDTH }}>
        <defs>
          {BARS.map((b) => (
            <clipPath key={b.id} id={`backdrop-bar-${b.id}`}>
              <rect {...barRect} transform={barTransform(b)} />
            </clipPath>
          ))}
        </defs>
        {BARS.map((b, i) => {
          // each bar changes photo every fourth tick, the four bars one after another
          const src = INTRO_PHOTOS[(Math.floor((tick + i) / 4) * 5 + i * 4) % n];
          const left = i < 2;
          return (
            <g key={b.id} clipPath={`url(#backdrop-bar-${b.id})`}>
              <rect x="0" y="0" width="200" height="100" fill="#111" />
              <AnimatePresence initial={false}>
                <motion.image
                  key={src}
                  href={src}
                  x={left ? 0 : 100}
                  y="0"
                  width="100"
                  height="100"
                  preserveAspectRatio="xMidYMid slice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
