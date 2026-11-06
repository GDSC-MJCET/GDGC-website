import { GOOGLE_HEX } from "../fx/tokens";

// The GDG "< >" mark as four rounded bars in a 200x100 box: each bar starts at its chevron's point and runs
// out at an angle. Drawn as rotated rounded rects so they can double as clip paths.
export const MARK_VIEWBOX = "0 0 200 100";
export const BAR_LENGTH = 62;
export const BAR_THICKNESS = 27;

// rendered width of the mark when it sits behind the hero (and where the intro settles)
export const MARK_WIDTH = "max(min(96vw, 1400px), 100svh)";

export type Bar = { id: string; color: string; x: number; y: number; angle: number };

export const BARS: Bar[] = [
  { id: "red", color: GOOGLE_HEX.red, x: 22, y: 50, angle: -28 },
  { id: "blue", color: GOOGLE_HEX.blue, x: 22, y: 50, angle: 28 },
  { id: "green", color: GOOGLE_HEX.green, x: 178, y: 50, angle: 208 },
  { id: "yellow", color: GOOGLE_HEX.yellow, x: 178, y: 50, angle: 152 },
];

export const barRect = {
  x: -BAR_THICKNESS / 2,
  y: -BAR_THICKNESS / 2,
  width: BAR_LENGTH + BAR_THICKNESS,
  height: BAR_THICKNESS,
  rx: BAR_THICKNESS / 2,
};

export const barTransform = (b: Bar) => `translate(${b.x} ${b.y}) rotate(${b.angle})`;

// Photos the intro (and the hero backdrop) flips through inside the bars, from the current phases only:
// Phase Three events (Tech Face-Off, Pixel X, Adsophos, Antigravity, FPTR) alternating with Phase Four's
// Orientation Day (the orientation-* photos come from the gallery). Web-sized copies in public/home/community/.
export const INTRO_PHOTOS = [
  "/home/community/tech-faceoff-2.webp",
  "/home/community/orientation-14.webp",
  "/home/community/pixelx-2.webp",
  "/home/community/orientation-48.webp",
  "/home/community/adsophos-1.webp",
  "/home/community/orientation-26.webp",
  "/home/community/tech-faceoff-1.webp",
  "/home/community/orientation-8.webp",
  "/home/community/antigravityiii.webp",
  "/home/community/orientation-36.webp",
  "/home/community/pixelx-3.webp",
  "/home/community/orientation-24.webp",
  "/home/community/frtp-2.webp",
  "/home/community/orientation-15.webp",
  "/home/community/tech-faceoff-3.webp",
  "/home/community/orientation-27.webp",
];

export const INTRO_KEY = "gdgc-cinema-intro-seen";

// Plays once per browser session. ?intro forces it (handy for testing), ?nointro skips it; reduced motion
// and automated browsers skip it too.
export function shouldPlayIntro() {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("intro")) return true;
    if (q.has("nointro") || q.has("nosplash") || navigator.webdriver) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // storage unavailable: the intro may play again, which is harmless
  }
}
