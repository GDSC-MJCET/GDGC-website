// Draws the hero's honeycomb loop one frame at a time, for scripts/bake-hero.mjs to capture.
// Same cells and photos as the live honeycomb (src/components/landing-cinema/Honeycomb.tsx), but on a fixed
// timetable that repeats exactly, so the video loops without a seam: every cell swaps its photo two or three
// times per loop and ends on the photo it began with, and nothing is mid-fade at the loop point.
import { CELLS, W, H, startPhoto } from "/src/components/landing-cinema/honeycombCells.ts";
import { BARS, INTRO_PHOTOS, barRect } from "/src/components/landing-cinema/mark.ts";
import { seeded } from "/src/components/landing-cinema/story/rand.ts";

const OUT_W = 1280;
const OUT_H = 640;
const FPS = 24;
const LOOP = 12; // seconds
const FADE = 1.1; // seconds, as the live honeycomb's cross-fade
const QUIET_START = 0.4; // no swap begins this soon after the loop point...
const QUIET_END = FADE + 0.2; // ...or this close before it, so frame 0 is a clean still
const MIN_GAP = FADE + 0.5;
const PAD = 1.2; // each photo overlaps its cell's box by this much, as in the live version
const BLEED = 2; // how far past the logo's edge the picture is drawn (the site cuts it to the exact shape)

const canvas = document.getElementById("frame");
canvas.width = OUT_W;
canvas.height = OUT_H;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";
const scale = OUT_W / W;

// each cell's timetable: when it swaps, and to which photo
const n = INTRO_PHOTOS.length;
const plans = CELLS.map((cell) => {
  const rand = seeded(9001 + cell.id * 31);
  const swaps = rand() < 0.5 ? 2 : 3;
  let times = [];
  for (let tries = 0; tries < 200; tries++) {
    times = Array.from({ length: swaps }, () => QUIET_START + rand() * (LOOP - QUIET_START - QUIET_END)).sort((a, b) => a - b);
    if (times.every((t, i) => i === 0 || t - times[i - 1] >= MIN_GAP)) break;
  }
  // photos[k] is what shows after swap k. The last one is the cell's starting photo, which is also what the
  // loop opens on; the others differ from it and from the photo before them, so every swap is a real change.
  const first = startPhoto(cell.id, n);
  const photos = [];
  for (let k = 0; k < swaps - 1; k++) {
    let pick = Math.floor(rand() * n);
    while (pick === first || pick === photos[k - 1]) pick = (pick + 1 + Math.floor(rand() * (n - 1))) % n;
    photos.push(pick);
  }
  photos.push(first);
  return { cell, path: new Path2D(cell.d), times, photos };
});

// The logo's four bars, a little oversized. Only this much of the picture is drawn: the rest would be cut
// away by the site anyway, and leaving it flat makes the video smaller.
const bars = new Path2D();
for (const b of BARS) {
  const bar = new Path2D();
  bar.roundRect(barRect.x - BLEED, barRect.y - BLEED, barRect.width + BLEED * 2, barRect.height + BLEED * 2, barRect.rx + BLEED);
  bars.addPath(bar, new DOMMatrix().translate(b.x, b.y).rotate(b.angle));
}

const easeOut = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 1.8);

function drawCover(img, x, y, w, h) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

let images = [];

function draw(frame) {
  const t = (frame / FPS) % LOOP;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0d0e10";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.clip(bars);
  for (const { cell, path, times, photos } of plans) {
    // the latest swap at or before t (the last one of the previous loop, if none yet)
    let k = times.length - 1;
    for (let i = 0; i < times.length; i++) if (times[i] <= t) k = i;
    const since = times[k] <= t ? t - times[k] : t + LOOP - times[k];
    const before = photos[(k - 1 + photos.length) % photos.length];
    const alpha = easeOut(since / FADE);
    const box = [cell.x - PAD, cell.y - PAD, cell.w + PAD * 2, cell.h + PAD * 2];
    ctx.save();
    ctx.clip(path);
    if (alpha < 1) drawCover(images[before], ...box);
    ctx.globalAlpha = alpha;
    drawCover(images[photos[k]], ...box);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#050506";
  ctx.lineWidth = 0.9;
  ctx.lineJoin = "round";
  for (const { path } of plans) ctx.stroke(path);
  ctx.restore();
}

const load = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });

window.bake = {
  width: OUT_W,
  height: OUT_H,
  fps: FPS,
  frames: FPS * LOOP,
  cells: CELLS.length,
  ready: Promise.all(INTRO_PHOTOS.map(load)).then((loaded) => {
    images = loaded;
  }),
  /** draws frame i and returns it as a PNG data URL */
  frame(i) {
    draw(i);
    return canvas.toDataURL("image/png");
  },
};
