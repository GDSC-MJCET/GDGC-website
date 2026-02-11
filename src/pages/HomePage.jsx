import React from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Hero from "../components/Hero";
import Events from "../components/Events";
import About from "../components/About";
import Idk from "../components/Idk";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <Background bgColor="#000000">
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
