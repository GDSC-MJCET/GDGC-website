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
  // console.log("TopBadge render with debate:", debate);
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
              debate?.isLive && !debate.break ? "bg-[#2de05b]" : "bg-[#fbd34f]"
            }`}
          />
          <div className="dm-mono text-sm text-white">
            {debate?.isLive && !debate.break ? "LIVE" : "BREAK"}
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
  const [voteCountLeft, setVoteCountLeft] = useState(0);
  const [voteCountRight, setVoteCountRight] = useState(0);
  const [disable,setDisable] = useState(false)
  // Function to handle audience voting
  const handleVote = async (side) => {
    if (disable) return; // Prevent multiple votes
    setDisable(true)
    try {
      // Make API call to backend FIRST
      console.log("Submitting vote for side:", side, debate.leftTeam, debate.rightTeam);
      
      // Update state OPTIMISTICALLY (show immediate UI update)
      if (side === "left") {
        setVoteCountLeft(prev => prev + 1);
        // Also update debate state for immediate UI consistency
        setDebate(prev => ({
          ...prev,
          votesLeft: (prev.votesLeft || 0) + 1
        }));
      } else {
        setVoteCountRight(prev => prev + 1);
        // Also update debate state for immediate UI consistency
        setDebate(prev => ({
          ...prev,
          votesRight: (prev.votesRight || 0) + 1
        }));
      }
      
      // Then make the API call
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/techdebate/vote`,
        { leftTeam: debate.leftTeam, rightTeam: debate.rightTeam, side },
      );
      
      // Update with server response (ensures sync)
      if (response.data && response.data.updatedDebate) {
        setDebate(response.data.updatedDebate);
        setVoteCountLeft(response.data.updatedDebate.votesLeft);
        setVoteCountRight(response.data.updatedDebate.votesRight);
      }
      
    } catch (error) {
      console.error("Error submitting vote:", error);
      // Revert optimistic update on error
      if (side === "left") {
        setVoteCountLeft(prev => Math.max(0, prev - 1));
        setDebate(prev => ({
          ...prev,
          votesLeft: Math.max(0, (prev.votesLeft || 1) - 1)
        }));
      } else {
        setVoteCountRight(prev => Math.max(0, prev - 1));
        setDebate(prev => ({
          ...prev,
          votesRight: Math.max(0, (prev.votesRight || 1) - 1)
        }));
      }
      // Show error feedback to user
      alert("Failed to submit vote. Please try again.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchDebate = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}`+`/api/v1/techdebate/get-score`
        );
        if (res) {
          setDebate(res.data.sendingData);
          setVoteCountLeft(res.data.sendingData.votesLeft);
          setVoteCountRight(res.data.sendingData.votesRight);
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
              {/* <div
                className="absolute left-8 right-8"
                style={{
                  top: "55%",
                  height: "1px",
                  background: "rgba(255,255,255,0.18)",
                }}
              /> */}
              <div
                className="absolute"
                style={{
                  top: "34%",
                  bottom: "18%",
                  left: "50%",
                  width: "1px",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.18)",
                }}
              />
            </div>

            <div className="relative z-10 px-8 py-6 pt-14">
              <div className="">
                    <div className="text-[11px] text-white inter">TOPIC</div>
                    <div className="text-[#fbd34f] dm-mono text-base mt-2">
                      {debate.Topic}
                    </div>
                  </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Team Section */}
                <div className="space-y-6 mt-4">
                  

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <img
                      src={debate.leftLogo}
                      alt="left logo"
                      className="w-fit max-w-16 h-16 rounded-md bg-[#0f0f10]"
                    />

                    <div className="text-center md:text-left flex-1">
                      <div className="dm-mono text-lg text-white">
                        {debate.leftTeam}
                      </div>
                      <div className="text-[#bdbdbd] text-sm">
                        For the Motion
                      </div>
                    </div>

                    {/* <div className="dm-mono text-4xl font-bold text-white">
                      {debate.leftScore}
                    </div> */}
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

                {/* Right Team Section */}
                <div className="space-y-4 md:space-y-6 text-right">
                  

                  <div className=" flex flex-col-reverse md:flex-row  items-center mt-4 gap-4">
                    {/* <div className="dm-mono text-4xl font-bold text-white">
                      {debate.rightScore}
                    </div> */}
                    <div className="flex-1 text-center md:text-right">
                      <div className="dm-mono text-lg text-white">
                        {debate.rightTeam}
                      </div>
                      <div className="text-[#bdbdbd] text-sm">
                        Against the motion
                      </div>
                    </div>
                    <img
                      src={debate.rightLogo}
                      alt="right logo"
                      className="w-fit max-w-16 h-16 rounded-md bg-[#0f0f10]"
                    />

                    
                  </div>

                  <div className=" mt-[-px]">
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

        {/* Vote Percentage Bar */}
        <div className="w-full mt-8 mb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="dm-mono text-sm text-white">
              {(() => {
                const totalVotes = (debate.votesLeft || 0) + (debate.votesRight || 0);
                const leftPercentage = totalVotes === 0 ? 0 : Math.round(((debate.votesLeft || 0) / totalVotes) * 100);
                return `${leftPercentage}%`;
              })()}
            </div>
            <div className="text-xs text-[#8b8b8b] dm-mono">Vote Distribution</div>
            <div className="dm-mono text-sm text-white">
              {(() => {
                const totalVotes = (debate.votesLeft || 0) + (debate.votesRight || 0);
                const rightPercentage = totalVotes === 0 ? 0 : Math.round(((debate.votesRight || 0) / totalVotes) * 100);
                return `${rightPercentage}%`;
              })()}
            </div>
          </div>
          
          <div className="relative h-4 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#fbd34f] to-[#ffcc33] transition-all duration-500 ease-out"
              style={{
                width: `${(() => {
                  const totalVotes = (debate.votesLeft || 0) + (debate.votesRight || 0);
                  return totalVotes === 0 ? 50 : ((debate.votesLeft || 0) / totalVotes) * 100;
                })()}%`
              }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#4A5568] to-[#2D3748] transition-all duration-500 ease-out"
              style={{
                width: `${(() => {
                  const totalVotes = (debate.votesLeft || 0) + (debate.votesRight || 0);
                  return totalVotes === 0 ? 50 : ((debate.votesRight || 0) / totalVotes) * 100;
                })()}%`
              }}
            />
            
            {/* Middle separator line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10"
              style={{
                left: `${(() => {
                  const totalVotes = (debate.votesLeft || 0) + (debate.votesRight || 0);
                  return totalVotes === 0 ? 50 : ((debate.votesLeft || 0) / totalVotes) * 100;
                })()}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#fbd34f] to-[#ffcc33]" />
              
            </div>
            <div className="flex items-center gap-2">
              
              <div className="w-3 h-3 rounded-full bg-gradient-to-l from-[#4A5568] to-[#2D3748]" />
            </div>
          </div>
        </div>

        {/* Vote Buttons Outside the Card */}
        <div className="w-full flex flex-row  mt-6 justify-between gap-4 sm:gap-6">
          {/* Left Team Vote Button */}
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={() => handleVote('left')}
              className={`py-3  bg-transparent border border-[#fbd34f] text-[#fbd34f] 
                       hover:bg-[#fbd34f] hover:text-black transition-all duration-300 
                       rounded-lg dm-mono text-xs sm:text:md font-medium flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] ${disable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="truncate">Vote for {debate.leftTeam}</span>
            </button>
          </div>

          {/* Right Team Vote Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => handleVote('right')}
              className={`py-3  bg-transparent border border-[#fbd34f] text-[#fbd34f] 
                       hover:bg-[#fbd34f] hover:text-black transition-all duration-300 
                       rounded-lg dm-mono text-xs sm:text-md font-medium flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] ${disable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="truncate">Vote for {debate.rightTeam}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}