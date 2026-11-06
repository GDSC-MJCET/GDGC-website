import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import type { GalleryItem } from "./types";

// An endless, draggable wall of photos seen through a lens: flat in the middle, stretching and swelling toward the
// edges, like the inside of a dome. Every photo is packed into one atlas texture and the grid is drawn by a shader.
// (The same idea as React Bits' paid "Inverted Dome", written here so it needs no licence.)

const TILE = 210; // tile size in CSS px at the centre of the lens
const GAP = 14;
const RADIUS = 0.1; // corner radius as a fraction of the tile
const CURVE = 0.3; // how hard the lens pulls the edges (kept low so people do not look stretched)
const CELL = 256; // atlas cell size in px
const SIDE = 8; // atlas is SIDE x SIDE cells (64 photos)

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uOffset;
uniform float uTile;
uniform float uGap;
uniform float uCurve;
uniform float uRadius;
uniform float uSide;
uniform float uHover;
uniform vec2 uHoverCell;
uniform float uMap[64];
uniform sampler2D uAtlas;
out vec4 outColor;

void main() {
  vec2 p = gl_FragCoord.xy - 0.5 * uRes;
  float hd = 0.5 * length(uRes);
  vec2 q = p / hd;
  float k = 1.0 + uCurve * dot(q, q);
  vec2 world = p / k + uOffset;
  float pitch = uTile + uGap;
  vec2 cell = floor(world / pitch);
  vec2 local = world - cell * pitch - 0.5 * pitch;
  vec2 d = abs(local) - vec2(0.5 * uTile) + vec2(uRadius * uTile);
  float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uRadius * uTile;
  float mask = 1.0 - smoothstep(-1.5 * k, 0.0, dist);
  if (mask <= 0.0) { outColor = vec4(0.0); return; }

  // the wall repeats every 8 x 8 tiles, so it loops seamlessly in every direction
  vec2 w8 = mod(cell, 8.0);
  float idx = uMap[int(w8.y) * 8 + int(w8.x)];
  float row = floor(idx / uSide);
  float col = idx - row * uSide;
  vec2 uv = clamp(local / uTile + 0.5, 0.004, 0.996);
  uv.y = 1.0 - uv.y;
  vec3 color = texture(uAtlas, (vec2(col, row) + uv) / uSide).rgb;

  float hov = step(abs(cell.x - uHoverCell.x) + abs(cell.y - uHoverCell.y), 0.1) * uHover;
  color = mix(color * 0.8, color * 1.1, hov);
  color *= mix(0.3, 1.0, 1.0 - smoothstep(0.7, 1.15, length(q)));
  outColor = vec4(color * mask, mask);
}`;

// which photo sits in each of the 8 x 8 tiles that repeat; every photo appears, a few twice, shuffled so repeats are far apart
const buildMap = (count: number) => {
  let seed = 4242;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const order = Array.from({ length: 64 }, (_, i) => i % Math.max(1, count));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};
const mod = (n: number, m: number) => ((n % m) + m) % m;

type Props = {
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
};

export default function InvertedDome({ items, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpen);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    openRef.current = onOpen;
  });

  useEffect(() => {
    const el = box.current;
    if (!el || !items.length) return;
    const shown = items.slice(0, SIDE * SIDE);
    let disposed = false;
    let dirty = true;
    const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.75) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab";
    el.appendChild(gl.canvas);

    const atlas = document.createElement("canvas");
    atlas.width = atlas.height = CELL * SIDE;
    const ctx = atlas.getContext("2d")!;
    ctx.fillStyle = "#15171a";
    ctx.fillRect(0, 0, atlas.width, atlas.height);
    const texture = new Texture(gl, { image: atlas, generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, flipY: false });

    const map = buildMap(shown.length);
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uRes: { value: [1, 1] },
        uOffset: { value: [0, 0] },
        uTile: { value: TILE },
        uGap: { value: GAP },
        uCurve: { value: CURVE },
        uRadius: { value: RADIUS },
        uMap: { value: map },
        uSide: { value: SIDE },
        uHover: { value: 0 },
        uHoverCell: { value: [1e6, 1e6] },
        uAtlas: { value: texture },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    // photos arrive one by one into their atlas cell, so the wall fills in as they load
    shown.forEach((item, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const cx = (i % SIDE) * CELL;
        const cy = Math.floor(i / SIDE) * CELL;
        const s = Math.max(CELL / img.naturalWidth, CELL / img.naturalHeight);
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        ctx.save();
        ctx.beginPath();
        ctx.rect(cx, cy, CELL, CELL);
        ctx.clip();
        ctx.drawImage(img, cx + (CELL - w) / 2, cy + (CELL - h) / 2, w, h);
        ctx.restore();
        texture.needsUpdate = true;
        dirty = true;
        setReady(true);
      };
      img.src = item.t;
    });

    let W = 1;
    let H = 1;
    const scale = () => (W < 700 ? 0.75 : 1);
    const resize = () => {
      W = el.clientWidth || 1;
      H = el.clientHeight || 1;
      renderer.setSize(W, H);
      // the shader works in device pixels
      program.uniforms.uRes.value = [W * renderer.dpr, H * renderer.dpr];
      program.uniforms.uTile.value = TILE * scale() * renderer.dpr;
      program.uniforms.uGap.value = GAP * scale() * renderer.dpr;
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pos = { x: 0, y: 0 }; // CSS px in grid space
    const vel = { x: 0, y: 0 };
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    let hover: [number, number] | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // screen point (CSS px, y down) to grid cell, using the same lens maths as the shader
    const cellAt = (sx: number, sy: number): [number, number] | null => {
      const tile = TILE * scale();
      const pitch = tile + GAP * scale();
      const px = sx - W / 2;
      const py = H / 2 - sy;
      const hd = 0.5 * Math.hypot(W, H);
      const k = 1 + CURVE * ((px / hd) ** 2 + (py / hd) ** 2);
      const wx = px / k + pos.x;
      const wy = py / k + pos.y;
      const cx = Math.floor(wx / pitch);
      const cy = Math.floor(wy / pitch);
      const lx = wx - cx * pitch - pitch / 2;
      const ly = wy - cy * pitch - pitch / 2;
      return Math.abs(lx) <= tile / 2 && Math.abs(ly) <= tile / 2 ? [cx, cy] : null;
    };
    const itemAt = (c: [number, number]) => shown[map[mod(c[1], 8) * 8 + mod(c[0], 8)]];

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      last = { x: e.clientX, y: e.clientY };
      vel.x = vel.y = 0;
      gl.canvas.setPointerCapture(e.pointerId);
      gl.canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (dragging) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        pos.x -= dx;
        pos.y += dy;
        vel.x = -dx;
        vel.y = dy;
        last = { x: e.clientX, y: e.clientY };
      } else if (e.pointerType === "mouse") {
        hover = cellAt(e.clientX - r.left, e.clientY - r.top);
        gl.canvas.style.cursor = hover ? "pointer" : "grab";
      }
      dirty = true;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      gl.canvas.style.cursor = hover ? "pointer" : "grab";
      if (moved < 6) {
        const r = el.getBoundingClientRect();
        const c = cellAt(e.clientX - r.left, e.clientY - r.top);
        if (c) openRef.current(itemAt(c));
      }
    };
    const onLeave = () => {
      hover = null;
      dirty = true;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pos.x += e.deltaX * 0.6;
      pos.y -= e.deltaY * 0.6;
      dirty = true;
    };
    gl.canvas.addEventListener("pointerdown", onDown);
    gl.canvas.addEventListener("pointermove", onMove);
    gl.canvas.addEventListener("pointerup", onUp);
    gl.canvas.addEventListener("pointercancel", onUp);
    gl.canvas.addEventListener("pointerleave", onLeave);
    gl.canvas.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    let t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      if (document.hidden) return;
      if (!dragging) {
        if (Math.abs(vel.x) > 0.02 || Math.abs(vel.y) > 0.02) {
          pos.x += vel.x;
          pos.y += vel.y;
          vel.x *= 0.93;
          vel.y *= 0.93;
          dirty = true;
        } else if (!reduce && !hover) {
          pos.x += 14 * dt; // a slow drift so it never sits still
          dirty = true;
        }
      }
      if (!dirty) return;
      dirty = false;
      program.uniforms.uOffset.value = [pos.x * renderer.dpr, pos.y * renderer.dpr];
      program.uniforms.uHover.value = hover ? 1 : 0;
      program.uniforms.uHoverCell.value = hover ?? [1e6, 1e6];
      renderer.render({ scene: mesh });
    };
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.canvas.removeEventListener("pointerdown", onDown);
      gl.canvas.removeEventListener("pointermove", onMove);
      gl.canvas.removeEventListener("pointerup", onUp);
      gl.canvas.removeEventListener("pointercancel", onUp);
      gl.canvas.removeEventListener("pointerleave", onLeave);
      gl.canvas.removeEventListener("wheel", onWheel);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [items]);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-[#050506]" role="group" aria-label="Photo wall">
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs tracking-[0.3em] text-white/40 uppercase">
          Loading
        </div>
      )}
    </div>
  );
}
