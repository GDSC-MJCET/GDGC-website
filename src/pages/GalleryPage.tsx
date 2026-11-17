import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import GalleryMenu from "../components/gallery/GalleryMenu";
import InvertedDome from "../components/gallery/InvertedDome";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  // opens on the newest event; "All events" is still one tap away in the menu
  const [eventSlug, setEventSlug] = useState<string | null>(() => (manifestJson as GalleryManifest).events[0]?.slug ?? null);
  const events = useMemo(
    () => manifest.events.map((e) => ({ slug: e.slug, title: e.title, count: e.photos.length })),
    [manifest]
  );
  const activeSlug = events.some((e) => e.slug === eventSlug) ? eventSlug : null;
  const activeIndex = events.findIndex((e) => e.slug === activeSlug);
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

  // < > on screen (and the arrow keys) step through the events, wrapping round
  const stepEvent = (by: number) => {
    if (events.length < 2) return;
    const next = activeIndex < 0 ? (by > 0 ? 0 : events.length - 1) : (activeIndex + by + events.length) % events.length;
    setEventSlug(events[next].slug);
    setSelected(new Set());
  };
  useEffect(() => {
    if (editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (open || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") stepEvent(1);
      else if (e.key === "ArrowLeft") stepEvent(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
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
        <motion.div key={activeSlug ?? "all"} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <InvertedDome items={items} onOpen={setOpen} />
        </motion.div>
      )}
      {!editing && items.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-3 px-4">
          {events.length > 1 && (
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/15 bg-black/55 p-1 backdrop-blur-md">
              <button
                type="button"
                aria-label="Previous event"
                onClick={() => stepEvent(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <p aria-live="polite" className="min-w-[11rem] px-2 text-center text-sm font-semibold sm:min-w-[16rem]">
                {activeIndex >= 0 ? events[activeIndex].title : "All events"}
                <span className="ml-2 text-xs font-medium text-white/50 tabular-nums">{activeIndex >= 0 ? `${activeIndex + 1} / ${events.length}` : `${items.length} photos`}</span>
              </p>
              <button
                type="button"
                aria-label="Next event"
                onClick={() => stepEvent(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">Drag to explore · click a photo to open</p>
        </div>
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
          message={busy ? "Working…" : message}
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
