import type { CSSProperties, ReactNode } from "react";

// Shared components for the site's "Bold Dev Energy" visual language: a near-black canvas,
// vivid Google-brand color glows, big geometric display type, and a consistent entrance easing.
// Pulled out of the section components, where each had its own copy.
// Non-component tokens (EASE, clamp sizes, hex values) live in ./tokens so this file can stay
// component-only for React Fast Refresh.

/** A word drawn in outline only, like "TOGETHER" in the home hero. */
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

/** The small round coloured dot used to punctuate eyebrows and headlines. */
export function Dot({ color = "bg-google-yellow", className = "" }: { color?: string; className?: string }) {
  return <span className={`ml-[0.04em] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline ${color} ${className}`} />;
}

const GLOW_COLOR: Record<"blue" | "red" | "yellow" | "green", string> = {
  blue: "var(--google-blue)",
  red: "var(--google-red)",
  yellow: "var(--google-yellow)",
  green: "var(--google-green)",
};

type GlowOrbProps = {
  color?: keyof typeof GLOW_COLOR;
  size?: number;
  opacity?: number;
  blur?: number;
  className?: string;
  style?: CSSProperties;
};

/** The repeated "large blurred circle in a Google brand color" background glow. */
export function GlowOrb({ color = "blue", size = 440, opacity = 0.22, blur = 130, className = "", style }: GlowOrbProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: GLOW_COLOR[color],
        opacity,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    />
  );
}

/** The repeated frosted-glass card surface used across Up Next, Contact, and archive cards. */
export function GlassCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/[0.02] backdrop-blur-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
