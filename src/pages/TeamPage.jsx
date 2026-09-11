import React from "react";
import TeamTimeline from "../components/team/TeamTimeline";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Footer from "../components/Footer";

const TeamPage = () => {
  return (
    <Background>
      <div className="min-screen overflow-hidden">
        <Nav />
        <TeamTimeline />
        <Footer />
      </div>
    </Background>
  );
};

export default TeamPage;
