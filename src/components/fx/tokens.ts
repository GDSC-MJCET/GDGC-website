// Non-component design tokens shared across the site (kept out of designSystem.tsx so that file can
// stay component-only for React Fast Refresh).

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline clamp sizes shared by every big display heading on the site. */
export const HEADLINE_CLAMP = "text-[clamp(2.4rem,4.6vw,4.75rem)]";
export const HEADLINE_CLAMP_COMPACT = "text-[clamp(2rem,3.4vw,3.4rem)]";

/** Single source of truth for the Google brand hex values (mirrors index.css's --google-* vars),
 * for the places that need an actual hex/CSS-color value rather than a Tailwind class — three.js
 * material colors, SVG stroke/fill, etc. */
export const GOOGLE_HEX = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
} as const;
