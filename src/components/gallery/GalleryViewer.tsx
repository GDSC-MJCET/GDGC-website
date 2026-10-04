import { useEffect, useRef } from "react";
import { Dialog } from "radix-ui";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "./types";

type Props = {
  /** the photos the viewer can step through (the current filter) */
  list: GalleryItem[];
  /** index into `list`, or -1 when closed */
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export default function GalleryViewer({ list, index, onIndexChange, onClose }: Props) {
  const open = index >= 0 && index < list.length;
  const item = open ? list[index] : null;
  const step = (by: number) => onIndexChange((index + by + list.length) % list.length);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, list.length]);

  // quietly fetch the neighbours so stepping feels instant
  useEffect(() => {
    if (!open) return;
    for (const by of [1, -1]) {
      const n = list[(index + by + list.length) % list.length];
      if (n) new Image().src = n.f;
    }
  }, [open, index, list]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9000] bg-black/85 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[9001] flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8"
          aria-describedby={undefined}
          onTouchStart={(e) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            // swipe left/right to step through the photos
            const s = touchStart.current;
            touchStart.current = null;
            if (!s || list.length < 2) return;
            const dx = e.changedTouches[0].clientX - s.x;
            const dy = e.changedTouches[0].clientY - s.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {item && (
            <>
              <Dialog.Title className="sr-only">Photo {index + 1} of {list.length}</Dialog.Title>
              <img
                key={item.id}
                src={item.f}
                alt={`Photo ${index + 1} of ${list.length}`}
                className="max-h-[84dvh] max-w-full rounded-2xl object-contain"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 24px 80px rgba(0,0,0,0.6)" }}
                draggable={false}
              />
              <span className="text-xs tracking-[0.2em] text-white/40">
                {index + 1} / {list.length}
              </span>
            </>
          )}

          <Dialog.Close
            aria-label="Close"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/15 sm:top-6 sm:right-6"
          >
            <X size={20} />
          </Dialog.Close>
          {list.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => step(-1)}
                className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/15 sm:left-6 sm:flex"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => step(1)}
                className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/15 sm:right-6 sm:flex"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
