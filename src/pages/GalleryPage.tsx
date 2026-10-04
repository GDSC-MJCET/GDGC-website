import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import VoronoiGallery from "../components/gallery/VoronoiGallery";
import GalleryViewer from "../components/gallery/GalleryViewer";
import GalleryMenu from "../components/gallery/GalleryMenu";
import GalleryEditBar from "../components/gallery/GalleryEditBar";
import { removePhotos, replacePhoto } from "../components/gallery/editorApi";
import { flattenManifest, type GalleryManifest } from "../components/gallery/types";
import manifestJson from "../data/gallery.json";

// The gallery takes over the whole page: just the photo mesh and a burger that fades away when idle.
// Under `npm run dev`, /gallery?edit adds a selector for removing or replacing photos.
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
  // a removed-away event falls back to showing everything
  const activeSlug = events.some((e) => e.slug === eventSlug) ? eventSlug : null;
  const items = useMemo(
    () => flattenManifest(manifest).filter((i) => !activeSlug || i.eventSlug === activeSlug),
    [manifest, activeSlug]
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const index = useMemo(() => (openId ? items.findIndex((i) => i.id === openId) : -1), [openId, items]);

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
    <div className="fixed inset-0 z-50 bg-[#0C0E0D]">
      {items.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-white/60">Photos are coming soon.</p>
      ) : (
        <VoronoiGallery
          className="h-full w-full"
          items={items}
          selectedIds={editing ? selected : undefined}
          onOpen={(item) => (editing ? toggle(item.id) : setOpenId(item.id))}
        />
      )}

      <GalleryMenu
        events={events}
        active={activeSlug}
        onSelect={(slug) => {
          setEventSlug(slug);
          setSelected(new Set());
          setOpenId(null);
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

      <GalleryViewer
        list={items}
        index={index}
        onIndexChange={(i) => setOpenId(items[i]?.id ?? null)}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
};

export default GalleryPage;
