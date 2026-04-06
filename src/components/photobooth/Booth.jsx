import React, { useState, useEffect, useRef } from 'react';
import './photobooth.css';

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
             3.8s ease-in-out 1s infinite;
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

      <div ref={sectionRef} className="relative adsophos-container w-full overflow-visible">

        {/* Background — covers the full height of content */}
        <img
          src="/Frame-container.svg"
          alt=""
          className="absolute inset-0 w-full  top-[20px] max-x-[20px] object-cover md:object-cover z-20 bg-drift"
          style={{
            transform: `translateX(${bgParallaxX}px) translateY(${bgParallaxY}px) scale(1.08)`,
            transition: 'transform 0.14s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        />

        {/* Dark scrim so text stays readable */}
        <div className="absolute inset-0 z-[15]" />

        {/* All content in normal flow — determines section height */}
        <div className="relative flex flex-col items-center px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-24 md:pb-28">

          {/* Title badge */}
          <div className="relative z-40 flex flex-col justify-center mb-3 sm:mb-4 md:mb-5">
            <h1 className="booth booth-title text-center">
              THE GDGC
              <br />
              PHOTOBOOTH
            </h1>
          </div>

          <button
            type="button"
            className="relative z-40 booth-btn mb-5 sm:mb-7 md:mb-20 md:mt-20 flex items-center gap-3 border-2 border-[#ffffff] bg-gradient-to-b from-[#f6a2a2] via-[#EA4336] to-[#f6a2a2] px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-[#ffffff] rounded-lg shadow-[0_6px_18px_rgba(234,67,54,0.35)]"
          >
            <span className="font-bold">Register Now!</span>
          </button>

          {/* <div className="relative z-10 w-full  flex items-center justify-center ">
            <div
              className="relative w-[94%] max-w-[1140px] booth-image pt-5 "
              style={{
                transform: `translateX(${imageParallaxX}px) translateY(${imageParallaxY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              <img
                src="/Frame-board.svg"
                alt="Photobooth frame"
                className="w-full h-auto object-cover"
              />

              <div className="absolute top-50 left-50  sans-serif z-1000 h-[1000px] w-[70%] text-[#1E1E1E]">
                <h3 className="booth-panel-heading mb-6 sm:mb-6 tracking-tight">MAKE TONS OF MEMORIES!</h3>
                <p className="booth-panel-copy mb-3 sm:mb-4 text-lg/500">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, odio labore! Ipsam impedit temporibus illo. Enim magni excepturi sint mollitia dolore molestiae. Sequi unde tenetur amet esse excepturi numquam facere veniam repellat, officiis praesentium fuga maxime voluptas, quibusdam sint alias.
                </p>
                <h4 className="booth-panel-heading mb-2">WHAT YOU&apos;LL RECEIVE</h4>
                <ul className="booth-panel-copy list-disc pl-5 space-y-0.5 sm:space-y-1">
                  <li>High-quality digital photobooth pictures</li>
                  <li>Instant sharing-ready snapshots</li>
                  <li>A creative keepsake from GDGC PhotoBooth</li>
                </ul>
              </div>
            </div>

            
          </div> */}
      <div className="flex items-center justify-center w-full">
  <div className="relative w-full max-w-[1140px] pt-5">
    {/* Background Image */}
    <img src="/Frame-board.svg" alt="Board" className="w-full" />


    <div className="absolute top-0 mt-25 sm:mt-38 md:mt-38 lg:mt-60 xl-mt-40 md:pt-10 text-[#1E1E1E] max-h-[20%] max-w-[60%]  left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className='flex flex-col items-center'>

      <h1 className="text-[0.5rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.75rem] font-bold text-start mb-1 ">Make tons of memories!</h1>
      <p className="text-[0.38rem] sm:text-[0.5rem] md:text-[0.8rem] lg:text-[1.35rem] mb-2 font-sans text-start">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure.
      </p>
      
      <h1 className='text-[0.5rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.75rem] font-bold text-start mb-1 '>     
                 What you'll recieve
        </h1>
            <ul className='text-[0.38rem] sm:text-[0.5rem] md:text-[0.8rem] lg:text-[1.35rem] font-sans text-start'>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Ut enim ad minim veniam, quis nostrud exercitation.</li>
                <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Duis aute irure.</li>
              </ul>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Booth;