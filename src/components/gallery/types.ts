// Shape of src/data/gallery.json, written by scripts/build-gallery.mjs
export type GalleryPhoto = {
  id: string;
  w: number;
  h: number;
  /** small copy used for the mesh cells */
  t: string;
  /** larger copy used by the viewer */
  f: string;
  /** the original file, relative to gallery-source/ (used by the dev-only editor) */
  src?: string;
};

export type GalleryEvent = {
  slug: string;
  title: string;
  /** "YYYY-MM" or "YYYY-MM-DD" taken from the folder name, when it has one */
  date: string | null;
  color: string;
  photos: GalleryPhoto[];
};

export type GalleryManifest = { events: GalleryEvent[] };

/** One photo with its event details attached, as the mesh and the viewer use it */
export type GalleryItem = GalleryPhoto & {
  eventSlug: string;
  eventTitle: string;
  eventDate: string | null;
  color: string;
};

export const flattenManifest = (m: GalleryManifest): GalleryItem[] =>
  m.events.flatMap((e) =>
    e.photos.map((p) => ({
      ...p,
      eventSlug: e.slug,
      eventTitle: e.title,
      eventDate: e.date,
      color: e.color,
    }))
  );
