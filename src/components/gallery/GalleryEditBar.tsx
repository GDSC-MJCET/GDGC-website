import { useRef } from "react";
import { ClipboardCopy, ImagePlus, Trash2, X } from "lucide-react";

type Props = {
  count: number;
  busy: boolean;
  message: string | null;
  onRemove: () => void;
  onCopy: () => void;
  onReplace: (file: File) => void;
  onClear: () => void;
  onExit: () => void;
};

// Toolbar for the local edit mode (/gallery?edit under `npm run dev`).
export default function GalleryEditBar({ count, busy, message, onRemove, onCopy, onReplace, onClear, onExit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const btn =
    "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[9100] flex flex-col items-center gap-2 px-4">
      {message && (
        <p className="pointer-events-auto rounded-full bg-black/80 px-4 py-2 text-xs text-white/80 backdrop-blur-md">
          {message}
        </p>
      )}
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-black/75 p-2 backdrop-blur-md">
        <span className="px-3 text-sm text-white/70">
          {count === 0 ? "Click photos to select them" : `${count} selected`}
        </span>
        <button
          type="button"
          disabled={busy || count !== 1}
          title={count === 1 ? "Replace this photo with an image from your computer" : "Select exactly one photo to replace it"}
          onClick={() => fileRef.current?.click()}
          className={`${btn} bg-white/10 text-white hover:bg-white/20`}
        >
          <ImagePlus size={16} /> Replace
        </button>
        <button
          type="button"
          disabled={busy || count === 0}
          title="Copy the file paths of the selected photos"
          onClick={onCopy}
          className={`${btn} bg-white/10 text-white hover:bg-white/20`}
        >
          <ClipboardCopy size={16} /> Copy path{count > 1 ? "s" : ""}
        </button>
        <button
          type="button"
          disabled={busy || count === 0}
          onClick={onRemove}
          className={`${btn} bg-[#EA4335] text-white hover:bg-[#d93a2d]`}
        >
          <Trash2 size={16} /> Remove{count > 1 ? ` ${count}` : ""}
        </button>
        <button
          type="button"
          disabled={busy || count === 0}
          onClick={onClear}
          className={`${btn} text-white/70 hover:text-white`}
        >
          Clear
        </button>
        <button type="button" onClick={onExit} className={`${btn} text-white/70 hover:text-white`}>
          <X size={16} /> Done
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onReplace(file);
          }}
        />
      </div>
    </div>
  );
}
