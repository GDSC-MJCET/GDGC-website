// Dev-only API behind the gallery's edit mode (open /gallery?edit while `npm run dev` is running).
// It is a Vite plugin with `apply: "serve"`, so it does not exist in a production build, and it only answers
// requests from this machine.
//
//   POST /__gallery/remove            { ids: ["event-slug/3", ...] }
//        parks the originals in gallery-source/_removed/ (nothing is deleted), drops the generated copies
//        and removes the photos from src/data/gallery.json. Their originals are also added to
//        scripts/gallery-excluded.json, which `npm run gallery` honours, so they cannot come back.
//   POST /__gallery/replace?id=...&name=photo.jpg      (raw image bytes as the body)
//        swaps one photo for the uploaded image, keeping its place in the mesh
//
// Both reply with the updated manifest. Afterwards `npm run gallery` still gives the same result, because
// the originals in gallery-source/ were moved or replaced to match.
import { promises as fs } from "node:fs";
import path from "node:path";
import { MANIFEST, OUT, REMOVED, ROOT, SRC, addExcluded, exists, isImage, processPhoto } from "./gallery-lib.mjs";

const MAX_UPLOAD = 60 * 1024 * 1024;
const LOCAL = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

const readManifest = async () => JSON.parse(await fs.readFile(MANIFEST, "utf8"));
const writeManifest = (m) => fs.writeFile(MANIFEST, JSON.stringify(m, null, 2) + "\n");

// "/gallery/slug/t/3.webp?v=123" -> absolute file path inside public/gallery (or null if it would escape it)
const publicFile = (url) => {
  const p = path.join(ROOT, "public", url.split("?")[0]);
  return p.startsWith(OUT + path.sep) ? p : null;
};
const inside = (root, p) => path.resolve(p).startsWith(root + path.sep);

function findPhoto(manifest, id) {
  for (const ev of manifest.events) {
    const photo = ev.photos.find((p) => p.id === id);
    if (photo) return { ev, photo };
  }
  return null;
}

// move a file into gallery-source/_removed/ under the same relative path (never overwriting what is there)
async function park(srcRel) {
  const from = path.join(SRC, srcRel);
  if (!inside(SRC, from) || !(await exists(from))) return;
  let to = path.join(REMOVED, srcRel);
  if (await exists(to)) {
    const { dir, name, ext } = path.parse(to);
    to = path.join(dir, `${name}-${Date.now()}${ext}`);
  }
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
}

const readBody = (req, limit) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("upload too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

async function remove(ids) {
  const manifest = await readManifest();
  const gone = [];
  for (const id of ids) {
    const hit = findPhoto(manifest, id);
    if (!hit) continue;
    const { ev, photo } = hit;
    if (photo.src) {
      gone.push(photo.src);
      await park(photo.src);
    }
    for (const url of [photo.t, photo.f]) {
      const file = publicFile(url);
      if (file) await fs.rm(file, { force: true });
    }
    ev.photos = ev.photos.filter((p) => p.id !== id);
  }
  manifest.events = manifest.events.filter((ev) => ev.photos.length > 0);
  await addExcluded(gone);
  await writeManifest(manifest);
  return manifest;
}

async function replace(id, name, bytes) {
  const manifest = await readManifest();
  const hit = findPhoto(manifest, id);
  if (!hit) throw new Error(`no photo "${id}"`);
  const { photo } = hit;
  if (!photo.src) throw new Error("this photo has no recorded original: run `npm run gallery` once, then try again");

  // the new original takes the old one's file name (so ordering is unchanged); the old one is parked
  const { dir, name: stem } = path.parse(photo.src);
  const ext = path.extname(name).toLowerCase();
  const newRel = (dir === "." ? "" : dir + "/") + stem + ext;
  await park(photo.src);
  const target = path.join(SRC, newRel);
  if (!inside(SRC, target)) throw new Error("bad path");
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, bytes);

  const thumb = publicFile(photo.t);
  const full = publicFile(photo.f);
  if (!thumb || !full) throw new Error("bad generated path");
  const { w, h } = await processPhoto(target, thumb, full);
  const v = Date.now(); // new query string so the browser does not show the cached old picture
  photo.w = w;
  photo.h = h;
  photo.src = newRel;
  photo.t = `${photo.t.split("?")[0]}?v=${v}`;
  photo.f = `${photo.f.split("?")[0]}?v=${v}`;
  await writeManifest(manifest);
  return manifest;
}

export default function galleryEditor() {
  return {
    name: "gdgc-gallery-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__gallery", async (req, res) => {
        try {
          if (!LOCAL.has(req.socket.remoteAddress ?? "")) return send(res, 403, { error: "local only" });
          if (req.method !== "POST") return send(res, 405, { error: "POST only" });
          const url = new URL(req.url ?? "/", "http://localhost");
          if (url.pathname === "/remove") {
            const { ids } = JSON.parse((await readBody(req, 1024 * 1024)).toString("utf8"));
            if (!Array.isArray(ids) || !ids.every((i) => typeof i === "string")) return send(res, 400, { error: "ids" });
            return send(res, 200, await remove(ids));
          }
          if (url.pathname === "/replace") {
            const id = url.searchParams.get("id") ?? "";
            const name = url.searchParams.get("name") ?? "";
            if (!isImage(name)) return send(res, 400, { error: "that is not an image file" });
            return send(res, 200, await replace(id, name, await readBody(req, MAX_UPLOAD)));
          }
          return send(res, 404, { error: "unknown route" });
        } catch (err) {
          console.error("[gallery-editor]", err);
          return send(res, 500, { error: String(err instanceof Error ? err.message : err) });
        }
      });
    },
  };
}
