import React, { useState } from "react";
import TeamTimeline from "../components/team/TeamTimeline";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Footer from "../components/Footer";
import ExeSection from "../components/team/ExeSection";
import CoreSection from "../components/team/CoreSection";

const TeamPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  return (
    <Background bgColor="#000000">
      <div className="min-screen overflow-hidden">
        <Nav />
        <TeamTimeline />
        <ExeSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <CoreSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <Footer />
      </div>
    </Background>
  );
};

export default TeamPage;