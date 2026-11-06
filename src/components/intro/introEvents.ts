export const REPLAY_EVENT = "gdgc:replay-intro";

/** Plays the home page's opening titles again (the home page listens for this). */
export const replayIntro = () => {
  window.dispatchEvent(new Event(REPLAY_EVENT));
};
