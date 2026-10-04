export const SEEN_KEY = "gdgc-intro-seen";
export const REPLAY_EVENT = "gdgc:replay-intro";

export const replayIntro = () => {
  try {
    sessionStorage.removeItem(SEEN_KEY);
  } catch {
    // storage unavailable: the replay still works for this page view
  }
  window.dispatchEvent(new Event(REPLAY_EVENT));
};
