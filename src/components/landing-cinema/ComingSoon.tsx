import { ArrowUpRight } from "lucide-react";
import { INSTAGRAM_URL, WRAP } from "./theme";

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

export default function ComingSoon() {
  const e = UPCOMING_EVENT;
  return (
    <section aria-label="Next event" className={`${WRAP} pt-10`}>
      <a
        href={e ? e.href : INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/[0.02] px-6 py-6 backdrop-blur-sm transition-colors hover:border-white/40 sm:px-8 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {e && <span className="absolute inset-0 animate-ping rounded-full bg-google-green opacity-70 motion-reduce:animate-none" />}
            <span className={`relative h-2.5 w-2.5 rounded-full ${e ? "bg-google-green" : "bg-white/35"}`} />
          </span>
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 uppercase">Upcoming Events</p>
            <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl">{e ? e.title : "No Upcoming Events"}</p>
            <p className="mt-1 text-sm text-white/55">
              {e ? `${e.when} · ${e.where}` : "Something is cooking. Follow @gdgc.mjcet to be the first to know."}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
          {e ? "Register" : "Follow @gdgc.mjcet"}
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </a>
    </section>
  );
}
