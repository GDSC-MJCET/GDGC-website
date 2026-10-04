// Shared by scripts/build-gallery.mjs and the dev-only gallery editor (scripts/vite-gallery-editor.mjs).
import { promises as fs } from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const SRC = path.join(ROOT, "gallery-source");
export const REMOVED = path.join(SRC, "_removed"); // originals taken out of the gallery are parked here, never deleted
export const OUT = path.join(ROOT, "public", "gallery");
export const MANIFEST = path.join(ROOT, "src", "data", "gallery.json");
// Originals (paths relative to gallery-source/) that must never appear in the gallery. It is committed, so a
// removed photo stays removed even if its original reappears in gallery-source (e.g. from re-extracting a zip).
export const EXCLUDED_FILE = path.join(ROOT, "scripts", "gallery-excluded.json");

export const THUMB = 480; // long edge, px
export const FULL = 1600;
export const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".avif", ".tif", ".tiff"]);
// Google palette, cycled across events (matches --google-* in src/index.css)
export const ACCENTS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const norm = (p) => p.replace(/\\/g, "/").replace(/^\/+/, "");

export async function readExcluded() {
  try {
    const list = JSON.parse(await fs.readFile(EXCLUDED_FILE, "utf8"));
    return new Set((Array.isArray(list.excluded) ? list.excluded : []).map(norm));
  } catch {
    return new Set();
  }
}

export async function addExcluded(paths) {
  const set = await readExcluded();
  for (const p of paths) if (p) set.add(norm(p));
  await fs.writeFile(EXCLUDED_FILE, JSON.stringify({ excluded: [...set].sort() }, null, 2) + "\n");
}

export const isImage = (file) => IMAGE_EXT.has(path.extname(file).toLowerCase());

export async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// sharp's prebuilt binaries cannot decode iPhone HEIC (no HEVC decoder), so those go through heic-convert first.
// (sharp and heic-convert are dev-only native/heavy packages, so they are imported lazily: vite.config.js pulls
// this file in on every build, and a production build must not need them just to load the config.)
async function openImage(input) {
  const { default: sharp } = await import("sharp");
  if (typeof input === "string" && /\.hei[cf]$/i.test(input)) {
    const { default: convert } = await import("heic-convert");
    const jpeg = await convert({ buffer: await fs.readFile(input), format: "JPEG", quality: 0.92 });
    return sharp(Buffer.from(jpeg), { failOn: "none" });
  }
  return sharp(input, { failOn: "none" });
}

// Writes the viewer copy to `fullPath` and the mesh thumbnail to `thumbPath`; returns the size of the viewer copy.
export async function processPhoto(file, thumbPath, fullPath) {
  const input = (await openImage(file)).rotate(); // honour EXIF orientation
  const full = await input
    .clone()
    .resize({ width: FULL, height: FULL, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(fullPath);
  await input
    .clone()
    .resize({ width: THUMB, height: THUMB, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(thumbPath);
  return { w: full.width, h: full.height };
}
