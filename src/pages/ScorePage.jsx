import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Background from "@/components/Background";
import LiveScoreCard from "../components/debate/LiveScore";
import Footer from "@/components/Footer";
import History from "../components/debate/History";
import { Link } from "react-router-dom";
import WinnerPopup from "@/components/WinnerPopup";

export default function ScorePage() {
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
    <div>
      <Background
        bgColor="#0b0b0b"
        columnColor="rgba(87, 203, 255, 0.1)"
        dotColor="rgba(87,203,255,0.6)"
        dotGlowColor="rgba(87,203,255,0.9)"
      >
        {showPopup && <WinnerPopup onClose={handleClosePopup} />}
        <Nav bgColor="#0b0b0b" />
        <div className="text-white dm-mono   px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 w-full py-6 sm:py-8">
            <div className="flex items-center justify-center">
                <p className="text-4xl sm:text-4xl md:text-6xl lg:text-8xl text-[#57CBFF]">Score</p>
                <p className="text-4xl sm:text-4xl md:text-6xl lg:text-8xl text-[#5DDB6E]">board</p>
            </div>
            <div className="ml-auto pt-8 " >
                <Link to="/techfaceoff"><p className="text-[#FFD428] text-xl text-center" >Learn about Tech Face-Off</p></Link>
            </div>
        </div>
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 hidden md:block">
            <img src="/bracket-horizontal.png" className="w-full" alt="Debate IPL" />
        </div>
        <div className=" px-4 sm:px-6 md:hidden">
            <img src="/bracket-vertical.png" className="w-full" alt="Debate IPL" />
        </div>
       {/* <LiveScoreCard/> */}
        <History />
        
              <Footer bgColor="#0b0b0b" />
        
            </Background>
       </div>

    ) 
}