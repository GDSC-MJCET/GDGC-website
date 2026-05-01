import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Hero from "../components/Hero";
import Events from "../components/Events";
import About from "../components/About";
import Idk from "../components/Idk";
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
  const nav = useNavigate();
  return (
    <Background bgColor="#000000">
      {/* {showPopup && <WinnerPopup onClose={handleClosePopup} />} */}
     <p className="text-center mt-4">
  <button
    onClick={() => nav("/signup-guest")}
    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-dotted underline-offset-4 font-medium"
  >
    Sign up as a guest →
  </button>
</p>
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
