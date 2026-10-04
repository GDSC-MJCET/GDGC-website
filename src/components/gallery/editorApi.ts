import type { GalleryManifest } from "./types";

// Client for the dev-only gallery editor (scripts/vite-gallery-editor.mjs). Only works under `npm run dev`.
async function parse(res: Response): Promise<GalleryManifest> {
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? `request failed (${res.status})`);
  return body as GalleryManifest;
}

export async function removePhotos(ids: string[]): Promise<GalleryManifest> {
  return parse(
    await fetch("/__gallery/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
  );
}

export async function replacePhoto(id: string, file: File): Promise<GalleryManifest> {
  return parse(
    await fetch(`/__gallery/replace?id=${encodeURIComponent(id)}&name=${encodeURIComponent(file.name)}`, {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: file,
    })
  );
}
