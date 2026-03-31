import React from "react";
import TeamTimeline from "../components/team/TeamTimeline";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Footer from "../components/Footer";

const TeamPage = () => {
  return (
    <Background bgColor="#000000">
      <div>
        <Nav />
        <TeamTimeline />
        <Footer />
      </div>
    </Background>
  );
};

export default TeamPage;