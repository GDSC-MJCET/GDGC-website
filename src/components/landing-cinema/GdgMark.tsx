import type { CSSProperties } from "react";
import { BARS, MARK_VIEWBOX, barRect, barTransform } from "./mark";

export default function GdgMark({ className = "", style, title }: { className?: string; style?: CSSProperties; title?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} style={style} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {BARS.map((b) => (
        <rect key={b.id} {...barRect} transform={barTransform(b)} fill={b.color} />
      ))}
    </svg>
  );
}
