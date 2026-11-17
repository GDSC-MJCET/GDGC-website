// The academic year in progress. An event whose recap is written up lives in eventsByYear[CURRENT_YEAR]
// (PastEvents.tsx) and gets its own page. An event that has happened but has no recap yet can be listed here
// as a poster; move it into eventsByYear when the recap is ready.
export const CURRENT_YEAR = "2026-27";

export type CurrentEvent = { key: string; name: string; date: string; image: string; category: string };

export const CURRENT_EVENTS: CurrentEvent[] = [];
