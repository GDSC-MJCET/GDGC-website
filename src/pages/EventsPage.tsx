import React from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import AmbientGlow from "../components/home/AmbientGlow";
import EventsHero from "../components/events/EventsHero";
import UpNext from "../components/events/UpNext";
import EventsArchive from "../components/events/EventsArchive";
import Footer from "../components/Footer";

const EventsPage = () => {
  return (
    <Background>
      <Nav />
      {/* same GDGC colour strips as the home page, behind every section */}
      <div className="relative overflow-hidden">
        <AmbientGlow />
        <div className="relative">
          <EventsHero />
          <UpNext />
          <EventsArchive />
        </div>
      </div>
      <Footer />
    </Background>
  );
};

export default EventsPage;
