import { useEffect, useRef } from "react";

// React Bits "Click Spark": a short burst of lines where you click. One full-screen canvas that only draws
// while sparks are alive, and ignores the pointer, so it never gets in the way.

const COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const COUNT = 8;
const DURATION = 480;

type Spark = { x: number; y: number; angle: number; color: string; t0: number };

export default function ClickSpark() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sparks: Spark[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      el.width = window.innerWidth * dpr;
      el.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((s) => now - s.t0 < DURATION);
      for (const s of sparks) {
        const p = (now - s.t0) / DURATION;
        const ease = 1 - Math.pow(1 - p, 3);
        const from = 6 + ease * 22;
        const to = from + 9 * (1 - p);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 1 - p;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x + from * Math.cos(s.angle), s.y + from * Math.sin(s.angle));
        ctx.lineTo(s.x + to * Math.cos(s.angle), s.y + to * Math.sin(s.angle));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      for (let i = 0; i < COUNT; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / COUNT + Math.random() * 0.4, color: COLORS[i % 4], t0: now });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[10001] h-full w-full" />;
}
