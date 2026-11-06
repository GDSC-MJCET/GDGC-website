import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Label, RiseLines } from "./primitives";
import { WRAP } from "./constants";

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

const ROWS = [PHOTOS.slice(0, 8), PHOTOS.slice(8)];

function Row({ photos, reverse, height }: { photos: typeof PHOTOS; reverse?: boolean; height: string }) {
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none]">
      <div
        className={`flex w-max group-hover:[animation-play-state:paused] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": reverse ? "70s" : "60s" } as CSSProperties}
      >
        {[0, 1].map((half) => (
          <div key={half} aria-hidden={half === 1} className="flex shrink-0 gap-3 pr-3">
            {photos.map((p) => (
              <img
                key={p.src}
                src={p.src}
                alt=""
                decoding="async"
                draggable={false}
                className={`${height} shrink-0 rounded-[0.9rem] bg-white/5 object-cover brightness-[0.85] transition duration-500 hover:brightness-105`}
                style={{ aspectRatio: `${Math.min(Math.max(p.w / p.h, 0.7), 1.6)}` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunityReel() {
  return (
    <section aria-label="From our community" className="pt-24 pb-8 md:pt-36 md:pb-12">
      <div className={`${WRAP} flex flex-col gap-8 md:flex-row md:items-end md:justify-between`}>
        <div>
          <Label index="04">From our community</Label>
          <RiseLines
            lines={[
              "People.",
              "Projects.",
              <>
                Progress<span className="text-google-green">.</span>
              </>,
            ]}
            className="mt-6 font-display text-[clamp(2.75rem,6vw,5.75rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-white"
          />
        </div>
        <div className="flex flex-col gap-6 md:mb-2 md:items-end md:text-right">
          <p className="max-w-[20rem] text-base leading-relaxed text-white/60">
            Workshops. Hackathons. Talks.
            <br />
            And the people who make it happen.
          </p>
          <Link
            to="/gallery"
            className="group inline-flex w-fit items-center gap-2 border-b border-white/30 pb-1 text-sm font-medium text-white transition-colors hover:border-white"
          >
            Open the gallery <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <Link to="/gallery" tabIndex={-1} aria-hidden className="group mt-14 flex flex-col gap-3">
        <Row photos={ROWS[0]} height="h-[200px] sm:h-[280px]" />
        <Row photos={ROWS[1]} height="h-[160px] sm:h-[220px]" reverse />
      </Link>
    </section>
  );
}
