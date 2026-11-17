import { GOOGLE_HEX } from "../fx/tokens";

export type GoverningMember = {
  name: string;
  role: string;
  /**
   * The cut-out portrait, normalised by scripts/build-team-portraits.mjs: every one is 760 x 660 with the head
   * the same size and at the same height, so people line up whatever their original photo's crop.
   */
  image: string;
  /** Accent colour for the line under the name and the card's glow */
  color: string;
  /** also one of the chapter's official GDG Organizers */
  organizer?: boolean;
  /** their own one-liner for the team page; shown under their name when set */
  quote?: string;
};

/** width / height of every normalised portrait */
export const PORTRAIT_RATIO = 760 / 660;

// Google palette, repeated down the list (matches --google-* in src/index.css)
const ACCENTS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const cut = (file: string) => `/gb-267/n/${file}.webp`;

// `color` overrides the repeating accent for a member
const MEMBERS: (Omit<GoverningMember, "color"> & { color?: string })[] = [
  { name: "Afzal Hashmi", role: "Chief Coordinator", image: cut("afzal-hashmi"), organizer: true },
  { name: "Liyaqat Ahmed", role: "Chief Coordinator", image: cut("liyaqat-ahmed") },
  { name: "Misbah Hussain", role: "General Secretary", image: cut("misbah-hussien") },
  { name: "Linra Khan", role: "General Secretary", image: cut("linra-khan"), organizer: true },
  { name: "Rehmath Unnisa", role: "Chief Representative", image: cut("rehmath-unnisa") },
  { name: "Ibrahim Wajid", role: "Chief Representative", image: cut("ibrahim-wajid") },
  { name: "Afra Ahmed", role: "Treasurer", image: cut("afra-ahmed") },
  { name: "Ayaan Tabrez", role: "Tech Captain", image: cut("ayaan-tabrez"), color: "#4285F4" },
  { name: "Moid Abdul", role: "Tech Captain", image: cut("moid-abdul"), organizer: true, color: "#34A853" },
  { name: "Afeef Uddin", role: "Tech Captain", image: cut("afeef-uddin") },
];

export const GB_MEMBERS: GoverningMember[] = MEMBERS.map((m, i) => ({
  ...m,
  color: m.color ?? ACCENTS[i % ACCENTS.length],
}));

// Top-down: the Chief Coordinators first. `spot` is the colour that role is lit in.
export const GB_ROLES = [
  { role: "Chief Coordinator", plural: "Chief Coordinators", line: "The ones who run it all", spot: GOOGLE_HEX.red },
  { role: "General Secretary", plural: "General Secretaries", line: "Keeping every plan on track", spot: GOOGLE_HEX.blue },
  { role: "Chief Representative", plural: "Chief Representatives", line: "The voice in every room", spot: GOOGLE_HEX.green },
  { role: "Treasurer", plural: "Treasurer", line: "Every rupee, accounted for", spot: GOOGLE_HEX.yellow },
  { role: "Tech Captain", plural: "Tech Captains", line: "The ones who build it", spot: GOOGLE_HEX.blue },
]
  .map((r) => ({ ...r, members: GB_MEMBERS.filter((m) => m.role === r.role) }))
  .filter((r) => r.members.length);

export type GoverningRole = (typeof GB_ROLES)[number];

/** the soft fade at the bottom of a cut-out, so the bust melts into whatever is behind it */
export const FADE_MASK = "linear-gradient(to bottom, black 72%, transparent 98%)";
