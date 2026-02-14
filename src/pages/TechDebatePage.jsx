import Background from '@/components/Background'
import About from '@/components/debate/About'
import Guidelines from '@/components/debate/Guidelines'
import GuidelinesTab from '@/components/debate/GuidelinesTab'
import Hero from '@/components/debate/Hero'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import WinnerPopup from '@/components/WinnerPopup'
import React, { useState, useEffect } from 'react'

const TechDebatePage = () => {
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
    <Background
      bgColor="#0b0b0b"
      columnColor="rgba(87, 203, 255, 0.1)"
      dotColor="rgba(87,203,255,0.6)"
      dotGlowColor="rgba(87,203,255,0.9)"
    >
      {showPopup && <WinnerPopup onClose={handleClosePopup} />}
      <Nav bgColor='#0b0b0b'/>
      <Hero />
      <About />
      <Guidelines />
      <GuidelinesTab />
      <Footer bgColor="#0b0b0b" />
    </Background>
  )
}

export default TechDebatePage