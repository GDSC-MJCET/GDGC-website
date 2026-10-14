import type { PastEvent } from "./PastEvents";

// Extra details for the events archive: a category for the filter pills, a couple of tags for the cards,
// and a friendlier display title. Keyed by the event's `title` in PastEvents.tsx.

export type Category = "Workshop" | "Talk" | "Competition" | "Community";
export const CATEGORIES: Category[] = ["Workshop", "Talk", "Competition", "Community"];

type Meta = { category: Category; tags: string[]; name?: string };

const META: Record<string, Meta> = {
  ADSOPHOS: { category: "Competition", tags: ["Competition", "Creative"], name: "Adsophos" },
  "ANTIGRAVITY 2.0": { category: "Workshop", tags: ["Workshop", "Agentic AI"], name: "Antigravity 2.0" },
  "EPISODE 4: BUILD WEEK": { category: "Workshop", tags: ["Multi-domain programme"], name: "Episode 4 — Build Week" },
  "BUG BOUNTY": { category: "Workshop", tags: ["Workshop", "Cybersecurity"], name: "Bug Bounty Workshop" },
  "GSC INFO SESSION": { category: "Talk", tags: ["Talk", "Solution Challenge"], name: "Google Solution Challenge Info Session" },
  "TECH FACE-OFF": { category: "Competition", tags: ["Debate", "Inter-club"], name: "Tech Face-Off: The Verdict" },
  FPTR: { category: "Workshop", tags: ["Workshop", "Cybersecurity"], name: "FPTR — From Protection to Response" },
  PIXELX: { category: "Workshop", tags: ["Workshop", "Web Dev"], name: "Pixel X — Frontend Mastery" },
  "DYE 2025": { category: "Community", tags: ["Community", "First years"], name: "Doodle Your Engineering" },
  "GCSJ INFO SESSION": { category: "Talk", tags: ["Talk", "Cloud"], name: "Google Cloud Study Jam Info Session" },
  "GDGC INFO SESSION": { category: "Community", tags: ["Community", "Orientation"], name: "GDGC Info Session" },
  "EPISODE 3: BREAKTHROUGH": { category: "Workshop", tags: ["Multi-domain programme"], name: "Episode 3 — Breakthrough" },
  "DEV ARENA": { category: "Competition", tags: ["Hackathon"], name: "Dev Arena" },
  "DESIGN AND DEV": { category: "Workshop", tags: ["Workshop", "Design"], name: "Design and Dev" },
  "DSA BOOTCAMP": { category: "Workshop", tags: ["Bootcamp", "DSA"], name: "DSA Bootcamp" },
  "SOLUTIONS CHALLENGE INFO SESSION": { category: "Talk", tags: ["Talk", "Solution Challenge"], name: "Solution Challenge Info Session" },
  "TECH FACE-OFF '24": { category: "Competition", tags: ["Debate", "Inter-club"], name: "Tech Face-Off '24" },
  "CYBER STRIKERS LEAGUE": { category: "Competition", tags: ["CTF", "Cybersecurity"], name: "Cyber Strikers League" },
  "DYE '24": { category: "Community", tags: ["Community", "First years"], name: "Doodle Your Engineering '24" },
  "INFO SESSION '24": { category: "Community", tags: ["Community", "Orientation"], name: "Info Session '24" },
  "GDGC BUILD WEEK": { category: "Workshop", tags: ["Multi-domain programme"], name: "GDSC Build Week" },
  "GEN AI STUDY JAMS": { category: "Workshop", tags: ["Study Jam", "Gen AI"], name: "Gen AI Study Jams" },
  "ANDROID UNPLUGGED": { category: "Talk", tags: ["Talk", "Android"], name: "Android Unplugged" },
  "INFO SESSION – SOLUTION CHALLENGE": { category: "Talk", tags: ["Talk", "Solution Challenge"], name: "Solution Challenge Info Session '23" },
  "DYE '23": { category: "Community", tags: ["Community", "First years"], name: "Doodle Your Engineering '23" },
  "CLOUD STUDY JAMS": { category: "Workshop", tags: ["Study Jam", "Cloud"], name: "Cloud Study Jams" },
  "AI GENESIS": { category: "Talk", tags: ["Talk", "AI"], name: "AI Genesis" },
  PRODX: { category: "Talk", tags: ["Talk", "Product"], name: "ProdX" },
};

export const metaOf = (e: PastEvent): Meta =>
  META[e.title] ?? { category: "Community", tags: [], name: undefined };

export const nameOf = (e: PastEvent) => metaOf(e).name ?? e.title;

/** "12th & 13th" + "February, 2026" -> "12th & 13th Feb, 2026" */
export const dateOf = (e: PastEvent) => {
  const month = e.month.replace(/^([A-Za-z]{3})[a-z]*,?/, "$1,").trim();
  return e.date && e.date !== "TBA" ? `${e.date} ${month}` : e.month;
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** sortable number from the event's month text (newest first when sorted descending); "TBA" goes last */
export const sortKey = (e: PastEvent) => {
  if (e.date === "TBA") return -Infinity;
  const year = Number(e.month.match(/(\d{4})/)?.[1] ?? 0);
  const m = MONTHS.indexOf(e.month.trim().slice(0, 3).toLowerCase());
  const day = Number(e.date.match(/(\d{1,2})/)?.[1] ?? 0);
  return year * 10000 + Math.max(m, 0) * 100 + day;
};
