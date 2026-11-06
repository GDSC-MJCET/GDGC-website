import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ArchiveHero from "../components/events/archive/ArchiveHero";
import Spotlight from "../components/events/archive/Spotlight";

// The events archive: a wall of every poster, then each phase as a chapter with its events in the spotlight.
const EventsPage = () => (
  <div className="min-h-screen bg-[#050506] text-white">
    <Nav overlay />
    <main>
      <ArchiveHero />
      <Spotlight />
    </main>
    <Footer />
  </div>
);

export default EventsPage;
