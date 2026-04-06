import React, { useState, useEffect, useRef } from 'react';
import './photobooth.css';

/* ─── tiny lerp helper ─────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

const Booth = () => {
  /* raw targets — written by event listeners */
  const targetScroll  = useRef(0);
  const targetMouseX  = useRef(0);
  const targetMouseY  = useRef(0);

  /* smoothed values — driven by the rAF loop */
  const smoothScroll  = useRef(0);
  const smoothMouseX  = useRef(0);
  const smoothMouseY  = useRef(0);

  /* ref to the background <img> and board wrapper so we
     can mutate their transforms directly — no re-renders */
  const bgRef    = useRef(null);
  const imageRef = useRef(null);
  const rafId    = useRef(null);

  useEffect(() => {
    const onScroll = () => { targetScroll.current = window.scrollY; };
    const onMouse  = (e) => {
      targetMouseX.current = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse);

    /* ── rAF loop ─────────────────────────────────────────── */
    const EASE = 0.072; /* lower = smoother/slower; 0.05–0.12 is a good range */

    const tick = () => {
      smoothScroll.current  = lerp(smoothScroll.current,  targetScroll.current,  EASE);
      smoothMouseX.current  = lerp(smoothMouseX.current,  targetMouseX.current,  EASE);
      smoothMouseY.current  = lerp(smoothMouseY.current,  targetMouseY.current,  EASE);

      const mx = smoothMouseX.current;
      const my = smoothMouseY.current;
      const sy = smoothScroll.current;

      if (bgRef.current) {
        const tx = mx * -14;
        const ty = my * -8 - sy * 0.2;
        bgRef.current.style.transform =
          `translateX(${tx}px) translateY(${ty}px) scale(1.08)`;
      }

      if (imageRef.current) {
        const tx = mx * 7;
        const ty = my * 5;
        imageRef.current.style.transform =
          `translateX(${tx}px) translateY(${ty}px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

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
          0%   { transform: translateX(0px)  translateY(0px);  scale(1.08) }
          33%  { transform: translateX(5px)  translateY(-3px); scale(1.08) }
          66%  { transform: translateX(-4px) translateY(4px);  scale(1.08) }
          100% { transform: translateX(0px)  translateY(0px);  scale(1.08) }
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
            fadeSlideDown 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
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
          transition:
            transform   0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow  0.2s ease;
        }
        .booth-btn:hover {
          transform: scale(1.07) !important;
        }

        /* board wrapper — receives the smoothed mouse parallax via ref */
        .booth-board-wrap {
          will-change: transform;
        }
      `}</style>

      <div className="relative adsophos-container w-full overflow-visible">

        {/* Background ─ transform driven by rAF loop via ref */}
        <img
          ref={bgRef}
          src="/Frame-container.svg"
          alt=""
          className="absolute inset-0 w-full top-[20px] object-cover md:object-cover z-20"
          style={{
            willChange: 'transform',
            /* no CSS transition here — the rAF lerp IS the easing */
          }}
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 z-[15]" />

        {/* Content */}
        <div className="relative flex flex-col items-center px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-24 md:pb-28">

          {/* Title */}
          <div className="relative z-40 flex flex-col justify-center mb-3 sm:mb-4 md:mb-5">
            <h1 className="booth booth-title text-center">
              THE GDGC
              <br />
              PHOTOBOOTH
            </h1>
          </div>

          {/* Register button */}
          <button
            type="button"
            className="relative isolate z-40 booth-btn m-5 sm:m-10 md:mb-20 md:mt-20 flex min-w-[240px] sm:min-w-[300px] md:min-w-[360px] items-center justify-center border-2 border-[#ffffff] px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-[#ffffff] rounded-lg shadow-[0_6px_18px_rgba(234,67,54,0.35)] overflow-visible"
            style={{ background: 'radial-gradient(circle at 50% 42%, #EA4335 48%, #ea4336 100%)' }}
          >
            <img
              className="pointer-events-none absolute left-[-1.5rem] sm:left-[-1.9rem] md:left-[-2.2rem] top-1/2 z-0 w-[2.75rem] sm:w-[3.5rem] md:w-[4rem] -translate-y-1/2"
              src="/heart.svg"
              alt=""
              aria-hidden="true"
            />
            <img
              className="pointer-events-none absolute right-[-2.1rem] sm:right-[-2.6rem] md:right-[-3.2rem] top-1/2 z-0 w-[4.5rem] sm:w-[5.5rem] md:w-[8rem] -translate-y-1/2 rotate-[8deg]"
              src="/camera.svg"
              alt=""
              aria-hidden="true"
            />
            <span className="relative z-10 font-bold tracking-wide">Register Now!</span>
          </button>

          {/* Board — gentle counter-parallax via ref */}
          <div className="flex items-center justify-center w-full">
            <div
              ref={imageRef}
              className="booth-board-wrap  relative w-full max-w-[1140px] pt-5"
            >
              <img src="/Frame-board.svg" alt="Board" className="w-full" />

             <div className="absolute md:ml-10 top-[18.5%] bottom-[15%] left-[15.5%] right-[15.5%] overflow-y-auto text-[#1E1E1E] flex flex-col min-h-0" style={{ scrollbarWidth: 'none' }}>

            <h1 className="adsophos-container font-bold uppercase text-center  sm:text-start mb-1 sm:mb-2 md:mb-3
                          text-xsm sm:text-lg md:text-2xl lg:text-4xl">
              Polaroid Camera Booth
            </h1>

            <p className="font-sans text-center sm:text-start mb-1 sm:mb-2 md:mb-3
                          text-[9px] sm:text-xs md:text-sm lg:text-base leading-snug sm:leading-normal">
              Digital photos are great for your camera roll, but nothing beats the
              magic of a physical Polaroid developing in your hands. Stop by our
              Polaroid Memory Booth to freeze a moment of the fest forever.
            </p>

            <p className="font-semibold font-sans italic text-center sm:text-start mt-1 sm:mt-2
                          text-[9px] sm:text-xs md:text-sm lg:text-base leading-snug">
              * Please bring friends and good vibes.<br />
            </p>

</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Booth;