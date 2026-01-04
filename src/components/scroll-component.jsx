"use client";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ScrollLines = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll(".draw");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
  }, []);

  const upper = [
    { c: "red", d: "M0 300 C120 260 220 240 360 220 C460 205 540 220 720 300" },
    { c: "yellow", d: "M0 260 C120 240 220 200 360 180 C460 165 540 180 720 260" },
    { c: "green", d: "M0 220 C120 200 220 160 360 140 C460 125 540 140 720 220" },
    { c: "blue", d: "M0 180 C120 160 220 120 360 100 C460 85 540 100 720 180" }
  ];

  const shiftY = (d, dy) =>
    d.replace(/-?\d+(\.\d+)?/g, (n, _, i) => (i % 2 ? Number(n) + dy : n));

  const lowerOffset = 95;
  const offsets = [-36, -24, -12, 0, 12, 24, 36];

  const paths = [...upper, ...upper.map(p => ({ ...p, d: shiftY(p.d, lowerOffset) }))]
    .flatMap(p => offsets.map(o => ({ c: p.c, d: shiftY(p.d, o) })));

  return (
    <div className="relative h-[520vh] bg-black text-white">
      <div className="sticky top-24 flex flex-col items-center px-6">
        <h1 className="text-4xl md:text-6xl font-light mb-3 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
          Post whats on your mind..?
        </h1>
        <p className="text-sm md:text-lg text-neutral-400 max-w-2xl text-center mb-10">
          GDGC-MJCET Fueled Blog Editor
        </p>

        <svg
          ref={svgRef}
          viewBox="0 0 1440 420"
          className="w-full max-w-[1440px] h-[420px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="b1" />
              <feGaussianBlur stdDeviation="36" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#neon)" fill="none" strokeLinecap="round">
            {paths.map(({ d, c }, i) => (
              <React.Fragment key={i}>
                <path className={`draw glow ${c}`} d={d} />
                <path className={`draw main ${c}`} d={d} />
                <path className={`draw core ${c}`} d={d} />
                <g transform="translate(1440 0) scale(-1 1)">
                  <path className={`draw glow ${c}`} d={d} />
                  <path className={`draw main ${c}`} d={d} />
                  <path className={`draw core ${c}`} d={d} />
                </g>
              </React.Fragment>
            ))}
          </g>
        </svg>

        <div className="reveal mt-14">
          <Link
            to="/blog/home"
            className="px-6 py-3 rounded-full bg-white text-black font-semibold"
          >
            Get Started..?
          </Link>
        </div>
      </div>

      <style jsx>{`
        .draw {
          animation: draw linear forwards;
          animation-timeline: scroll();
          animation-range: entry 0% exit 100%;
        }
        .glow {
          stroke-width: 16;
          opacity: 0.25;
          mix-blend-mode: screen;
        }
        .main {
          stroke-width: 5;
          opacity: 0.85;
        }
        .core {
          stroke-width: 2;
        }
        .red { stroke: #ff5f5f; }
        .yellow { stroke: #ffd84d; }
        .green { stroke: #66ff99; }
        .blue { stroke: #66b3ff; }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          animation: reveal 0.6s ease-out forwards;
          animation-timeline: scroll();
          animation-range: exit 92% exit 100%;
        }

        @keyframes reveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollLines;