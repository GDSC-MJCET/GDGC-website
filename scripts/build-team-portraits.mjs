// Makes same-size, same-framing copies of the governing body's cut-out portraits, so every head is the same
// size and sits at the same height whatever the original photo's crop.
//
//   public/gb-267/<name>.png  ->  public/gb-267/n/<name>.webp   (760 x 660, transparent)
//
// For each person: `top` and `chin` are where the top of the head and the chin sit, as a fraction of the
// original's height; `cx` is the centre of the face as a fraction of its width. Add a row for a new member
// (measure in any image editor) and run:  node scripts/build-team-portraits.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve(import.meta.dirname, "..", "public", "gb-267");
const W = 760;
const H = 660;
const HEAD = 264; // top of head to chin, in output pixels
const HEAD_TOP = 60;

const PEOPLE = {
  "afeef-uddin": { top: 0.12, chin: 0.38, cx: 0.48 },
  "afra-ahmed": { top: 0.085, chin: 0.35, cx: 0.49 },
  "afzal-hashmi": { top: 0.1, chin: 0.49, cx: 0.48 },
  "ayaan-tabrez": { top: 0.06, chin: 0.305, cx: 0.44 },
  "ibrahim-wajid": { top: 0.03, chin: 0.4, cx: 0.56 },
  "linra-khan": { top: 0.08, chin: 0.36, cx: 0.55 },
  "liyaqat-ahmed": { top: 0.07, chin: 0.4, cx: 0.45 },
  "misbah-hussien": { top: 0.12, chin: 0.38, cx: 0.52 },
  "moid-abdul": { top: 0.06, chin: 0.4, cx: 0.43 },
  "rehmath-unnisa": { top: 0.1, chin: 0.325, cx: 0.59 },
};

await mkdir(path.join(DIR, "n"), { recursive: true });
for (const [name, p] of Object.entries(PEOPLE)) {
  const src = path.join(DIR, `${name}.png`);
  const meta = await sharp(src).metadata();
  const scale = HEAD / ((p.chin - p.top) * meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const left = Math.round(W / 2 - p.cx * w);
  const top = Math.round(HEAD_TOP - p.top * h);
  const scaled = await sharp(src).resize(w, h).png().toBuffer();
  // the part of the scaled picture that lands inside the canvas
  const sx = Math.max(0, -left);
  const sy = Math.max(0, -top);
  const cw = Math.min(w - sx, W - Math.max(0, left));
  const ch = Math.min(h - sy, H - Math.max(0, top));
  const piece = await sharp(scaled).extract({ left: sx, top: sy, width: cw, height: ch }).toBuffer();
  const out = path.join(DIR, "n", `${name}.webp`);
  const info = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: piece, left: Math.max(0, left), top: Math.max(0, top) }])
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(out);
  const short = top + h < H ? `  (!) picture ends ${H - (top + h)}px above the bottom` : "";
  console.log(`${name.padEnd(16)} scale ${scale.toFixed(2)}  ${(info.size / 1024).toFixed(0)} KB${short}`);
}
