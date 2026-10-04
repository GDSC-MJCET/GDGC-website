import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import IntroScene from "./IntroScene";
import { REPLAY_EVENT, SEEN_KEY } from "./introEvents";

const MIN_DURATION_MS = 6000;
const MAX_DURATION_MS = 9000;
const EASE = [0.22, 1, 0.36, 1] as const;

const shouldShowIntro = () => {
  try {
    if (navigator.webdriver) return false;
    if (new URLSearchParams(window.location.search).has("nosplash")) return false;
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage unavailable: the intro may replay, which is harmless
  }
};

const STEPS = ["01", "02", "03"];

export default function IntroSplash() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const [step, setStep] = useState(0);
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const leave = useCallback(() => {
    markSeen();
    setVisible(false);
  }, []);

  // Lets ReplayIntroButton (or the console) start the intro again.
  useEffect(() => {
    const replay = () => {
      setStep(0);
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
          onClick={leave}
          className="fixed inset-0 z-[10000] cursor-pointer overflow-hidden bg-[#030303] text-white select-none"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <IntroScene reduced={reduced} />

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

            <h1 className="mt-7 text-[clamp(2.75rem,6vw,6.25rem)] leading-[0.95] font-black tracking-[-0.03em]">
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
              className="mt-7 text-[10px] font-medium tracking-[0.65em] text-white/70 sm:text-[12px]"
              {...fade(2.5, 8)}
            >
              GO FURTHER.
            </motion.p>
          </div>

          {/* bottom-left tagline */}
          <motion.div
            className="absolute bottom-8 left-[7%] hidden gap-4 sm:flex"
            {...fade(3.0, 8)}
          >
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

          {/* bottom-centre enter button */}
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-5 sm:bottom-8">
            <motion.button
              type="button"
              aria-label="Skip intro and enter the site"
              onClick={(e) => {
                e.stopPropagation();
                leave();
              }}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/35 bg-black/30 backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 sm:h-16 sm:w-16"
              {...fade(2.9, 8)}
            >
              <motion.span
                animate={reduced ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={22} strokeWidth={1.5} />
              </motion.span>
            </motion.button>
            <motion.p className="text-[10px] tracking-[0.4em] text-white/70 sm:text-[11px]" {...fade(3.1, 6)}>
              ENTERING GDGC MJCET
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
