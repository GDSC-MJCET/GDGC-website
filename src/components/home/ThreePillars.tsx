import { lazy, Suspense, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading, { Dot, Outline } from "./SectionHeading";
import type { ShapeKind } from "./PillarShape";

// three.js (about 230 KB compressed) only loads once this section comes near the screen
const PillarShape = lazy(() => import("./PillarShape"));

const PILLARS: { n: string; title: string; text: string; color: string; rule: string; kind: ShapeKind }[] = [
  {
    n: "01",
    title: "Community",
    text: "A place to find your people, collaborate, and build together.",
    color: "#4285F4",
    rule: "bg-google-blue",
    kind: "cluster",
  },
  {
    n: "02",
    title: "Learning Ecosystem",
    text: "Workshops, hackathons, mentorship and learning by doing.",
    color: "#EA4335",
    rule: "bg-google-red",
    kind: "pyramid",
  },
  {
    n: "03",
    title: "Networking & Outreach",
    text: "Connections that extend beyond the classroom and campus.",
    color: "#34A853",
    rule: "bg-google-green",
    kind: "ring",
  },
];

export default function ThreePillars() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const near = useInView(sectionRef, { once: true, margin: "600px 0px" });
  return (
    <section ref={sectionRef} aria-label="What drives us" className="relative px-6 py-20 sm:px-10 lg:px-[5.5%] lg:py-28">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-8">
        <div>
          <SectionHeading
            eyebrow="What Drives Us"
            dot="bg-google-blue"
            lines={[
              <>
                <Outline>Three</Outline>
              </>,
              <>
                Pillars
                <Dot />
              </>,
            ]}
          />
          <p className="mt-6 max-w-[16rem] text-base leading-relaxed text-white/65">
            A stronger community.
            <br />A brighter tomorrow.
          </p>
          <Link
            to="/events"
            aria-label="See what we do"
            className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white/60 hover:text-white"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-0">
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.n}
              className="relative flex flex-col sm:px-6 sm:first:pl-0 lg:px-8"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* coloured divider on the left of each column (desktop) */}
              {i > 0 && <span aria-hidden className={`absolute top-0 bottom-0 left-0 hidden w-px opacity-60 sm:block ${p.rule}`} />}
              <span className="text-sm font-semibold tracking-[0.2em]" style={{ color: p.color }}>
                {p.n}
              </span>
              <div className="relative my-4 aspect-square w-full max-w-[260px] self-center">
                <span
                  aria-hidden
                  className="absolute inset-[18%] rounded-full blur-3xl"
                  style={{ background: p.color, opacity: 0.22 }}
                />
                {near && (
                  <Suspense fallback={null}>
                    <PillarShape kind={p.kind} color={p.color} />
                  </Suspense>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-white/60">{p.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
