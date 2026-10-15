import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeading, { Dot, Outline } from "./SectionHeading";

// "People. Projects. Progress.": a film strip of photos from past events, scrollable by drag/swipe or the
// arrows at either end. Clicking a photo opens the gallery page.

// web-sized copies (in public/home/community/) of event photos that live full-size in public/
const PHOTOS = [
  { src: "/home/community/pixelx-2.webp", w: 480, h: 640 },
  { src: "/home/community/tech-faceoff-2.webp", w: 960, h: 640 },
  { src: "/home/community/doodle3.webp", w: 853, h: 640 },
  { src: "/home/community/au2.webp", w: 480, h: 640 },
  { src: "/home/community/adsophos-1.webp", w: 960, h: 640 },
  { src: "/home/community/tech-faceoff-1.webp", w: 960, h: 640 },
  { src: "/home/community/dy1.webp", w: 853, h: 640 },
  { src: "/home/community/aig3.webp", w: 853, h: 640 },
  { src: "/home/community/antigravityiii.webp", w: 960, h: 640 },
  { src: "/home/community/dev-arena-1.webp", w: 360, h: 640 },
  { src: "/home/community/pixelx-3.webp", w: 853, h: 640 },
  { src: "/home/community/tech24-4.webp", w: 1100, h: 619 },
  { src: "/home/community/frtp-2.webp", w: 853, h: 640 },
  { src: "/home/community/c9.webp", w: 480, h: 640 },
  { src: "/home/community/dy7.webp", w: 853, h: 640 },
  { src: "/home/community/tech-faceoff-3.webp", w: 853, h: 640 },
];

export default function CommunityStrip() {
  const strip = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={dir < 0 ? "Scroll photos left" : "Scroll photos right"}
      onClick={() => scrollBy(dir)}
      className="absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white/85 backdrop-blur-md transition-colors hover:border-white/60 hover:text-white sm:flex"
      style={dir < 0 ? { left: 12 } : { right: 12 }}
    >
      {dir < 0 ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
    </button>
  );

  return (
    <section aria-label="From our community" className="relative py-20 lg:py-28">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-[5.5%]">
        <SectionHeading
          eyebrow="From Our Community"
          dot="bg-google-green"
          lines={[
            "People.",
            <>
              <Outline>Projects</Outline>.
            </>,
            <>
              Progress
              <Dot />
            </>,
          ]}
        />
        <p className="max-w-[20rem] text-sm leading-relaxed text-white/65 lg:mb-3 lg:text-right">
          Workshops. Hackathons. Talks.
          <br />
          And the people who make it happen.
        </p>
      </div>

      {PHOTOS.length > 0 && (
        <div className="relative mt-10">
          {arrow(-1)}
          {arrow(1)}
          {/* edge fades */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
          <div
            ref={strip}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:px-24 [&::-webkit-scrollbar]:hidden"
          >
            {PHOTOS.map((p) => (
              <Link
                key={p.src}
                to="/gallery"
                aria-label="Open the gallery"
                className="group relative h-[260px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-white/15 sm:h-[300px]"
                style={{ aspectRatio: `${Math.min(Math.max(p.w / p.h, 0.7), 1.6)}` }}
              >
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover brightness-[0.85] transition duration-500 group-hover:scale-105 group-hover:brightness-100"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
