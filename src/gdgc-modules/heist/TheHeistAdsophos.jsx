import { useEffect, useRef } from "react";
import PixelSkyline from "../photobooth/components/PixelSkyline";
import Final from "../photobooth/components/Final";

import bgii from "./public/ali-bg-ii.jpeg";
import bgiii from "./public/ali-bg-iii.png";
// Import your mobile image:
import bgMobile from "./public/ali-bg-mobile.png"; // <-- rename to match your actual filename

const noteLines = [
  "Note: equipment will be provided by organizers and must be returned back in the same condition. If any damages occur the party involved will be held responsible.",
  "Note: Any damage to the room or its belonging by the participants will be charged for.",
];

export default function TheHeistAdsophos() {
  return (
    <>

      <div className="block md:hidden">
        <MobileLayout />
      </div>


      <div className="hidden md:flex flex-col">

        {/* SECTION 1 — Hero */}
        <div className="bg-[url('/adsophos-hero.png')]">
          <div className="relative h-screen w-full bg-[url('/ali-bg-i.png')] bg-cover bg-no-repeat bg-center overflow-hidden">
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <button
                onClick={() => (window.location.href = "/register")}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "clamp(9px, 1vw, 14px)",
                  background: "linear-gradient(135deg, #6ABFF2, #53DEE5)",
                  color: "#1a1a1a",
                  border: "none",
                  padding: "14px 36px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255,215,0,0.4), 4px 4px 0px #8a6200",
                  imageRendering: "pixelated",
                  clipPath:
                    "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
                }}
              >
                ▶ REGISTER NOW
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Pixel window with text */}
        <div className="relative h-screen w-full">
          <img src={bgii} alt="bg" className="h-full w-full object-cover" />
          <div className="absolute inset-0">
            <div
              className="absolute top-[27%] bottom-[14%] left-[27%] right-[17%] overflow-hidden text-[#1E1E1E]"
            >
              <style>{`
                  .heist-panel-copy::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div className="heist-panel-copy mt-30 flex flex-col items-start overflow-y-auto pr-2 text-start">
                <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(0.7rem, 1.55vw, 1.6rem)", color: "#1a1a1a", marginBottom: "0.65em", letterSpacing: "0.05em" }}>
                  MISSION BRIEF
                </h2>
                <p style={{ fontFamily: "'Product Sans', sans-serif", fontSize: "clamp(0.59rem, 0.82vw, 0.76rem)", color: "#1a1a1a", lineHeight: "1.82", marginBottom: "1.15em" }}>
                  Enter the Diamond Casino as part of an elite crew on a mission to steal the legendary Black Diamond. With security closing in and time slipping away, you must solve challenges, break into the vault, and escape before lockdown. One perfect heist—that’s all you get.
                </p>
                <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(0.7rem, 1.55vw, 2.6rem)", color: "#1a1a1a", marginBottom: "0.65em", letterSpacing: "0.05em" }}>
                  HEIST EQUIPMENT
                </h2>
                <ul style={{ fontFamily: "'Product Sans', sans-serif", fontSize: "clamp(0.9rem, 0.82vw, 5.76rem)", color: "#1a1a1a", lineHeight: "1.95", paddingLeft: "1.2em", listStyleType: "disc", marginBottom: "1.1em" }}>
                  <li>robber mask</li>
                  <li>walkie talkie</li>
                  <li>bags to steal money</li>
                  <li>folder</li>
                  <li>player profiles on paper</li>
                  <li>list</li>
                </ul>
                <div style={{ fontFamily: "'Product Sans', sans-serif", fontSize: "clamp(0.87rem, 0.8vw, 0.5rem)", color: "#1a1a1a", lineHeight: "1.65", maxWidth: "72%" }}>
                  {noteLines.map((line, index) => (
                    <p key={line} style={{ marginBottom: index === 0 ? "0.5em" : 0 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="h-screen w-full mt-0">
          <img src={bgiii} className="h-screen w-screen " alt="bg3" />
        </div>

        {/* SECTION 4 */}
        <div className="bg-[#1E1E1E] h-screen w-full">
          <Final />
        </div>
      </div>
    </>
  );
}

function MobileLayout() {
  return (
    <div style={{ overflowX: "hidden" }} className="bg-[#1E1E1E] ">

      <div
        className="relative w-full"
        style={{

          paddingTop: "216%",
          backgroundImage: `url('/ali-bg-mobile.png')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >



        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "56%" }}
        >
          <button
            onClick={() => (window.location.href = "/register")}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(8px, 3vw, 13px)",
              background: "linear-gradient(135deg, #6ABFF2, #53DEE5)",
              color: "#1a1a1a",
              border: "none",
              padding: "12px 28px",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(255,215,0,0.4), 3px 3px 0px #8a6200",
              imageRendering: "pixelated",
              clipPath:
                "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
              whiteSpace: "nowrap",
            }}
          >
            ▶ REGISTER NOW
          </button>
        </div>

        <div
          className="absolute"
          style={{
            top: "69%",
            left: "22%",
            right: "14%",
            bottom: "6%",
            overflowY: "auto",
            padding: "4% 5%",
            // Webkit scrollbar hidden for clean look
            scrollbarWidth: "none",
          }}
        >
          <style>{`
            .mobile-text-box::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="mobile-text-box" style={{ height: "100%", overflowY: "auto", scrollbarWidth: "none" }}>

            {/* MISSION BRIEF */}
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(8.5px, 3.35vw, 16px)",
                color: "#1a1a1a",
                marginBottom: "0.55em",
                letterSpacing: "0.04em",
              }}
            >
              MISSION BRIEF
            </h2>
            <p
              style={{
                fontFamily: "'Product Sans', sans-serif",
                fontSize: "clamp(6px, 2.15vw, 9.6px)",
                color: "#1a1a1a",
                lineHeight: "2.02",
                marginBottom: "1.15em",
              }}
            >
              Enter the Diamond Casino as part of an elite crew on a mission to steal the legendary Black Diamond. With security closing in and time slipping away, you must solve challenges, break into the vault, and escape before lockdown. One perfect heist—that’s all you get.
            </p>

            {/* HEIST EQUIPMENT */}
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(8.5px, 3.35vw, 16px)",
                color: "#1a1a1a",
                marginBottom: "0.55em",
                letterSpacing: "0.04em",
              }}
            >
              HEIST EQUIPMENT
            </h2>
            <ul
              style={{
                fontFamily: "'Product Sans', sans-serif",
                fontSize: "clamp(6px, 2.15vw, 9.6px)",
                color: "#1a1a1a",
                lineHeight: "2.2",
                paddingLeft: "1.1em",
                listStyleType: "disc",
                marginBottom: "1.15em",
              }}
            >
              <li>robber mask</li>
              <li>walkie talkie</li>
              <li>bags to steal money</li>
              <li>folder</li>
              <li>player profiles on paper (DIY)</li>
              <li>list</li>
            </ul>
            <div style={{ fontFamily: "'Product Sans', sans-serif", fontSize: "clamp(5.2px, 1.85vw, 8.2px)", color: "#1a1a1a", lineHeight: "1.65" }}>
              {noteLines.map((line, index) => (
                <p key={line} style={{ marginBottom: index === 0 ? "0.5em" : 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3 on mobile ── */}
      <div className="w-full">
        <img src={bgiii} className="w-full h-auto " alt="bg3" />
      </div>

      {/* ── Section 4 on mobile ── */}
      <div className="bg-[#1E1E1E]  ">
        <Final />
      </div>
    </div>
  );
}
