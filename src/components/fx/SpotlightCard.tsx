import { useRef, type HTMLAttributes, type ReactNode } from "react";

// React Bits "Spotlight Card": a soft light that follows the pointer across the card.
// Mouse only (touch has nothing to hover), and it costs nothing when the pointer is elsewhere.

export default function SpotlightCard({
  children,
  className = "",
  color = "rgba(255,255,255,0.12)",
  ...rest
}: { children: ReactNode; color?: string } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      {...rest}
      className={`group/spot relative overflow-hidden ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(260px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 70%)` }}
      />
      {children}
    </div>
  );
}
