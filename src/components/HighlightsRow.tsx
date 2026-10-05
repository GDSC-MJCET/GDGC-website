import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";

type UpcomingEvent = {
  title: string;
  /** e.g. "11 Sept 2026 · 2 PM – 4 PM" */
  when: string;
  where: string;
  /** registration / details link */
  href: string;
  /** image shown at the bottom of the card, from public/ */
  image: string;
};

// Put the next event here and the card shows it. Leave it null and the card reads "No Upcoming Events".
// (The last one was GDGC 101: "11 Sept 2026 · 2 PM – 4 PM", "Seminar Hall, Block 4",
// https://forms.gle/hVxqpPMvK6VjU6yT7, image /gdg_101.jpeg.)
const UPCOMING_EVENT = null as UpcomingEvent | null;

const HighlightsRow = () => {
  return (
    <div className="px-6 md:px-20 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1.5fr_2fr] lg:gap-6 items-stretch">
        {UPCOMING_EVENT ? (
          <a
            href={UPCOMING_EVENT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-opacity duration-200 hover:opacity-90"
          >
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-google-red" />
                  Upcoming Event
                </span>
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground leading-snug">{UPCOMING_EVENT.title}</h3>

              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {UPCOMING_EVENT.when}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} />
                  {UPCOMING_EVENT.where}
                </span>
              </div>
            </div>

            <div className="mt-auto h-40">
              <img src={UPCOMING_EVENT.image} alt={UPCOMING_EVENT.title} className="w-full h-full object-cover" />
            </div>
          </a>
        ) : (
          <a
            href="https://www.instagram.com/gdgc.mjcet/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-opacity duration-200 hover:opacity-90"
          >
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  Upcoming Events
                </span>
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground leading-snug">No Upcoming Events</h3>

              <p className="text-sm text-muted-foreground">
                Something is cooking. Follow @gdgc.mjcet to be the first to know.
              </p>
            </div>

            {/* soft Google-colour glow where the event photo used to be */}
            <div aria-hidden className="relative mt-auto h-40 overflow-hidden">
              <span className="absolute -bottom-10 left-[8%] h-28 w-28 rounded-full bg-google-blue opacity-30 blur-3xl" />
              <span className="absolute -bottom-12 left-[32%] h-28 w-28 rounded-full bg-google-red opacity-25 blur-3xl" />
              <span className="absolute -bottom-10 left-[56%] h-28 w-28 rounded-full bg-google-yellow opacity-25 blur-3xl" />
              <span className="absolute -bottom-12 left-[78%] h-28 w-28 rounded-full bg-google-green opacity-30 blur-3xl" />
            </div>
          </a>
        )}

        <div className="flex flex-col justify-center gap-4 pl-0 lg:pl-6 lg:border-l lg:border-border">
          <span className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            What Drives Us
          </span>
          <h3 className="text-3xl sm:text-4xl leading-tight text-foreground">
            <span className="block font-bold">More than</span>
            <span className="block italic font-serif">events.</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            A community that learns, builds, and creates real impact.
          </p>
          <Link to="/events" className="inline-flex w-fit text-muted-foreground hover:text-foreground transition-colors duration-200">
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="rounded-2xl bg-[#111111] text-white p-6 flex flex-col justify-between gap-6">
          <span className="font-mono text-xs text-white/50">// community.exe</span>

          <div className="flex items-center justify-between gap-6">
            <svg viewBox="0 0 100 60" className="w-24 h-16 shrink-0" fill="none">
              <circle cx="38" cy="30" r="26" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
              <circle cx="62" cy="30" r="26" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            </svg>

            <ul className="flex flex-col gap-2 text-sm text-white/85">
              <li>Students</li>
              <li>Ideas</li>
              <li>Collaboration</li>
              <li>Real Impact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightsRow;
