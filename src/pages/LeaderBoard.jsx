import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("AuthState"));

    if (!auth?.token) {
      nav("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_SERVER + "/api/v1/leaderboard", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-6 relative overflow-hidden">
      {/* 🌐 Animated grid background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="w-full h-full bg-[linear-gradient(to_right,#22c55e30_1px,transparent_1px),linear-gradient(to_bottom,#22c55e20_1px,transparent_1px)]
    bg-[size:30px_30px] animate-[moveGrid_25s_linear_infinite]"
        ></div>

        {/* subtle second layer for depth */}
        <div
          className="w-full h-full bg-[radial-gradient(circle,rgba(34,197,94,0.05)_1px,transparent_1px)]
    bg-[size:60px_60px] animate-pulse"
        ></div>
      </div>

      {/* Glow orb */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-green-500 blur-[160px] rounded-full -translate-x-1/2 opacity-20"></div>

      {/* TITLE */}
      <h1
        className="text-center py-6 sm:py-8 font-black glitch-text text-white
  text-xl sm:text-2xl md:text-3xl lg:text-4xl
  tracking-[0.25em]"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        LEADERBOARD
      </h1>
      <br />
      <br />
      {/* TABLE */}
      <div
        className="relative z-10 max-w-6xl mx-auto rounded-2xl overflow-hidden
        border border-green-500/20 bg-white/5 backdrop-blur-xl"
      >
        {/* HEADER */}
        <div
          className="grid grid-cols-5 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
          px-4 py-4 text-xs text-center font-bold text-green-300 uppercase tracking-widest
          border-b border-green-500/20 bg-black/40"
        >
          <div>Rank</div>
          <div className="text-left">Name</div>
          <div className="hidden md:block">Easy</div>
          <div className="hidden md:block">Med</div>
          <div className="hidden md:block">Hard</div>
          <div className="hidden md:block">Rating</div>
          <div>Total</div>
          <div>Streak</div>
          <div>Profile</div>
        </div>

        {/* ROWS */}
        {users.map((u, index) => {
          const lcUser = u.user?.username || u.username;
          const isTop3 = index < 3;

          return (
            <div
              key={u._id}
              className={`
                grid grid-cols-5 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]
                px-4 py-4 items-center text-center border-b border-white/5
                transition-all duration-300
                hover:bg-green-500/5 hover:scale-[1.01]
                ${isTop3 ? "animate-pulse" : ""}
              `}
            >
              {/* 🏆 Rank podium effect */}
              <div className="flex justify-center">
                <div className="flex justify-center text-2xl">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && (
                    <span className="text-gray-400 font-bold">#{u.rank}</span>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="text-left font-semibold truncate">
                {u.user?.name}
              </div>

              <div className="hidden md:block text-gray-300">
                {u.easySolved}
              </div>
              <div className="hidden md:block text-gray-300">
                {u.mediumSolved}
              </div>
              <div className="hidden md:block text-gray-300">
                {u.hardSolved}
              </div>

              <div className="hidden md:block text-cyan-300 font-semibold">
                {Math.floor(u.contestRating)}
              </div>

              <div className="font-bold">{u.totalSolved}</div>

              <div className="text-xl">{u.activityStatus}</div>

              <div>
                <a
                  href={`https://leetcode.com/${lcUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] text-lg"
                >
                  🔗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🧾 LEGEND (fixed + improved) */}
      <div
        className="mt-10 max-w-xl mx-auto rounded-xl border border-green-500/20
        bg-black/40 backdrop-blur-md p-5 text-sm"
      >
        <h2 className="text-center text-green-400 font-bold tracking-widest mb-4">
          STREAK LEGEND
        </h2>

        <div className="space-y-2 text-gray-300">
          <div>🔥 Solved today</div>
          <div>💪 Solved yesterday</div>
          <div>💀 No activity for 2 days</div>
          <div>⛔ Inactive (2+ days)</div>
        </div>
      </div>

      <style>{`
      .glitch-text {
        position: relative;
        text-shadow:
          0 0 10px rgba(34,197,94,0.4),
          0 0 20px rgba(34,197,94,0.2);
        animation: glitch-flicker 3s infinite;
      }

      @keyframes glitch-flicker {
        0%, 100% { transform: translate(0); opacity: 1; }
        92% { transform: translate(0); }
        93% { transform: translate(-1px, 1px); opacity: 0.95; }
        94% { transform: translate(1px, -1px); opacity: 0.9; }
        95% { transform: translate(0); }
      }

      .glitch-text::after {
        content: "";
        position: absolute;
        top: 0;
        left: -10%;
        width: 120%;
        height: 100%;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(34,197,94,0.15) 45%,
          rgba(34,197,94,0.35) 50%,
          rgba(34,197,94,0.15) 55%,
          transparent 100%
        );
        transform: skewX(-20deg);
        animation: scan 4s infinite;
      }

      @keyframes scan {
        0% { left: -120%; }
        100% { left: 120%; }
      }

      @keyframes moveGrid {
        0% { transform: translateY(0px); }
        100% { transform: translateY(40px); }
      }
    `}</style>
    </div>
  );
};

export default Leaderboard;
