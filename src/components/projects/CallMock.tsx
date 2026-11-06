import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Hand, Mic, MicOff, MonitorUp, PhoneOff, Users, Video } from "lucide-react";

// A Northiers call, drawn in its own design language (flat GDGC colours, rounded tiles, one floating
// control bar). The speaker moves around the room and someone raises a hand now and then.
const PEOPLE = [
  { name: "Afzal", tint: "#4285F4" },
  { name: "Misbah", tint: "#EA4335" },
  { name: "Ibrahim", tint: "#FBBC04" },
  { name: "Linra", tint: "#34A853" },
  { name: "Moid", tint: "#4285F4" },
  { name: "Liyaqat", tint: "#EA4335" },
];

export default function CallMock() {
  const reduce = !!useReducedMotion();
  const [speaker, setSpeaker] = useState(0);
  const [hand, setHand] = useState<number | null>(null);

  useEffect(() => {
    if (reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setSpeaker((s) => (s + 1 + (n % 2)) % PEOPLE.length);
      setHand(n % 3 === 0 ? (n * 2) % PEOPLE.length : null);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div aria-hidden className="overflow-hidden rounded-[1.75rem] bg-white p-3 text-[#202124] shadow-[0_60px_140px_-40px_rgba(66,133,244,0.45)] sm:p-4">
      <div className="flex items-center justify-between px-2 pb-3 text-xs sm:text-sm">
        <span className="flex items-center gap-2 font-bold">
          <span className="rounded-full bg-[#34A853] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#202124] uppercase">Live</span>
          Phase Four standup
        </span>
        <span className="flex items-center gap-1.5 text-[#5F6368]">
          <Users size={14} /> 6 · no account needed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {PEOPLE.map((p, i) => {
          const on = i === speaker;
          return (
            <motion.div
              key={p.name}
              layout
              className="relative flex aspect-[4/3] items-center justify-center rounded-2xl sm:rounded-3xl"
              style={{ background: on ? p.tint : "#F1F3F4" }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-full text-base font-black sm:h-14 sm:w-14 sm:text-xl"
                style={{ background: on ? "#FFFFFF" : p.tint, color: on ? p.tint : "#FFFFFF" }}
                animate={on && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.9, repeat: on ? Infinity : 0 }}
              >
                {p.name[0]}
              </motion.span>
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold sm:bottom-2 sm:left-2 sm:text-[11px]">
                {on ? <Mic size={10} className="text-[#34A853]" /> : <MicOff size={10} className="text-[#5F6368]" />}
                {p.name}
              </span>
              {hand === i && (
                <motion.span
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FBBC04] sm:top-2 sm:right-2 sm:h-7 sm:w-7"
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <Hand size={13} />
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-[#F1F3F4] p-1.5 sm:gap-2">
          {[
            { icon: Mic, bg: "#FFFFFF" },
            { icon: Video, bg: "#FFFFFF" },
            { icon: MonitorUp, bg: "#1967D2", fg: "#FFFFFF" },
            { icon: Hand, bg: "#FBBC04" },
          ].map(({ icon: Icon, bg, fg }, i) => (
            <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10" style={{ background: bg, color: fg ?? "#202124" }}>
              <Icon size={15} />
            </span>
          ))}
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-[#D93025] px-3 text-xs font-semibold text-white sm:h-10 sm:px-4">
            <PhoneOff size={14} /> Leave
          </span>
        </div>
      </div>
    </div>
  );
}
