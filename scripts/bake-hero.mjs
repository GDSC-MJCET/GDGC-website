// Bakes the honeycomb loop that plays behind the home page's hero. Usage: npm run hero
//
// The live honeycomb (71 clipped cells cross-fading photos) repaints all the time, which is too heavy to leave
// running on a phone. So it is drawn here once, frame by frame, and saved as a short video that loops without
// a seam; the site then plays that video cut to the logo's shape. Run this again whenever the photos
// (INTRO_PHOTOS in src/components/landing-cinema/mark.ts) or the cells change.
//
// Needs ffmpeg on the PATH. Writes to public/home/hero/: mark-<width>.mp4 and mark-<width>.webp (the first
// frame, shown before the video starts and instead of it when motion is off).
import { spawn } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "home", "hero");
const SIZES = [1280, 960]; // keep in step with HERO_LOOP_SIZES in mark.ts
const CRF = 29;

mkdirSync(outDir, { recursive: true });

// a bare Vite server (none of the site's plugins) so the bake page can import the site's own TypeScript
const server = await createServer({
  root,
  configFile: false,
  logLevel: "error",
  cacheDir: path.join(root, "node_modules", ".vite-hero-bake"),
  optimizeDeps: { entries: ["scripts/hero-bake/index.html"] },
  server: { port: 4391, strictPort: false },
});
await server.listen();
const origin = server.resolvedUrls.local[0];

let exitCode = 0;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("page error:", e.message));
  await page.goto(new URL("scripts/hero-bake/index.html", origin).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.bake, null, { timeout: 30000 });
  await page.evaluate(() => window.bake.ready);
  const info = await page.evaluate(() => ({ width: window.bake.width, height: window.bake.height, fps: window.bake.fps, frames: window.bake.frames, cells: window.bake.cells }));
  console.log(`Drawing ${info.frames} frames (${info.cells} cells, ${info.width}x${info.height}, ${info.fps}fps)...`);

  // one ffmpeg run, one output per size. Colours are converted and labelled as BT.709 so browsers show them right.
  const even = (v) => Math.round(v / 2) * 2;
  const graph =
    `[0:v]split=${SIZES.length}${SIZES.map((_, i) => `[s${i}]`).join("")};` +
    SIZES.map((w, i) => `[s${i}]scale=${w}:${even((w * info.height) / info.width)}:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p[v${i}]`).join(";");
  const outputs = SIZES.flatMap((w, i) => [
    "-map", `[v${i}]`, "-an",
    "-c:v", "libx264", "-preset", "veryslow", "-crf", String(CRF), "-profile:v", "high",
    "-g", String(info.frames), // one keyframe per loop: it only ever plays from the start
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-movflags", "+faststart",
    path.join(outDir, `mark-${w}.mp4`),
  ]);
  const ffmpeg = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(info.fps), "-c:v", "png", "-i", "pipe:0", "-filter_complex", graph, ...outputs], {
    stdio: ["pipe", "inherit", "inherit"],
  });
  const encoded = new Promise((resolve, reject) => {
    ffmpeg.on("error", (e) => reject(new Error(`could not run ffmpeg (is it installed and on the PATH?): ${e.message}`)));
    ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });
  ffmpeg.stdin.on("error", () => {}); // a failed ffmpeg is reported by `encoded`

  let first;
  for (let i = 0; i < info.frames; i++) {
    const url = await page.evaluate((n) => window.bake.frame(n), i);
    const png = Buffer.from(url.slice(url.indexOf(",") + 1), "base64");
    if (i === 0) first = png;
    if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  }
  ffmpeg.stdin.end();
  await encoded;

  for (const w of SIZES) {
    await sharp(first).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(outDir, `mark-${w}.webp`));
  }

  for (const w of SIZES) {
    const kb = (f) => Math.round(statSync(path.join(outDir, f)).size / 1024);
    console.log(`mark-${w}.mp4  ${kb(`mark-${w}.mp4`)} KB    mark-${w}.webp  ${kb(`mark-${w}.webp`)} KB`);
  }
} catch (e) {
  console.error(e);
  exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
}
process.exit(exitCode);
