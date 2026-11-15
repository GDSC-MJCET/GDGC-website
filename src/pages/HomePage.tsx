import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CinemaIntro from "../components/landing-cinema/CinemaIntro";
import CinemaHero from "../components/landing-cinema/CinemaHero";
import ComingSoon from "../components/landing-cinema/ComingSoon";
import Origin from "../components/landing-cinema/story/Origin";
import ArchiveTunnel from "../components/landing-cinema/story/ArchiveTunnel";
import Gather from "../components/landing-cinema/story/Gather";
import { shouldPlayIntro } from "../components/landing-cinema/mark";
import { REPLAY_EVENT } from "../components/intro/introEvents";
import { getQuality } from "../components/fx/quality";

// Landing page v2: opening titles, the hero, then the club's story told in scroll-driven chapters. (v1 lives at /v1.)
const HomePage = () => {
  // no opening titles on the static tier (reduced motion, or the browser asked to save data)
  const [intro, setIntro] = useState(() => getQuality() !== "static" && shouldPlayIntro());

  // the nav's "replay intro" button
  useEffect(() => {
    const replay = () => setIntro(true);
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      {intro && <CinemaIntro onDone={() => setIntro(false)} />}
      <Nav overlay />
      <main>
        <CinemaHero ready={!intro} />
        {/* the story, in pinned scroll scenes */}
        <Origin />
        <ArchiveTunnel />
        <Gather />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
