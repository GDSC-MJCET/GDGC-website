import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { BARS, INTRO_PHOTOS, MARK_VIEWBOX, MARK_WIDTH, barRect, barTransform, markIntroSeen } from "./mark";

type Phase = "load" | "flip" | "title" | "exit";

const FLIP_MS = 130;
const ZOOM_MS = 4600;
const EXIT_MS = 1100;
const START_SCALE = 2.6;
const PULL_EASE = [0.25, 0.1, 0.2, 1] as const;

// The home page's opening titles. A giant GDG mark sits dead centre, its four bars windows onto photos from
// our events, flipping fast and, while the camera slowly pulls back until the mark
// is exactly the size of the one behind the hero. The name comes up, then the black fades away and the mark
// simply stays: it is the hero's backdrop. Click or press a key to skip.
export default function CinemaIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("load");
  const [tick, setTick] = useState(0);
  const timers = useRef<number[]>([]);
  const zoom = useMotionValue(START_SCALE);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const leave = useCallback(() => {
    clearTimers();
    animate(zoom, 1, { duration: 0.4, ease: PULL_EASE });
    setPhase("exit");
    markIntroSeen();
    later(EXIT_MS, onDone);
  }, [onDone, zoom]);

  const skip = useCallback(() => {
    if (phase !== "exit") leave();
  }, [phase, leave]);

  // wait (briefly) for the photos, so the first frames are not empty
  useEffect(() => {
    let alive = true;
    const loads = INTRO_PHOTOS.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        })
    );
    Promise.race([Promise.all(loads), new Promise<void>((r) => window.setTimeout(r, 1800))]).then(() => {
      if (alive) setPhase((p) => (p === "load" ? "flip" : p));
    });
    return () => {
      alive = false;
    };
  }, []);

  // the timeline, once the photos are in
  const started = phase !== "load";
  useEffect(() => {
    if (!started) return;
    const pull = animate(zoom, 1, { duration: ZOOM_MS / 1000, ease: PULL_EASE });
    later(ZOOM_MS - 600, () => setPhase((p) => (p === "flip" ? "title" : p)));
    later(ZOOM_MS + 900, leave);
    return () => pull.stop();
    // runs once, when the photos are ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // flip the photos (until the name comes up)
  useEffect(() => {
    if (phase !== "flip") return;
    const id = window.setInterval(() => setTick((t) => t + 1), FLIP_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  // hold the page still underneath
  useEffect(() => {
    window.scrollTo(0, 0);
    const stop = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      document.body.style.overflow = prev;
      clearTimers();
    };
  }, []);

  useEffect(() => {
    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const n = INTRO_PHOTOS.length;

  return (
    <motion.div
      role="dialog"
      aria-label="GDG on Campus MJCET"
      className="fixed inset-0 z-[10000] cursor-pointer overflow-hidden bg-[#050506]"
      onClick={skip}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="shrink-0" style={{ width: MARK_WIDTH, scale: zoom }}>
          <svg viewBox={MARK_VIEWBOX} className="block w-full overflow-visible" aria-hidden>
            <defs>
              {BARS.map((b) => (
                <clipPath key={b.id} id={`cinema-bar-${b.id}`}>
                  <rect {...barRect} transform={barTransform(b)} />
                </clipPath>
              ))}
            </defs>
            {BARS.map((b, i) => (
              <g key={b.id} clipPath={`url(#cinema-bar-${b.id})`}>
                <rect x="0" y="0" width="200" height="100" fill="#111" />
                {started && (
                  <image
                    href={INTRO_PHOTOS[(tick + i * 4) % n]}
                    x={i < 2 ? 0 : 100}
                    y="0"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid slice"
                  />
                )}
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* the name, over a darkened middle */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "title" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[clamp(3rem,8vw,7.5rem)] leading-none font-black tracking-[-0.035em] text-white">GDGC MJCET</p>
        <p className="mt-5 text-[11px] font-medium tracking-[0.35em] text-white/75 uppercase sm:text-[12px]">Google Developer Groups · On Campus</p>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

      <span className="absolute right-5 bottom-5 text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase">Click to skip</span>
    </motion.div>
  );
}
