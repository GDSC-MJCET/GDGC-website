import axios from "axios";
import React, { useEffect, useState } from "react";

function TopBadge({ debate }) {
  let dateDisplay = "11 Feb, 2026";

  if (debate && debate.date) {
    const d = new Date(debate.date);
    if (!isNaN(d.getTime())) {
      const day = d.toLocaleString("en-GB", { day: "2-digit" });
      const month = d.toLocaleString("en-GB", { month: "short" });
      const year = d.getFullYear();
      dateDisplay = `${day} ${month}, ${year}`;
    }
  }

  return (
    <div className="w-[99%] max-w-full z-10">
      <div
        className="rounded-xl px-6 pt-4 pb-12 flex items-start justify-between"
        style={{
          background: "#1f1f1f",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="dm-mono text-sm text-white">
          {debate?.status ? `${debate.status} stage` : "Status"}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              debate?.isLive ? "bg-[#2de05b]" : "bg-[#fbd34f]"
            }`}
          />
          <div className="dm-mono text-sm text-white">
            {debate?.isLive ? "LIVE" : "SOON"}
          </div>
        </div>

        <div className="dm-mono text-sm text-white">{dateDisplay}</div>
      </div>
    </div>
  );
}

export default function LiveScoreCard() {
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noLiveMatch, setNoLiveMatch] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDebate = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/techdebate/get-score`
        );
        if (mounted) {
          setDebate(res.data.sendingData);
          setLoading(false);
          setNoLiveMatch(false);
        }
      } catch (err) {
        console.error("fetch debate error", err);
        if (mounted) {
          setLoading(false);
          setNoLiveMatch(true);
        }
      }
    };

    fetchDebate();
    const interval = setInterval(fetchDebate, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0b0c] dm-mono">
        Loading...
      </div>
    );
  }

  if (noLiveMatch || !debate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0b0c] dm-mono">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No Live Match right now</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start py-16 px-6 dm-mono">
      <div className="w-[920px] max-w-full flex flex-col items-center">
        <TopBadge debate={debate} />

        <div className="w-full z-20 -mt-10">
          <div className="bg-[#171717] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div
                className="absolute left-8 right-8"
                style={{
                  top: "55%",
                  height: "1px",
                  background: "rgba(255,255,255,0.18)",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: "22%",
                  bottom: "22%",
                  left: "50%",
                  width: "1px",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.18)",
                }}
              />
            </div>

            <div className="relative z-10 px-8 py-6 pt-14">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] text-white inter">TOPIC</div>
                    <div className="text-[#fbd34f] dm-mono text-base mt-2">
                      {debate.Topic}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={debate.leftLogo}
                      alt="left logo"
                      className="w-16 h-16 object-contain rounded-md bg-[#0f0f10]"
                    />

                    <div className="flex-1">
                      <div className="dm-mono text-lg text-white">
                        {debate.leftTeam}
                      </div>
                      <div className="text-[#bdbdbd] text-sm">
                        For the Motion
                      </div>
                    </div>

                    <div className="dm-mono text-4xl font-bold text-white">
                      {debate.leftScore || 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#8b8b8b]">Speakers</div>

                    <ul className="mt-2 space-y-1 dm-mono text-sm text-[#cbd1c7]">
                      {Array.isArray(debate.speakersLeft) &&
                        debate.speakersLeft.map((speaker) => (
                          <li key={speaker._id}>{speaker.name}</li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 text-right">
                  <div>
                    <div className="text-[11px] text-[#8b8b8b]">VENUE</div>
                    <div className="dm-mono text-sm text-white mt-2">
                      Seminar Hall, MJCET BLOCK 4
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <div className="dm-mono text-4xl font-bold text-white">
                      {debate.rightScore || 0}
                    </div>

                    <div className="flex-1 text-right">
                      <div className="dm-mono text-lg text-white">
                        {debate.rightTeam}
                      </div>
                      <div className="text-[#bdbdbd] text-sm">
                        Against the Motion
                      </div>
                    </div>

                    <img
                      src={debate.rightLogo}
                      alt="right logo"
                      className="w-16 h-16 object-contain rounded-md bg-[#0f0f10]"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] text-[#8b8b8b]">Speakers</div>

                    <ul className="mt-2 space-y-1 dm-mono text-sm text-[#cbd1c7]">
                      {Array.isArray(debate.speakersRight) &&
                        debate.speakersRight.map((speaker) => (
                          <li key={speaker._id}>{speaker.name}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[rgba(255,255,255,0.03)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
