import { ArrowUpRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GoverningStage from "../components/team/GoverningStage";
import { Dot, Outline } from "../components/fx/designSystem";

const JOIN_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfMc7dWVyNixPNjBIc-PZmCuzifw0j2w0c7x1ms2h3H9mnVyw/viewform?usp=send_form";

// The team page: the governing body on a lit stage. Anything else for the page (the Executive Committee)
// goes between the stage and the join section.
const TeamPage = () => (
  <div className="min-h-screen bg-[#050506] text-white">
    <Nav />
    <main>
      <header className="mx-auto max-w-[1500px] px-5 pt-14 pb-10 sm:px-10 md:pt-20 lg:px-16">
        <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">GDGC MJCET · 2026–27</p>
        <h1 className="mt-4 text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] font-black tracking-[-0.05em]">
          The Governing <Outline>Body</Outline>
          <Dot color="bg-google-red" />
        </h1>
        <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-white/60">The ten people running Phase Four, role by role.</p>
      </header>

      <GoverningStage />

      <section aria-label="Join" className="mx-auto max-w-[1500px] px-5 pt-24 pb-16 text-center sm:px-10 lg:px-16">
        <p className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] font-black tracking-[-0.04em]">
          Come build it <Outline>with us</Outline>
          <Dot color="bg-google-yellow" />
        </p>
        <a
          href={JOIN_FORM}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
        >
          Join the community
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </a>
      </section>
    </main>
    <Footer />
  </div>
);

export default TeamPage;
