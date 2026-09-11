import React, { useEffect, useRef } from "react";

// Satellite colors match --google-blue/red/yellow/green in src/index.css
const SAT = [
  { color: "#4285F4", ring: 0, t: 0.2, r: 7, sp: 0.16, pulsePhase: 0 },
  { color: "#EA4335", ring: 1, t: 1.6, r: 8, sp: 0.13, pulsePhase: 1.5 },
  { color: "#FBBC05", ring: 0, t: 3.4, r: 7, sp: 0.16, pulsePhase: 3 },
  { color: "#34A853", ring: 1, t: 4.9, r: 8, sp: 0.13, pulsePhase: 4.5 },
];

// World units: sphere radius is 1. Camera sits this many units back along
// the rotated Z axis, so points nearer the viewer (z -> +1) project larger
// and points on the far side (z -> -1) project smaller/closer to center.
// That foreshortening is what naturally clusters points at the silhouette —
// no artificial brightness/opacity gradient is used to fake it.
const CAMERA_DISTANCE = 10;

export default function ParticleGlobe({ className = "" }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 2600;
    const pts = [];
    for (let i = 0; i < COUNT; i++) {
      const u = (i + 0.5) / COUNT;
      const phi = Math.acos(1 - 2 * u);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const j = 0.02;
      pts.push({
        x: Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * j,
        y: Math.cos(phi) + (Math.random() - 0.5) * j,
        z: Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * j,
        s: 0.7 + Math.random() * 0.7,
        ph: Math.random() * Math.PI * 2,
        shimmerSpeed: 1.2 + Math.random() * 0.8,
        jx: Math.random() * Math.PI * 2,
        jy: Math.random() * Math.PI * 2,
        jitterSpeed: 0.3 + Math.random() * 0.3,
      });
    }

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const t0 = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now) => {
      const time = (now - t0) / 1000;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;

      // Particle/ring color flips with the theme (checked every frame — cheap)
      // so the globe stays visible against a light background instead of
      // rendering invisible white-on-white.
      const isDark = document.documentElement.classList.contains("dark");
      const particleRGB = isDark ? "255,255,255" : "17,17,17";
      const ringStroke = isDark ? "rgba(255,255,255,0.22)" : "rgba(17,17,17,0.22)";

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;

      // Base linear rate plus a slow (~170s period), low-amplitude wobble so
      // the rotation reads as organic rather than a perfectly metronomic spin.
      const spin = reduce ? 0 : time * 0.07 + Math.sin(time * 0.037) * 0.03;
      const yaw = spin + mx * 0.18;
      const pit = -my * 0.14;
      const cy1 = Math.cos(yaw);
      const sy1 = Math.sin(yaw);
      const cp = Math.cos(pit);
      const sp = Math.sin(pit);

      const rot = (x, y, z) => {
        const x1 = x * cy1 + z * sy1;
        const z1 = -x * sy1 + z * cy1;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        return [x1, y2, z2];
      };

      // Real perspective projection: screen position scales with depth, so
      // foreshortening — not a manual gradient — creates the dense silhouette
      // ring and sparse center.
      const project = (x, y, z) => {
        const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE - z);
        return [cx + x * R * scale, cy - y * R * scale, scale];
      };

      // All points are drawn every frame, near and far hemisphere alike —
      // no back-face culling — so the far side shows through the near side.
      for (const p of pts) {
        // Tiny per-point positional drift (texture, not displacement enough
        // to break the sphere's silhouette) — skipped under reduced motion.
        const dx = reduce ? 0 : Math.sin(time * p.jitterSpeed + p.jx) * 0.01;
        const dy = reduce ? 0 : Math.cos(time * p.jitterSpeed * 0.8 + p.jy) * 0.01;
        const [rx, ry, rz] = rot(p.x + dx, p.y + dy, p.z);
        const [px, py] = project(rx, ry, rz);
        // Per-point noise flicker only — not tied to viewing angle or depth.
        // Phase AND speed vary per point so the sphere shimmers organically
        // instead of pulsing as one unit.
        const shimmer = reduce ? 0 : 0.15 * Math.sin(time * p.shimmerSpeed + p.ph);
        const alpha = 0.42 * (0.85 + shimmer);
        ctx.fillStyle = `rgba(${particleRGB},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Radii are bounded by how far CAMERA_DISTANCE pushes near-side
      // perspective magnification — too large and the ring's screen extent
      // exceeds the canvas's own pixel bounds and gets clipped at the edge
      // during some rotation phases (not an overlap/z-index issue).
      const rings = [
        { tilt: 0.5, spin: (reduce ? 0 : time * 0.11) + 0.4, rad: 1.15 },
        { tilt: -1.15, spin: (reduce ? 0 : -time * 0.08) + 1.2, rad: 1.22 },
      ];
      const ringPoint = (ri, ang) => {
        const r = rings[ri] ?? rings[0];
        const x0 = Math.cos(ang) * r.rad;
        const z0 = Math.sin(ang) * r.rad;
        const y1 = -z0 * Math.sin(r.tilt);
        const z1 = z0 * Math.cos(r.tilt);
        const x2 = x0 * Math.cos(r.spin) + z1 * Math.sin(r.spin);
        const z2 = -x0 * Math.sin(r.spin) + z1 * Math.cos(r.spin);
        return rot(x2, y1, z2);
      };

      ctx.lineWidth = 1;
      for (let ri = 0; ri < rings.length; ri++) {
        ctx.strokeStyle = ringStroke;
        ctx.beginPath();
        for (let a = 0; a <= 128; a++) {
          const [x, y, z] = ringPoint(ri, (a / 128) * Math.PI * 2);
          const [px, py] = project(x, y, z);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      for (const s of SAT) {
        const ang = s.t + (reduce ? 0 : time * s.sp);
        const [x, y, z] = ringPoint(s.ring, ang);
        const [px, py, scale] = project(x, y, z);
        // Slow, soft pulse (~3s period, desynced per satellite) so the
        // orbiting dots read as alive nodes rather than static decoration.
        const pulse = reduce ? 1 : 1 + 0.15 * Math.sin(time * ((2 * Math.PI) / 3) + s.pulsePhase);
        const rad = s.r * scale * (Math.min(w, h) / 520) * pulse;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad * 4);
        g.addColorStop(0, `${s.color}66`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(rad, 3), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="space-y-1 text-center text-[10px] leading-[1.5] tracking-[0.22em] text-foreground/55 sm:text-[11px]">
          <div>IDEAS</div>
          <div>PEOPLE</div>
          <div>TECHNOLOGY</div>
          <div>IMPACT</div>
        </div>
      </div>
    </div>
  );
}
