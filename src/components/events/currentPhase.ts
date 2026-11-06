// The academic year in progress. Its events are not in the archive data (PastEvents.tsx) yet, so they are
// listed here as they happen; when a recap is written up, move the event into eventsByYear.
export const CURRENT_YEAR = "2026-27";

export type CurrentEvent = { key: string; name: string; date: string; image: string; category: string };

export const CURRENT_EVENTS: CurrentEvent[] = [
  { key: "gdgc-101", name: "GDGC 101", date: "11th Sep, 2026", image: "/gdg_101.jpeg", category: "Community" },
];
