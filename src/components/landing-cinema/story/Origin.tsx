import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { clamp01, seeded, smooth } from "./rand";
import { BARS, BAR_LENGTH, BAR_THICKNESS } from "../mark";
import { Dot, Outline } from "../../fx/designSystem";
import { GOOGLE_HEX } from "../../fx/tokens";

const FIRST = 5; // the founding handful
const BIRTH_START = 0.04;
const BIRTH_SPAN = 0.4;
// The picture builds in order: the mark (bar by bar, each streaming in along its length), then each word,
// written left to right. start = when the group begins, spread = how long its sweep takes.
const GROUPS = [
  { start: 0.4, spread: 0.16 },
  { start: 0.58, spread: 0.1 },
  { start: 0.7, spread: 0.1 },
  { start: 0.82, spread: 0.1 },
];
const LAND = 0.06; // how long one dot takes to fly in

const WORDS = [
  { text: "Community", color: GOOGLE_HEX.blue },
  { text: "Learning", color: GOOGLE_HEX.red },
  { text: "Outreach", color: GOOGLE_HEX.green },
];

type Target = { x: number; y: number; color: string; r: number; group: number; order: number };
type Particle = Target & { r0: number; sx: number; sy: number; birth: number; delay: number; ph: number };

// Where every dot ends up for a w x h screen: the GDG mark with the three pillars written beneath it, all on
// one dot grid, so mark and words read as a single picture. Each shape is drawn off-screen and a dot is
// placed on every lit cell of the grid.
function layout(w: number, h: number): Target[] {
  const rand = seeded(2023);
  const narrow = w < 768;
  const targets: Target[] = [];
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return targets;

  // word size: as big as fits (one row on wide screens, one word per line on phones)
  const font = (px: number) => `900 ${px}px Inter, system-ui, sans-serif`;
  let size = narrow ? 80 : 110;
  ctx.font = font(size);
  const gapEm = 0.7;
  const widths = () => WORDS.map((wd) => ctx.measureText(wd.text).width);
  const fit = narrow ? (w * 0.84) / Math.max(...widths()) : (w * 0.86) / (widths().reduce((a, b) => a + b, 0) + gapEm * size * (WORDS.length - 1));
  size = Math.min(size * fit, narrow ? 80 : 110);
  ctx.font = font(size);
  const step = Math.max(4, size * 0.085);

  const sample = (draw: () => void, color: string, group: number, orderOf: (x: number) => number, orderOfY?: (x: number, y: number) => number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    draw();
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        if (data[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 140) {
          targets.push({
            x: x + (rand() - 0.5) * step * 0.2,
            y: y + (rand() - 0.5) * step * 0.2,
            color,
            r: step * 0.36,
            group,
            order: clamp01(orderOfY ? orderOfY(x, y) : orderOf(x)),
          });
        }
      }
    }
  };

  // the mark
  const markW = narrow ? w * 0.74 : Math.min(w * 0.4, 560);
  const k = markW / 200;
  const ox = w / 2 - markW / 2;
  const oy = h * (narrow ? 0.36 : 0.43) - markW / 4;
  BARS.forEach((b, bi) => {
    const a = (b.angle * Math.PI) / 180;
    // how far along its bar a point is, counted from the chevron's point outward; the bars go one after another
    const along = (x: number, y: number) => {
      const u = ((x - ox) / k - b.x) * Math.cos(a) + ((y - oy) / k - b.y) * Math.sin(a);
      return (bi + clamp01((u + BAR_THICKNESS / 2) / (BAR_LENGTH + BAR_THICKNESS))) / BARS.length;
    };
    sample(() => {
      ctx.setTransform(k, 0, 0, k, ox, oy);
      ctx.translate(b.x, b.y);
      ctx.rotate((b.angle * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(-BAR_THICKNESS / 2, -BAR_THICKNESS / 2, BAR_LENGTH + BAR_THICKNESS, BAR_THICKNESS, BAR_THICKNESS / 2);
      ctx.fill();
    }, b.color, 0, () => 0, along);
  });

  // the words
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const ws = widths();
  let x = w / 2 - (ws.reduce((a, b) => a + b, 0) + gapEm * size * (WORDS.length - 1)) / 2;
  WORDS.forEach((wd, i) => {
    const cx = narrow ? w / 2 : x + ws[i] / 2;
    const cy = narrow ? h * (0.6 + i * 0.12) : h * 0.8;
    x += ws[i] + gapEm * size;
    const left = cx - ws[i] / 2;
    sample(() => ctx.fillText(wd.text, cx, cy), wd.color, i + 1, (px) => (px - left) / ws[i]);
  });
  return targets;
}

function makeParticles(targets: Target[]): Particle[] {
  const rand = seeded(7);
  const n = targets.length;
  // the order dots appear in: a random order, except the founding few come first
  const order = targets.map((_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = new Array<number>(n);
  order.forEach((idx, r) => (rank[idx] = r));
  return targets.map((t, i) => {
    const r = rank[i];
    const founder = r < FIRST;
    const ang = rand() * Math.PI * 2;
    const rad = Math.sqrt(rand()) * (founder ? 0.16 : 1);
    return {
      ...t,
      sx: Math.cos(ang) * rad,
      sy: Math.sin(ang) * rad,
      birth: founder ? 0 : BIRTH_START + BIRTH_SPAN * ((r - FIRST) / (n - FIRST)) ** 1.6,
      delay: rand() * 0.02,
      ph: rand() * Math.PI * 2,
      r0: founder ? 3.4 : Math.min(t.r, 2.4),
    };
  });
}

// "Our Pillars": five glowing dots multiply into a restless, noise-driven crowd. Then, in turn, dots break
// away to build one picture: the GDG mark bar by bar, then Community, Learning and Outreach, each written
// left to right. Even once formed, every dot keeps trembling and flickering with noise.
export default function Origin() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const header = useTransform(p, [0, 0.04], [0.4, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const noise = createNoise3D(seeded(11));
    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      particles = makeParticles(layout(w, h));
    };
    build();
    // the words are drawn with the page font, so lay them out again once it has loaded
    document.fonts?.ready.then(build);
    window.addEventListener("resize", build);

    const draw = (now: number) => {
      const prog = reduce ? 1 : p.get();
      const time = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const q of particles) {
        if (prog < q.birth) continue;
        const appear = q.birth === 0 ? 1 : smooth((prog - q.birth) / 0.05);
        const g = GROUPS[q.group];
        const gather = smooth((prog - g.start - q.order * g.spread - q.delay) / LAND);
        // noise: a slow, wide flow while scattered; a fast, fine tremble once in place
        const amp = 30 * (1 - gather) + 1.8 * gather;
        const f = 0.0025 + 0.03 * gather;
        const speed = 0.18 + 0.9 * gather;
        const sx = w / 2 + q.sx * w * 0.47;
        const sy = h / 2 + q.sy * h * 0.42;
        const bx = sx + (q.x - sx) * gather;
        const by = sy + (q.y - sy) * gather;
        const x = bx + noise(bx * f, by * f, time * speed) * amp;
        const y = by + noise(bx * f + 31.7, by * f - 12.3, time * speed) * amp;
        const flicker = noise(q.ph * 10, time * 1.6, 7.1);
        const r = (q.r0 + (q.r - q.r0) * gather) * (0.4 + 0.6 * appear) * (1 + 0.28 * flicker);
        ctx.globalAlpha = appear * Math.min(1, Math.max(0.15, 0.78 + 0.3 * flicker));
        ctx.fillStyle = q.color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.6, r), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, [p, reduce]);

  return (
    <section ref={ref} aria-label="Our pillars" className="relative h-[520vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.h2
          className="absolute inset-x-0 top-[104px] z-10 px-5 text-center text-[clamp(2.25rem,5vw,4.5rem)] leading-none font-black tracking-[-0.035em] text-white"
          style={{ opacity: header }}
        >
          Our <Outline>Pillars</Outline>
          <Dot color="bg-google-yellow" />
        </motion.h2>
        <canvas ref={canvasRef} role="img" aria-label="Dots gathering into the GDG logo and the words Community, Learning and Outreach" className="absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}
