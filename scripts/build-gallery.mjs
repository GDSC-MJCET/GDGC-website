// Builds the gallery from raw event photos.
//
//   gallery-source/<Event Name>/*.jpg        (optionally "2025-03_Event Name" to set the date and ordering)
//
// For every image it writes a small thumbnail (used for the mesh cells) and a larger copy (used by the
// viewer) to public/gallery/<event-slug>/{t,f}/<n>.webp, and a manifest to src/data/gallery.json.
// Anything that is not an image (videos, documents, ...) is ignored, and so is anything under a folder
// or file whose name starts with "_" (that is where the gallery editor parks photos you removed).
// HEIC (iPhone) photos are converted with heic-convert.
//
//   npm run gallery
import { promises as fs } from "node:fs";
import path from "node:path";
import { ACCENTS, MANIFEST, OUT, SRC, exists, isImage, processPhoto, readExcluded } from "./gallery-lib.mjs";

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "event";

// "2025-03_Antigravity Workshop" -> { date: "2025-03", title: "Antigravity Workshop" }
function parseFolder(name) {
  const m = name.match(/^(\d{4}-\d{2}(?:-\d{2})?)[_\s-]+(.+)$/);
  return m ? { date: m[1], title: m[2].trim() } : { date: null, title: name.trim() };
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

async function main() {
  if (!(await exists(SRC))) {
    console.log(`No "gallery-source" folder found. Create one with a sub-folder per event, e.g.
  gallery-source/Antigravity Workshop/photo-1.jpg
then run this again.`);
    return;
  }

  // group image files by their top-level folder (files directly in gallery-source go to "Gallery")
  const excluded = await readExcluded(); // photos removed in the gallery editor (scripts/gallery-excluded.json)
  const groups = new Map();
  let skipped = 0;
  let dropped = 0;
  for await (const file of walk(SRC)) {
    if (!isImage(file)) {
      skipped++;
      continue;
    }
    const rel = path.relative(SRC, file).split(path.sep);
    if (excluded.has(rel.join("/"))) {
      dropped++;
      continue;
    }
    const folder = rel.length > 1 ? rel[0] : "Gallery";
    if (!groups.has(folder)) groups.set(folder, []);
    groups.get(folder).push(file);
  }

  const events = [...groups.entries()].map(([folder, files]) => ({ folder, files, ...parseFolder(folder) }));
  // newest dated events first, undated ones after, alphabetical within each
  events.sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : a.date ? -1 : b.date ? 1 : naturalSort(a.title, b.title)));

  await fs.rm(OUT, { recursive: true, force: true });
  const manifest = { events: [] };
  const usedSlugs = new Set();
  let total = 0;
  let failed = 0;

  for (const [ei, ev] of events.entries()) {
    let slug = slugify(ev.title);
    for (let i = 2; usedSlugs.has(slug); i++) slug = `${slugify(ev.title)}-${i}`;
    usedSlugs.add(slug);

    const dirT = path.join(OUT, slug, "t");
    const dirF = path.join(OUT, slug, "f");
    await fs.mkdir(dirT, { recursive: true });
    await fs.mkdir(dirF, { recursive: true });

    const files = ev.files.sort((a, b) => naturalSort(path.basename(a), path.basename(b)));
    const photos = [];
    for (const file of files) {
      const n = photos.length + 1;
      try {
        const { w, h } = await processPhoto(file, path.join(dirT, `${n}.webp`), path.join(dirF, `${n}.webp`));
        photos.push({
          id: `${slug}/${n}`,
          w,
          h,
          t: `/gallery/${slug}/t/${n}.webp`,
          f: `/gallery/${slug}/f/${n}.webp`,
          // where the original lives, so the gallery editor can park or swap it
          src: path.relative(SRC, file).split(path.sep).join("/"),
        });
      } catch (err) {
        failed++;
        console.warn(`  skipped ${path.relative(SRC, file)}: ${err.message}`);
      }
    }
    total += photos.length;
    manifest.events.push({
      slug,
      title: ev.title,
      date: ev.date,
      color: ACCENTS[ei % ACCENTS.length],
      photos,
    });
    console.log(`${ev.title}: ${photos.length} photos`);
  }

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\nDone: ${total} photos in ${manifest.events.length} events` +
      (skipped ? `, ${skipped} non-image files ignored` : "") +
      (dropped ? `, ${dropped} excluded` : "") +
      (failed ? `, ${failed} images failed` : "") +
      `.\nManifest: ${path.relative(process.cwd(), MANIFEST)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
