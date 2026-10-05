import { useEffect, useRef, type RefObject } from "react";
import { MORPH_MS, MORPH_DELAY_MS, type ExitState } from "./introEvents";

// Virtual canvas the composition is authored on; scaled to fit the viewport.
const VW = 1600;
const VH = 900;
const CX = 800;
const CY = 432;

const BLUE = "#4285F4";
const RED = "#EA4335";
const YELLOW = "#FBBC05";
const GREEN = "#34A853";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
const ramp = (t: number, from: number, to: number) => easeOut((t - from) / (to - from));
const easeInOut = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: string, b: string, k: number) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return [Math.round(lerp(r1, r2, k)), Math.round(lerp(g1, g2, k)), Math.round(lerp(b1, b2, k))];
};
const rgba = ([r, g, b]: number[], a: number) => `rgba(${r},${g},${b},${a})`;

// The hero globe's satellites and rings (same values as ParticleGlobe) that the planets land on.
const SAT = [
  { color: "#4285F4", ring: 0, t: 0.2, r: 7, sp: 0.16, pulsePhase: 0 },
  { color: "#EA4335", ring: 1, t: 1.6, r: 8, sp: 0.13, pulsePhase: 1.5 },
  { color: "#FBBC05", ring: 0, t: 3.4, r: 7, sp: 0.16, pulsePhase: 3 },
  { color: "#34A853", ring: 1, t: 4.9, r: 8, sp: 0.13, pulsePhase: 4.5 },
];
const HERO_RINGS = [
  { tilt: 0.5, spinBase: 0.4, spinRate: 0.11, rad: 1.15 },
  { tilt: -1.15, spinBase: 1.2, spinRate: -0.08, rad: 1.22 },
];
const CAMERA = 10;

type Orbit = { cx: number; cy: number; rx: number; ry: number; rot: number };

const ORBIT_A: Orbit = { cx: 815, cy: 432, rx: 655, ry: 255, rot: -0.02 };
const ORBIT_B: Orbit = { cx: 800, cy: 440, rx: 560, ry: 205, rot: 0.1 };
const ORBIT_C: Orbit = { cx: 790, cy: 430, rx: 705, ry: 285, rot: 0.06 };

const onOrbit = (o: Orbit, u: number) => {
  const x = o.rx * Math.cos(u);
  const y = o.ry * Math.sin(u);
  const c = Math.cos(o.rot);
  const s = Math.sin(o.rot);
  return { x: o.cx + x * c - y * s, y: o.cy + x * s + y * c };
};

// `sat` is the hero-globe satellite each planet lands on at the end of the intro.
type Planet = { label: string; color: string; orbit: Orbit; u: number; dir: number; r: number; at: number; sat: number };
const PLANETS: Planet[] = [
  { label: "LEARN", color: BLUE, orbit: ORBIT_A, u: -2.32, dir: 1, r: 12, at: 1.0, sat: 0 },
  { label: "BUILD", color: YELLOW, orbit: ORBIT_A, u: -0.74, dir: 1, r: 12, at: 1.15, sat: 2 },
  { label: "CONNECT", color: RED, orbit: ORBIT_B, u: 2.9, dir: -1, r: 13, at: 1.3, sat: 1 },
  { label: "GROW", color: GREEN, orbit: ORBIT_B, u: 0.73, dir: -1, r: 12, at: 1.45, sat: 3 },
];

type Node = { label: string; orbit: Orbit | null; u: number; x: number; y: number; at: number };
const NODES: Node[] = [
  { label: "STUDENTS", orbit: ORBIT_A, u: -1.92, x: 0, y: 0, at: 1.5 },
  { label: "IDEAS", orbit: null, u: 0, x: 1045, y: 380, at: 1.65 },
  { label: "TECHNOLOGY", orbit: ORBIT_B, u: 2.25, x: 0, y: 0, at: 1.8 },
  { label: "IMPACT", orbit: ORBIT_B, u: 1.6, x: 0, y: 0, at: 1.95 },
  { label: "", orbit: ORBIT_C, u: 0.9, x: 0, y: 0, at: 1.7 },
  { label: "", orbit: ORBIT_C, u: -1.55, x: 0, y: 0, at: 1.85 },
];

// Deterministic pseudo-random so stars stay put between frames and reloads.
const makeRand = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

type Star = { x: number; y: number; r: number; phase: number; color: string };
const STAR_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#7aa7ff", "#ffb347", "#ff6b6b", "#5ddb6e"];
const makeStars = (): Star[] => {
  const rand = makeRand(7);
  return Array.from({ length: 110 }, () => ({
    x: rand() * VW,
    y: rand() * VH,
    r: 0.5 + rand() * 1.1,
    phase: rand() * Math.PI * 2,
    color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
  }));
};

const SPHERE_COUNT = 2600; // same count as the hero globe, so the dot density matches at hand-off
const SPHERE_R = 330;
type SpherePoint = { x: number; y: number; z: number; s: number; hs: number; ph: number };
const makeSphere = (): SpherePoint[] => {
  const rand = makeRand(21);
  return Array.from({ length: SPHERE_COUNT }, (_, i) => {
    const u = (i + 0.5) / SPHERE_COUNT;
    const phi = Math.acos(1 - 2 * u);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
      s: 0.6 + rand() * 0.9,
      hs: 0.7 + rand() * 0.7, // dot radius on the hero globe
      ph: rand() * Math.PI * 2,
    };
  });
};

type TextCtx = CanvasRenderingContext2D & { letterSpacing: string };

// The intro is two stacked canvases. "back" (corner glows, stars, nodes) lives inside the shutter
// panel and rides up with it; "front" (globe, orbits, planets) stays put above the shutter and
// morphs into the hero globe.
export default function IntroScene({
  reduced,
  exitRef,
  layer,
}: {
  reduced: boolean;
  exitRef: RefObject<ExitState | null>;
  layer: "back" | "front";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as TextCtx | null;
    if (!ctx) return;

    const stars = makeStars();
    const sphere = makeSphere();
    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();

    const sceneScale = () => (W < 700 ? W / 1000 : Math.min(W / VW, H / VH));

    const label = (text: string, x: number, y: number, alpha: number, size = 11, color = "#ffffff") => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = `500 ${size}px Inter, system-ui, sans-serif`;
      ctx.letterSpacing = `${size * 0.31}px`;
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    // ── back layer: corner glows ─────────────────────────────────────────────
    // One corner's glow arcs, authored for the top-left and mirrored/scaled for the others.
    const cornerArcs = (
      c: CanvasRenderingContext2D, color: string, a: number, ox: number, oy: number, sx: number, k: number, s: number
    ) => {
      c.setTransform(dpr * s * sx * k, 0, 0, dpr * s * k, dpr * ox, dpr * oy);
      const strokeArc = (path: () => void, width: number, alpha: number, blur: number) => {
        const g = c.createLinearGradient(0, 0, 260, 380);
        g.addColorStop(0, color + "00");
        g.addColorStop(0.35, color);
        g.addColorStop(1, color + "00");
        c.save();
        c.globalAlpha = a * alpha;
        c.shadowColor = color;
        c.shadowBlur = blur;
        c.strokeStyle = g;
        c.lineWidth = width;
        c.beginPath();
        path();
        c.stroke();
        c.restore();
      };
      strokeArc(() => { c.moveTo(0, 40); c.quadraticCurveTo(120, 160, 205, 345); }, 2.2, 0.95, 26);
      strokeArc(() => { c.moveTo(0, 70); c.quadraticCurveTo(140, 180, 245, 330); }, 1, 0.5, 14);
      strokeArc(() => { c.moveTo(0, 8); c.quadraticCurveTo(95, 100, 160, 270); }, 4, 0.25, 40);
    };

    const drawGlows = (c: CanvasRenderingContext2D, t: number, s: number) => {
      c.setTransform(1, 0, 0, 1, 0, 0);
      const glowR = Math.max(W, H) * 0.55;
      const corners: [number, number, string, number][] = [
        [0, 0, BLUE, 0.3],
        [W, 0, YELLOW, 0.2],
        [0, H, RED, 0.38],
        [W, H, GREEN, 0.26],
      ];
      corners.forEach(([x, y, color, strength], i) => {
        const g = c.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, glowR * dpr);
        g.addColorStop(0, color + "ff");
        g.addColorStop(0.35, color + "40");
        g.addColorStop(1, color + "00");
        c.globalAlpha = strength * ramp(t, 0.1 + i * 0.1, 1.3 + i * 0.1) * 0.95;
        c.fillStyle = g;
        c.fillRect(0, 0, canvas.width, canvas.height);
      });
      c.globalAlpha = 1;
      cornerArcs(c, BLUE, ramp(t, 0.2, 1.5), 0, 0, 1, 1, s);
      cornerArcs(c, YELLOW, ramp(t, 0.3, 1.6), W, 70 * s, -1, 0.9, s);
      cornerArcs(c, RED, ramp(t, 0.1, 1.4), 0, H - 390 * s, 1, 1.25, s);
      cornerArcs(c, GREEN, ramp(t, 0.4, 1.7), W, H - 300 * s, -1, 1.1, s);
    };

    // The glows stop changing once they have faded in, and they are the costliest thing to
    // draw (blurred strokes), so they are baked once per size and blitted from then on.
    let glowBake: HTMLCanvasElement | null = null;
    const bakeGlows = () => {
      if (layer !== "back") return;
      const bake = document.createElement("canvas");
      bake.width = canvas.width;
      bake.height = canvas.height;
      const bctx = bake.getContext("2d");
      if (bctx) drawGlows(bctx, 99, sceneScale());
      glowBake = bake;
    };
    bakeGlows();
    const onResize = () => {
      resize();
      bakeGlows();
    };
    window.addEventListener("resize", onResize);

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = reduced ? 8 : (now - start) / 1000;
      const narrow = W < 700 || H < 520; // small or short (sideways phone): drop the tiny orbit labels
      // Portrait phones: scale to width (the rings bleed off the sides) and drop the labels.
      const s = sceneScale();
      const ox0 = (W - VW * s) / 2;
      const oy0 = (H - VH * s) / 2;
      const ex = exitRef.current;

      // ══ back layer: nothing here moves on its own once the shutter starts rising ══
      if (layer === "back") {
        if (!ex) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (t > 1.8 && glowBake) ctx.drawImage(glowBake, 0, 0);
          else drawGlows(ctx, t, s);

          ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox0, dpr * oy0);
          stars.forEach((st) => {
            const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + st.phase);
            ctx.globalAlpha = 0.5 * tw * ramp(t, 0.2, 1.2);
            ctx.fillStyle = st.color;
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 0.3 * ramp(t, 0.6, 1.6);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          [[556, 82], [252, 170], [118, 382]].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.moveTo(x - 5, y);
            ctx.lineTo(x + 5, y);
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();
          });

          NODES.forEach((n, i) => {
            const a = ramp(t, n.at, n.at + 0.6);
            if (a <= 0) return;
            const pos = n.orbit ? onOrbit(n.orbit, n.u + t * 0.02) : { x: n.x, y: n.y + Math.sin(t + i) * 3 };
            ctx.globalAlpha = a;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, n.label ? 2.8 : 1.8, 0, Math.PI * 2);
            ctx.fill();
            if (n.label && !narrow) label(n.label, pos.x + 22, pos.y + 4, 0.6 * a, 10);
          });
          ctx.globalAlpha = 1;
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      // ══ front layer: globe, orbits, planets (and their hand-off to the hero globe) ══
      // how far the hand-off has progressed (0 = intro globe, 1 = sitting on the hero globe)
      const m = ex ? easeInOut((now - ex.t0 - MORPH_DELAY_MS) / (MORPH_MS - MORPH_DELAY_MS)) : 0;
      const heroT = ex ? (now - ex.heroT0) / 1000 : 0;
      // the hero globe, in virtual coordinates
      const tcx = ex ? (ex.cx - ox0) / s : CX;
      const tcy = ex ? (ex.cy - oy0) / s : CY;
      const tR = ex ? (ex.size * 0.36) / s : SPHERE_R;
      const gcx = lerp(CX, tcx, m);
      const gcy = lerp(CY, tcy, m);
      const gR = lerp(SPHERE_R, tR, m);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox0, dpr * oy0);

      // ── globe: stays on screen and glides onto the hero globe ────────────
      const globeIn = ramp(t, 0.4, 2.0);
      const introYaw = t * 0.12 + 0.8;
      const heroYaw = heroT * 0.07 + Math.sin(heroT * 0.037) * 0.03;
      const yaw = lerp(introYaw, heroYaw, m);
      const tilt = lerp(-0.35, 0, m);
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < SPHERE_COUNT; i++) {
        const p = sphere[i];
        // each point fades in at its own moment so the globe "assembles"
        const own = clamp01(globeIn * 1.6 - (i / SPHERE_COUNT) * 0.6);
        if (own <= 0) continue;
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const scale = CAMERA / (CAMERA - z2);
        const shimmer = 0.75 + 0.25 * Math.sin(t * 1.4 + p.ph);
        const introAlpha = (0.18 + 0.5 * ((z2 + 1) / 2)) * shimmer;
        const heroAlpha = 0.42 * (0.85 + 0.15 * Math.sin(heroT * 1.6 + p.ph));
        const px = gcx + x1 * gR * scale;
        const py = gcy + y2 * gR * scale;
        ctx.globalAlpha = lerp(introAlpha, heroAlpha, m) * own;
        if (m > 0) {
          ctx.beginPath();
          ctx.arc(px, py, lerp(p.s * 0.95 * scale, p.hs / s, m), 0, Math.PI * 2);
          ctx.fill();
        } else {
          const d = p.s * 0.95 * scale * 2;
          ctx.fillRect(px - d / 2, py - d / 2, d, d);
        }
      }

      // ── orbit rings (drawn in) ────────────────────────────────────────────
      const ring = (o: Orbit, p: number, alpha: number, dashed: boolean) => {
        if (p <= 0) return;
        const len = 2 * Math.PI * Math.sqrt((o.rx * o.rx + o.ry * o.ry) / 2);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        if (dashed) {
          ctx.setLineDash([1.5, 9]);
          ctx.lineWidth = 1.6;
        } else {
          ctx.setLineDash([len, len]);
          ctx.lineDashOffset = len * (1 - p);
        }
        ctx.beginPath();
        ctx.ellipse(o.cx, o.cy, o.rx, o.ry, o.rot, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };
      // The orbits shrink along with the globe and fade, handing over to the hero's own rings.
      const orbitA = (1 - m) * (1 - m);
      if (orbitA > 0.01) {
        ctx.save();
        const k = 1 - 0.55 * m;
        ctx.translate(gcx, gcy);
        ctx.scale(k, k);
        ctx.translate(-CX, -CY);
        ring(ORBIT_A, ramp(t, 0.5, 2.0), 0.75 * orbitA, false);
        ring(ORBIT_B, ramp(t, 0.7, 2.2), 0.55 * orbitA, false);
        ring(ORBIT_C, ramp(t, 0.9, 2.0), 0.28 * ramp(t, 0.9, 2.0) * orbitA, true);
        ctx.restore();
      }

      // The hero globe's rings and satellites (same maths as ParticleGlobe, seen head-on).
      const heroRing = (ri: number, ang: number) => {
        const r = HERO_RINGS[ri];
        const spin = r.spinBase + heroT * r.spinRate;
        const x0 = Math.cos(ang) * r.rad;
        const z0 = Math.sin(ang) * r.rad;
        const y1 = -z0 * Math.sin(r.tilt);
        const z1 = z0 * Math.cos(r.tilt);
        const x2 = x0 * Math.cos(spin) + z1 * Math.sin(spin);
        const z2 = -x0 * Math.sin(spin) + z1 * Math.cos(spin);
        const scale = CAMERA / (CAMERA - z2);
        return { x: gcx + x2 * gR * scale, y: gcy - y1 * gR * scale, scale };
      };
      const ringAlpha = 0.22 * clamp01((m - 0.2) / 0.6);
      if (ringAlpha > 0) {
        ctx.lineWidth = 1 / s;
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = ringAlpha;
        for (let ri = 0; ri < HERO_RINGS.length; ri++) {
          ctx.beginPath();
          for (let a = 0; a <= 128; a++) {
            const q = heroRing(ri, (a / 128) * Math.PI * 2);
            if (a === 0) ctx.moveTo(q.x, q.y);
            else ctx.lineTo(q.x, q.y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // ── planets: ride their orbits, then fly to the hero globe's satellites ─
      const mm = easeInOut(clamp01((m - 0.3) / 0.7));
      PLANETS.forEach((p) => {
        const a = ramp(t, p.at, p.at + 0.7);
        if (a <= 0) return;
        const base = onOrbit(p.orbit, p.u + p.dir * t * 0.035);
        const k = 1 - 0.55 * m;
        let x = gcx + (base.x - CX) * k;
        let y = gcy + (base.y - CY) * k;
        let r = p.r * (0.4 + 0.6 * a);
        // no glow while riding the orbit; the hero globe's soft halo fades in as the planet lands on it
        let haloR = r * 4;
        let haloA = 0;
        let color = hexToRgb(p.color);
        let hi = [255, 255, 255];
        if (mm > 0) {
          const sat = SAT[p.sat];
          const q = heroRing(sat.ring, sat.t + heroT * sat.sp);
          const pulse = 1 + 0.15 * Math.sin(heroT * ((2 * Math.PI) / 3) + sat.pulsePhase);
          const radPx = sat.r * q.scale * (ex ? ex.size / 520 : 1) * pulse;
          x = lerp(x, q.x, mm);
          y = lerp(y, q.y, mm);
          r = lerp(r, Math.max(radPx, 3) / s, mm);
          haloR = lerp(haloR, (radPx * 4) / s, mm);
          haloA = lerp(haloA, 0.4, mm);
          color = mix(p.color, sat.color, mm);
          hi = mix("#ffffff", sat.color, mm);
        }

        if (haloA > 0.01) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, haloR);
          halo.addColorStop(0, rgba(color, haloA));
          halo.addColorStop(1, rgba(color, 0));
          ctx.globalAlpha = a;
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(x, y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }

        const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
        body.addColorStop(0, rgba(hi, 1));
        body.addColorStop(0.3, rgba(color, 1));
        body.addColorStop(1, mm > 0 ? rgba(color, 1) : "#00000099");
        ctx.globalAlpha = a;
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // leader line + label (they fade out as the planet leaves its orbit)
        const labelA = a * (1 - clamp01(m * 3));
        if (labelA > 0.01 && !narrow) {
          ctx.globalAlpha = 0.35 * labelA;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + r + 18, y - 14);
          ctx.lineTo(x + r + 40, y - 14);
          ctx.stroke();
          if (!narrow) label(p.label, x + r + 50, y - 13, 0.9 * labelA, 11);
        }
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, exitRef, layer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full${layer === "front" ? " pointer-events-none" : ""}`}
    />
  );
}
