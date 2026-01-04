"use client";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className = "",
  containerClassName = "",
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}) => {
  const canvasRef = useRef(null);
  const noise = createNoise3D();

  let w = 0;
  let h = 0;
  let nt = 0;
  let animationId;

  // 🔥 speed multiplier — THIS is the only real change
  const SPEED_MULTIPLIER = 16
  const getSpeed = () =>
    (speed === "fast" ? 0.002 : 0.001) * SPEED_MULTIPLIER;

  const waveColors =
    colors ?? [
      "#4285F4", // Google Blue
      "#EA4335", // Google Red
      "#FBBC05", // Google Yellow
      "#34A853", // Google Green
    ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawWave = (count) => {
      // ✅ same shape, just faster time progression
      nt += getSpeed();

      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle =
          waveColors[i % waveColors.length];

        for (let x = 0; x <= w; x += 5) {
          const y =
            noise(x / 800, i * 0.3, nt) * 100;

          ctx.lineTo(x, y + h * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.globalAlpha = waveOpacity;
      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      drawWave(5);
      ctx.globalCompositeOperation = "source-over";

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [blur, backgroundFill, speed, waveOpacity]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div className={`relative min-h-screen ${containerClassName}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={
          isSafari ? { filter: `blur(${blur}px)` } : undefined
        }
      />
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};
