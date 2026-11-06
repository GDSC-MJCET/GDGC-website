import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Delaunay } from "d3-delaunay";
import { BARS, BAR_LENGTH, BAR_THICKNESS, INTRO_PHOTOS, MARK_VIEWBOX, barRect, barTransform } from "./mark";
import { seeded } from "./story/rand";

// The GDG mark filled with a honeycomb of photos: irregular Voronoi cells (like the gallery) cover the logo,
// and each cell swaps its own photo every so often, so the mark is always changing but never a mess.
// The layout is seeded, so the intro and the hero backdrop have the very same cells.

const W = 200;
const H = 100;
const SPACING = 15; // average cell width in the mark's 200x100 units

type CellShape = { id: number; d: string; x: number; y: number; w: number; h: number };

// distance from a point to the middle line of a bar (a bar is that line thickened into a rounded stripe)
function distanceToBar(px: number, py: number, b: (typeof BARS)[number]) {
  const a = (b.angle * Math.PI) / 180;
  const ex = Math.cos(a) * BAR_LENGTH;
  const ey = Math.sin(a) * BAR_LENGTH;
  const t = Math.max(0, Math.min(1, ((px - b.x) * ex + (py - b.y) * ey) / (ex * ex + ey * ey)));
  return Math.hypot(px - (b.x + ex * t), py - (b.y + ey * t));
}

function buildCells(): CellShape[] {
  const rand = seeded(2627);
  let points: [number, number][] = [];
  let row = 0;
  for (let y = -SPACING; y < H + SPACING; y += SPACING * 0.866, row++) {
    for (let x = -SPACING + (row % 2 ? SPACING / 2 : 0); x < W + SPACING; x += SPACING) {
      points.push([x + (rand() - 0.5) * SPACING * 0.6, y + (rand() - 0.5) * SPACING * 0.6]);
    }
  }
  const bounds: [number, number, number, number] = [-SPACING, -SPACING, W + SPACING, H + SPACING];

  // two rounds of relaxing (each point moves to the middle of its cell) make the cells more even
  for (let round = 0; round < 2; round++) {
    const vor = Delaunay.from(points).voronoi(bounds);
    points = points.map((p, i) => {
      const poly = vor.cellPolygon(i);
      if (!poly) return p;
      let cx = 0;
      let cy = 0;
      let area = 0;
      for (let k = 0; k < poly.length - 1; k++) {
        const [x0, y0] = poly[k];
        const [x1, y1] = poly[k + 1];
        const f = x0 * y1 - x1 * y0;
        area += f;
        cx += (x0 + x1) * f;
        cy += (y0 + y1) * f;
      }
      area /= 2;
      return area ? [cx / (6 * area), cy / (6 * area)] : p;
    });
  }

  const vor = Delaunay.from(points).voronoi(bounds);
  const cells: CellShape[] = [];
  points.forEach(([px, py], i) => {
    // only cells that touch the mark are drawn
    if (!BARS.some((b) => distanceToBar(px, py, b) <= BAR_THICKNESS / 2 + SPACING * 0.55)) return;
    const poly = vor.cellPolygon(i);
    if (!poly) return;
    const xs = poly.map((p) => p[0]);
    const ys = poly.map((p) => p[1]);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    cells.push({
      id: cells.length,
      d: "M" + poly.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join("L") + "Z",
      x,
      y,
      w: Math.max(...xs) - x,
      h: Math.max(...ys) - y,
    });
  });
  return cells;
}

const CELLS = buildCells();

type Mode = "fast" | "calm";

type CellProps = { cell: CellShape; uid: string; photos: string[]; mode: Mode; running: boolean };

const Cell = memo(function Cell({ cell, uid, photos, mode, running }: CellProps) {
  const reduce = !!useReducedMotion();
  const n = photos.length;
  const start = (cell.id * 7 + (cell.id >> 1) * 3) % n; // neighbours begin on different photos
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
