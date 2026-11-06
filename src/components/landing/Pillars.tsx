import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Label, RiseLines, Shape, type ShapeKind } from "./primitives";
import { EASE, GOOGLE_HEX } from "../fx/tokens";
import { INK, WRAP } from "./constants";

const PILLARS: { n: string; title: string; text: string; fill: string; kind: ShapeKind }[] = [
  { n: "01", title: "Community", text: "A place to find your people, collaborate, and build together.", fill: GOOGLE_HEX.blue, kind: "circle" },
  { n: "02", title: "Learning Ecosystem", text: "Workshops, hackathons, mentorship and learning by doing.", fill: GOOGLE_HEX.red, kind: "square" },
  { n: "03", title: "Networking & Outreach", text: "Connections that extend beyond the classroom and campus.", fill: GOOGLE_HEX.green, kind: "pill" },
];

// Three panels side by side; the one under the pointer (or keyboard focus) widens and floods with its colour.
// On phones they stack, all in colour.
export default function Pillars() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Three pillars" className="py-24 md:py-32">
      <div className={WRAP}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Label index="02">Three pillars</Label>
            <RiseLines
              lines={[
                <>
                  Three pillars<span className="text-google-blue">.</span>
                </>,
              ]}
              className="mt-6 font-display text-[clamp(2.75rem,6vw,5.75rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-white"
            />
          </div>
          <p className="max-w-[18rem] text-base leading-relaxed text-white/60 md:mb-2 md:text-right">
            A stronger community.
            <br />A brighter tomorrow.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 md:h-[34rem] md:flex-row">
          {PILLARS.map((p, i) => {
            const on = active === i;
            return (
              <motion.article
                key={p.n}
                tabIndex={0}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                style={{ flexGrow: on ? 2.1 : 1, background: on ? p.fill : undefined, ["--pillar" as string]: p.fill }}
                className={`relative isolate flex min-h-[22rem] basis-0 flex-col overflow-hidden rounded-[1.25rem] p-7 outline-none transition-[flex-grow,background-color,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-white sm:p-9 md:min-h-0 max-md:!bg-[var(--pillar)] max-md:text-black ${
                  on ? "md:text-black" : "md:bg-white/[0.04] md:text-white"
                }`}
              >
                <span className="font-tech text-xs tracking-[0.16em]">{p.n}</span>

                <div className="pointer-events-none absolute -top-[6%] -right-[6%] -z-10 flex aspect-square w-[55%] max-w-[20rem] items-start justify-end">
                  <Shape
                    kind={p.kind}
                    fill={on ? INK : p.fill}
                    className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:!bg-[#0B0B0C] ${
                      p.kind === "pill" ? "h-[46%] w-full" : "h-full w-full"
                    } ${on ? "scale-100 rotate-0" : "scale-[0.62] md:rotate-12"} max-md:scale-90 max-md:rotate-0`}
                  />
                </div>

                <div className="mt-auto max-w-[24rem]">
                  <h3 className="font-display text-[clamp(1.9rem,2.6vw,2.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">{p.title}</h3>
                  <p
                    className={`mt-4 max-w-[19rem] text-base leading-relaxed transition-opacity duration-500 max-md:opacity-100 ${
                      on ? "opacity-100 delay-200" : "md:opacity-0"
                    }`}
                  >
                    {p.text}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
