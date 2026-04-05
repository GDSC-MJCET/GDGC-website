import React, { useState, useEffect, useRef } from 'react';

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
  const paraParallaxY  = scrollY * -0.07;
  const imgParallaxX   = mousePos.x * 10;
  const imgParallaxY   = mousePos.y * 7 + scrollY * -0.1;

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

      <div className="w-full bg-[url('/ads-game-1-bg.png')] bg-contain bg-center overflow-hidden ">

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
        <div className="absolute inset-0 mb-8 pb-6 z-10" />

        {/* All content in normal flow — determines section height */}
        <div className="z-20 flex flex-col pt-44 items-center">

          {/* Title badge */}
          <div className="flex justify-center mb-16">
            <h2 className="r1-badge px-10 py-2 bg-[#2bdde1] drop-shadow-2xl text-4xl font-bold">
              MYSTERY ROOM:{" "}
              <span className="font-medium text-[#1e1e1e]">GAME 1</span>
            </h2>
          </div>

          {/* Middle — heading + description */}
          <div className="w-full max-w-3xl flex justify-between items-center gap-16 mb-20">
            <h2
              className="r1-title text-8xl leading-[0.9] font-bold text-transparent bg-gradient-to-b from-[#2fd7d2] to-[#0debff] bg-clip-text shrink-0"
              style={{
                transform: `translateY(${titleParallaxY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              <span className="block text-5xl text-white font-medium">THE</span>
              HEIST
            </h2>

            <p
              className="r1-para max-w-sm text-base leading-relaxed text-white/80"
              style={{
                transform: `translateY(${paraParallaxY}px)`,
                transition: 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
              repellendus vitae, enim nihil atque hic quas ipsa placeat. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quis repellendus vitae,
              enim nihil atque hic quas ipsa placeat.
            </p>
          </div>

          {/* Bottom dark strip — full bleed */}
          <div className="w-screen bg-[#1e1e1e] flex justify-center">
            <div className="w-full max-w-4xl flex justify-around items-start gap-12 py-16">
              <img
                src="/room-1-img.png"
                alt=""
                className="r1-image w-[520px] object-contain"
                style={{
                  transform: `translateX(${imgParallaxX}px) translateY(${imgParallaxY}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              />
              <button className="r1-btn border border-white bg-gradient-to-r from-[#2fd7d2] to-[#0debff] px-10 py-3 text-lg text-[#1e1e1e] rounded-lg hover:scale-105 transition-transform">
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