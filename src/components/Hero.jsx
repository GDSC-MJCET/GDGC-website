import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ParticleGlobe from "./ParticleGlobe";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -bottom-24 -left-40 h-[520px] w-[520px] bg-google-red opacity-[0.18] blur-[130px]"
          style={{ clipPath: "polygon(70% 0%, 100% 15%, 40% 50%, 100% 85%, 70% 100%, 0% 50%)" }}
        />
        <div
          className="absolute -bottom-24 -right-40 h-[520px] w-[520px] bg-google-yellow opacity-[0.16] blur-[130px]"
          style={{ clipPath: "polygon(30% 0%, 100% 50%, 30% 100%, 0% 85%, 60% 50%, 0% 15%)" }}
        />
      </div>

      <div className="relative z-10 px-6 pt-10 pb-20 sm:px-10 lg:px-16">
        <div className="relative lg:pl-32">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-8 hidden h-full lg:block"
          >
            <div className="absolute top-24 bottom-0 left-0 w-px bg-border" />
            <div className="space-y-1.5 pl-4 text-[10px] tracking-[0.22em] text-muted-foreground">
              <div>LEARN</div>
              <div>BUILD</div>
              <div>CONNECT</div>
              <div>GROW</div>
              <div className="mt-3 h-px w-6 bg-border" />
            </div>
            <div className="absolute top-1/2 left-4 text-foreground/25">+</div>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,48%)_minmax(0,1fr)] lg:gap-8">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                Students <span className="mx-1 text-foreground/40">×</span> Technology{" "}
                <span className="mx-1 text-foreground/40">×</span> Real Impact
              </p>

              <h1 className="mt-6 whitespace-nowrap text-[clamp(2.25rem,4.9vw,5rem)] leading-[0.95] font-black tracking-[-0.03em] text-foreground">
                <span className="block">BUILD</span>
                <span
                  className="block text-transparent"
                  style={{ WebkitTextStroke: "2px var(--foreground)", paintOrder: "stroke fill" }}
                >
                  TOGETHER
                </span>
                <span className="block">
                  GO FURTHER
                  <span className="ml-1 inline-block h-[0.14em] w-[0.14em] translate-y-[-0.05em] rounded-full bg-google-red align-baseline" />
                </span>
              </h1>

              <p className="mt-6 max-w-[480px] text-base leading-relaxed text-muted-foreground sm:text-lg">
                GDGC MJCET is a student-led community under Google Developer
                Groups, where curious minds learn, build, and solve real-world
                problems together.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://gdg.community.dev/gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-85 hover:scale-[1.03]"
                >
                  Join the Community <ArrowUpRight size={15} />
                </a>
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center rounded-full border border-border px-7 py-4 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  Explore Events
                </Link>
              </div>
            </div>

            <div className="relative min-w-0">
              <ParticleGlobe className="mx-auto aspect-square w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[620px]" />
            </div>
          </div>

          <div className="mt-10 flex justify-center lg:absolute lg:right-0 lg:-bottom-4 lg:mt-0">
            <div className="border border-border p-5">
              <p className="space-y-1 text-[10px] tracking-[0.2em] text-foreground/75 uppercase">
                <span className="block">A brighter</span>
                <span className="block">tomorrow</span>
                <span className="block">together.</span>
              </p>
              <span className="mt-4 block h-px w-8 bg-border" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
