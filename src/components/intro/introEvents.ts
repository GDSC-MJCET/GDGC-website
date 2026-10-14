export const SEEN_KEY = "gdgc-intro-seen";
export const REPLAY_EVENT = "gdgc:replay-intro";

export const replayIntro = () => {
  try {
    localStorage.removeItem(SEEN_KEY);
  } catch {
    // storage unavailable: the replay still works for this page view
  }
  window.dispatchEvent(new Event(REPLAY_EVENT));
};

export const shouldShowIntro = () => {
  try {
    if (navigator.webdriver) return false;
    if (new URLSearchParams(window.location.search).has("nosplash")) return false;
    // only on the landing page, and only the first time this browser ever visits
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path !== "") return false;
    return !localStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
};

// The shutter (backdrop, text, glows) rises over SHUTTER_MS; the globe starts gliding MORPH_DELAY_MS
// later and takes until MORPH_MS (from the start of the exit) to land on the hero globe.
export const SHUTTER_MS = 1300;
export const MORPH_DELAY_MS = 250;
export const MORPH_MS = 2000;
// Crossfade from the intro's globe to the real one once they overlap exactly.
export const HANDOFF_MS = 600;

// Set by IntroSplash when it starts flying the intro globe to the hero globe;
// read by IntroScene every frame. Coordinates are CSS pixels in the viewport.
export type ExitState = {
  t0: number; // performance.now() when the morph started
  heroT0: number; // performance.now() when the hero (and its globe clock) mounted
  cx: number; // centre of the hero globe
  cy: number;
  size: number; // side of the hero globe's square canvas
};
