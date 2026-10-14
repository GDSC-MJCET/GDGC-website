import { ArrowDown, CalendarDays } from "lucide-react";
import { scrollToTarget } from "../fx/smooth";

// "Up next" bar under the events hero. Put the next event in UPCOMING to announce it; null shows the
// "nothing announced yet" message.
type Upcoming = { title: string; when: string; href: string };
const UPCOMING = null as Upcoming | null;

export default function UpNext() {
  const scrollToArchive = () => scrollToTarget("#archive", -90);
  return (
    <section className="px-6 sm:px-10 lg:px-[6%]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 rounded-2xl border border-white/20 bg-white/[0.02] px-6 py-6 backdrop-blur-sm sm:px-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
            <span aria-hidden className="h-2 w-2 rounded-full bg-google-green shadow-[0_0_10px_#34A853]" />
            Up next
          </p>
          {UPCOMING ? (
            <>
              <a href={UPCOMING.href} target="_blank" rel="noopener noreferrer" className="mt-3 block text-2xl text-white hover:underline sm:text-3xl">
                {UPCOMING.title}
              </a>
              <p className="mt-1 text-sm text-white/60">{UPCOMING.when}</p>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-2xl font-light text-white sm:text-3xl">No upcoming events announced just yet.</h2>
              <p className="mt-1 text-sm text-white/60">
                Take a look at our past events and the impact we&apos;ve created together.
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={scrollToArchive}
          className="flex items-center gap-4 border-white/15 text-left text-white/85 transition-colors hover:text-white md:border-l md:pl-10"
        >
          <CalendarDays size={40} strokeWidth={1.2} className="text-white/70" />
          <span className="flex items-center gap-2 text-base">
            Explore what we&apos;ve built so far <ArrowDown size={16} />
          </span>
        </button>
      </div>
    </section>
  );
}
