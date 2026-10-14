// The colour behind the home page, from the hero down: soft round hues in the hero, then angular strips of GDGC-coloured light coming in from
// the section edges, like the design's light shards, on near-black. Purely decorative.
// Everything here holds still (no animation) so it is painted once and scrolling stays light.

type Strip = {
  /** vertical position, as % of the wrapper's height */
  top: string;
  /** which edge it comes in from, and how far in it starts (negative = starts off screen) */
  side: "left" | "right";
  inset: string;
  /** length (vw) and thickness (px) of the bright core */
  len: number;
  thick: number;
  /** rotation in degrees */
  angle: number;
  /** colours at the two ends of the strip (r,g,b) */
  colors: [string, string];
  opacity: number;
};

const BLUE = "66,133,244";
const RED = "234,67,53";
const YELLOW = "251,188,5";
const GREEN = "52,168,83";

const STRIPS: Strip[] = [
  // (the hero has soft round hues instead, see HERO_HUES below)
  // highlight cards: faint blue sliver on the left, red streak on the right
  { top: "19%", side: "left", inset: "-6%", len: 26, thick: 30, angle: -14, colors: [BLUE, BLUE], opacity: 0.3 },
  { top: "22%", side: "right", inset: "-6%", len: 24, thick: 34, angle: 22, colors: [RED, YELLOW], opacity: 0.32 },
  // past events: blue-to-red shard on the left edge, yellow on the right
  { top: "28%", side: "left", inset: "-12%", len: 36, thick: 90, angle: -24, colors: [BLUE, RED], opacity: 0.4 },
  { top: "34%", side: "right", inset: "-8%", len: 26, thick: 28, angle: 30, colors: [YELLOW, YELLOW], opacity: 0.28 },
  // our journey: green streak low on the right, a thin red line on the left
  { top: "50%", side: "right", inset: "-10%", len: 40, thick: 80, angle: -26, colors: [GREEN, GREEN], opacity: 0.42 },
  { top: "46%", side: "left", inset: "-6%", len: 22, thick: 20, angle: 34, colors: [RED, RED], opacity: 0.3 },
  // pillars: blue on the left, green on the right
  { top: "63%", side: "left", inset: "-10%", len: 30, thick: 60, angle: 20, colors: [BLUE, BLUE], opacity: 0.32 },
  { top: "70%", side: "right", inset: "-8%", len: 28, thick: 50, angle: -22, colors: [GREEN, BLUE], opacity: 0.3 },
  // community strip and the bottom: red on the right, faint blue and green low down
  { top: "80%", side: "right", inset: "-6%", len: 24, thick: 36, angle: 28, colors: [RED, RED], opacity: 0.32 },
  { top: "90%", side: "left", inset: "-10%", len: 40, thick: 70, angle: -12, colors: [BLUE, GREEN], opacity: 0.28 },
];

// The hero gets soft round hues rather than strips: top % of the wrapper, left %, size px, colour, strength.
const HERO_HUES: [string, string, number, string, number][] = [
  ["0%", "-8%", 760, BLUE, 0.22],
  ["1%", "70%", 820, RED, 0.16],
  ["4%", "52%", 840, GREEN, 0.18],
  ["8%", "80%", 760, YELLOW, 0.16],
  ["9%", "22%", 640, RED, 0.1],
];

const gradient = ([a, b]: [string, string], o: number) =>
  `linear-gradient(90deg, rgba(${a},0), rgba(${a},${o}) 35%, rgba(${b},${o}) 65%, rgba(${b},0))`;

// fade the whole layer in at the top and out at the bottom, so it never ends in a visible line
const EDGE_FADE = "linear-gradient(to bottom, transparent 0, black 160px, black calc(100% - 240px), transparent 100%)";

export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      {HERO_HUES.map(([top, left, size, rgb, a], i) => (
        <span
          key={`hue-${i}`}
          style={{
            position: "absolute",
            top,
            left,
            width: size,
            height: size,
            background: `radial-gradient(closest-side, rgba(${rgb},${a}), rgba(${rgb},0))`,
          }}
        />
      ))}
      {STRIPS.map((s, i) => {
        const base = {
          position: "absolute" as const,
          top: s.top,
          [s.side]: s.inset,
          width: `${s.len}vw`,
          transformOrigin: s.side === "left" ? "left center" : "right center",
          transform: `rotate(${s.angle}deg)`,
        };
        return (
          <div key={i}>
            {/* wide, faint glow around the strip */}
            <span
              style={{
                ...base,
                height: s.thick * 4,
                marginTop: -s.thick * 1.5,
                background: gradient(s.colors, s.opacity * 0.35),
                filter: "blur(48px)",
              }}
            />
            {/* the bright core of the strip, slanted at its ends like a shard */}
            <span
              style={{
                ...base,
                height: s.thick,
                background: gradient(s.colors, s.opacity),
                filter: "blur(14px)",
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
