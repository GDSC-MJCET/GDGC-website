import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

/* ─── confetti helpers ─── */
function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#5ddb6e", "#57cbff", "#FFD428", "#ffffff", "#ff6b6b"];

  // Initial big burst
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  });

  // Continuous side cannons
  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);

    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 250);
}

function fireStars() {
  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.4,
    decay: 0.94,
    startVelocity: 20,
    colors: ["#5ddb6e", "#57cbff", "#FFD428"],
    shapes: ["star"],
    scalar: 1.2,
  };

  confetti({ ...defaults, particleCount: 20, origin: { x: 0.3, y: 0.3 } });
  confetti({ ...defaults, particleCount: 20, origin: { x: 0.7, y: 0.3 } });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 15, origin: { x: 0.5, y: 0.5 } });
  }, 600);
}

/* ─── Floating emoji particles ─── */
function FloatingEmoji({ emoji, style }) {
  return (
    <span
      className="absolute text-2xl md:text-3xl pointer-events-none select-none animate-float-up"
      style={style}
    >
      {emoji}
    </span>
  );
}

/* ─── Main popup ─── */
export default function WinnerPopup({ onClose }) {
  const [visible, setVisible] = useState(false);
  const [emojis, setEmojis] = useState([]);

  const spawnEmojis = useCallback(() => {
    const pool = ["🎉", "🏆", "⭐", "🎊", "✨", "🥇", "🔥", "💪"];
    const items = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      style: {
        left: `${Math.random() * 90 + 5}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2.5 + Math.random() * 2}s`,
      },
    }));
    setEmojis(items);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      fireConfetti();
      setTimeout(fireStars, 800);
      spawnEmojis();
    }, 50);
    return () => clearTimeout(t);
  }, [spawnEmojis]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* keyframes injected once */}
      <style>{`
        @keyframes float-up {
          0%   { opacity: 0; transform: translateY(40px) scale(0.5) rotate(0deg); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) scale(1.2) rotate(20deg); }
        }
        .animate-float-up {
          animation: float-up var(--dur, 3s) ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(93,219,110,0.15), 0 0 60px rgba(87,203,255,0.08); }
          50%      { box-shadow: 0 0 50px rgba(93,219,110,0.3), 0 0 90px rgba(87,203,255,0.15); }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Floating emojis behind the card */}
        {emojis.map((e) => (
          <FloatingEmoji
            key={e.id}
            emoji={e.emoji}
            style={{
              ...e.style,
              "--delay": e.style.animationDelay,
              "--dur": e.style.animationDuration,
              bottom: "10%",
              zIndex: 0,
            }}
          />
        ))}

        {/* Card */}
        <div
          className={`relative max-w-md w-full rounded-2xl border border-white/10 bg-[#111111] p-8 text-center transform transition-all duration-300 ${
            visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          style={{ animation: visible ? "pulse-glow 3s ease-in-out infinite" : "none" }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/50 hover:text-white text-xl leading-none p-1"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Trophy with bounce */}
          <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: "1.5s" }}>
            🏆
          </div>

          {/* Sparkle row */}
          <p className="text-sm mb-3 tracking-widest">✨ ✨ ✨</p>

          {/* Heading with shimmer */}
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(90deg, #5ddb6e, #57cbff, #FFD428, #5ddb6e)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Congratulations!
          </h2>

          {/* Winner name */}
          <p className="text-xl md:text-2xl font-semibold mb-1">
            <span
              className="text-[#5ddb6e]"
              style={{ textShadow: "0 0 20px rgba(93,219,110,0.4)" }}
            >
              IEEE WIE
            </span>
          </p>

          {/* Sub text */}
          <p className="text-white/70 text-sm md:text-base mb-6">
            Winners of{" "}
            <span className="text-[#57cbff]">Tech Face-Off: The Verdict</span>{" "}
            🎉
          </p>

          {/* CTA */}
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-full bg-[#5ddb6e] text-black font-semibold text-sm hover:bg-[#4cc95e] hover:scale-105 active:scale-95 transition-all"
          >
            🎊 Awesome!
          </button>
        </div>
      </div>
    </>
  );
}
