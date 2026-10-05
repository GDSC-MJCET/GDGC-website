import React from "react";
import GoverningBodyShowcase from "../components/team/GoverningBodyShowcase";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Footer from "../components/Footer";

const TeamPage = () => {
  return (
    <Background>
      <div className="min-h-screen overflow-hidden">
        <Nav />
        <GoverningBodyShowcase />
        <Footer />
      </div>
    </Background>
  );
};

export default TeamPage;
