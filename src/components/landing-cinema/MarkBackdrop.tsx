import HoneycombMark from "./Honeycomb";
import { MARK_WIDTH } from "./mark";

// The GDG mark as the hero's backdrop: a honeycomb of event photos whose cells swap slowly. Same size, place and
// cells as the mark the intro settles into.
export default function MarkBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <div className="shrink-0" style={{ width: MARK_WIDTH }}>
        <HoneycombMark mode="calm" />
      </div>
    </div>
  );
}
