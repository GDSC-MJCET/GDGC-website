import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EXEC_COUNT, PORTFOLIOS } from "./executiveMembers";
import { Dot, Outline } from "../fx/designSystem";
import { GOOGLE_HEX } from "../fx/tokens";
import { useQuality } from "../fx/quality";

// one Google colour per portfolio, repeated down the list
const COLORS = [
  GOOGLE_HEX.blue,
  GOOGLE_HEX.red,
  GOOGLE_HEX.yellow,
  GOOGLE_HEX.green,
];
const N = PORTFOLIOS.length;
const pad = (n: number) => String(n).padStart(2, "0");
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// the four Google shapes, small, for the portfolio headings and the end card
function Shape({ k, size = 8 }: { k: number; size?: number }) {
  const s = k % 4;
  const style: CSSProperties = {
    width: size,
    height: s === 3 ? size * 1.6 : size,
    background: COLORS[s],
  };
  if (s === 0) style.borderRadius = "50%";
  if (s === 2) style.clipPath = "polygon(50% 0, 100% 100%, 0 100%)";
  if (s === 3) style.borderRadius = 99;
  return <span aria-hidden className="inline-block shrink-0" style={style} />;
}

// The Executive Committee, as a film's closing credits. The governing body before it is the lead cast; this is
// the ensemble. Portfolios are small coloured caps, names stand in two columns facing a centre line (one column
// on a phone), and each line lights up as it crosses the middle of the screen and dims as it leaves (the
// .credit-line rule in index.css, a scroll-driven CSS animation, so no script runs per line). A frame stays put
// over the roll: dark fades at the top and bottom, marks at the reading line, the light in the current
// portfolio's colour, and a reel counter.
export default function ExecutiveCommittee() {
  const full = useQuality() === "full";
  // -1 while the title or the end card is at the middle of the screen
  const [active, setActive] = useState(-1);
  const marks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    marks.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  const on = active >= 0;
  const color = on ? COLORS[active % 4] : "#ffffff";
  const mark = (i: number) => (el: HTMLElement | null) => {
    marks.current[i + 1] = el;
  };

  return (
    <section aria-label="The Executive Committee" className="relative">
      {/* the light: stays put behind the roll and takes the colour of the portfolio passing through */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div
            className="absolute inset-0 transition-[background-color] duration-1000"
            style={{
              backgroundColor: color,
              opacity: on ? 0.1 : 0.05,
              maskImage:
                "radial-gradient(ellipse 42% 75% at 50% 0%, black, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 42% 75% at 50% 0%, black, transparent 72%)",
            }}
          />
          <div
            className="absolute inset-0 transition-[background-color] duration-1000"
            style={{
              backgroundColor: color,
              opacity: on ? 0.08 : 0,
              maskImage:
                "radial-gradient(ellipse 60% 40% at 50% 100%, black, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 40% at 50% 100%, black, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* the frame: fades, the reading line and the reel counter stay put while the credits roll under them */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <div className="sticky top-0 h-[100svh]">
          <div className="absolute inset-x-0 top-0 h-[26svh] bg-gradient-to-b from-[#050506] via-[#050506]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[26svh] bg-gradient-to-t from-[#050506] via-[#050506]/85 to-transparent" />
          {full && (
            <div
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
          )}

          {/* registration marks at the reading line */}
          {[0, 1].map((s) => (
            <span
              key={s}
              className={`absolute top-1/2 flex items-center gap-1.5 ${s ? "right-0 flex-row-reverse" : "left-0"}`}
            >
              <span
                className="h-px w-[5vw] transition-colors duration-700 md:w-[7vw]"
                style={{ background: on ? color : "rgba(255,255,255,0.18)" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors duration-700"
                style={{ background: on ? color : "rgba(255,255,255,0.25)" }}
              />
            </span>
          ))}

          {/* the reel counter */}
          <div
            className="absolute bottom-[max(1.25rem,3svh)] left-1/2 w-[min(18rem,80vw)] -translate-x-1/2 transition-opacity duration-500 lg:left-16 lg:translate-x-0"
            style={{ opacity: on ? 1 : 0 }}
          >
            <div className="flex items-baseline justify-between gap-4 text-[10px] font-semibold tracking-[0.3em] uppercase">
              <span className="text-white/45 tabular-nums">
                Reel {pad(Math.max(active, 0) + 1)} / {pad(N)}
              </span>
              <span
                className="truncate transition-colors duration-700"
                style={{ color }}
              >
                {PORTFOLIOS[Math.max(active, 0)].name}
              </span>
            </div>
            <div className="mt-2 h-px w-full bg-white/15">
              <div
                className="h-full origin-left transition-transform duration-700 ease-out"
                style={{
                  background: color,
                  transform: `scaleX(${(Math.max(active, 0) + 1) / N})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* the roll */}
      <div className="relative z-10 px-5 sm:px-10">
        <header
          ref={mark(-1)}
          data-i={-1}
          className="pt-[24svh] pb-[24svh] text-center"
        >
          <p className="credit-line text-[11px] font-semibold tracking-[0.35em] text-white/55 uppercase">
            Phase Four · and introducing
          </p>
          <h2 className="credit-line mx-auto mt-5 max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] font-black tracking-[-0.05em]">
            The Executive <Outline>Committee</Outline>
            <Dot color="bg-google-green" />
          </h2>
          <p className="credit-line mt-6 text-[11px] font-semibold tracking-[0.35em] text-white/55 uppercase">
            {EXEC_COUNT} names · {N} portfolios
          </p>
        </header>

        {PORTFOLIOS.map((p, k) => {
          const half = Math.ceil(p.members.length / 2);
          return (
            <div
              key={p.name}
              ref={mark(k)}
              data-i={k}
              className="pb-[16svh] text-center"
            >
              <p
                className="credit-line inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.35em] uppercase sm:text-xs"
                style={{ color: COLORS[k % 4] }}
              >
                <Shape k={k} />
                <span className="text-white/45 tabular-nums">{pad(k + 1)}</span>
                {p.name}
              </p>
              <ul
                className="relative mx-auto mt-6 grid max-w-[76rem] grid-cols-1 lg:mt-8 lg:grid-flow-col lg:grid-cols-2 lg:gap-x-16 lg:[grid-template-rows:repeat(var(--rows),auto)]"
                style={{ "--rows": half } as CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-2 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
                />
                {p.members.map((m, i) => (
                  <li
                    key={m}
                    className={`credit-line py-1 text-[clamp(1.3rem,5.6vw,1.9rem)] leading-[1.18] font-bold tracking-[-0.025em] lg:py-1.5 lg:text-[clamp(1.5rem,2vw,2.15rem)] ${i < half ? "lg:text-right" : "lg:text-left"}`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div
          ref={mark(N)}
          data-i={-1}
          className="flex flex-col items-center pt-[4svh] pb-[30svh] text-center"
        >
          <div className="credit-line flex items-end gap-2.5">
            {[0, 1, 2, 3].map((k) => (
              <Shape key={k} k={k} size={14} />
            ))}
          </div>
          <p className="credit-line mt-7 text-[11px] font-semibold tracking-[0.35em] text-white/55 uppercase">
            GDGC MJCET · 2026–27
          </p>
          <p className="credit-line mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em]">
            Every one of them, building Phase Four.
          </p>
        </div>
      </div>
    </section>
  );
}
