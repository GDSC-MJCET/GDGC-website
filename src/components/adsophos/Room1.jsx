import React, { useState, useEffect, useRef } from 'react';
import './adsophos.css';

const Room1 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const bgParallaxX = mousePos.x * -20;
  const bgParallaxY = mousePos.y * -12 - scrollY * 0.22;
  const titleParallaxY = scrollY * -0.12;
  const paraParallaxY = scrollY * -0.07;
  const imgParallaxX = mousePos.x * 10;
  const imgParallaxY = mousePos.y * 7 + scrollY * -0.1;

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-44px) scaleX(0.92); }
          to   { opacity: 1; transform: translateY(0) scaleX(1); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(52px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bgDrift {
          0%   { transform: translateX(0px)  translateY(0px); }
          33%  { transform: translateX(7px)  translateY(-5px); }
          66%  { transform: translateX(-5px) translateY(5px); }
          100% { transform: translateX(0px)  translateY(0px); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0px #2bdde100; }
          50%       { box-shadow: 0 6px 32px #2bdde177, 0 0 0 2px #2bdde133; }
        }
        @keyframes titleGlitch {
          0%, 90%, 100% { text-shadow: none; transform: skewX(0deg); }
          92% { text-shadow: 3px 0 #2fd7d288, -3px 0 #0debff88; transform: skewX(-2deg); }
          94% { text-shadow: -3px 0 #2fd7d288,  3px 0 #0debff88; transform: skewX(2deg); }
          96% { text-shadow: 2px 0 #0debffaa; transform: skewX(0deg); }
        }
        @keyframes imageFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30%       { transform: translateY(-14px) rotate(-0.5deg); }
          70%       { transform: translateY(-6px) rotate(0.4deg); }
        }
        @keyframes btnFlare {
          0%, 100% { box-shadow: 0 0 0px #2fd7d200; }
          50%       { box-shadow: 0 0 24px #2fd7d2bb, inset 0 0 10px #0debff33; }
        }

        .r1-bg-drift { animation: bgDrift 12s ease-in-out infinite; }
        .r1-badge {
          animation:
            fadeSlideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both,
            badgePulse 4s ease-in-out 1s infinite;
        }
        .r1-title {
          animation:
            fadeSlideLeft 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both,
            titleGlitch 6s ease-in-out 2s infinite;
        }
        .r1-para {
          animation: fadeSlideRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
        }
        .r1-image {
          animation:
            fadeSlideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both,
            imageFloat 3.6s ease-in-out 1.4s infinite;
        }
        .r1-btn {
          animation:
            fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both,
            btnFlare 3.2s ease-in-out 1.5s infinite;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease;
        }
        .r1-btn:hover { transform: scale(1.08) !important; }
      `}</style>

      <div className="w-full adsophos-container bg-[url('/ad-section2.jpg')] bg-contain bg-center overflow-hidden ">

        {/* Background — covers the full height of content */}
        {/* <img
          src="/ads-game-1-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 r1-bg-drift"
          style={{
            transform: `translateX(${bgParallaxX}px) translateY(${bgParallaxY}px) scale(1.1)`,
            transition: 'transform 0.13s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        /> */}

        {/* Dark scrim so text stays readable */}
        <div className="absolute inset-0 mb-8 pb-6 z-10 pointer-events-none" />

        {/* All content in normal flow — determines section height */}
        <div className="relative z-20 flex flex-col items-center">

          {/* Title badge */}
          <div className="flex justify-center mb-16">
            <h2 className="r1-badge px-6 md:px-10 py-3 md:py-4 bg-[#2bdde1] drop-shadow-2xl text-2xl sm:text-3xl md:text-4xl font-bold [text-shadow:0.222px_0.222px_0.314px_rgba(0,0,0,0.20),0.605px_0.605px_0.856px_rgba(0,0,0,0.18),1.329px_1.329px_1.88px_rgba(0,0,0,0.25),2.95px_2.95px_4.172px_rgba(0,0,0,0.10),2.5px_2.5px_3px_rgba(0,0,0,0.15),-0.5px_-0.5px_0_rgba(0,0,0,0.10)]">
              MYSTERY ROOM:{" "}
              <span className="font-medium text-[#1e1e1e]">GAME 1</span>
            </h2>
          </div>

          {/* Middle — heading + description */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center md:items-center gap-10 md:gap-16 px-6 md:px-0 mb-12 md:mb-20 text-center md:text-left">
            <h2
              className="r1-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] font-bold text-transparent bg-gradient-to-b from-[#2fd7d2] to-[#0debff] bg-clip-text shrink-0"
              style={{
                transform: `translateY(${titleParallaxY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              <span className="flex justify-center md:justify-start text-3xl sm:text-4xl md:text-5xl text-white font-medium">
                <span className='mb-2 md:mb-4'>THE</span>
              </span>
              HEIST
            </h2>

            <p
              className="r1-para product-sans max-w-sm  mx-auto md:mx-0 text-center md:text-left text-base text-xl font-medium leading-relaxed text-white/80"
              style={{
                transform: `translateY(${paraParallaxY}px)`,
                transition: 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              Diamond Heist puts your team inside a high-risk casino robbery led by
              the mysterious Architect, with one mission: steal the legendary Black
              Diamond from a heavily secured vault. Work through security systems and
              timed challenges, make smart decisions under pressure, and coordinate
              every move with your crew. One mistake can trigger a full lockdown, so
              speed, strategy, and teamwork are the keys to escaping with the prize.
            </p>
          </div>

          {/* Bottom dark strip — full bleed */}
          <div className="w-full bg-transparent flex justify-center">
            <div className="w-full max-w-4xl flex flex-col md:flex-row justify-around items-center md:items-start gap-10 md:gap-12 py-8 md:py-16">
              <img
                src="/room-1-img.png"
                alt=""
                className="r1-image w-[280px] sm:w-[400px] md:w-[520px] object-contain"
                style={{
                  transform: `translateX(${imgParallaxX}px) translateY(${imgParallaxY}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              />
              <button 
              onClick={() => (window.location.href = "https://www.adsophos.com/register?event=Diamond%20Heist")}
              className="room1-btn cursor-pointer border mb-16 md:mb-0  border-white bg-gradient-to-r from-[#2fd7d2] to-[#0debff] px-6 md:px-10 py-2 md:py-3 text-sm sm:text-base md:text-lg text-[#1e1e1e] rounded-lg hover:scale-105 transition-transform">
                 Register Now! 
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Room1;