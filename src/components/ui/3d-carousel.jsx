import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LightRays from "./LightRays";

const BLOB_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

// Shortest signed distance from activeIndex to index, wrapping around the
// ends of the list, so arrows always step in the direction you'd expect.
function getOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

const MemberCard = ({ member, isActive }) => (
  <div
    className={`relative h-full w-full overflow-hidden rounded-3xl border border-border bg-card/80 transition-[filter] duration-300 ${
      isActive ? "" : "grayscale"
    }`}
  >
    <div aria-hidden className="absolute inset-0">
      {BLOB_COLORS.map((color, i) => (
        <div
          key={color}
          className="absolute h-1/2 w-1/2 rounded-full blur-2xl opacity-30"
          style={{
            background: color,
            top: i % 2 === 0 ? "-10%" : "auto",
            bottom: i % 2 !== 0 ? "-10%" : "auto",
            left: i < 2 ? "-10%" : "auto",
            right: i >= 2 ? "-10%" : "auto",
          }}
        />
      ))}
    </div>

    {isActive && (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.2}
          lightSpread={0.6}
          rayLength={1.1}
          fadeDistance={1.0}
          saturation={1.0}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.05}
          distortion={0.02}
        />
      </div>
    )}

    <img
      src={member.image}
      alt={member.name}
      className="absolute inset-0 h-full w-full scale-110 object-cover object-top"
      draggable={false}
    />

    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background/95 via-background/60 to-transparent px-4 pt-16 pb-4">
      <p className="text-base font-semibold text-foreground">{member.name}</p>
      <p className="text-sm text-muted-foreground">{member.role}</p>
    </div>
  </div>
);

export function ThreeDPhotoCarousel({ items }) {
  const length = items.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (i) => setActiveIndex(((i % length) + length) % length),
    [length]
  );
  // Functional updater form — doesn't close over `activeIndex`, so each
  // click is a single well-defined +1/-1 step regardless of render timing.
  const next = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % length),
    [length]
  );
  const prev = useCallback(
    () => setActiveIndex((prev) => ((prev - 1) + length) % length),
    [length]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-2">
      <div className="relative h-[420px] w-full sm:h-[500px] md:h-[560px]">
        {items.map((member, i) => {
          const offset = getOffset(i, activeIndex, length);
          if (Math.abs(offset) > 2) return null;
          const isActive = offset === 0;

          return (
            <motion.div
              key={member.image}
              className="absolute left-1/2 top-0 h-full w-[80%] sm:w-[64%] md:w-[52%] lg:w-[44%] cursor-pointer"
              style={{ zIndex: 10 - Math.abs(offset) }}
              animate={{
                x: `calc(-50% + ${offset * 48}%)`,
                scale: isActive ? 1 : 0.78,
                opacity: Math.abs(offset) === 2 ? 0.35 : isActive ? 1 : 0.65,
              }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                if (!isActive) goTo(i);
              }}
            >
              <MemberCard member={member} isActive={isActive} />
            </motion.div>
          );
        })}

        <button
          type="button"
          aria-label="Previous member"
          onClick={prev}
          className="absolute left-2 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-accent sm:left-4"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          aria-label="Next member"
          onClick={next}
          className="absolute right-2 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-accent sm:right-4"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
