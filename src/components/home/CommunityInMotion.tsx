import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading, { Dot, Outline } from "./SectionHeading";
import ScrollReveal from "../fx/ScrollReveal";
import Parallax from "../fx/Parallax";

// "A Community in Motion": the club's story, a few numbers that count up, and a tilted cluster of photos.

const STATS = [
  { value: 3, suffix: "+", label: "Years" },
  { value: 20, suffix: "+", label: "Events" },
  { value: 1000, suffix: "+", label: "Students Reached" },
  { value: null, suffix: "∞", label: "Bigger Ambitions" },
] as const;

// photo, position in the cluster (% of its box), size (% of box width), tilt
const PHOTOS = [
  { src: "/about4.jpg", left: 6, top: 10, w: 44, rY: 18, rZ: -4, z: 1 },
  { src: "/about3.webp", left: 42, top: 0, w: 46, rY: -10, rZ: 3, z: 2 },
  { src: "/idk-img-final-3.jpeg", left: 20, top: 46, w: 52, rY: 8, rZ: -2, z: 3 },
  { src: "/about2.png", left: 62, top: 44, w: 34, rY: -18, rZ: 5, z: 2 },
] as const;

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = !!useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function TiltPhoto({ photo }: { photo: (typeof PHOTOS)[number] }) {
  const reduce = !!useReducedMotion();
  const tx = useSpring(0, { stiffness: 160, damping: 20 });
  const ty = useSpring(0, { stiffness: 160, damping: 20 });
  const rotateY = useTransform(tx, (v) => photo.rY + v);
  const rotateX = useTransform(ty, (v) => -v);
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${photo.left}%`,
        top: `${photo.top}%`,
        width: `${photo.w}%`,
        zIndex: photo.z,
        rotateY,
        rotateX,
        rotateZ: photo.rZ,
        transformPerspective: 1000,
      }}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay: photo.z * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        tx.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        ty.set(((e.clientY - r.top) / r.height - 0.5) * 6);
      }}
      onPointerLeave={() => {
        tx.set(0);
        ty.set(0);
      }}
    >
      <div className="rounded-[18px] border border-white/25 bg-white/[0.06] p-[6px] shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md">
        <img
          src={photo.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="aspect-[4/3] w-full rounded-[12px] object-cover brightness-[0.9]"
        />
      </div>
    </motion.div>
  );
}

export default function CommunityInMotion() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-label="Our journey" className="relative px-6 py-20 sm:px-10 lg:px-[5.5%] lg:py-28">
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
        <div>
          <div className="flex items-start gap-6">
            <SectionHeading
              eyebrow="Our Journey"
              dot="bg-google-red"
              lines={[
                "A Community",
                <>
                  in <Outline>Motion</Outline>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <p className="mt-3 text-[11px] tracking-[0.3em] text-white/45 uppercase">Est. 2023</p>
          <ScrollReveal
            className="mt-6 max-w-[30rem] text-base leading-relaxed text-white/80"
            text="What started as a small group of curious students has grown into a thriving tech community — hosting workshops, building projects, and creating opportunities for every student at MJCET."
          />
          <Link
            to="/team-page"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            Learn More <ArrowRight size={15} />
          </Link>

          <dl className="mt-10 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-black tracking-[-0.02em] text-white">
                  {s.value === null ? s.suffix : <CountUp to={s.value} suffix={s.suffix} />}
                </dd>
                <p aria-hidden className="mt-1 text-xs leading-snug text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <p className="absolute -top-16 right-0 hidden text-right text-[11px] leading-5 tracking-[0.25em] text-white/50 uppercase lg:block">
            Same curiosity.
            <br />
            Bigger possibilities.
          </p>
          <Parallax distance={40}>
            <div className="relative mx-auto aspect-[1.25] w-full max-w-[680px]" style={{ perspective: 1200 }}>
              {PHOTOS.map((p) => (
                <TiltPhoto key={p.src} photo={p} />
              ))}
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
