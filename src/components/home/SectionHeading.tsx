import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// Shared heading for the home page sections: a small tracked eyebrow with a coloured dot, then a headline in
// the hero's style whose lines slide up out of a mask the first time it scrolls into view.

const EASE = [0.22, 1, 0.36, 1] as const;

/** A word drawn in outline, like "TOGETHER" in the hero. */
export function Outline({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-transparent"
      style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
    >
      {children}
    </span>
  );
}

/** The small round coloured dot that ends a headline. */
export function Dot({ color = "bg-google-yellow" }: { color?: string }) {
  return <span className={`ml-[0.04em] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline ${color}`} />;
}

type Props = {
  eyebrow: string;
  /** Tailwind background class for the eyebrow dot */
  dot?: string;
  /** one entry per headline line */
  lines: ReactNode[];
  /** indent each line after the first, like the design */
  stagger?: boolean;
  /** smaller headline, for headings that should sit on one line */
  compact?: boolean;
  className?: string;
};

export default function SectionHeading({ eyebrow, dot = "bg-google-yellow", lines, stagger = true, compact = false, className = "" }: Props) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  // the lines start pushed out of their masks, so watch the heading itself, not the lines
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const y = reduce || inView ? 0 : "105%";

  return (
    <div className={className}>
      <motion.p
        className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {eyebrow}
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      </motion.p>
      <h2
        ref={ref}
        className={`mt-4 leading-[0.95] font-black tracking-[-0.03em] text-white ${compact ? "text-[clamp(2rem,3.4vw,3.4rem)]" : "text-[clamp(2.4rem,4.6vw,4.75rem)]"}`}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              style={{ paddingLeft: stagger && i > 0 ? `${0.45 * i}em` : undefined }}
              initial={reduce ? false : { y: "105%" }}
              animate={{ y }}
              transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: EASE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
    </div>
  );
}
