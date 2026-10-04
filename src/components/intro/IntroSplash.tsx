import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import IntroScene from "./IntroScene";
import {
  HANDOFF_MS,
  MORPH_MS,
  REPLAY_EVENT,
  SEEN_KEY,
  SHUTTER_MS,
  shouldShowIntro,
  type ExitState,
} from "./introEvents";

const MIN_DURATION_MS = 6000;
const MAX_DURATION_MS = 9000;
const EASE = [0.22, 1, 0.36, 1] as const;
const SHUTTER_EASE = [0.76, 0, 0.24, 1] as const;

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage unavailable: the intro may replay, which is harmless
  }
};

const STEPS = ["01", "02", "03"];

export default function IntroSplash({ onLeave }: { onLeave?: () => void }) {
  const [visible, setVisible] = useState(shouldShowIntro);
  const [step, setStep] = useState(0);
  const [shutter, setShutter] = useState(false); // the dark panel (glows, text, HUD) rises away
  const leavingRef = useRef(false);
  const exitRef = useRef<ExitState | null>(null);
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finish = useCallback(() => {
    document.documentElement.classList.remove("intro-morph");
    setVisible(false);
  }, []);

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    markSeen();
    const heroT0 = performance.now();
    onLeave?.(); // mounts the site behind the intro (a no-op when it is already mounted)

    if (reduced) {
      setShutter(true);
      window.setTimeout(finish, 500);
      return;
    }

    // Wait for the hero globe to exist, then lift the shutter and fly the intro globe onto it.
    let tries = 0;
    const attempt = () => {
      const el = document.querySelector<HTMLElement>("[data-hero-globe]");
      const r = el?.getBoundingClientRect();
      const onScreen =
        !!r &&
        r.width > 40 &&
        r.height > 40 &&
        r.bottom > 0 &&
        r.right > 0 &&
        r.top < window.innerHeight &&
        r.left < window.innerWidth;
      if (r && onScreen) {
        exitRef.current = {
          t0: performance.now(),
          heroT0: Number(el?.dataset.t0) || heroT0,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          size: Math.min(r.width, r.height),
        };
        document.documentElement.classList.add("intro-morph");
        setShutter(true);
        window.setTimeout(finish, MORPH_MS);
      } else if (tries++ < 40) {
        requestAnimationFrame(attempt);
      } else {
        setShutter(true); // hero globe not on screen: just lift the shutter
        window.setTimeout(finish, SHUTTER_MS);
      }
    };
    requestAnimationFrame(attempt);
  }, [onLeave, reduced, finish]);

  // Lets ReplayIntroButton (or the console) start the intro again.
  useEffect(() => {
    const replay = () => {
      leavingRef.current = false;
      exitRef.current = null;
      setStep(0);
      setShutter(false);
      setVisible(true);
    };
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  // Keep the page behind the intro from scrolling.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  // Auto-dismiss: at least MIN_DURATION_MS, and only once the page and fonts are ready.
  useEffect(() => {
    if (!visible) return;
    const min = reduced ? 1800 : MIN_DURATION_MS;
    const started = performance.now();
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fontsReady = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
    let timer = 0;
    Promise.all([pageLoaded, fontsReady]).then(() => {
      const wait = Math.max(0, min - (performance.now() - started));
      timer = window.setTimeout(leave, wait);
    });
    const safety = window.setTimeout(leave, MAX_DURATION_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safety);
    };
  }, [visible, reduced, leave]);

  // Progress counter 01 -> 02 -> 03.
  useEffect(() => {
    if (!visible) return;
    const timers = [window.setTimeout(() => setStep(1), 2200), window.setTimeout(() => setStep(2), 4200)];
    return () => timers.forEach(window.clearTimeout);
  }, [visible]);

  // Skip with the keyboard.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, leave]);

  const fade = (delay: number, y = 14) => ({
    initial: reduced ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: reduced ? 0 : delay, ease: EASE },
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Welcome to GDGC MJCET"
          className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden text-white select-none"
          // once the globe is sitting on the hero globe, fade the copy of it out while the real one fades in
          exit={{ opacity: 0, transition: { duration: HANDOFF_MS / 1000, ease: "easeInOut" } }}
        >
          {/* the shutter: the dark panel with the glows, copy and HUD. Rises off the top to reveal the page. */}
          <motion.div
            className="pointer-events-auto absolute inset-0 cursor-pointer bg-[#030303]"
            onClick={leave}
            animate={shutter && !reduced ? { y: "-100%" } : { y: 0, opacity: shutter ? 0 : 1 }}
            transition={shutter && !reduced ? { duration: SHUTTER_MS / 1000, ease: SHUTTER_EASE } : { duration: 0.4 }}
          >
            <IntroScene reduced={reduced} exitRef={exitRef} layer="back" />

            {/* top-left logo */}
            <motion.img
              src="/logo.svg"
              alt="Google Developer Groups"
              className="absolute top-5 left-5 h-8 w-auto sm:top-8 sm:left-[7%] sm:h-10"
              {...fade(2.6, -8)}
            />

            {/* top-right strip */}
            <motion.p
              className="absolute top-9 right-[7%] hidden items-center gap-3 text-[10px] tracking-[0.3em] text-white/60 uppercase md:flex"
              {...fade(2.8, -8)}
            >
              Students <span className="text-white/30">×</span> Technology <span className="text-white/30">×</span> Real
              Impact
              <span className="ml-1 h-px w-12 bg-white/30" />
            </motion.p>

            {/* centre copy */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 pb-6 text-center">
              <motion.div
                className="rounded-full border border-white/30 px-6 py-2 text-[10px] font-medium tracking-[0.55em] text-white/90 sm:text-[11px]"
                {...fade(1.4, 10)}
              >
                GDGC MJCET
              </motion.div>

              <h1 className="mt-4 sm:mt-7 text-[clamp(2.25rem,min(6vw,13dvh),6.25rem)] leading-[0.95] font-black tracking-[-0.03em]">
                <span className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={reduced ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: reduced ? 0 : 1.6, ease: EASE }}
                  >
                    BUILD
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span
                    className="block text-transparent"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
                    initial={reduced ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: reduced ? 0 : 1.85, ease: EASE }}
                  >
                    TOGETHER
                    <motion.span
                      className="ml-[0.06em] inline-block h-[0.14em] w-[0.14em] translate-y-[-0.02em] rounded-full bg-google-red align-baseline"
                      style={{ WebkitTextStroke: 0 }}
                      initial={reduced ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 14, delay: reduced ? 0 : 2.6 }}
                    />
                  </motion.span>
                </span>
              </h1>

              <motion.p
                className="mt-4 text-[10px] font-medium tracking-[0.65em] sm:mt-7 text-white/70 sm:text-[12px]"
                {...fade(2.5, 8)}
              >
                GO FURTHER.
              </motion.p>
            </div>

            {/* bottom-left tagline */}
            <motion.div className="absolute bottom-8 left-[7%] hidden gap-4 sm:flex" {...fade(3.0, 8)}>
              <span className="w-px bg-white/25" />
              <p className="text-[10px] leading-5 tracking-[0.3em] text-white/60 uppercase">
                A brighter
                <br />
                tomorrow
                <br />
                together.
              </p>
            </motion.div>

            {/* bottom-right progress */}
            <motion.div
              className="absolute right-[7%] bottom-9 hidden items-center gap-3 text-[11px] tracking-[0.2em] sm:flex"
              {...fade(3.0, 8)}
            >
              {STEPS.map((label, i) => (
                <span key={label} className="flex items-center gap-3">
                  <span className={`font-semibold transition-colors duration-500 ${i === step ? "text-white" : "text-white/35"}`}>
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className={`h-px transition-all duration-700 ${i === step ? "w-16 bg-white" : "w-6 bg-white/25"}`}
                    />
                  )}
                </span>
              ))}
            </motion.div>

            {/* bottom caption */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center sm:bottom-8">
              <motion.p className="text-[10px] tracking-[0.4em] text-white/70 sm:text-[11px]" {...fade(3.1, 6)}>
                ENTERING GDGC MJCET
              </motion.p>
            </div>
          </motion.div>

          {/* globe, orbits and planets: stay put above the shutter and morph into the hero globe */}
          <IntroScene reduced={reduced} exitRef={exitRef} layer="front" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
