import { useEffect, useRef } from "react";

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

type Planet = { label: string; color: string; orbit: Orbit; u: number; dir: number; r: number; at: number };
const PLANETS: Planet[] = [
  { label: "LEARN", color: BLUE, orbit: ORBIT_A, u: -2.32, dir: 1, r: 12, at: 1.0 },
  { label: "BUILD", color: YELLOW, orbit: ORBIT_A, u: -0.74, dir: 1, r: 12, at: 1.15 },
  { label: "CONNECT", color: RED, orbit: ORBIT_B, u: 2.9, dir: -1, r: 13, at: 1.3 },
  { label: "GROW", color: GREEN, orbit: ORBIT_B, u: 0.73, dir: -1, r: 12, at: 1.45 },
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

const SPHERE_COUNT = 1900;
const SPHERE_R = 330;
type SpherePoint = { x: number; y: number; z: number; s: number; ph: number };
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
      ph: rand() * Math.PI * 2,
    };
  });
};

type TextCtx = CanvasRenderingContext2D & { letterSpacing: string };

export default function IntroScene({ reduced }: { reduced: boolean }) {
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // One corner's glow arcs, authored for the top-left and mirrored/scaled for the others.
    const cornerArcs = (color: string, a: number, ox: number, oy: number, sx: number, k: number, s: number) => {
      ctx.setTransform(dpr * s * sx * k, 0, 0, dpr * s * k, dpr * ox, dpr * oy);
      const strokeArc = (path: () => void, width: number, alpha: number, blur: number) => {
        const g = ctx.createLinearGradient(0, 0, 260, 380);
        g.addColorStop(0, color + "00");
        g.addColorStop(0.35, color);
        g.addColorStop(1, color + "00");
        ctx.save();
        ctx.globalAlpha = a * alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.beginPath();
        path();
        ctx.stroke();
        ctx.restore();
      };
      strokeArc(() => { ctx.moveTo(0, 40); ctx.quadraticCurveTo(120, 160, 205, 345); }, 2.2, 0.95, 26);
      strokeArc(() => { ctx.moveTo(0, 70); ctx.quadraticCurveTo(140, 180, 245, 330); }, 1, 0.5, 14);
      strokeArc(() => { ctx.moveTo(0, 8); ctx.quadraticCurveTo(95, 100, 160, 270); }, 4, 0.25, 40);
    };

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

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = reduced ? 8 : (now - start) / 1000;
      const narrow = W < 700;
      // Portrait phones: scale to width (the rings bleed off the sides) and drop the labels.
      const s = narrow ? W / 1000 : Math.min(W / VW, H / VH);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── corner nebulae (screen space) ─────────────────────────────────────
      const glowR = Math.max(W, H) * 0.55;
      const corners: [number, number, string, number][] = [
        [0, 0, BLUE, 0.3],
        [W, 0, YELLOW, 0.2],
        [0, H, RED, 0.38],
        [W, H, GREEN, 0.26],
      ];
      corners.forEach(([x, y, color, strength], i) => {
        const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, glowR * dpr);
        g.addColorStop(0, color + "ff");
        g.addColorStop(0.35, color + "40");
        g.addColorStop(1, color + "00");
        ctx.globalAlpha = strength * ramp(t, 0.1 + i * 0.1, 1.3 + i * 0.1) * 0.95;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      ctx.globalAlpha = 1;

      // ── corner arc streaks ────────────────────────────────────────────────
      cornerArcs(BLUE, ramp(t, 0.2, 1.5), 0, 0, 1, 1, s);
      cornerArcs(YELLOW, ramp(t, 0.3, 1.6), W, 70 * s, -1, 0.9, s);
      cornerArcs(RED, ramp(t, 0.1, 1.4), 0, H - 390 * s, 1, 1.25, s);
      cornerArcs(GREEN, ramp(t, 0.4, 1.7), W, H - 300 * s, -1, 1.1, s);

      // ── composition space ─────────────────────────────────────────────────
      ctx.setTransform(dpr * s, 0, 0, dpr * s, (dpr * (W - VW * s)) / 2, (dpr * (H - VH * s)) / 2);

      // stars + plus marks
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

      // ── globe ─────────────────────────────────────────────────────────────
      const globeIn = ramp(t, 0.4, 2.0);
      const ry = t * 0.12 + 0.8;
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const tilt = -0.35;
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
        const scale = 10 / (10 - z2);
        const shimmer = 0.75 + 0.25 * Math.sin(t * 1.4 + p.ph);
        ctx.globalAlpha = (0.18 + 0.5 * ((z2 + 1) / 2)) * shimmer * own;
        ctx.beginPath();
        ctx.arc(CX + x1 * SPHERE_R * scale, CY + y2 * SPHERE_R * scale, p.s * 0.95 * scale, 0, Math.PI * 2);
        ctx.fill();
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
      ring(ORBIT_A, ramp(t, 0.5, 2.0), 0.75, false);
      ring(ORBIT_B, ramp(t, 0.7, 2.2), 0.55, false);
      ring(ORBIT_C, ramp(t, 0.9, 2.0), 0.28 * ramp(t, 0.9, 2.0), true);

      // ── white nodes ───────────────────────────────────────────────────────
      NODES.forEach((n, i) => {
        const a = ramp(t, n.at, n.at + 0.6);
        if (a <= 0) return;
        const pos = n.orbit ? onOrbit(n.orbit, n.u + t * 0.02) : { x: n.x, y: n.y + Math.sin(t + i) * 3 };
        ctx.globalAlpha = a;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, n.label ? 2.8 : 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (n.label && !narrow) label(n.label, pos.x + 22, pos.y + 4, 0.6 * a, 10);
      });

      // ── planets ───────────────────────────────────────────────────────────
      PLANETS.forEach((p) => {
        const a = ramp(t, p.at, p.at + 0.7);
        if (a <= 0) return;
        const pos = onOrbit(p.orbit, p.u + p.dir * t * 0.035);
        const pop = 0.4 + 0.6 * a;
        const r = p.r * pop;

        const halo = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 5);
        halo.addColorStop(0, p.color + "bb");
        halo.addColorStop(1, p.color + "00");
        ctx.globalAlpha = a * (0.8 + 0.2 * Math.sin(t * 2 + p.u));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        const body = ctx.createRadialGradient(pos.x - r * 0.35, pos.y - r * 0.4, r * 0.1, pos.x, pos.y, r);
        body.addColorStop(0, "#ffffff");
        body.addColorStop(0.3, p.color);
        body.addColorStop(1, "#00000099");
        ctx.globalAlpha = a;
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fill();

        // leader line + label
        ctx.globalAlpha = 0.35 * a;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x + r + 18, pos.y - 14);
        ctx.lineTo(pos.x + r + 40, pos.y - 14);
        ctx.stroke();
        if (!narrow) label(p.label, pos.x + r + 50, pos.y - 13, 0.9 * a, 11);
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
