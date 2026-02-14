import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Hero from "../components/Hero";
import Events from "../components/Events";
import About from "../components/About";
import Idk from "../components/Idk";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import WinnerPopup from "../components/WinnerPopup";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("winner-popup-dismissed");
    if (!dismissed) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("winner-popup-dismissed", "true");
  };

  return (
    <Background bgColor="#000000">
      {showPopup && <WinnerPopup onClose={handleClosePopup} />}
      <Nav />
      <Hero />
      <Events />
      <About />
      <Idk />
      {/* <Portfolio /> */}
      <Footer />
    </Background>
  );
};

export default HomePage;
