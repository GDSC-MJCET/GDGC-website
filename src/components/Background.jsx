"use client";

import React, { useMemo } from "react";

const INCH = 142;

const Background = ({
  children,
  bgColor = "#1e1e1e",
  columnColor = "rgba(255,255,255,0.12)",
  dotColor = "rgba(255,255,255,0.5)",
  dotGlowColor = "rgba(255,255,255,0.85)",
}) => {
  const columns = useMemo(() => {
    if (typeof window === "undefined") return [];

    const columnCount = Math.ceil(window.innerWidth / INCH + 2);

    return Array.from({ length: columnCount }).map(() => {
      const dotCount = 2;

      return {
        dots: Array.from({ length: dotCount }).map(() => ({
          startY: Math.random() * window.innerHeight,
          duration: 12 + Math.random() * 32,
          delay: Math.random() * 3,
        })),
      };
    });
  }, []);

  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {columns.map((col, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-px"
            style={{
              left: `${i * INCH}px`,
              backgroundColor: columnColor,
            }}
          >
            {col.dots.map((dot, j) => (
              <span
                key={j}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: dot.startY,
                  backgroundColor: dotColor,
                  boxShadow: `0 0 8px ${dotGlowColor}`,
                  animation: `dotTravel ${dot.duration}s linear infinite`,
                  animationDelay: `${dot.delay}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes dotTravel {
          0% {
            transform: translate(-50%, -100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 5000vh);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Background;
