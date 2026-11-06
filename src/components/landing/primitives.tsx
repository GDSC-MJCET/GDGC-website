import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "../fx/tokens";

export type ShapeKind = "circle" | "square" | "triangle" | "pill";

// Google's four flat primitives, the visual alphabet of the landing page. `fill` is any CSS colour.
export function Shape({ kind, fill, className = "", style }: { kind: ShapeKind; fill: string; className?: string; style?: CSSProperties }) {
  if (kind === "triangle") {
    return (
      <svg aria-hidden viewBox="0 0 100 88" className={`block ${className}`} style={style}>
        <polygon points="50,0 100,88 0,88" style={{ fill, transition: "fill 0.5s" }} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{ background: fill, borderRadius: kind === "square" ? "14%" : "9999px", transition: "background-color 0.5s", ...style }}
    />
  );
}

export function Label({ index, children, className = "" }: { index: string; children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-tech text-[11px] tracking-[0.16em] text-white/50 uppercase ${className}`}>
      <span className="text-white/85">[{index}]</span>
      <span aria-hidden className="h-px w-8 bg-white/25" />
      {children}
    </p>
  );
}

// Headline whose lines slide up out of a mask the first time it scrolls into view.
export function RiseLines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const shown = reduce || immediate || inView;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        // padding + negative margin keep descenders inside the mask without changing the line spacing
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: shown ? 0 : "110%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.1, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
