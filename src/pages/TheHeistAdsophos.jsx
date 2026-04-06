import { useEffect, useRef } from "react";
import PixelSkyline from "../components/adsophos/PixelSkyline";
import Nav from "../components/adsophos/nav";
import Final from "../components/adsophos/Final";

import bgii from "../../public/ali-bg-ii.jpeg";
import bgiii from "../../public/ali-bg-iii.png";
// Import your mobile image:
import bgMobile from "../../public/ali-bg-mobile.png"; // <-- rename to match your actual filename

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
            <Nav />
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative"
              style={{ width: "48%", marginTop: "6%", marginLeft: "2%" }}
            >
              <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(10px, 1.4vw, 20px)", color: "#1a1a1a", marginBottom: "0.6em", letterSpacing: "0.05em" }}>
                MISSION BRIEF
              </h2>
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(6px, 0.55vw, 10px)", color: "#1a1a1a", lineHeight: "2", marginBottom: "1.2em" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure.
              </p>
              <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(10px, 1.4vw, 20px)", color: "#1a1a1a", marginBottom: "0.6em", letterSpacing: "0.05em" }}>
                HEIST EQUIPMENT
              </h2>
              <ul style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(6px, 0.55vw, 10px)", color: "#1a1a1a", lineHeight: "2.2", paddingLeft: "1.2em", listStyleType: "disc" }}>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Ut enim ad minim veniam, quis nostrud exercitation.</li>
                <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Duis aute irure.</li>
              </ul>
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

        <div className="absolute top-0 left-0 right-0 z-10">
          <Nav />
        </div>


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
                fontSize: "clamp(7px, 2.8vw, 13px)",
                color: "#1a1a1a",
                marginBottom: "0.5em",
                letterSpacing: "0.04em",
              }}
            >
              MISSION BRIEF
            </h2>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(5px, 1.8vw, 8px)",
                color: "#1a1a1a",
                lineHeight: "2",
                marginBottom: "1em",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure.
            </p>

            {/* HEIST EQUIPMENT */}
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(7px, 2.8vw, 13px)",
                color: "#1a1a1a",
                marginBottom: "0.5em",
                letterSpacing: "0.04em",
              }}
            >
              HEIST EQUIPMENT
            </h2>
            <ul
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(5px, 1.8vw, 8px)",
                color: "#1a1a1a",
                lineHeight: "2.2",
                paddingLeft: "1em",
                listStyleType: "disc",
              }}
            >
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation.</li>
              <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
              <li>Duis aute irure.</li>
            </ul>
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