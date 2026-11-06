import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Clock, Lock, Server, UserRoundX, Users, Zap } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CallMock from "../components/projects/CallMock";
import { Dot, Outline } from "../components/fx/designSystem";
import { EASE } from "../components/fx/tokens";

const WRAP = "mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16";
const NORTHIERS_URL = "https://northiers.vercel.app/";

const PROBLEMS = [
  { icon: UserRoundX, title: "Everyone needs an account", text: "Guests at a workshop shouldn't have to sign up just to watch a talk." },
  { icon: Clock, title: "Calls that cut off", text: "Free plans end the session right when the Q&A gets good." },
  { icon: Lock, title: "Someone else's servers", text: "Our sessions, recordings and attendance belong on infrastructure we control." },
];

const FEATURES = [
  { icon: Users, title: "Guest-first", text: "Share a link, people join from the browser. No installs, no sign-ups.", color: "#4285F4" },
  { icon: Zap, title: "Built for big rooms", text: "Designed for 100–150 people in a speaker-led session, with screen sharing.", color: "#EA4335" },
  { icon: Server, title: "Self-hosted", text: "Runs on our own infrastructure, built to scale down when no one is in a call.", color: "#FBBC05" },
  { icon: Lock, title: "Private by design", text: "Host controls, moderation, and in-call chat that isn't stored afterwards.", color: "#34A853" },
];

const STACK = ["LiveKit (WebRTC)", "Django", "React", "PostgreSQL", "Redis", "coturn", "Docker"];

function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">{children}</p>;
}

// Projects: the earlier phases were for learning; in Phase Four we started shipping our own tools.
// The first is Northiers, our own video calls.
const ProjectsPage = () => {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] });
  const tilt = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 28, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.86, 1]);

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <Nav />
      <main>
        {/* opening */}
        <header className={`${WRAP} pt-14 md:pt-24`}>
          <motion.div {...reveal()}>
            <Kicker>Projects · Phase Four</Kicker>
            <h1 className="mt-5 text-[clamp(3.25rem,9.5vw,9rem)] leading-[0.88] font-black tracking-[-0.05em]">
              We learned.
              <br />
              Now we <Outline>ship</Outline>
              <Dot color="bg-google-red" />
            </h1>
          </motion.div>
          <motion.div {...reveal(0.1)} className="mt-10 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-3">
            {[
              ["Phase One–Three", "Workshops, study jams and talks. Three years of learning how to build."],
              ["Phase Four", "We started building tools for problems we kept running into ourselves."],
              ["First release", "Northiers: video calls for our sessions, on our own terms."],
            ].map(([k, v], i) => (
              <div key={k}>
                <p className={`text-sm font-bold ${i === 2 ? "text-white" : "text-white/80"}`}>{k}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{v}</p>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Northiers */}
        <section aria-label="Northiers" className="pt-28 md:pt-40">
          <div className={WRAP}>
            <motion.div {...reveal()} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Kicker>Project 01 · Open source</Kicker>
                <h2 className="mt-4 text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.86] font-black tracking-[-0.05em]">
                  Northiers<Dot color="bg-google-blue" />
                </h2>
                <p className="mt-4 text-[clamp(1.4rem,2.4vw,2.2rem)] font-bold tracking-[-0.02em] text-white/80">Meet without the friction.</p>
              </div>
              <div className="flex flex-col gap-5 md:mb-3 md:items-end md:text-right">
                <p className="max-w-[24rem] text-base leading-relaxed text-white/60">
                  A self-hostable video-call platform for our classes, workshops, team meetings and community sessions.
                </p>
                <a
                  href={NORTHIERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
                >
                  Try Northiers
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              </div>
            </motion.div>

            <div ref={stage} className="mt-14 md:mt-20" style={{ perspective: 1600 }}>
              <motion.a
                href={NORTHIERS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Northiers"
                className="mx-auto block max-w-[62rem]"
                style={{ rotateX: tilt, scale: lift, transformOrigin: "50% 100%" }}
              >
                <CallMock />
              </motion.a>
              <p className="mt-5 text-center text-sm text-white/45">
                Live at{" "}
                <a href={NORTHIERS_URL} target="_blank" rel="noopener noreferrer" className="text-white/75 underline-offset-4 hover:text-white hover:underline">
                  northiers.vercel.app
                </a>
              </p>
            </div>
          </div>

          {/* why */}
          <div className={`${WRAP} pt-28 md:pt-36`}>
            <motion.div {...reveal()}>
              <Kicker>Why we built it</Kicker>
              <p className="mt-5 max-w-[56rem] text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.08] font-black tracking-[-0.03em]">
                Running sessions on someone else&apos;s meeting app kept getting in the way of the sessions themselves.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PROBLEMS.map(({ icon: Icon, title, text }, i) => (
                <motion.div key={title} {...reveal(i * 0.08)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                  <Icon size={22} className="text-white/60" />
                  <p className="mt-6 text-lg font-bold">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* what it does */}
          <div className={`${WRAP} pt-28 md:pt-36`}>
            <motion.div {...reveal()}>
              <Kicker>What it does</Kicker>
              <h3 className="mt-4 text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.92] font-black tracking-[-0.04em]">
                So we made our <Outline>own</Outline>
                <Dot color="bg-google-green" />
              </h3>
            </motion.div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text, color }, i) => (
                <motion.div key={title} {...reveal(i * 0.06)} className="group bg-[#050506] p-8 sm:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: color }}>
                    <Icon size={22} className="text-[#202124]" />
                  </span>
                  <p className="mt-8 text-2xl font-black tracking-[-0.02em]">{title}</p>
                  <p className="mt-3 max-w-[26rem] text-base leading-relaxed text-white/60">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* stack */}
          <motion.div {...reveal()} className={`${WRAP} pt-20`}>
            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <Kicker>Under the hood</Kicker>
                <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-white/65">
                  Built on La Suite Meet and LiveKit, proven open-source foundations, then shaped into our own.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 md:max-w-[34rem] md:justify-end">
                {STACK.map((s) => (
                  <li key={s} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* next */}
        <section aria-label="What's next" className={`${WRAP} pt-28 pb-10 md:pt-40`}>
          <motion.div {...reveal()} className="relative overflow-hidden rounded-[2rem] border border-dashed border-white/25 p-10 text-center md:p-16">
            <Kicker>Project 02</Kicker>
            <p className="mx-auto mt-5 max-w-[44rem] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.045em]">
              Could be <Outline>yours</Outline>
              <Dot color="bg-google-yellow" />
            </p>
            <p className="mx-auto mt-5 max-w-[30rem] text-base leading-relaxed text-white/60">
              Got a problem worth solving? Bring it to us and build it with the community.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
              >
                Pitch a project
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <a
                href="https://github.com/GDSC-MJCET"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-[15px] text-sm font-medium transition-colors hover:border-white"
              >
                Our GitHub <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
