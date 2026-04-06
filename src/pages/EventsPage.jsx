import React from "react";
import Nav from "../components/Nav";
import Background from "../components/Background";
import Hero from "../components/events/Hero";
import PastEvents from "../components/events/PastEvents";
import Footer from "../components/Footer";

const EventsPage = () => {
  return ( 
    <Background bgColor="#000000">
      <div> 
        <Nav />     
        <Hero />
        <PastEvents />
        <Footer />
      </div>
    </Background>
  );
};

export default EventsPage;
