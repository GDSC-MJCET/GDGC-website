import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import type { GalleryItem } from "./types";

// A full-screen photo mesh: every photo owns the Voronoi cell around its seed point. Cells are computed on
// the CPU and painted on a 2D canvas (no WebGL). Seeds move on springs, and the pointer acts as a smooth
// fisheye lens (continuous, so nothing snaps when it crosses from one cell to the next). The draw loop only
// runs while something is moving, so the page costs nothing when it is sitting still.

const BG = "#0C0E0D";
const MAX_DPR = 1.5; // full-screen canvas: more than this costs fill-rate and the photos don't need it
const MAX_DPR_PHONE = 1.25; // phones have the least GPU headroom
const LOAD_CONCURRENCY = 6;
const STIFFNESS = 150; // seed spring
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.8; // slightly under critical, so cells settle with a hint of life

type Props = {
  items: GalleryItem[];
  /** called with the photo whose cell was clicked */
  onOpen: (item: GalleryItem) => void;
  /** ids of photos to show as selected (edit mode) */
  selectedIds?: ReadonlySet<string>;
  className?: string;
};

// Halton sequence: an even, repeatable scatter of points (no random reshuffle between renders)
const halton = (i: number, base: number) => {
  let f = 1;
  let r = 0;
  while (i > 0) {
    f /= base;
    r += f * (i % base);
    i = Math.floor(i / base);
  }
  return r;
};

type Box = [number, number, number, number];

// Lloyd relaxation: move every point to the centre of its cell a few times so the cells even out.
function relax(pts: Float64Array, box: Box, rounds: number) {
  const n = pts.length / 2;
  if (n < 3) return;
  for (let r = 0; r < rounds; r++) {
    const vor = new Delaunay(pts).voronoi(box);
    for (let i = 0; i < n; i++) {
      const poly = vor.cellPolygon(i);
      if (!poly) continue;
      let a = 0;
      let cx = 0;
      let cy = 0;
      for (let k = 0; k < poly.length - 1; k++) {
        const [x0, y0] = poly[k];
        const [x1, y1] = poly[k + 1];
        const cross = x0 * y1 - x1 * y0;
        a += cross;
        cx += (x0 + x1) * cross;
        cy += (y0 + y1) * cross;
      }
      if (Math.abs(a) < 1e-6) continue;
      pts[2 * i] = cx / (3 * a);
      pts[2 * i + 1] = cy / (3 * a);
    }
  }
}

type Source = ImageBitmap | HTMLImageElement;
const sourceSize = (s: Source) => (s instanceof HTMLImageElement ? [s.naturalWidth, s.naturalHeight] : [s.width, s.height]);

export default function VoronoiGallery({ items, onOpen, selectedIds, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ items, onOpen, selectedIds });
  propsRef.current = { items, onOpen, selectedIds };
  // set by the effect below so the effects after it can ask for a rebuild / a repaint
  const rebuildRef = useRef<() => void>(() => {});
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;

    // per-photo state, parallel arrays indexed like `items`
    let n = 0;
    let pos = new Float64Array(0); // current seed positions (x, y pairs)
    let vel = new Float64Array(0);
    let home = new Float64Array(0); // where each seed wants to be
    let hover = new Float64Array(0); // 0..1 per cell: how "under the pointer" it is
    let appear = new Float64Array(0); // 0..1 per cell: photo fade-in
    let sources: (Source | null)[] = [];
    let avgCell = 100;
    let placed = false;
    let delaunay: Delaunay<Delaunay.Point> | null = null;
    let voronoi: ReturnType<Delaunay<Delaunay.Point>["voronoi"]> | null = null;

    // pointer: raw position, an eased copy of it (the lens centre), and how strongly the lens is on
    let inside = false;
    let rawX = 0;
    let rawY = 0;
    let lensX = 0;
    let lensY = 0;
    let strength = 0;

    let raf = 0;
    let running = false;
    let last = 0;
    let queueIndex = 0;
    let loading = 0;
    let generation = 0; // bumps on rebuild so stale image loads are ignored

    // ── image loading ───────────────────────────────────────────────────────
    const pump = (gen: number) => {
      const list = propsRef.current.items;
      while (gen === generation && loading < LOAD_CONCURRENCY && queueIndex < list.length) {
        const i = queueIndex++;
        const img = new Image();
        loading++;
        const finish = (src: Source | null) => {
          if (gen !== generation) {
            if (src && !(src instanceof HTMLImageElement)) src.close();
            return; // the list was rebuilt while this was loading
          }
          loading--;
          sources[i] = src;
          pump(gen);
          start();
        };
        img.onload = () => {
          // an ImageBitmap is decoded and ready for the GPU, so the first draw does not hitch
          if (typeof createImageBitmap === "function") {
            createImageBitmap(img).then(finish, () => finish(img));
          } else finish(img);
        };
        img.onerror = () => finish(null);
        img.src = list[i].t;
      }
    };

    // ── layout: where every seed wants to sit ───────────────────────────────
    const rebuildVoronoi = () => {
      if (!n || w < 10 || h < 10) return;
      delaunay = new Delaunay(pos);
      voronoi = delaunay.voronoi([0, 0, w, h]);
    };
    const layout = () => {
      if (!n || w < 10 || h < 10) return;
      const box: Box = [0, 0, w, h];
      avgCell = Math.sqrt((w * h) / n);
      const pts = new Float64Array(2 * n);
      for (let k = 0; k < n; k++) {
        pts[2 * k] = (0.04 + 0.92 * halton(k + 1, 2)) * w;
        pts[2 * k + 1] = (0.04 + 0.92 * halton(k + 1, 3)) * h;
      }
      relax(pts, box, 10);
      home = pts;
      if (!placed) {
        // first layout: start bunched at the centre and let the springs bloom the mesh outwards
        const f = reduce ? 1 : 0.1;
        for (let k = 0; k < n; k++) {
          pos[2 * k] = w / 2 + (home[2 * k] - w / 2) * f;
          pos[2 * k + 1] = h / 2 + (home[2 * k + 1] - h / 2) * f;
        }
        placed = true;
      }
      rebuildVoronoi();
      start();
    };
    const build = () => {
      generation++;
      loading = 0;
      queueIndex = 0;
      n = propsRef.current.items.length;
      pos = new Float64Array(2 * n);
      vel = new Float64Array(2 * n);
      home = new Float64Array(2 * n);
      hover = new Float64Array(n);
      appear = new Float64Array(n);
      sources = new Array<Source | null>(n).fill(null);
      placed = false;
      delaunay = null;
      voronoi = null;
      layout();
      pump(generation);
    };

    // ── one animation frame; returns true while anything is still moving ────
    const frame = (dt: number) => {
      let moving = false;

      // the lens follows the pointer with a little lag and fades in and out
      const pe = reduce ? 1 : 1 - Math.exp(-dt * 14);
      if (inside) {
        lensX += (rawX - lensX) * pe;
        lensY += (rawY - lensY) * pe;
        if (Math.abs(rawX - lensX) > 0.3 || Math.abs(rawY - lensY) > 0.3) moving = true;
      }
      const goal = inside ? 1 : 0;
      strength += (goal - strength) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
      if (Math.abs(goal - strength) > 0.002) moving = true;
      else strength = goal;

      // seeds spring toward home, pushed outwards from the lens (fisheye), so the cell under it grows
      const R = avgCell * 2.4;
      const S = avgCell * 0.95;
      const step = Math.min(dt, 1 / 30);
      for (let i = 0; i < n; i++) {
        let tx = home[2 * i];
        let ty = home[2 * i + 1];
        if (strength > 0.002) {
          const dx = tx - lensX;
          const dy = ty - lensY;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.5) {
            const f = 1 - d / R;
            const push = f * f * S * strength;
            tx += (dx / d) * push;
            ty += (dy / d) * push;
          }
        }
        const ex = tx - pos[2 * i];
        const ey = ty - pos[2 * i + 1];
        if (reduce) {
          pos[2 * i] = tx;
          pos[2 * i + 1] = ty;
        } else {
          vel[2 * i] += (STIFFNESS * ex - DAMPING * vel[2 * i]) * step;
          vel[2 * i + 1] += (STIFFNESS * ey - DAMPING * vel[2 * i + 1]) * step;
          pos[2 * i] += vel[2 * i] * step;
          pos[2 * i + 1] += vel[2 * i + 1] * step;
        }
        if (Math.abs(ex) > 0.05 || Math.abs(ey) > 0.05 || Math.abs(vel[2 * i]) > 0.05 || Math.abs(vel[2 * i + 1]) > 0.05) {
          moving = true;
        }
      }

      if (!voronoi || !delaunay || !n) return moving;
      if (propsRef.current.items.length !== n) return true; // the photo list just changed: wait for the rebuild
      voronoi.update(); // the seed array was edited in place
      const hi = inside ? delaunay.find(rawX, rawY) : -1;

      for (let i = 0; i < n; i++) {
        const dh = (i === hi ? 1 : 0) - hover[i];
        if (Math.abs(dh) > 0.002) {
          hover[i] += dh * (reduce ? 1 : 1 - Math.exp(-dt * 12));
          moving = true;
        } else hover[i] = i === hi ? 1 : 0;
        if (sources[i] && appear[i] < 1) {
          appear[i] = reduce ? 1 : Math.min(1, appear[i] + dt * 3.5);
          moving = true;
        }
      }

      // ── paint ──
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const gutter = new Path2D();
      const chosen = propsRef.current.selectedIds;
      const list = propsRef.current.items;
      const selectedCells: { path: Path2D; x: number; y: number }[] = [];
      let hoveredPath: Path2D | null = null;
      for (let i = 0; i < n; i++) {
        const poly = voronoi.cellPolygon(i);
        if (!poly) continue;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const path = new Path2D();
        for (let j = 0; j < poly.length; j++) {
          const [x, y] = poly[j];
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (j === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }
        path.closePath();
        gutter.addPath(path);
        if (i === hi) hoveredPath = path;
        if (chosen?.has(list[i].id)) selectedCells.push({ path, x: pos[2 * i], y: pos[2 * i + 1] });

        ctx.save();
        ctx.clip(path);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        const src = sources[i];
        if (src && appear[i] > 0) {
          const [iw, ih] = sourceSize(src);
          if (iw && ih) {
            const zoom = 1.12 + 0.2 * hover[i];
            const s = Math.max((maxX - minX) / iw, (maxY - minY) / ih) * zoom;
            const dw = iw * s;
            const dh = ih * s;
            ctx.globalAlpha = appear[i];
            // centred on the seed (not the bounding box) so the subject stays inside its cell
            ctx.drawImage(src, pos[2 * i] - dw / 2, pos[2 * i + 1] - dh / 2, dw, dh);
            ctx.globalAlpha = 1;
          }
        }
        // with the lens on, everything except the cell under it steps back a little
        const dim = 0.3 * strength * (1 - hover[i]);
        if (dim > 0.005) {
          ctx.fillStyle = `rgba(12,14,13,${dim.toFixed(3)})`;
          ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        }
        ctx.restore();
      }

      ctx.lineJoin = "round";
      ctx.strokeStyle = BG;
      ctx.lineWidth = 3;
      ctx.stroke(gutter);
      if (hoveredPath && hi >= 0) {
        ctx.strokeStyle = `rgba(255,255,255,${(0.9 * hover[hi]).toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.stroke(hoveredPath);
      }
      // edit mode: selected cells get a green frame, a tint and a tick
      for (const { path, x, y } of selectedCells) {
        ctx.save();
        ctx.clip(path);
        ctx.fillStyle = "rgba(52,168,83,0.22)";
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        ctx.strokeStyle = "#34A853";
        ctx.lineWidth = 4;
        ctx.stroke(path);
        ctx.fillStyle = "#34A853";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x - 1.5, y + 5);
        ctx.lineTo(x + 7, y - 5);
        ctx.stroke();
      }
      return moving;
    };

    const loop = (now: number) => {
      if (document.hidden) {
        running = false;
        return;
      }
      const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      try {
        if (frame(dt)) raf = requestAnimationFrame(loop);
        else running = false; // everything has settled: stop drawing until something changes
      } catch (err) {
        running = false; // let the next interaction restart the loop instead of freezing for good
        console.error("gallery frame failed", err);
      }
    };
    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }

    // ── sizing, pointer, visibility ─────────────────────────────────────────
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? MAX_DPR_PHONE : MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      layout();
      start();
    };
    resize();
    build();
    rebuildRef.current = build;
    redrawRef.current = start;
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const track = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      rawX = e.clientX - r.left;
      rawY = e.clientY - r.top;
    };
    // touch drags steer the lens too (the finger acts as the pointer while it is down)
    const onEnter = (e: PointerEvent) => {
      track(e);
      if (!inside) {
        inside = true;
        lensX = rawX;
        lensY = rawY;
      }
      start();
    };
    const onMove = (e: PointerEvent) => {
      track(e);
      inside = true;
      start();
    };
    const onLeave = () => {
      inside = false;
      start();
    };
    const onClick = (e: MouseEvent) => {
      if (!delaunay || !n) return;
      const r = canvas.getBoundingClientRect();
      const i = delaunay.find(e.clientX - r.left, e.clientY - r.top);
      const it = propsRef.current.items[i];
      if (it) propsRef.current.onOpen(it);
    };
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      generation++;
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const s of sources) if (s && !(s instanceof HTMLImageElement)) s.close();
      rebuildRef.current = () => {};
      redrawRef.current = () => {};
    };
  }, []);

  // the selection changed (edit mode)
  useEffect(() => {
    redrawRef.current();
  }, [selectedIds]);

  // the photo list changed
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    rebuildRef.current();
  }, [items]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Gallery of photos from GDGC MJCET events, arranged as a mesh"
        className="block h-full w-full cursor-pointer touch-none"
      />
    </div>
  );
}
