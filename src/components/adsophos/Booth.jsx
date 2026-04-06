import React, { useState, useEffect, useRef } from 'react';
import './adsophos.css';

const Booth = () => {
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

  const bgParallaxX = mousePos.x * -14;
  const bgParallaxY = mousePos.y * -8 - scrollY * 0.2;
  const imageParallaxX = mousePos.x * 7;
  const imageParallaxY = mousePos.y * 5;

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 10px #ea433680); }
          50%       { filter: drop-shadow(0 0 26px #ea4336cc); }
        }
        @keyframes imageFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes bgDrift {
          0%   { transform: translateX(0px) translateY(0px); }
          33%  { transform: translateX(5px) translateY(-3px); }
          66%  { transform: translateX(-4px) translateY(4px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0px #ea433600; }
          50%       { box-shadow: 0 0 18px #ea4336aa; }
        }
        @keyframes textFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .booth-title {
          animation:
            fadeSlideDown 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both,
            titleGlow 3.8s ease-in-out 1s infinite;
        }
        .booth-image {
          animation:
            fadeSlideRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both,
            imageFloat 3s ease-in-out 1.2s infinite;
        }
        .booth-text {
          animation: textFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }
        .booth-btn {
          animation:
            fadeSlideLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both,
            btnPulse 3s ease-in-out 1.4s infinite;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease;
        }
        .booth-btn:hover {
          transform: scale(1.07) !important;
        }
        .bg-drift {
          animation: bgDrift 11s ease-in-out infinite;
        }
      `}</style>

      <div ref={sectionRef} className="relative  adsophos-container w-full overflow-hidden">

        {/* Background — covers the full height of content */}
        <img
          src="/booth.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain z-0 bg-drift"
          style={{
            transform: `translateX(${bgParallaxX}px) translateY(${bgParallaxY}px) scale(1.08)`,
            transition: 'transform 0.14s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        />

        {/* Dark scrim so text stays readable */}
        <div className="absolute inset-0 mb-8 pb-6 z-10" />

        {/* All content in normal flow — determines section height */}
        <div className="relative z-20 flex flex-col items-center px-6 pt-24 pb-0">

          {/* Title badge */}
          <div className="flex justify-center mb-16">
            <h2 className="booth booth-title">
              THE GDGC PHOTOBOOTH
            </h2>
          </div>

          <div className="max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-start gap-10 px-4 md:px-0">
            {/* Image (tall) */}
            <img
              src="/photo-booth.png"
              alt=""
              className="w-[800px] max-h-[600px] object-contain md:-mt-22 booth-image"
              style={{
                transform: `translateX(${imageParallaxX}px) translateY(${imageParallaxY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            />

            {/* Content */}
            <div className="flex flex-col justify-start items-center md:items-start text-center md:text-left max-w-lg">
              <p className="mb-8 product-sans text-[#ffffff] text-base sm:text-xl font-medium leading-relaxed">
              Step into our Photo Booth and capture moments that last beyond the event. With a DSLR setup, aesthetic backdrops, and Polaroid-style prints, take home a memory that’s uniquely yours.              </p>

              <button className="booth-btn  border-2 border-[#ffffff] bg-gradient-to-b from-[#f6a2a2] via-[#ea4336] to-[#f6a2a2] px-8 md:px-10 py-2 md:py-3 text-sm sm:text-base md:text-lg text-[#ffffff] rounded-lg">
                Get Your Photo!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booth;