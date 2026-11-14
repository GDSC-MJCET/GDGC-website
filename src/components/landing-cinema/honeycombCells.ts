import { Delaunay } from "d3-delaunay";
import { BARS, BAR_LENGTH, BAR_THICKNESS } from "./mark";
import { seeded } from "./story/rand";

// The honeycomb that fills the GDG mark: irregular Voronoi cells (like the gallery) laid over the logo.
// The layout is seeded, so the intro, the hero's video loop (baked by `npm run hero`) and its still all
// have the very same cells. No React in here, so the bake page can import it too.

export const W = 200;
export const H = 100;
const SPACING = 15; // average cell width in the mark's 200x100 units

export type CellShape = { id: number; d: string; x: number; y: number; w: number; h: number };

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

export const CELLS = buildCells();

/** the photo a cell starts on: neighbours begin on different photos */
export const startPhoto = (cellId: number, photoCount: number) => (cellId * 7 + (cellId >> 1) * 3) % photoCount;
