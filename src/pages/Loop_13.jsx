import { motion } from "framer-motion";
import "../components/adsophos/adsophos.css";
import eyes from "../../public/eyes.svg";
import Final from "../components/adsophos/Final.jsx";
import PixelSkyline from "../components/adsophos/PixelSkyline.jsx";

const equipmentItems = [
  "Placeholder reward or item one goes here.",
  "Add a short sentence for the second item.",
  "Describe what players receive after registering.",
  "Use this line for event perks or kit details.",
  "Replace this with your final equipment copy.",
];

const Loop13 = () => {
  return (
    <div className="loop13-shell relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <style>{`
        .loop13-shell .loop13-panel-copy::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative h-[28vh] min-h-[190px] w-full overflow-hidden bg-[url('/adsophos-hero.png')] bg-cover bg-center bg-no-repeat sm:h-[34vh] sm:min-h-[230px] md:h-[42vh] lg:h-[50vh]">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <motion.div
          className="absolute inset-0 z-0 bg-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

        <div className="absolute bottom-0 w-full z-20">
          <PixelSkyline />
        </div>
      </div>

      <main className="relative min-h-screen w-screen max-w-none overflow-hidden bg-black px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 md:px-8 md:pt-12">

        <img
          src="/stars.svg"
          alt=""
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-[92vw] max-w-[66rem] -translate-x-1/2 opacity-55 sm:w-[88vw]"
        />

        {/* Hero content */}
        <section className="relative z-10 flex flex-col items-center">
          <div className="mt-4 bg-[#4a4a4a] px-4 py-2 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:mt-6 sm:px-7">
            <h2 className="adsophos-container text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white sm:text-[1rem]">
              Mystery Room: Game 2
            </h2>
          </div>

          <h1
            className="adsophos-container mt-9 text-center text-[3.1rem] font-bold uppercase leading-none tracking-[0.08em] text-transparent sm:mt-11 sm:text-[4.8rem] md:text-[5.5rem]"
            style={{
              background:
                "linear-gradient(180deg, #d5d9df 0%, #838d9d 45%, #232730 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1px rgba(198, 208, 220, 0.18)",
              textShadow:
                "0 3px 10px rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.55)",
            }}
          >
            Loop 13
          </h1>

          <div className="relative mt-8 flex w-full items-center justify-center sm:mt-10 md:mt-12">
            <img
              src={eyes}
              alt=""
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[88%] max-w-[35rem] -translate-x-1/2 -translate-y-1/2 opacity-95"
            />

            <button
              className="relative z-10 rounded-[0.85rem] border border-white/15 bg-[linear-gradient(180deg,#959ca6_0%,#5d616a_42%,#1b1d22_100%)] px-8 py-3 text-[1.1rem] font-semibold text-white shadow-[inset_0_1px_12px_rgba(255,255,255,0.55),0_12px_28px_rgba(0,0,0,0.65)] transition-transform hover:scale-[1.02] sm:px-12 sm:py-3.5 sm:text-[1.55rem]"
              type="button"
            >
              Register Now!
            </button>
          </div>
        </section>

        <section className="relative z-10 mt-10 flex flex-col items-center sm:mt-12">
          <div className="relative w-full max-w-[54rem]">
            <img
              src="/time_travel.svg"
              alt="Loop 13 mission panel"
              className="block w-full"
            />

            <div className="absolute bottom-[18.6%] left-[14.3%] right-[14.7%] top-[21.7%] overflow-hidden text-[#232323]">
              <div className="loop13-panel-copy h-full overflow-y-auto pr-1 text-left sm:pr-2">
                <h2 className="adsophos-container text-[clamp(0.7rem,1.6vw,1.65rem)] font-bold uppercase leading-none tracking-[0.03em]">
                  Mission Brief
                </h2>

                <p className="mt-[clamp(0.28rem,0.9vw,0.8rem)] font-sans text-[clamp(0.34rem,0.98vw,0.86rem)] leading-[1.42] text-[#2f2f2f]">
                  Placeholder copy for the mission goes here. Use this space to
                  describe the challenge, set the scene, and tell participants
                  what kind of mystery they are stepping into.
                </p>

                <h2 className="adsophos-container mt-[clamp(0.68rem,1.7vw,1.45rem)] text-[clamp(0.7rem,1.6vw,1.65rem)] font-bold uppercase leading-none tracking-[0.03em]">
                  Time Travel Equipment
                </h2>

                <ul className="mt-[clamp(0.35rem,0.95vw,0.9rem)] list-disc pl-[clamp(0.65rem,1.7vw,1.2rem)] font-sans text-[clamp(0.31rem,0.96vw,0.84rem)] leading-[1.38] text-[#2f2f2f]">
                  {equipmentItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <img
            src="/clocker.svg"
            alt="Hanging time machine clock"
            className="mt-[-2.25rem] w-[74%] max-w-[28rem] object-contain opacity-90 sm:mt-[-2rem] sm:w-[56%] md:mt-[-2.5rem]"
          />
        </section>
      </main>
      <Final />
    </div>
  );
};

export default Loop13;
