import Nav from "../components/Nav";
import Background from "../components/Background";
import Footer from "../components/Footer";
import LandingHero from "../components/landing/LandingHero";
import NextUp from "../components/landing/NextUp";
import Manifesto from "../components/landing/Manifesto";
import Pillars from "../components/landing/Pillars";
import Moments from "../components/landing/Moments";
import CommunityReel from "../components/landing/CommunityReel";

const LandingV1Page = () => (
  <Background>
    <Nav />
    <main>
      <LandingHero />
      <NextUp />
      <Manifesto />
      <Pillars />
      <Moments />
      <CommunityReel />
    </main>
    <Footer />
  </Background>
);

export default LandingV1Page;
