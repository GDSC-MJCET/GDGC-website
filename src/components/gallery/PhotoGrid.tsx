import { Check } from "lucide-react";
import type { GalleryItem } from "./types";

type Props = {
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
  /** ids of photos shown as selected (the dev edit mode) */
  selectedIds?: ReadonlySet<string>;
};

// The plain way to browse: every photo, whole, in columns. Easier to scan than the honeycomb, and what phones get.
export default function PhotoGrid({ items, onOpen, selectedIds }: Props) {
  return (
    <ul className="columns-2 gap-3 px-3 pt-3 pb-16 sm:px-5 md:columns-3 lg:columns-4 xl:columns-5 [&>li]:mb-3">
      {items.map((item) => {
        const selected = !!selectedIds?.has(item.id);
        return (
          <li key={item.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => onOpen(item)}
              aria-label={`Open photo from ${item.eventTitle}`}
              className={`group relative block w-full overflow-hidden rounded-xl bg-white/5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-white ${
                selected ? "ring-[3px] ring-white" : "ring-1 ring-white/10 hover:ring-white/40"
              }`}
              style={{ aspectRatio: `${item.w} / ${item.h}` }}
            >
              <img
                src={item.t}
                alt=""
                width={item.w}
                height={item.h}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-8 pb-2.5 text-left text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.eventTitle}
              </span>
              {selected && (
                <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                  <Check size={14} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
