import React, { useState, useEffect, useRef } from 'react';

const Room2 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

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
  const imgParallaxX = mousePos.x * 10;
  const imgParallaxY = mousePos.y * 7;

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
        @keyframes titleGlitch {
          0%, 90%, 100% {
            text-shadow: none;
            transform: skewX(0deg);
          }
          92% {
            text-shadow: 3px 0 #ffffff88, -3px 0 #68686888;
            transform: skewX(-2deg);
          }
          94% {
            text-shadow: -3px 0 #ffffff88, 3px 0 #68686888;
            transform: skewX(2deg);
          }
          96% {
            text-shadow: 2px 0 #ffffffaa;
            transform: skewX(0deg);
          }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0px #00000000; }
          50%       { box-shadow: 0 6px 32px #00000099, 0 0 0 2px #68686855; }
        }
        @keyframes imageFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30%       { transform: translateY(-14px) rotate(-0.5deg); }
          70%       { transform: translateY(-6px) rotate(0.4deg); }
        }
        @keyframes btnFlare {
          0%, 100% { box-shadow: 0 0 0px #68686800; }
          50%       { box-shadow: 0 0 22px #686868bb, inset 0 0 10px #1e1e1e44; }
        }
        @keyframes scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }

        .room1-bg-drift { animation: bgDrift 12s ease-in-out infinite; }

        .room1-badge {
          animation:
            fadeSlideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both,
            badgePulse 4s ease-in-out 1s infinite;
        }
        .room1-title {
          animation:
            fadeSlideLeft 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both,
            titleGlitch 6s ease-in-out 2s infinite;
        }
        .room1-para {
          animation: fadeSlideUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }
        .room1-btn {
          animation:
            fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both,
            btnFlare 3.2s ease-in-out 1.5s infinite;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease;
        }
        .room1-btn:hover { transform: scale(1.08) !important; }
        .room1-image {
          animation:
            fadeSlideRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both,
            imageFloat 3.6s ease-in-out 1.3s infinite;
        }
      `}</style>

      <div ref={sectionRef} className="relative w-full overflow-hidden">

        {/* Background — covers the full height of content */}
        <img
          src="/room-2-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 room1-bg-drift"
          style={{
            transform: `translateX(${bgParallaxX}px) translateY(${bgParallaxY}px) scale(1.1)`,
            transition: 'transform 0.13s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        />

        {/* Dark scrim so text stays readable */}
        <div className="absolute inset-0 z-10" />

        {/* All content in normal flow — determines section height */}
        <div className="relative z-20 flex flex-col items-center px-6 pt-24 pb-0">

          {/* Title badge */}
          <div className="flex justify-center mb-16">
            <h2 className="room1-badge px-10 py-2 bg-[#1e1e1e] drop-shadow-2xl text-4xl font-bold">
              MYSTERY ROOM:{" "}
              <span className="font-medium text-[#ffffff]">GAME 2</span>
            </h2>
          </div>

          <div className='flex  justify-between gap-22 items-center max-w-4xl'>
            <div className="w-full max-w-3xl flex flex-col justify-between items-left gap-6 ">
              <h2 className="room1-title text-6xl font-bold text-transparent bg-gradient-to-b from-[#ffffff] via-[#686868] to-[#ffffff] bg-clip-text shrink-0">
                HEIST
              </h2>

              <p className="room1-para max-w-sm text-base leading-relaxed text-white/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                repellendus vitae, enim nihil atque hic quas ipsa placeat. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Quis repellendus vitae,
                enim nihil atque hic quas ipsa placeat.
              </p>
              <button className="room1-btn border-2 border-[#363434] bg-gradient-to-r from-[#686868] to-[#1e1e1e] px-10 py-3 text-lg text-[#ffffff] rounded-lg hover:scale-105 transition-transform">
                Register Now!
              </button>
            </div>

            <div className="w-screen flex justify-center ">
              <div className="w-full max-w-4xl flex justify-around items-start gap-12 py-16">
                <img
                  src="/room-1-img.png"
                  alt=""
                  className="room1-image w-[520px] object-contain"
                  style={{
                    transform: `translateX(${imgParallaxX}px) translateY(${imgParallaxY}px)`,
                    transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Room2;