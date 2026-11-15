import { useEffect, useRef } from "react";
import { useQuality } from "../fx/quality";
import { BARS, MARK_MASK, MARK_VIEWBOX, barRect, barTransform, heroLoop } from "./mark";

// The GDG mark filled with the honeycomb of event photos, as a video loop cut to the logo's shape.
// It looks like the live honeycomb (Honeycomb.tsx, same cells) but costs next to nothing to show: the
// phone's video decoder does the work, where the live one repaints 71 clipped photos all the time.
// The loop only plays while it is on screen. With motion off it is a still (the loop's first frame).
export default function MarkLoop({ className = "block w-full" }: { className?: string }) {
  const quality = useQuality();
  const video = useRef<HTMLVideoElement>(null);
  const still = quality === "static";
  const { video: src, still: poster } = heroLoop(quality === "full" ? 1280 : 960);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true; // set on the element itself: browsers only start a video on their own if it is muted
    const seen = new IntersectionObserver(([entry]) => {
      // a refused play() (low-power mode, say) just leaves the still showing
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    seen.observe(el);
    return () => seen.disconnect();
  }, [still, src]);

  const cut = { maskImage: MARK_MASK, WebkitMaskImage: MARK_MASK, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" };

  return (
    <div aria-hidden className={`relative aspect-[2/1] ${className}`}>
      <div className="absolute inset-0 bg-[#0d0e10]" style={cut}>
        {still ? (
          <img src={poster} alt="" decoding="async" draggable={false} className="h-full w-full object-cover" />
        ) : (
          <video ref={video} key={src} src={src} poster={poster} muted loop playsInline preload="auto" disablePictureInPicture className="h-full w-full object-cover" />
        )}
      </div>
      {/* the bars' own colours, as a thin edge, so it still reads as the GDG mark */}
      <svg viewBox={MARK_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible">
        {BARS.map((b) => (
          <rect key={b.id} {...barRect} transform={barTransform(b)} fill="none" stroke={b.color} strokeWidth="1.1" />
        ))}
      </svg>
    </div>
  );
}
