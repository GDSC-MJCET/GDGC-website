import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Hero from "../components/Hero";
import HighlightsRow from "../components/HighlightsRow";
import PastEventsShowcase from "../components/home/PastEventsShowcase";
import AmbientGlow from "../components/home/AmbientGlow";
import CommunityInMotion from "../components/home/CommunityInMotion";
import ThreePillars from "../components/home/ThreePillars";
import CommunityStrip from "../components/home/CommunityStrip";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
// import WinnerPopup from "../components/WinnerPopup";

const HomePage = () => {
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   const dismissed = sessionStorage.getItem("winner-popup-dismissed");
  //   if (!dismissed) {
  //     setShowPopup(true);
  //   }
  // }, []);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  //   sessionStorage.setItem("winner-popup-dismissed", "true");
  // };
  return (
    <Background>
      {/* {showPopup && <WinnerPopup onClose={handleClosePopup} />} */}
      <Nav />
      {/* the hero and the sections below it share one soft colour-wash background */}
      <div className="relative">
        <AmbientGlow />
        <div className="relative">
          <Hero />
          <HighlightsRow />
          <PastEventsShowcase />
          <CommunityInMotion />
          <ThreePillars />
          <CommunityStrip />
        </div>
      </div>
      {/* <Portfolio /> */}
      <Footer />
    </Background>
  );
};

export default HomePage;
