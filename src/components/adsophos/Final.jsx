import React, { useState, useEffect, useRef } from "react";

const Final = () => {
  const [hovered, setHovered] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  const buttons = [
    "Register for Mystery Rooms",
    "Register for Photobooth",
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const cloudParallaxX = mousePos.x * -18;
  const cloudParallaxY = mousePos.y * -10 - scrollY * 0.25;
  const grassParallaxY = scrollY * 0.08;
  const marioParallaxX = mousePos.x * 8;

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes titlePulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 12px #ff00a280); }
          50%       { filter: brightness(1.15) drop-shadow(0 0 28px #ff00a2cc); }
        }
        @keyframes marioFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes grassSway {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(1.01); }
        }
        @keyframes cloudDrift {
          0%   { transform: translateX(0px) translateY(0px); }
          33%  { transform: translateX(6px)  translateY(-4px); }
          66%  { transform: translateX(-4px) translateY(3px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes arrowPop {
          0%   { transform: translateX(0) scale(1); }
          40%  { transform: translateX(4px) scale(1.3); }
          100% { transform: translateX(0) scale(1); }
        }
        .title-animated {
          animation:
            fadeSlideDown 0.9s cubic-bezier(0.22, 1, 0.36, 1) both,
            titlePulse 3.5s ease-in-out 1s infinite;
        }
        .btn-animated-0 {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
        }
        .btn-animated-1 {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both;
        }
        .cloud-idle {
          animation: cloudDrift 9s ease-in-out infinite;
        }
        .grass-idle {
          animation: grassSway 6s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .mario-float {
          animation: marioFloat 2.4s ease-in-out infinite;
        }
        .arrow-hovered {
          animation: arrowPop 0.35s ease-out forwards;
        }
        .btn-text {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      color 0.2s ease,
                      letter-spacing 0.2s ease;
        }
        .btn-text:hover {
          letter-spacing: 0.03em;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative w-full  min-h-screen overflow-hidden flex flex-col items-center justify-start"
      >

        {/* Cloud Background */}
        <img
          src="/final-cloud-ads.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 cloud-idle"
          style={{
            transform: `translateX(${cloudParallaxX}px) translateY(${cloudParallaxY}px) scale(1.08)`,
            transition: "transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        />

        {/* Top Content */}
        <div className="relative z-20 flex flex-col items-center mt-20">

          {/* Title */}
          <h1
            className={`text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[#f19ad1] via-[#ff00a2] to-[#f19ad1] mb-12 tracking-wide title-animated`}
          >
            START <br /> EVENT
          </h1>

          {/* Buttons */}
          <div className="flex flex-col gap-6 text-xl">
            {buttons.map((btn, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-3 cursor-pointer group btn-animated-${i}`}
              >
                {/* Arrow */}
                <span
                  className={`transition-all duration-200 text-[#ff5700] ${
                    hovered === i
                      ? `opacity-100 translate-x-0 arrow-hovered`
                      : "opacity-0 -translate-x-3"
                  }`}
                >
                  &gt;
                </span>

                {/* Text */}
                <span className="text-[#ff5700] font-extrabold group-hover:translate-x-1 group-hover:text-[#e5005c] transition-transform btn-text">
                  {btn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grass Bottom */}
         <div className="absolute bottom-0 w-full z-20">

  {/* Grass */}
  <img
    src="/final-grass-ads.png"
    alt=""
    className="w-full h-30"
  />

  {/* Mario */}
  <img
    src="/mario.png"
    alt=""
    className="absolute right-10 bottom-full mb-[-20px] w-[120px]"
  />

</div>
      </div>
    </>
  );
};

export default Final;

