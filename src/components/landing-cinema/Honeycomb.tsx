import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BARS, INTRO_PHOTOS, MARK_VIEWBOX, barRect, barTransform } from "./mark";
import { CELLS, H, W, startPhoto, type CellShape } from "./honeycombCells";

// The GDG mark filled with a honeycomb of photos: irregular Voronoi cells (like the gallery) cover the logo,
// and each cell swaps its own photo every so often, so the mark is always changing but never a mess.
// The cells come from honeycombCells.ts, shared with the hero's baked video loop, so the intro settles into it.
// This live version is only used by the intro on the full tier: it repaints all the time, so it is too
// heavy to leave running behind the page.

type Mode = "fast" | "calm";

type CellProps = { cell: CellShape; uid: string; photos: string[]; mode: Mode; running: boolean };

const Cell = memo(function Cell({ cell, uid, photos, mode, running }: CellProps) {
  const reduce = !!useReducedMotion();
  const n = photos.length;
  const start = startPhoto(cell.id, n);
  const [shown, setShown] = useState({ now: start, before: null as number | null, count: 0 });
  const current = useRef(start);

  useEffect(() => {
    if (!running || reduce || n < 2) return;
    let timer = 0;
    const wait = (first: boolean) =>
      mode === "fast" ? 90 + Math.random() * 340 : (first ? Math.random() * 5000 : 2400 + Math.random() * 4200);
    const swap = () => {
      let next = current.current;
      while (next === current.current) next = Math.floor(Math.random() * n);
      setShown((s) => ({ now: next, before: current.current, count: s.count + 1 }));
      current.current = next;
      timer = window.setTimeout(swap, wait(false));
    };
    timer = window.setTimeout(swap, wait(true));
    return () => window.clearTimeout(timer);
  }, [running, reduce, mode, n]);

  const pad = 1.2;
  const image = (src: string, key: string, fade: boolean) => (
    <image
      key={key}
      href={src}
      x={cell.x - pad}
      y={cell.y - pad}
      width={cell.w + pad * 2}
      height={cell.h + pad * 2}
      preserveAspectRatio="xMidYMid slice"
      className={fade ? "honey-in" : undefined}
    />
  );

  return (
    <>
      <clipPath id={`${uid}-c${cell.id}`}>
        <path d={cell.d} />
      </clipPath>
      <g clipPath={`url(#${uid}-c${cell.id})`}>
        {running && shown.before !== null && image(photos[shown.before], `b${shown.count}`, false)}
        {running && image(photos[shown.now], `n${shown.count}`, mode === "calm" && shown.count > 0)}
      </g>
      <path d={cell.d} fill="none" stroke="#050506" strokeWidth="0.9" strokeLinejoin="round" />
    </>
  );
});

export default function HoneycombMark({
  photos = INTRO_PHOTOS,
  mode = "calm",
  running = true,
  className = "block w-full overflow-visible",
}: {
  photos?: string[];
  mode?: Mode;
  running?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const cells = useMemo(() => CELLS, []);

  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden>
      <defs>
        <clipPath id={`${uid}-mark`}>
          {BARS.map((b) => (
            <rect key={b.id} {...barRect} transform={barTransform(b)} />
          ))}
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-mark)`}>
        <rect x="0" y="0" width={W} height={H} fill="#0d0e10" />
        {cells.map((cell) => (
          <Cell key={cell.id} cell={cell} uid={uid} photos={photos} mode={mode} running={running} />
        ))}
      </g>
      {/* the bars' own colours, as a thin edge, so it still reads as the GDG mark */}
      {BARS.map((b) => (
        <rect key={b.id} {...barRect} transform={barTransform(b)} fill="none" stroke={b.color} strokeWidth="1.1" />
      ))}
    </svg>
  );
}
