export type PastEvent = {
  title: string;
  /** shown in caps on the card, e.g. "Nov 2025" */
  date: string;
  image: string;
  /** the matching entry in eventsByYear (src/components/events/PastEvents.tsx): its title and year, so the card can open that event's page */
  match: { title: string; year: string };
};

// Shown left to right in this order (the row loops, so the last one comes in after Build Week).
// The original event pictures (banners and posters from public/), shown as they are.
export const PAST_EVENTS: PastEvent[] = [
  { title: "Pixel X — Frontend Mastery", date: "Nov 2025", image: "/pixel-x-large.webp", match: { title: "PIXELX", year: "2025-26" } },
  { title: "Doodle Your Engineering", date: "Dec 2025", image: "/doogle-large.webp", match: { title: "DYE 2025", year: "2025-26" } },
  { title: "Google Solutions Challenge Info Session", date: "Apr 2026", image: "/info-session-26.jpeg", match: { title: "GSC INFO SESSION", year: "2025-26" } },
  {
    title: "Build Week",
    date: "Jun 2025",
    image: "https://shcumgowsirqqfazrogw.supabase.co/storage/v1/object/public/images/1778439455443__buildweek.jpeg",
    match: { title: "EPISODE 4: BUILD WEEK", year: "2025-26" },
  },
  { title: "Tech Face-Off", date: "Feb 2026", image: "/tech-face-off-l.webp", match: { title: "TECH FACE-OFF", year: "2025-26" } },
];

/** which event is first (leftmost) when the section loads */
export const FIRST_FEATURED = 4; // Tech Face-Off, then Pixel X and Doodle (the row loops round)
