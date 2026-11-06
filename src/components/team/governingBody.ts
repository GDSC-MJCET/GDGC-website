export type GoverningMember = {
  name: string;
  role: string;
  image: string;
  /** Accent colour for the dot beside the name and the active card's rim glow */
  color: string;
  /** also one of the chapter's official GDG Organizers */
  organizer?: boolean;
  /** their own one-liner for the team page; shown under their name when set */
  quote?: string;
};

// Google palette, repeated down the list (matches --google-* in src/index.css)
const ACCENTS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

// `color` overrides the repeating accent for a member
const MEMBERS: (Omit<GoverningMember, "color"> & { color?: string })[] = [
  { name: "Afzal Hashmi", role: "Chief Coordinator", image: "/gb-267/afzal-hashmi.png", organizer: true },
  { name: "Liyaqat Ahmed", role: "Chief Coordinator", image: "/gb-267/liyaqat-ahmed.png" },
  { name: "Misbah Hussain", role: "General Secretary", image: "/gb-267/misbah-hussien.png" },
  { name: "Linra Khan", role: "General Secretary", image: "/gb-267/linra-khan.png", organizer: true },
  { name: "Rehmath Unnisa", role: "Chief Representative", image: "/gb-267/rehmath-unnisa.png" },
  { name: "Ibrahim Wajid", role: "Chief Representative", image: "/gb-267/ibrahim-wajid.png" },
  { name: "Afra Ahmed", role: "Treasurer", image: "/gb-267/afra-ahmed.png" },
  { name: "Ayaan Tabrez", role: "Tech Captain", image: "/gb-267/ayaan-tabrez.png", color: "#4285F4" },
  { name: "Moid Abdul", role: "Tech Captain", image: "/gb-267/moid-abdul.png", organizer: true, color: "#34A853" },
  { name: "Afeef Uddin", role: "Tech Captain", image: "/gb-267/afeef-uddin.png" },
];

export const GB_MEMBERS: GoverningMember[] = MEMBERS.map((m, i) => ({
  ...m,
  color: m.color ?? ACCENTS[i % ACCENTS.length],
}));
