import { ArrowUpRight } from "lucide-react";
import { INSTAGRAM_URL, WRAP } from "./constants";

type UpcomingEvent = {
  title: string;
  /** e.g. "11 Sept 2026 · 2 PM – 4 PM" */
  when: string;
  where: string;
  /** registration / details link */
  href: string;
};

// Put the next event here and the band announces it. Leave it null and it reads "No upcoming events".
// (The last one was GDGC 101: "11 Sept 2026 · 2 PM – 4 PM", "Seminar Hall, Block 4", https://forms.gle/hVxqpPMvK6VjU6yT7.)
const UPCOMING_EVENT = null as UpcomingEvent | null;

export default function NextUp() {
  const e = UPCOMING_EVENT;
  return (
    <section aria-label="Next event" className="border-b border-white/10">
      <a
        href={e ? e.href : INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${WRAP} group grid items-center gap-4 py-7 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:gap-8`}
      >
        <span className="flex items-center gap-3 font-tech text-[11px] tracking-[0.16em] text-white/55 uppercase">
          <span className="relative flex h-2 w-2">
            {e && <span className="absolute inset-0 animate-ping rounded-full bg-google-green opacity-70 motion-reduce:animate-none" />}
            <span className={`relative h-2 w-2 rounded-full ${e ? "bg-google-green" : "bg-white/35"}`} />
          </span>
          Next up
        </span>
        <span className="font-display text-2xl leading-tight font-bold tracking-[-0.03em] text-white sm:text-3xl">
          {e ? (
            <>
              {e.title}
              <span className="mt-1 block font-sans text-sm font-normal tracking-normal text-white/55">
                {e.when} · {e.where}
              </span>
            </>
          ) : (
            <>
              No upcoming events. <span className="text-white/40">Something is cooking.</span>
            </>
          )}
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors group-hover:text-white">
          {e ? "Register" : "Follow @gdgc.mjcet"}
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </a>
    </section>
  );
}
