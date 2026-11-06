import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import GalleryMenu from "../components/gallery/GalleryMenu";
import InvertedDome from "../components/gallery/InvertedDome";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import PhotoGrid from "../components/gallery/PhotoGrid";
import GalleryEditBar from "../components/gallery/GalleryEditBar";
import { removePhotos, replacePhoto } from "../components/gallery/editorApi";
import { flattenManifest, type GalleryManifest } from "../components/gallery/types";
import manifestJson from "../data/gallery.json";

// The gallery: every photo on the inside of a dome. Drag to spin it, click a photo to bring it forward.
// Under `npm run dev`, /gallery?edit swaps the dome for a plain grid with a selector for removing or replacing photos.
const GalleryPage = () => {
  const [params, setParams] = useSearchParams();
  const editing = import.meta.env.DEV && params.has("edit");

  // `edited` holds the list returned by the editor; whenever gallery.json itself changes (a rebuild, or an
  // edit made outside this tab) it is dropped, so the page never keeps showing photos that no longer exist.
  const [edited, setEdited] = useState<GalleryManifest | null>(null);
  const [seenFile, setSeenFile] = useState(manifestJson);
  if (seenFile !== manifestJson) {
    setSeenFile(manifestJson);
    setEdited(null);
  }
  const manifest = edited ?? (manifestJson as GalleryManifest);
  const [eventSlug, setEventSlug] = useState<string | null>(null);
  const events = useMemo(
    () => manifest.events.map((e) => ({ slug: e.slug, title: e.title, count: e.photos.length })),
    [manifest]
  );
  const activeSlug = events.some((e) => e.slug === eventSlug) ? eventSlug : null;
  const items = useMemo(
    () => flattenManifest(manifest).filter((i) => !activeSlug || i.eventSlug === activeSlug),
    [manifest, activeSlug]
  );
  const [open, setOpen] = useState<(typeof items)[number] | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const run = async (work: () => Promise<GalleryManifest>, done: string) => {
    setBusy(true);
    setMessage(null);
    try {
      setEdited(await work());
      setSelected(new Set());
      setMessage(done);
    } catch (err) {
      setMessage(`Failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  // copies the original file paths of the selected photos, one per line
  const onCopy = async () => {
    const lines = items.filter((i) => selected.has(i.id)).map((i) => i.src ?? i.id);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setMessage(`Copied ${lines.length} path${lines.length > 1 ? "s" : ""}`);
    } catch {
      setMessage("Could not copy: the browser blocked clipboard access");
    }
  };

  const onRemove = () => {
    const ids = [...selected];
    const ok = window.confirm(
      `Remove ${ids.length} photo${ids.length > 1 ? "s" : ""} from the gallery?\n\nThe originals are moved to gallery-source/_removed, so nothing is lost.`
    );
    if (ok) run(() => removePhotos(ids), `Removed ${ids.length}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050506] text-white">
      {editing ? (
        <div className="absolute inset-0 overflow-y-auto pt-4">
          <PhotoGrid items={items} selectedIds={selected} onOpen={(i) => toggle(i.id)} />
        </div>
      ) : items.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-white/60">Photos are coming soon.</p>
      ) : (
        <InvertedDome key={activeSlug ?? "all"} items={items} onOpen={setOpen} />
      )}
      {!editing && items.length > 0 && (
        <p className="pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center text-xs tracking-[0.2em] text-white/50 uppercase">
          Drag to explore · click a photo to open
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key={open.id}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center gap-3 bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              src={open.f}
              alt={`Photo from ${open.eventTitle}`}
              className="max-h-[84svh] max-w-full rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.7)] ring-1 ring-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-sm text-white/70">{open.eventTitle}</p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white hover:bg-white/15"
            >
              <X size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <GalleryMenu
        events={events}
        active={activeSlug}
        onSelect={(slug) => {
          setEventSlug(slug);
          setSelected(new Set());
        }}
      />

      {editing && (
        <GalleryEditBar
          count={selected.size}
          busy={busy}
          message={busy ? "Workingâ€¦" : message}
          onRemove={onRemove}
          onCopy={onCopy}
          onReplace={(file) => run(() => replacePhoto([...selected][0], file), "Replaced")}
          onClear={() => setSelected(new Set())}
          onExit={() => {
            setSelected(new Set());
            setMessage(null);
            setParams({}, { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default GalleryPage;
