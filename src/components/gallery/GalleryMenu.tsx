import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { menuItems } from "../navItems";

const IDLE_HIDE_MS = 2600;

export type EventOption = { slug: string; title: string; count: number };

type Props = {
  events: EventOption[];
  /** event slug currently shown, or null for all of them */
  active: string | null;
  onSelect: (slug: string | null) => void;
};

// The only chrome on the full-screen gallery: a burger that fades away when you stop moving, and
// brings back the site menu (as a full-screen overlay) when it is opened.
export default function GalleryMenu({ events, active, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [awake, setAwake] = useState(true);
  const timer = useRef(0);
  const hovering = useRef(false);
  const openRef = useRef(false);
  openRef.current = open;
  const location = useLocation();

  // < > step through the events (wrapping round); with a single event there is nowhere to go yet
  const stepEvent = (by: number) => {
    if (events.length < 2) return;
    const i = events.findIndex((e) => e.slug === active);
    const next = i < 0 ? (by > 0 ? 0 : events.length - 1) : (i + by + events.length) % events.length;
    onSelect(events[next].slug);
  };
  const arrow =
    "flex h-8 w-8 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors enabled:hover:border-white/50 enabled:hover:text-white disabled:cursor-default disabled:opacity-30";

  const wake = useCallback(() => {
    setAwake(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!openRef.current && !hovering.current) setAwake(false);
    }, IDLE_HIDE_MS);
  }, []);

  useEffect(() => {
    wake();
    const events = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      window.clearTimeout(timer.current);
    };
  }, [wake]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onPointerEnter={() => {
          hovering.current = true;
          wake();
        }}
        onPointerLeave={() => {
          hovering.current = false;
          wake();
        }}
        onFocus={wake}
        style={{ top: "calc(1rem + env(safe-area-inset-top))", right: "calc(1rem + env(safe-area-inset-right))" }}
        className={`fixed z-[9100] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-all duration-500 hover:bg-white/15 ${
          awake || open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            aria-label="Site menu"
            className="fixed inset-0 z-[9050] flex flex-col items-center gap-5 overflow-y-auto bg-black/88 px-6 py-24 backdrop-blur-md sm:gap-6 [&>*:first-child]:mt-auto [&>*:last-child]:mb-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Object.entries(menuItems).map(([name, path], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`text-3xl font-semibold tracking-tight transition-colors sm:text-5xl ${
                    location.pathname === path ? "text-white" : "text-white/45 hover:text-white"
                  }`}
                >
                  {name}
                </Link>
              </motion.div>
            ))}

            {events.length > 0 && (
              <motion.div
                role="group"
                aria-label="Choose an event"
                className="mt-4 flex max-w-2xl flex-col items-center gap-3 border-t border-white/10 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * Object.keys(menuItems).length + 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] tracking-[0.4em] text-white/40 uppercase">Event</p>
                <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  aria-label="Previous event"
                  disabled={events.length < 2}
                  onClick={() => stepEvent(-1)}
                  className={arrow}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex flex-wrap justify-center gap-2">
                  {events.length > 1 && (
                    <button
                      type="button"
                      aria-pressed={active === null}
                      onClick={() => {
                        onSelect(null);
                        setOpen(false);
                      }}
                      className={`rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                        active === null
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      All events
                    </button>
                  )}
                  {events.map((e) => (
                    <button
                      key={e.slug}
                      type="button"
                      aria-pressed={active === e.slug || events.length === 1}
                      onClick={() => {
                        onSelect(e.slug);
                        setOpen(false);
                      }}
                      className={`rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                        active === e.slug || events.length === 1
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {e.title} <span className="opacity-55">{e.count}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next event"
                  disabled={events.length < 2}
                  onClick={() => stepEvent(1)}
                  className={arrow}
                >
                  <ChevronRight size={20} />
                </button>
                </div>
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
